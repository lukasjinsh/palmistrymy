import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, LifeBuoy, Brain, Heart, Star, ShipWheel, Gem, Link, Sun, Shield } from "lucide-react";
import Image from "next/image";

export default function BasicsPage() {
  const palmLines = [
    { name: "생명선 (Life Line)", icon: LifeBuoy, description: "건강, 활력, 수명, 그리고 삶의 중요한 변화들을 나타냅니다. 선이 길고 진할수록 건강하고 활기찬 삶을 의미합니다." },
    { name: "두뇌선 (Head Line)", icon: Brain, description: "지성, 사고방식, 재능, 그리고 적성을 나타냅니다. 선의 길이, 깊이, 방향을 통해 지적 능력과 판단력을 엿볼 수 있습니다." },
    { name: "감정선 (Heart Line)", icon: Heart, description: "애정, 감정 표현, 대인 관계의 성향을 보여줍니다. 선의 모양과 길이를 통해 감정의 깊이와 연애 패턴을 알 수 있습니다." },
    { name: "운명선 (Fate Line)", icon: Star, description: "직업, 사회적 성공, 인생의 방향성을 나타냅니다. 손바닥 중앙을 세로로 가로지르는 선으로, 자수성가 여부와 삶의 만족도를 보여줍니다." },
    { name: "태양선 (Sun Line)", icon: Sun, description: "인기, 명예, 재능, 예술적 감각을 나타냅니다. 성공과 부를 끌어당기는 힘을 상징하며, '성공선'이라고도 불립니다." },
    { name: "결혼선 (Marriage Line)", icon: Link, description: "결혼 생활, 연애 관계의 깊이와 시기를 나타냅니다. 새끼손가락 아래에 위치하며, 선의 수와 모양으로 이성 관계를 파악합니다." },
    { name: "재물선 (Money Line)", icon: Gem, description: "재물운, 저축 능력, 비즈니스 감각을 나타냅니다. 선이 굵고 선명할수록 재물을 모으는 능력이 뛰어나다고 봅니다." },
    { name: "건강선 (Health Line)", icon: Shield, description: "현재의 건강 상태나 질병에 대한 저항력을 나타냅니다. 선이 끊어지거나 흐릿하면 건강 관리에 유의해야 함을 의미합니다." },
  ];

  return (
    <div className="w-full bg-background py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6 animate-in fade-in slide-in-from-bottom-10 duration-500">
        <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                손금 기초 가이드
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
                당신의 손바닥에 새겨진 주요 손금들의 의미를 알아보세요. 각 손금은 당신의 삶과 운명에 대한 특별한 이야기를 담고 있습니다.
            </p>
        </div>

        <Card className="mb-12 card-glow-border">
          <CardContent className="p-6">
             <Image src="/palm-analysis-guide.png" alt="손금 라인 가이드 이미지" width={1024} height={1024} className="rounded-lg w-full" />
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {palmLines.map((line, index) => (
            <Card key={index} className="card-glow-border">
              <CardHeader className="flex flex-row items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                      <line.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{line.name}</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-muted-foreground">
                      {line.description}
                  </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-20">
          <Card className="card-glow-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <BookOpen className="text-primary"/>
                추천 도서 및 자료
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                손금에 대해 더 깊이 탐구하고 싶다면 아래의 책을 추천합니다. 손금의 세계를 더 넓게 이해하는 데 도움이 될 것입니다.
              </p>
              <div className="p-4 border rounded-lg bg-card/50">
                <h4 className="font-semibold text-foreground">Palmistry: Your Personal Guide</h4>
                <p className="text-sm text-muted-foreground">by Roberta Vernon</p>
                <p className="text-sm mt-2">손금의 기초부터 심화 내용까지 체계적으로 다루고 있어 입문자에게 매우 유용한 책입니다.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
