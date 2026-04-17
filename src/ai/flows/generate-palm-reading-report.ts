
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePalmReadingReportInputSchema = z.object({
  leftPhotoDataUri: z.string().describe("왼손 사진 URI"),
  rightPhotoDataUri: z.string().describe("오른손 사진 URI"),
});
export type GeneratePalmReadingReportInput = z.infer<typeof GeneratePalmReadingReportInputSchema>;

const GeneratePalmReadingReportOutputSchema = z.object({
  comprehensiveAnalysis: z.object({
    loveLuck: z.string().describe('연애운 분석'),
    marriageLuck: z.string().describe('결혼운 분석'),
    healthLuck: z.string().describe('건강운 분석'),
    wealthLuck: z.string().describe('재물운 분석'),
    careerLuck: z.string().describe('직업운 분석'),
    aptitudeLuck: z.string().describe('적성운 분석'),
    interpersonalLuck: z.string().describe('대인관계운 분석'),
  }),
});
export type GeneratePalmReadingReportOutput = z.infer<typeof GeneratePalmReadingReportOutputSchema>;

export async function generatePalmReadingReport(input: GeneratePalmReadingReportInput): Promise<GeneratePalmReadingReportOutput> {
  return generatePalmReadingReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePalmReadingReportPrompt',
  model: 'googleai/gemini-3-flash-preview',
  input: {schema: GeneratePalmReadingReportInputSchema},
  output: {schema: GeneratePalmReadingReportOutputSchema},
  prompt: `당신은 수만 명의 손금을 분석해 온 전설적인 손금술사입니다. 제공된 양손의 고해상도 이미지를 정밀 분석하여 인생의 여러 측면에 대한 종합 리포트를 작성해주세요.

왼손(선천적 운명): {{media url=leftPhotoDataUri}}
오른손(후천적 운명 및 현재): {{media url=rightPhotoDataUri}}

각 운세별로 구체적이고 전문적인 통찰을 제공해주세요.`,
});

const generatePalmReadingReportFlow = ai.defineFlow(
  {
    name: 'generatePalmReadingReportFlow',
    inputSchema: GeneratePalmReadingReportInputSchema,
    outputSchema: GeneratePalmReadingReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI response was empty.");
    }
    return output;
  }
);
