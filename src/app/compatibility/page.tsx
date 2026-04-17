
'use client';

import { Suspense, useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { UploadCloud, Camera, LoaderCircle, Heart, Users, Hand, Lightbulb } from 'lucide-react';
import pako from 'pako';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { analyzeFriendship, analyzeLove } from '@/lib/gemini';
import type { GenerateFriendshipAnalysisOutput } from '@/ai/flows/generate-friendship-analysis';
import type { GenerateLoveAnalysisOutput } from '@/ai/flows/generate-love-analysis';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X, CircleDot } from 'lucide-react';


type UserAFeatures = string;

const loadingMessages = {
    friend: [
        "두 분의 우정 라인을 분석하고 있습니다...",
        "서로에게 어떤 영향을 주는지 살펴보고 있어요.",
        "함께하면 좋을 활동을 찾아보는 중...",
        "최고의 단짝이 될 수 있을지 확인 중입니다!",
    ],
    love: [
        "두 분의 애정선을 교차 분석하고 있습니다...",
        "서로의 감정 흐름을 읽는 중이에요.",
        "천생연분일지 AI가 신중하게 검토 중...",
        "두 분의 사랑이 더 깊어질 방법을 찾고 있어요!",
    ]
};

function CompatibilityReader() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const [type, setType] = useState<'friend' | 'love' | null>(null);
    const [userAFeatures, setUserAFeatures] = useState<UserAFeatures | null>(null);

    const [userBLeftPhoto, setUserBLeftPhoto] = useState<string | null>(null);
    const [userBRightPhoto, setUserBRightPhoto] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [currentLoadingMessage, setCurrentLoadingMessage] = useState("");

    const leftFileInputRef = useRef<HTMLInputElement>(null);
    const rightFileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    
    // Camera State
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [capturingHand, setCapturingHand] = useState<'left' | 'right' | null>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);


    useEffect(() => {
        const typeParam = searchParams.get('type');
        const dataParam = searchParams.get('data');

        if (typeParam === 'friend' || typeParam === 'love') {
            setType(typeParam);
        } else {
            toast({ variant: 'destructive', title: "오류", description: "잘못된 궁합 유형입니다." });
            router.push('/');
            return;
        }

        if (dataParam) {
            try {
                const binaryString = atob(decodeURIComponent(dataParam));
                const charData = binaryString.split('').map(x => x.charCodeAt(0));
                const byteArray = new Uint8Array(charData);
                const decompressed = pako.inflate(byteArray, { to: 'string' });
                if (!decompressed) throw new Error("Invalid feature data in URL");
                setUserAFeatures(decompressed);
            } catch (error) {
                console.error("Failed to parse user A's data", error);
                toast({ variant: 'destructive', title: "오류", description: `친구/연인의 정보를 불러오는 데 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`});
                router.push('/');
            }
        } else {
             toast({ variant: 'destructive', title: "오류", description: "궁합 분석에 필요한 데이터가 없습니다." });
             router.push('/');
        }
    }, [searchParams, router, toast]);
    
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isLoading && type) {
          const messages = loadingMessages[type];
          let messageIndex = 0;
          setCurrentLoadingMessage(messages[0]);
          interval = setInterval(() => {
            messageIndex = (messageIndex + 1) % messages.length;
            setCurrentLoadingMessage(messages[messageIndex]);
          }, 2500);
        }
        return () => clearInterval(interval);
      }, [isLoading, type]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, hand: 'left' | 'right') => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                toast({ variant: "destructive", title: "유효하지 않은 파일 형식", description: "이미지 파일(예: JPG, PNG)을 업로드해주세요." });
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUri = reader.result as string;
                if (hand === 'left') setUserBLeftPhoto(dataUri);
                else setUserBRightPhoto(dataUri);
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
    
    const handleUploadClick = (hand: 'left' | 'right') => {
        if (hand === 'left') leftFileInputRef.current?.click();
        else rightFileInputRef.current?.click();
    };

    const handleSubmit = async () => {
        if (!userAFeatures || !userBLeftPhoto || !userBRightPhoto || !type) return;

        setIsLoading(true);

        try {
            const result = type === 'friend' 
                ? await analyzeFriendship(userAFeatures, { left: userBLeftPhoto, right: userBRightPhoto })
                : await analyzeLove(userAFeatures, { left: userBLeftPhoto, right: userBRightPhoto });

            const resultJson = JSON.stringify(result);
            const compressed = pako.deflate(resultJson);
            
            let binary = '';
            const bytes = new Uint8Array(compressed);
            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            const encodedResult = window.btoa(binary);

            router.push(`/compatibility/result?type=${type}&data=${encodeURIComponent(encodedResult)}`);
        } catch (error) {
            console.error('[CompatibilityReader] Analysis error:', error);
            toast({ 
                variant: "destructive", 
                title: "분석 실패", 
                description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다." 
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userBLeftPhoto && userBRightPhoto && !isLoading) {
            handleSubmit();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userBLeftPhoto, userBRightPhoto]);

    const openCamera = async (hand: 'left' | 'right') => {
        setCapturingHand(hand);
        setIsCameraOpen(true);
        setHasCameraPermission(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            setCameraStream(stream);
            setHasCameraPermission(true);
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
            toast({ variant: 'destructive', title: '카메라 접근 불가', description: '브라우저 설정에서 카메라 권한을 허용해주세요.' });
        }
    };

    const closeCamera = () => {
        cameraStream?.getTracks().forEach(track => track.stop());
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
                    if (capturingHand === 'left') setUserBLeftPhoto(dataUri);
                    else setUserBRightPhoto(dataUri);
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
    
    if (!type || !userAFeatures) {
        return (
             <div className="flex justify-center items-center h-64">
                <LoaderCircle className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }
    
    const UploadCard = ({ hand, previewSrc }: { hand: 'left' | 'right', previewSrc: string | null }) => (
        <Card className="flex flex-col items-center justify-center p-6 w-full border-2 border-dashed border-primary/50 bg-transparent transition-all duration-300 hover:border-primary hover:bg-primary/10">
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
            <Button size="lg" onClick={() => handleUploadClick(hand)} disabled={isLoading} className="w-full">
               {previewSrc ? '다른 사진 선택' : '사진 선택'}
            </Button>
            <Button size="lg" variant="outline" onClick={() => openCamera(hand)} disabled={isLoading} className="w-full">
                <Camera className="mr-2 h-5 w-5"/>
                {previewSrc ? '다시 촬영' : '카메라로 촬영'}
            </Button>
          </div>
        </Card>
    );

    return (
        <div className="container mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
             <div className="text-center mb-12 animate-in fade-in slide-in-from-top-10 duration-700">
                <div className="flex justify-center items-center gap-2 mb-4 text-2xl font-bold font-headline">
                    {type === 'friend' ? <Users className="w-8 h-8 text-primary" /> : <Heart className="w-8 h-8 text-primary" />}
                    <h1>{type === 'friend' ? '친구와 우정 궁합 보기' : '연인과 애정 궁합 보기'}</h1>
                </div>
                <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                    {type === 'friend' 
                        ? '친구가 공유한 링크입니다. 당신의 손금 사진을 업로드하고 친구와의 우정 궁합을 확인해보세요!' 
                        : '연인이 공유한 링크입니다. 당신의 손금 사진을 업로드하고 연인과의 애정 궁합을 확인해보세요!'}
                </p>
            </div>
            
            {isLoading ? (
                 <div className="flex flex-col items-center justify-center text-center p-4 min-h-[300px]">
                  <LoaderCircle className="w-10 h-10 mx-auto animate-spin text-primary mb-6" />
                  <p className="text-lg font-semibold text-primary transition-opacity duration-300">{currentLoadingMessage}</p>
                  <p className="text-sm text-muted-foreground mt-2">AI가 두 분의 운명을 꼼꼼히 살피고 있습니다.</p>
                </div>
            ) : (
                <div className="animate-in fade-in-50 slide-in-from-bottom-10 duration-1000">
                    <div className="grid md:grid-cols-2 gap-8 items-start mb-8">
                        <UploadCard hand="left" previewSrc={userBLeftPhoto} />
                        <UploadCard hand="right" previewSrc={userBRightPhoto} />
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
                            <li className="flex items-start gap-3"><span className="text-primary font-bold">1.</span><strong>밝은 조명:</strong> 밝고 균일한 조명 아래에서 손바닥을 촬영하여 그림자를 최소화하세요.</li>
                            <li className="flex items-start gap-3"><span className="text-primary font-bold">2.</span><strong>선명한 초점:</strong> 손금 라인이 흐릿하지 않고 선명하게 보이도록 카메라 초점을 정확히 맞추세요.</li>
                            <li className="flex items-start gap-3"><span className="text-primary font-bold">3.</span><strong>전체 손바닥:</strong> 손가락을 자연스럽게 펴고 손바닥 전체가 사진 프레임에 들어오도록 하세요.</li>
                        </ul>
                        </CardContent>
                    </Card>
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
                          <AlertDescription>카메라를 사용하려면 브라우저 설정에서 권한을 허용해야 합니다.</AlertDescription>
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
        </div>
    )
}

export default function CompatibilityPage() {
    return (
        <Suspense fallback={
            <div className="w-full h-screen flex justify-center items-center">
                <LoaderCircle className="w-10 h-10 animate-spin text-primary" />
            </div>
        }>
            <CompatibilityReader />
        </Suspense>
    );
}
