import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/header';
import Footer from '@/components/footer';
import Script from 'next/script';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI 손금 분석 - 무료 손금 보기, 운세, 사주',
  description: '최첨단 AI 기술로 당신의 손금을 정밀 분석해 드립니다. AI 손금 서비스로 연애운, 재물운, 건강운 등 당신의 미래를 예측하고 숨겨진 잠재력을 발견하세요. 100% 무료입니다.',
  keywords: '손금, 손금 AI, AI 손금, 손금 분석, 무료 손금, 손금 보기, 인공지능 손금, 손금 풀이, 운세, 사주, 미래 예측, 연애운, 재물운, 건강운, 직업운, 결혼운, 손금 앱',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5616997531686678"
     crossOrigin="anonymous"></script>
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "sbka0wm9ap");
  `,
          }}
        />
      </head>
      <body className="font-body antialiased">
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 flex flex-col">{children}</main>
            <div className="bg-background py-8">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-sm font-semibold text-foreground mb-4">제작자에게 후원하기</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                        무료로 운영되는 서비스를 위해 여유가 되신다면 소정의 금액을 지원해주세요! 후원금은 서버 비용과 제작자의 믹스커피 비용에 사용됩니다 :)
                    </p>
                    <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-transform duration-200 hover:scale-105 active:scale-100 shine-effect button-glow-accent">
                        <a href="https://buymeacoffee.com/returnai" target="_blank" rel="noopener noreferrer">
                            <Heart className="mr-2 h-5 w-5" />
                            마음 표현하기
                        </a>
                    </Button>
                </div>
            </div>
            <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
