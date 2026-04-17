import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="grid gap-8 text-center sm:grid-cols-3 sm:text-left">
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-sm font-semibold text-foreground">AI 손금 분석기</h3>
            <p className="mt-2 text-sm text-muted-foreground">&copy; 2025 Made By Ming. All Rights Reserved.</p>
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-sm font-semibold text-foreground">정보</h3>
            <nav className="mt-2 flex flex-col space-y-1">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground" prefetch={false}>
                우리에 대해서
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground" prefetch={false}>
                이용약관
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground" prefetch={false}>
                개인정보처리방침
              </Link>
            </nav>
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-sm font-semibold text-foreground">다른 서비스</h3>
            <nav className="mt-2 flex flex-col space-y-1">
              <a href="https://joseon.my" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">
                나의 조상 얼굴 찾기
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
