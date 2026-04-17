
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLoveLuckAnalysisInputSchema = z.object({
  leftPhotoDataUri: z.string().describe("왼손 사진 URI"),
  rightPhotoDataUri: z.string().describe("오른손 사진 URI"),
  question: z.string().describe("사용자의 질문"),
});
export type GenerateLoveLuckAnalysisInput = z.infer<typeof GenerateLoveLuckAnalysisInputSchema>;

const GenerateLoveLuckAnalysisOutputSchema = z.object({
  analysis: z.string().describe('질문에 대한 심층 분석 결과.'),
});
export type GenerateLoveLuckAnalysisOutput = z.infer<typeof GenerateLoveLuckAnalysisOutputSchema>;

export async function generateLoveLuckAnalysis(input: GenerateLoveLuckAnalysisInput): Promise<GenerateLoveLuckAnalysisOutput> {
  return generateLoveLuckAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLoveLuckAnalysisPrompt',
  model: 'googleai/gemini-3-flash-preview',
  input: {schema: GenerateLoveLuckAnalysisInputSchema},
  output: {schema: GenerateLoveLuckAnalysisOutputSchema},
  prompt: `당신은 세계 최고의 손금 전문가입니다. 사진과 사용자의 구체적인 질문을 바탕으로 통찰력 있는 분석을 제공해주세요.

질문: "{{{question}}}"

왼손 사진: {{media url=leftPhotoDataUri}}
오른손 사진: {{media url=rightPhotoDataUri}}

질문에 대해 손금의 구체적인 라인을 근거로 들어 답변해주세요.`,
});

const generateLoveLuckAnalysisFlow = ai.defineFlow(
  {
    name: 'generateLoveLuckAnalysisFlow',
    inputSchema: GenerateLoveLuckAnalysisInputSchema,
    outputSchema: GenerateLoveLuckAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI response was empty.");
    }
    return output;
  }
);
