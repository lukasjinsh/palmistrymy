import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

export default function SampleBlogPostPage() {
  return (
    <div className="w-full bg-background py-12 md:py-16 lg:py-20">
      <div className="container mx-auto max-w-3xl px-4 md:px-6 animate-in fade-in slide-in-from-bottom-10 duration-500">
        <article>
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl md:text-5xl mb-4 text-foreground">
              오늘의 손금: 재물운이 폭발하는 손금은?
            </h1>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <time dateTime="2024-05-20">2024년 5월 20일</time>
              </div>
              <Badge variant="outline">재물운</Badge>
            </div>
          </header>

          <Image
            src="https://placehold.co/800x400.png"
            data-ai-hint="gold coins money"
            alt="재물운과 관련된 손금 이미지"
            width={800}
            height={400}
            className="w-full rounded-lg mb-8 shadow-lg"
          />

          <div className="prose max-w-none text-muted-foreground">
            <p className="text-lg leading-relaxed mb-6">
              누구나 한 번쯤 '부자가 되고 싶다'는 꿈을 꿉니다. 놀랍게도 그 힌트가 바로 당신의 손바닥 안에 숨겨져 있을 수 있습니다. 손금에서는 특정 선의 모양과 특징을 통해 한 사람의 재물운을 가늠해볼 수 있다고 하는데요, 오늘은 과연 어떤 손금이 '부자의 손금'인지 함께 알아보겠습니다.
            </p>
            
            <h2 className="text-2xl font-semibold font-headline text-foreground mt-8 mb-4">1. 진하고 선명한 '재물선'</h2>
            <p>
              가장 대표적인 것이 바로 '재물선'입니다. 새끼손가락 뿌리 부분을 향해 뻗어있는 세로선을 말하는데요, 이 선이 끊김 없이 진하고 선명하게 뻗어있다면 재물을 모으는 능력이 뛰어나고 돈이 잘 새어나가지 않음을 의미합니다. 만약 여러 가닥의 재물선이 있다면 다양한 경로를 통해 수익을 창출할 수 있는 능력을 가졌다고 해석할 수 있습니다.
            </p>

            <h2 className="text-2xl font-semibold font-headline text-foreground mt-8 mb-4">2. M자 손금: 행운의 상징</h2>
            <p>
              생명선, 두뇌선, 감정선, 그리고 운명선이 만나 알파벳 'M'자 모양을 그리는 손금입니다. M자 손금은 매우 드물며, 강력한 행운과 재물운을 타고났음을 의미합니다. 특히 젊은 시절의 노력이 중년 이후 큰 결실을 맺어 경제적으로 풍요로운 삶을 살게 될 가능성이 높다고 봅니다.
            </p>
            
            <Card className="my-8 card-glow-border">
              <CardContent className="p-6">
                <p className="text-lg font-semibold text-center text-primary">
                  "손금은 정해진 운명이 아니라, 당신이 만들어갈 미래의 지도입니다."
                </p>
              </CardContent>
            </Card>

            <h2 className="text-2xl font-semibold font-headline text-foreground mt-8 mb-4">3. '삼지창' 손금: 부와 명예를 동시에</h2>
            <p>
              운명선 끝이 세 갈래로 갈라져 마치 삼지창처럼 보이는 손금입니다. 이는 자신의 노력으로 큰 부와 명예를 동시에 얻게 될 것을 암시하는 매우 길한 손금입니다. 강한 의지와 리더십을 바탕으로 사회적으로 큰 성공을 거두는 사람들에게서 자주 발견됩니다.
            </p>
            <p>
              물론, 좋은 손금을 가졌다고 해서 노력을 게을리해서는 안 되며, 반대로 재물운 손금이 뚜렷하지 않다고 해서 실망할 필요도 없습니다. 손금은 계속해서 변하며, 당신의 노력과 의지에 따라 얼마든지 더 나은 방향으로 바뀔 수 있습니다. 오늘 알려드린 내용을 참고하여 자신의 잠재력을 믿고 꾸준히 나아가시길 바랍니다.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
