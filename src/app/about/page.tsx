import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hand, Sparkles, BrainCircuit, Beaker } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="w-full bg-background py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6 animate-in fade-in slide-in-from-bottom-10 duration-500">
        <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent text-glow">
                AI 손금 분석 서비스 소개
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
                최첨단 AI 기술로 당신의 손바닥 안에 숨겨진 운명의 지도를 해석해 보세요. 저희의 인공지능 손금 서비스는 전통적인 손금 지식과 딥러닝 기술을 결합하여, 당신의 삶에 대한 깊이 있는 통찰력을 제공합니다.
            </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
            <Card className="card-glow-border">
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Hand className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>전통과 기술의 만남</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        저희 서비스는 수세기 동안 이어져 온 전통 손금 지혜와 최첨단 인공지능 기술을 결합하여, 당신의 손금에 담긴 의미를 현대적으로 재해석합니다. AI는 방대한 손금 데이터를 학습하여, 보다 객관적이고 체계적인 분석을 제공합니다.
                    </p>
                </CardContent>
            </Card>
            <Card className="card-glow-border">
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <BrainCircuit className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>정교한 AI 분석</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        고도로 훈련된 AI 모델이 당신의 손바닥 이미지를 정밀하게 스캔하여 생명선, 두뇌선, 감정선과 같은 주요 손금은 물론, 결혼선, 재물선 등 세부적인 손금까지 식별하고 복합적으로 분석합니다.
                    </p>
                </CardContent>
            </Card>
            <Card className="card-glow-border">
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>개인화된 리포트</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        분석 결과는 단순한 정보 나열을 넘어, 당신의 성격, 재능, 그리고 미래의 가능성을 종합적으로 해석한 운세 리포트로 제공됩니다. 연애운, 결혼운, 건강운, 재물운, 직업운 등 삶의 다양한 측면을 조명하여 더 나은 미래를 설계하는 데 도움을 드립니다.
                    </p>
                </CardContent>
            </Card>
            <Card className="card-glow-border">
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Beaker className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Made by Ming</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        본 서비스는 옥밍 연구소에서 제작하는 AI 서비스입니다.
                    </p>
                </CardContent>
            </Card>
        </div>
        <div className="mt-12 text-center text-muted-foreground">
            <p>AI 손금 분석기와 함께 당신의 잠재력을 발견하고 미래를 탐험해 보세요!</p>
        </div>
      </div>
    </div>
  );
}