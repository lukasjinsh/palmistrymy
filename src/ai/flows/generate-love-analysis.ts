
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLoveAnalysisInputSchema = z.object({
  userAFeatures: z.string().describe("상대방의 손금 특징 설명"),
  userBPhotos: z.object({
    left: z.string().describe("나의 왼손 사진 URI"),
    right: z.string().describe("나의 오른손 사진 URI"),
  }),
});
export type GenerateLoveAnalysisInput = z.infer<typeof GenerateLoveAnalysisInputSchema>;

const GenerateLoveAnalysisOutputSchema = z.object({
  title: z.string().describe("분석 결과 제목"),
  score: z.number().describe("애정 궁합 점수 (0-100)"),
  analysis: z.string().describe("상세 애정 궁합 분석 내용"),
});
export type GenerateLoveAnalysisOutput = z.infer<typeof GenerateLoveAnalysisOutputSchema>;

export async function generateLoveAnalysis(input: GenerateLoveAnalysisInput): Promise<GenerateLoveAnalysisOutput> {
  return generateLoveAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLoveAnalysisPrompt',
  model: 'googleai/gemini-3-flash-preview',
  input: {schema: GenerateLoveAnalysisInputSchema},
  output: {schema: GenerateLoveAnalysisOutputSchema},
  prompt: `두 사람의 애정 궁합을 손금을 통해 정밀하게 분석해주세요.

상대방의 손금 특징: {{{userAFeatures}}}
나의 왼손: {{media url=userBPhotos.left}}
나의 오른손: {{media url=userBPhotos.right}}

천생연분인지, 서로 보완해야 할 점은 무엇인지 운명적인 관점에서 분석해주세요.`,
});

const generateLoveAnalysisFlow = ai.defineFlow(
  {
    name: 'generateLoveAnalysisFlow',
    inputSchema: GenerateLoveAnalysisInputSchema,
    outputSchema: GenerateLoveAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) throw new Error("AI response empty");
    return output;
  }
);
