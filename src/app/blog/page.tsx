import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const blogPosts = [
  {
    slug: "sample",
    title: "오늘의 손금: 재물운이 폭발하는 손금은?",
    description: "혹시 당신도 모르는 사이에 부자의 손금을 가지고 있을 수 있습니다! 오늘은 재물운과 관련된 손금의 특징들을 자세히 알아봅니다.",
    image: "https://placehold.co/600x400.png",
    imageHint: "gold coins"
  },
  {
    slug: "sample",
    title: "성공하는 사람들의 손금에는 특별한 것이 있다?",
    description: "성공한 사람들의 손에는 공통적인 특징이 있다는 사실, 알고 계셨나요? 운명선과 태양선을 중심으로 성공의 비밀을 파헤쳐 봅니다.",
     image: "https://placehold.co/600x400.png",
     imageHint: "success mountain"
  },
  {
    slug: "sample",
    title: "연애운을 높이는 손금 관리법",
    description: "감정선과 결혼선을 통해 알아보는 나의 연애 스타일! 더 나은 관계를 위한 손금 관리 팁을 알려드립니다.",
     image: "https://placehold.co/600x400.png",
     imageHint: "love heart"
  },
];

export default function BlogPage() {
  return (
    <div className="w-full bg-background py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6 animate-in fade-in slide-in-from-bottom-10 duration-500">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            AI 손금 블로그
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            손금에 대한 흥미로운 이야기와 깊이 있는 정보를 만나보세요.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Card key={post.slug} className="card-glow-border overflow-hidden flex flex-col">
              <CardHeader className="p-0">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover"
                  data-ai-hint={post.imageHint}
                />
              </CardHeader>
              <CardContent className="p-6 flex-grow flex flex-col">
                <CardTitle className="mb-2 text-xl font-headline">{post.title}</CardTitle>
                <CardDescription className="flex-grow">{post.description}</CardDescription>
                <Button asChild variant="outline" className="mt-6 w-full">
                  <Link href={`/blog/${post.slug}`}>
                    자세히 보기 <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
