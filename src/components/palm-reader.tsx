
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { UploadCloud, BookOpen, Hand, LoaderCircle, Lightbulb, Heart, Users, HeartPulse, Wallet, Briefcase, Users2, Copy, Share2, Zap, ShieldCheck, BrainCircuit, Star, StarHalf, Target, BarChart, Camera, Sparkles, FileText, GraduationCap, X, CircleDot, TrendingUp, WandSparkles, Link as LinkIcon } from "lucide-react";
import pako from 'pako';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { analyzePalmReading, analyzeLoveLuck, extractFeatures } from "@/lib/gemini";
import type { GeneratePalmReadingReportOutput } from "@/ai/flows/generate-palm-reading-report";
import { useIsMobile } from "@/hooks/use-mobile";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const loadingMessages = [
  "양손의 기운을 분석하는 중입니다...",
  "운명선을 따라가고 있습니다...",
  "당신의 감정선을 읽고 있습니다...",
  "숨겨진 재능을 찾고 있습니다...",
  "거의 다 됐습니다! 잠시만 기다려주세요...",
];

export default function PalmReader() {
  const [leftPhotoPreview, setLeftPhotoPreview] = useState<string | null>(null);
  const [rightPhotoPreview, setRightPhotoPreview] = useState<string | null>(null);
  const [report, setReport] = useState<GeneratePalmReadingReportOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState(loadingMessages[0]);
  const [shareUrl, setShareUrl] = useState('');
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [generatingLinkType, setGeneratingLinkType] = useState<'friend' | 'love' | null>(null);
  const [showCopyFallback, setShowCopyFallback] = useState<string | null>(null);


  // Additional Analysis State
  const [isAnalyzingExtra, setIsAnalyzingExtra] = useState(false);
  const [extraAnalysisResult, setExtraAnalysisResult] = useState<string | null>(null);
  
  // Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturingHand, setCapturingHand] = useState<'left' | 'right' | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const isMobile = useIsMobile();
  const { toast } = useToast();
  const leftFileInputRef = useRef<HTMLInputElement>(null);
  const rightFileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const baseCount = Math.floor(Date.now() / 10000) - 172000000;
    setVisitorCount(baseCount + 10000);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      let messageIndex = 0;
      setCurrentLoadingMessage(loadingMessages[0]);
      interval = setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        setCurrentLoadingMessage(loadingMessages[messageIndex]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, hand: 'left' | 'right') => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "유효하지 않은 파일 형식",
          description: "이미지 파일(예: JPG, PNG)을 업로드해주세요.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        if (hand === 'left') {
          setLeftPhotoPreview(dataUri);
        } else {
          setRightPhotoPreview(dataUri);
        }
      };
      reader.onerror = (error) => {
        console.error("FileReader error: ", error);
        toast({
          variant: "destructive",
          title: "파일 읽기 오류",
          description: "파일을 읽는 도중 오류가 발생했습니다.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (leftUri: string, rightUri: string) => {
    console.log('[PalmReader] handleSubmit: 분석 시작. 서버 액션을 호출합니다.');
    setIsLoading(true);
    setReport(null);
    setShareUrl('');

    try {
      const report = await analyzePalmReading(leftUri, rightUri);
      setReport(report);
      
      const reportJson = JSON.stringify(report);
      const compressed = pako.deflate(reportJson);
      
      let binary = '';
      const bytes = new Uint8Array(compressed);
      for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
      }
      const encodedReport = window.btoa(binary);

      const url = `${window.location.origin}/result?data=${encodeURIComponent(encodedReport)}`;
      setShareUrl(url);
    } catch (error) {
      console.error('[PalmReader] Analysis error:', error);
      toast({
        variant: "destructive",
        title: "분석 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (leftPhotoPreview && rightPhotoPreview && !isLoading && !report) {
      handleSubmit(leftPhotoPreview, rightPhotoPreview);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftPhotoPreview, rightPhotoPreview]);

  const handleUploadClick = (hand: 'left' | 'right') => {
    if (hand === 'left') {
      leftFileInputRef.current?.click();
    } else {
      rightFileInputRef.current?.click();
    }
  };

  const openCamera = async (hand: 'left' | 'right') => {
    setCapturingHand(hand);
    setIsCameraOpen(true);
    setHasCameraPermission(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setCameraStream(stream);
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: '카메라 접근 불가',
        description: '브라우저 설정에서 카메라 권한을 허용해주세요.',
      });
    }
  };

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    setCameraStream(null);
    setIsCameraOpen(false);
    setCapturingHand(null);
  };
  
  const handleCapture = () => {
    if (videoRef.current && capturingHand) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        try {
          context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const dataUri = canvas.toDataURL('image/png');
          if (capturingHand === 'left') {
            setLeftPhotoPreview(dataUri);
          } else {
            setRightPhotoPreview(dataUri);
          }
        } catch (e) {
          console.error("Failed to capture image from video stream", e);
          toast({
            variant: "destructive",
            title: "촬영 실패",
            description: "사진을 캡처하는 데 실패했습니다. 다시 시도해주세요."
          });
        }
      } else {
        console.error("Failed to get 2D context from canvas");
        toast({
            variant: "destructive",
            title: "촬영 준비 실패",
            description: "사진을 처리하는 데 필요한 요소를 준비하지 못했습니다."
        });
      }
      closeCamera();
    }
  };

  const handleAdditionalAnalysis = async () => {
    if (!leftPhotoPreview || !rightPhotoPreview) return;

    setIsAnalyzingExtra(true);
    setExtraAnalysisResult(null);

    try {
      const question = "올해 나는 연애에 성공할까?";
      const result = await analyzeLoveLuck(leftPhotoPreview!, rightPhotoPreview!, question);
      setExtraAnalysisResult(result.analysis);
    } catch (error) {
      console.error('[PalmReader] Extra analysis error:', error);
      toast({
        variant: "destructive",
        title: "추가 분석 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
      });
    } finally {
      setIsAnalyzingExtra(false);
    }
  };

  const generateCompatibilityLink = async (type: 'friend' | 'love') => {
    if (!leftPhotoPreview || !rightPhotoPreview || generatingLinkType) return;
    
    setGeneratingLinkType(type);

    try {
        const featuresResult = await extractFeatures(leftPhotoPreview, rightPhotoPreview);
        const featuresJson = featuresResult.features;
        const compressed = pako.deflate(featuresJson);
        
        let binaryString = '';
        for (let i = 0; i < compressed.length; i++) {
            binaryString += String.fromCharCode(compressed[i]);
        }
        const encoded = btoa(binaryString);
        
        const url = `${window.location.origin}/compatibility?type=${type}&data=${encodeURIComponent(encoded)}`;
        
        if (isMobile && navigator.share) {
            await navigator.share({
                title: type === 'friend' ? '친구와 우정 궁합 보기' : '연인과 애정 궁합 보기',
                text: '내 손금을 보냈어! 너의 손금을 입력하고 우리 궁합을 확인해봐!',
                url: url,
            });
             toast({
                title: "공유 완료!",
                description: "친구(또는 연인)에게 링크를 성공적으로 공유했습니다!",
            });
        } else {
            try {
                await navigator.clipboard.writeText(url);
                toast({
                    title: "궁합 링크 복사 완료!",
                    description: "친구(또는 연인)에게 링크를 공유하여 궁합을 확인해보세요!",
                });
            } catch (clipboardError) {
                console.warn("Clipboard write failed, showing fallback", clipboardError);
                setShowCopyFallback(url);
            }
        }
    } catch(e) {
        console.error("Failed to create or share compatibility link", e);
        if (!(e instanceof DOMException && e.name === 'AbortError')) {
           toast({ variant: 'destructive', title: "오류", description: "링크를 만들거나 공유하는 데 실패했습니다."});
        }
    } finally {
        setGeneratingLinkType(null);
    }
  };


  const resetState = () => {
    setLeftPhotoPreview(null);
    setRightPhotoPreview(null);
    setReport(null);
    setIsLoading(false);
    setShareUrl('');
    setExtraAnalysisResult(null);
    setIsAnalyzingExtra(false);
    if(leftFileInputRef.current) {
      leftFileInputRef.current.value = "";
    }
    if(rightFileInputRef.current) {
      rightFileInputRef.current.value = "";
    }
  }

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
        await navigator.clipboard.writeText(shareUrl);
        toast({
            title: "링크 복사 완료!",
            description: "분석 결과 링크가 클립보드에 복사되었습니다.",
        });
    } catch (error) {
        console.warn("Clipboard copy failed, showing fallback", error);
        setShowCopyFallback(shareUrl);
    }
  };

  const handleShare = async () => {
      if (!shareUrl || !navigator.share) return;
      try {
          await navigator.share({
              title: 'AI 손금 분석 결과',
              text: 'AI가 분석해준 제 손금 결과를 확인해보세요!',
              url: shareUrl,
          });
      } catch (error) {
          console.error("Sharing failed", error);
          if (!(error instanceof DOMException && error.name === 'AbortError')) {
            toast({
                variant: "destructive",
                title: "공유 실패",
                description: "결과를 공유하는 데 실패했습니다. 대신 링크를 복사해드릴게요.",
            });
            handleCopyLink();
          }
      }
  };

  const isAnalysisReady = !!(leftPhotoPreview && rightPhotoPreview);
  const showInitialView = !isAnalysisReady && !isLoading && !report;
  const showResultView = isAnalysisReady || isLoading || report;

  const UploadCard = ({ hand, previewSrc, onUploadClick, onCameraClick }: { hand: 'left' | 'right', previewSrc: string | null, onUploadClick: () => void, onCameraClick: () => void }) => (
    <Card className="flex flex-col items-center justify-center p-6 sm:p-8 w-full border-2 border-dashed border-primary/50 bg-transparent transition-all duration-300 hover:border-primary hover:bg-primary/10">
      {previewSrc ? (
         <img src={previewSrc} alt={`${hand === 'left' ? '왼손' : '오른손'} 사진`} className="rounded-lg object-cover w-full aspect-square shadow-md mb-4" />
      ) : (
        <div className="flex flex-col items-center justify-center w-full aspect-square bg-muted/50 rounded-lg mb-4">
          <UploadCloud className="w-12 h-12 text-primary mb-2" />
          <CardTitle className="mb-1 font-headline text-xl">{hand === 'left' ? '왼손' : '오른손'}</CardTitle>
          <CardDescription className="text-center text-xs">{hand === 'left' ? '타고난 운명' : '현재와 미래의 운명'}</CardDescription>
        </div>
      )}
      <input type="file" ref={hand === 'left' ? leftFileInputRef : rightFileInputRef} onChange={(e) => handleFileChange(e, hand)} accept="image/*" className="hidden" />
      <div className="w-full flex flex-col sm:flex-row gap-2">
        <Button size="lg" onClick={onUploadClick} disabled={isLoading} className="w-full">
           {previewSrc ? '다른 사진 선택' : '사진 선택'}
        </Button>
        <Button size="lg" variant="outline" onClick={onCameraClick} disabled={isLoading} className="w-full">
            <Camera className="mr-2 h-5 w-5"/>
            {previewSrc ? '다시 촬영' : '카메라로 촬영'}
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-12 animate-in fade-in slide-in-from-top-10 duration-700">
        <div className="flex justify-center items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-primary" />
            <div className="text-lg font-semibold text-muted-foreground">
                지금까지 {visitorCount ? <span className="text-primary font-bold">{visitorCount.toLocaleString()}</span> : <Skeleton className="inline-block w-20 h-6" />} 명이 이용했어요!
            </div>
        </div>
        <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">AI 손금 분석으로 당신의 운명을 알아보세요</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">AI 손금 전문가가 당신의 양손을 정밀하게 분석하여 연애운, 재물운, 건강운 등 인생의 중요한 운세를 알려드립니다. 지금 <span className="font-bold text-primary">100% 무료</span>로 당신의 손금에 담긴 비밀을 확인해보세요!</p>
        <div className="flex justify-center items-center flex-wrap gap-3 mt-6">
            <Badge variant="outline" className="py-2 px-4 text-sm border-primary/30 bg-primary/5 text-muted-foreground">
                <Zap className="w-4 h-4 mr-2 text-primary" />
                바로 결과 확인이 가능해요
            </Badge>
            <Badge variant="outline" className="py-2 px-4 text-sm border-primary/30 bg-primary/5 text-muted-foreground">
                <ShieldCheck className="w-4 h-4 mr-2 text-primary" />
                개인정보 보호. 분석 후 데이터를 즉시 파기해요
            </Badge>
            <Badge variant="outline" className="py-2 px-4 text-sm border-primary/30 bg-primary/5 text-muted-foreground">
                <BrainCircuit className="w-4 h-4 mr-2 text-primary" />
                학습된 AI를 기반으로 분석해요
            </Badge>
        </div>
      </div>

      {showInitialView && (
        <div className="animate-in fade-in-50 slide-in-from-bottom-10 duration-1000">
          <div className="grid md:grid-cols-2 gap-8 items-start mb-8">
             <UploadCard hand="left" previewSrc={leftPhotoPreview} onUploadClick={() => handleUploadClick('left')} onCameraClick={() => openCamera('left')} />
             <UploadCard hand="right" previewSrc={rightPhotoPreview} onUploadClick={() => handleUploadClick('right')} onCameraClick={() => openCamera('right')} />
          </div>

          <Card className="border-l-4 border-primary bg-card/80 card-glow-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="text-primary"/> 
                최상의 결과를 위한 촬영 팁
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground list-inside">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">1.</span>
                  <span><strong>밝은 조명:</strong> 밝고 균일한 조명 아래에서 손바닥을 촬영하여 그림자를 최소화하세요.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">2.</span>
                  <span><strong>선명한 초점:</strong> 손금 라인이 흐릿하지 않고 선명하게 보이도록 카메라 초점을 정확히 맞추세요.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">3.</span>
                  <span><strong>전체 손바닥:</strong> 손가락을 자연스럽게 펴고 손바닥 전체가 사진 프레임에 들어오도록 하세요.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <div className="mt-8 mb-12 animate-in fade-in-50 slide-in-from-bottom-10 duration-800">
            <Card className="card-glow-border">
                <CardHeader>
                    <CardTitle className="text-center font-headline">많은 분들 덕분에 서비스가 점점 고도화 되고 있습니다.</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                        <div className="flex flex-col items-center">
                            <Star className="w-10 h-10 text-primary mb-3" />
                            <p className="text-2xl font-bold">4.5+/5</p>
                            <p className="text-sm text-muted-foreground">고객후기</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <Target className="w-10 h-10 text-primary mb-3" />
                            <p className="text-2xl font-bold">96%</p>
                            <p className="text-sm text-muted-foreground">정확도</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <BarChart className="w-10 h-10 text-primary mb-3" />
                            <p className="text-2xl font-bold">700+</p>
                            <p className="text-sm text-muted-foreground">분석요청</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>
      )}

      {showResultView && (
        <div className="grid md:grid-cols-2 gap-8 items-start animate-in fade-in duration-500">
          <div className="flex flex-col gap-8">
            <Card className="card-glow-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <Hand className="w-5 h-5 text-primary" /> 당신의 손금
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                {leftPhotoPreview ? 
                  <img src={leftPhotoPreview} alt="AI 손금 분석을 위해 업로드된 왼손 손바닥 사진" className="rounded-lg object-cover w-full aspect-square shadow-md" /> 
                  : <Skeleton className="w-full aspect-square rounded-lg" />
                }
                {rightPhotoPreview ? 
                  <img src={rightPhotoPreview} alt="AI 손금 분석을 위해 업로드된 오른손 손바닥 사진" className="rounded-lg object-cover w-full aspect-square shadow-md" /> 
                  : <Skeleton className="w-full aspect-square rounded-lg" />
                }
              </CardContent>
            </Card>
          </div>
          <Card className="md:sticky md:top-24 card-glow-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <BookOpen className="w-5 h-5 text-primary" /> 전체 리포트
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center text-center p-4 min-h-[300px]">
                  <LoaderCircle className="w-10 h-10 mx-auto animate-spin text-primary mb-6" />
                  <p className="text-lg font-semibold text-primary transition-opacity duration-300">{currentLoadingMessage}</p>
                  <p className="text-sm text-muted-foreground mt-2">AI가 당신의 운명을 꼼꼼히 살피고 있습니다.</p>
                </div>
              ) : (
                report && (
                  <>
                    <div className="mb-8 rounded-lg overflow-hidden shadow-lg border border-primary/20">
                        <Image
                            src="/palm-analysis-guide.png"
                            alt="손금 분석 가이드"
                            width={800}
                            height={800}
                            className="w-full h-auto"
                            priority
                        />
                    </div>
                    <div className="space-y-8">
                        <div>
                        <h3 className="text-xl font-semibold font-headline mb-4 border-b pb-2">종합 운세</h3>
                        <div className="space-y-5">
                            <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 text-primary"><Heart className="w-5 h-5" /></div>
                            <div>
                                <h4 className="font-semibold">연애운</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.comprehensiveAnalysis.loveLuck}</p>
                            </div>
                            </div>
                            <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 text-primary"><Users className="w-5 h-5" /></div>
                            <div>
                                <h4 className="font-semibold">결혼운</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.comprehensiveAnalysis.marriageLuck}</p>
                            </div>
                            </div>
                            <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 text-primary"><HeartPulse className="w-5 h-5" /></div>
                            <div>
                                <h4 className="font-semibold">건강운</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.comprehensiveAnalysis.healthLuck}</p>
                            </div>
                            </div>
                            <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 text-primary"><Wallet className="w-5 h-5" /></div>
                            <div>
                                <h4 className="font-semibold">재물운</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.comprehensiveAnalysis.wealthLuck}</p>
                            </div>
                            </div>
                            <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 text-primary"><Briefcase className="w-5 h-5" /></div>
                            <div>
                                <h4 className="font-semibold">직업운</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.comprehensiveAnalysis.careerLuck}</p>
                            </div>
                            </div>
                            <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 text-primary"><GraduationCap className="w-5 h-5" /></div>
                            <div>
                                <h4 className="font-semibold">적성운</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.comprehensiveAnalysis.aptitudeLuck}</p>
                            </div>
                            </div>
                            <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 text-primary"><Users2 className="w-5 h-5" /></div>
                            <div>
                                <h4 className="font-semibold">대인관계운</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.comprehensiveAnalysis.interpersonalLuck}</p>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                  </>
                )
              )}
            </CardContent>
          </Card>
        </div>
      )}
      
      {report && !isLoading && (
        <div className="mt-12 space-y-8 animate-in fade-in duration-700">
            <Card className="card-glow-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 font-headline">
                        <Sparkles className="text-primary"/>
                        친구/연인과 궁합 보기
                    </CardTitle>
                    <CardDescription>
                        링크를 복사해서 친구나 연인에게 공유해보세요. 상대방이 손금을 입력하면 두 사람의 궁합을 알려드립니다!
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={() => generateCompatibilityLink('friend')} className="w-full" variant="outline" disabled={!!generatingLinkType}>
                        {generatingLinkType === 'friend' ? <LoaderCircle className="mr-2 animate-spin" /> : <Users className="mr-2"/>}
                        {generatingLinkType === 'friend' ? '링크 생성 중...' : '친구와 우정 궁합'}
                    </Button>
                    <Button onClick={() => generateCompatibilityLink('love')} className="w-full" variant="outline" disabled={!!generatingLinkType}>
                         {generatingLinkType === 'love' ? <LoaderCircle className="mr-2 animate-spin" /> : <Heart className="mr-2"/>}
                         {generatingLinkType === 'love' ? '링크 생성 중...' : '연인과 애정 궁합'}
                    </Button>
                </CardContent>
            </Card>

            <Card className="bg-primary/10 border-primary/30 card-glow-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 font-headline">
                        <WandSparkles className="text-primary"/>
                        추가 분석: 올해 나는 연애에 성공할까?
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isAnalyzingExtra ? (
                        <div className="flex items-center justify-center gap-3 text-primary">
                            <LoaderCircle className="w-5 h-5 animate-spin" />
                            <span>당신의 연애운을 분석중입니다...</span>
                        </div>
                    ) : extraAnalysisResult ? (
                        <p className="text-muted-foreground whitespace-pre-wrap">{extraAnalysisResult}</p>
                    ) : (
                       <>
                        <p className="text-muted-foreground mb-4">당신의 손금을 기반으로 AI가 연애운에 대한 추가 분석을 제공합니다. 버튼을 눌러 확인해보세요.</p>
                        <Button onClick={handleAdditionalAnalysis} disabled={isAnalyzingExtra}>
                            <WandSparkles className="mr-2 h-4 w-4"/>
                            연애운 추가 분석하기
                        </Button>
                       </>
                    )}
                </CardContent>
            </Card>

            <div className="text-center">
                <p className="text-lg font-semibold text-primary mb-4 animate-pulse">
                📢 친구에게 공유하고 함께 운명을 확인해보세요!
                <br />
                친구에게 공유하면 친구도 무료로 손금 분석을 이용할 수 있어요!📢
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {isMobile && navigator.share ? (
                        <Button onClick={handleShare} className="w-full sm:w-auto button-glow-accent">
                        <Share2 className="mr-2" />
                        공유하기
                        </Button>
                    ) : (
                        <Button onClick={handleCopyLink} className="w-full sm:w-auto button-glow-accent">
                        <Copy className="mr-2" />
                        링크 복사하기
                        </Button>
                    )}
                    <Button variant="outline" onClick={resetState} className="w-full sm:w-auto">
                        다른 손금 분석하기
                    </Button>
                </div>
            </div>
        </div>
      )}

       <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
        <DialogContent className="max-w-md w-full p-0" onInteractOutside={closeCamera}>
            <DialogHeader className="p-4 border-b">
              <DialogTitle>{capturingHand === 'left' ? '왼손' : '오른손'} 촬영하기</DialogTitle>
              <DialogDescription>손바닥이 화면에 꽉 차고 선명하게 나오도록 촬영해주세요.</DialogDescription>
            </DialogHeader>
            <div className="p-4">
              <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                {hasCameraPermission === null && (
                   <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                     <LoaderCircle className="w-8 h-8 text-white animate-spin" />
                   </div>
                )}
              </div>
               {hasCameraPermission === false && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>카메라 권한 필요</AlertTitle>
                  <AlertDescription>
                    카메라를 사용하려면 브라우저 설정에서 권한을 허용해야 합니다.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <div className="p-4 border-t flex justify-center">
                <Button size="lg" onClick={handleCapture} disabled={!hasCameraPermission} className="w-20 h-20 rounded-full">
                    <CircleDot className="w-10 h-10"/>
                    <span className="sr-only">사진 찍기</span>
                </Button>
            </div>
            <DialogClose asChild>
                <button onClick={closeCamera} className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X className="h-4 w-4" />
                    <span className="sr-only">닫기</span>
                </button>
            </DialogClose>
        </DialogContent>
      </Dialog>

      <Dialog open={!!showCopyFallback} onOpenChange={() => setShowCopyFallback(null)}>
        <DialogContent className="max-w-md w-full">
            <DialogHeader>
                <DialogTitle>링크 공유하기</DialogTitle>
                <DialogDescription>
                    브라우저 보안 정책으로 인해 자동 복사가 차단되었습니다. 아래 링크를 직접 복사하여 공유해주세요.
                </DialogDescription>
            </DialogHeader>
            <div className="p-4 bg-muted rounded-md break-all text-sm font-mono border">
                {showCopyFallback}
            </div>
            <div className="flex justify-end pt-4">
                <Button onClick={() => setShowCopyFallback(null)}>확인</Button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
