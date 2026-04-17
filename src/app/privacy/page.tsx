import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full bg-background py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6 animate-in fade-in duration-500">
        <Card className="max-w-4xl mx-auto card-glow-border">
          <CardHeader>
            <CardTitle className="text-3xl font-bold font-headline">개인정보처리방침</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            <h3 className="text-xl font-semibold text-foreground">1. 개인정보의 처리 목적</h3>
            <p>AI 손금 분석기(이하 '서비스')는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>손금 분석 서비스 제공: 사용자가 업로드한 손바닥 사진을 분석하여 결과를 제공하기 위한 목적으로 개인정보(이미지)를 처리합니다.</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground">2. 처리하는 개인정보의 항목</h3>
            <p>서비스는 다음의 개인정보 항목을 처리하고 있습니다.</p>
             <ul className="list-disc list-inside space-y-2 pl-4">
              <li>필수항목 : 손바닥 이미지 사진. 해당 정보는 서비스 제공 목적 외 다른 용도로 사용되지 않으며, 분석 후 즉시 파기됩니다.</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground">3. 개인정보의 처리 및 보유 기간</h3>
            <p>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의 받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다. 사용자가 업로드한 손바닥 사진은 분석 결과를 제공하는 즉시 서버에서 파기되며, 어떠한 형태로도 저장되거나 보관되지 않습니다.</p>

            <h3 className="text-xl font-semibold text-foreground">4. 개인정보의 제3자 제공에 관한 사항</h3>
            <p>회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</p>
            
            <h3 className="text-xl font-semibold text-foreground">5. 개인정보처리의 위탁에 관한 사항</h3>
            <p>회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다. 회사는 위탁계약 체결시 개인정보 보호법 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>위탁받는 자 (수탁자): Google (Google Cloud AI Platform)</li>
              <li>위탁하는 업무의 내용: 손금 이미지 분석을 위한 AI 모델 처리</li>
            </ul>
            
            <p className="pt-4">본 개인정보처리방침은 2025년 1월 1일부터 시행됩니다.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}