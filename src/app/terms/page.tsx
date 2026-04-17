import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="w-full bg-background py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6 animate-in fade-in duration-500">
        <Card className="max-w-4xl mx-auto card-glow-border">
          <CardHeader>
            <CardTitle className="text-3xl font-bold font-headline">이용약관</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            <h3 className="text-xl font-semibold text-foreground">제1조 (목적)</h3>
            <p>이 약관은 AI 손금 분석기(이하 "서비스")가 제공하는 모든 제반 서비스의 이용과 관련하여 회사와 회원과의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
            
            <h3 className="text-xl font-semibold text-foreground">제2조 (정의)</h3>
            <p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>"서비스"라 함은 구현되는 단말기(PC, TV, 휴대형단말기 등의 각종 유무선 장치를 포함)와 상관없이 "회원"이 이용할 수 있는 AI 손금 분석기 및 관련 제반 서비스를 의미합니다.</li>
              <li>"회원"이라 함은 서비스에 접속하여 이 약관에 따라 "회사"와 이용계약을 체결하고 "회사"가 제공하는 "서비스"를 이용하는 고객을 말합니다.</li>
              <li>"콘텐츠"라 함은 "서비스"상에 게시된 부호·문자·음성·음향·화상·동영상 등의 정보 형태의 글, 사진, 동영상 및 각종 파일과 링크 등을 의미합니다.</li>
            </ol>
            
            <h3 className="text-xl font-semibold text-foreground">제3조 (약관의 게시와 개정)</h3>
            <p>"회사"는 이 약관의 내용을 "회원"이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다. "회사"는 "약관의규제에관한법률", "정보통신망이용촉진및정보보호등에관한법률(이하 "정보통신망법")" 등 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</p>

            <h3 className="text-xl font-semibold text-foreground">제4조 (서비스의 제공)</h3>
            <p>서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다. "회사"는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신두절 또는 운영상 상당한 이유가 있는 경우 "서비스"의 제공을 일시적으로 중단할 수 있습니다.</p>

            <h3 className="text-xl font-semibold text-foreground">제5조 (개인정보보호 의무)</h3>
            <p>"회사"는 "정보통신망법" 등 관계 법령이 정하는 바에 따라 "회원"의 개인정보를 보호하기 위해 노력합니다. 개인정보의 보호 및 사용에 대해서는 관련법 및 "회사"의 개인정보처리방침이 적용됩니다.</p>
            
            <p className="pt-4">본 약관은 2025년 1월 1일부터 시행됩니다.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}