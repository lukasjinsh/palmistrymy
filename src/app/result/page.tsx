'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { GeneratePalmReadingReportOutput } from "@/ai/flows/generate-palm-reading-report";
import { Hand, Heart, Users, HeartPulse, Wallet, Briefcase, Users2, Home, LoaderCircle, GraduationCap } from 'lucide-react';
import pako from 'pako';

function ResultDisplay() {
    const searchParams = useSearchParams();
    const data = searchParams.get('data');
    let report: GeneratePalmReadingReportOutput | null = null;

    if (data) {
        try {
            const binary_string = atob(data);
            const len = binary_string.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            const decompressed = pako.inflate(bytes, { to: 'string' });
            report = JSON.parse(decompressed);
        } catch (error) {
            console.error("Failed to parse report data from URL", error);
        }
    }

    if (!report?.comprehensiveAnalysis) {
        return (
            <div className="text-center animate-in fade-in slide-in-from-bottom-5 duration-500">
                <Card className="card-glow-border">
                    <CardHeader>
                        <CardTitle>오류</CardTitle>
                        <CardDescription>분석 결과를 불러오는데 실패했습니다.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">링크가 올바르지 않거나 데이터가 손상된 것 같습니다.</p>
                        <Button asChild className="mt-6">
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                홈으로 돌아가기
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
            <Card className="card-glow-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                        <Hand className="w-6 h-6 text-primary" /> AI 손금 분석 결과
                    </CardTitle>
                     <CardDescription>공유받은 AI 손금 분석 결과입니다.</CardDescription>
                </CardHeader>
                <CardContent>
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
                </CardContent>
            </Card>
            <div className="text-center mt-8">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-transform duration-200 hover:scale-105 active:scale-100 shine-effect button-glow-accent">
                    <Link href="/">
                        <Hand className="mr-2 h-5 w-5" />
                        나만의 손금 분석하기
                    </Link>
                </Button>
            </div>
        </div>
    );
}

export default function ResultPage() {
    return (
        <div className="w-full bg-gradient-to-b from-background to-accent/20 flex-1">
            <div className="container mx-auto max-w-3xl py-12 md:py-16">
                <Suspense fallback={
                    <div className="flex justify-center items-center h-64">
                        <LoaderCircle className="w-10 h-10 animate-spin text-primary" />
                    </div>
                }>
                    <ResultDisplay />
                </Suspense>
            </div>
        </div>
    );
}
