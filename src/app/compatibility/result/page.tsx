
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hand, LoaderCircle, Instagram, Share2, Copy, X } from 'lucide-react';
import pako from 'pako';
import type { GenerateFriendshipAnalysisOutput } from '@/ai/flows/generate-friendship-analysis';
import type { GenerateLoveAnalysisOutput } from '@/ai/flows/generate-love-analysis';
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type AnalysisResult = GenerateFriendshipAnalysisOutput | GenerateLoveAnalysisOutput;

function CompatibilityResultDisplay() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [type, setType] = useState<'friend' | 'love' | null>(null);
    const [showCopyFallback, setShowCopyFallback] = useState<string | null>(null);

    useEffect(() => {
        const dataParam = searchParams.get('data');
        const typeParam = searchParams.get('type');
        
        if (typeParam === 'friend' || typeParam === 'love') {
            setType(typeParam);
        }

        if (dataParam) {
            try {
                const binaryString = atob(decodeURIComponent(dataParam));
                const charData = binaryString.split('').map(x => x.charCodeAt(0));
                const byteArray = new Uint8Array(charData);
                const decompressed = pako.inflate(byteArray, { to: 'string' });
                setResult(JSON.parse(decompressed));
            } catch (error) {
                console.error("Failed to parse result data from URL", error);
                toast({ variant: 'destructive', title: "오류", description: `결과를 불러오는 데 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}` });
                router.push('/');
            }
        }
    }, [searchParams, router, toast]);

    const handleCopyLink = async () => {
        const url = window.location.href;
        try {
            await navigator.clipboard.writeText(url);
            toast({
                title: "링크 복사 완료!",
                description: "궁합 결과 링크가 클립보드에 복사되었습니다.",
            });
        } catch (error) {
            console.warn("Clipboard copy failed, showing fallback", error);
            setShowCopyFallback(url);
        }
    };

    if (!result || !type) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoaderCircle className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <Card className="card-glow-border shadow-2xl">
                <CardHeader className="text-center">
                    <div className="mb-4 text-5xl">{type === 'friend' ? '🤝' : '💖'}</div>
                    <CardTitle className="text-3xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">{result.title}</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground mt-2">
                        {type === 'friend' ? '친구와의 우정 궁합' : '연인과의 애정 궁합'} 분석 결과
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div>
                        <div className="flex justify-center items-baseline gap-2 mb-6">
                            <span className="text-6xl font-bold text-primary">{result.score}</span>
                            <span className="text-2xl text-muted-foreground">점</span>
                        </div>
                        <div className="p-6 bg-muted/50 rounded-lg">
                            <ReactMarkdown
                              className="prose prose-sm max-w-none text-muted-foreground leading-relaxed"
                              components={{
                                h3: ({node, ...props}) => <h3 className="text-foreground font-semibold" {...props} />,
                                strong: ({node, ...props}) => <strong className="font-semibold text-foreground" {...props} />,
                                p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal pl-5" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc pl-5" {...props} />,
                                li: ({node, ...props}) => <li className="mb-2" {...props} />,
                              }}
                            >
                                {result.analysis}
                            </ReactMarkdown>
                        </div>
                    </div>
                     <div className="text-center space-y-4">
                        <p className="text-lg font-semibold text-primary">
                            이 결과를 인스타그램에 공유해보세요!
                        </p>
                         <p className="text-sm text-muted-foreground">
                            결과 화면을 스크린샷하여 인스타그램 스토리나 피드에 올려보세요!
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button onClick={handleCopyLink} variant="outline" className="w-full sm:w-auto">
                                <Copy className="mr-2" />
                                링크 복사하기
                            </Button>
                        </div>
                    </div>
                    <div className="flex justify-center">
                         <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-transform duration-200 hover:scale-105 active:scale-100 shine-effect button-glow-accent">
                            <Link href="/">
                                <Hand className="mr-2 h-5 w-5" />
                                나만의 손금 분석하기
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

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


export default function CompatibilityResultPage() {
    return (
        <Suspense fallback={
            <div className="w-full h-screen flex justify-center items-center">
                <LoaderCircle className="w-10 h-10 animate-spin text-primary" />
            </div>
        }>
            <CompatibilityResultDisplay />
        </Suspense>
    );
}
