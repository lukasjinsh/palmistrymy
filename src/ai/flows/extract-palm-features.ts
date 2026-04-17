
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractPalmFeaturesInputSchema = z.object({
  leftPhotoDataUri: z.string().describe("왼손 사진 데이터 URI"),
  rightPhotoDataUri: z.string().describe("오른손 사진 데이터 URI"),
});
export type ExtractPalmFeaturesInput = z.infer<typeof ExtractPalmFeaturesInputSchema>;

const ExtractPalmFeaturesOutputSchema = z.object({
    features: z.string().describe("추출된 손금 특징의 텍스트 설명"),
});
export type ExtractPalmFeaturesOutput = z.infer<typeof ExtractPalmFeaturesOutputSchema>;

export async function extractPalmFeatures(input: ExtractPalmFeaturesInput): Promise<ExtractPalmFeaturesOutput> {
  return extractPalmFeaturesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractPalmFeaturesPrompt',
  model: 'googleai/gemini-3-flash-preview',
  input: {schema: ExtractPalmFeaturesInputSchema},
  output: {schema: ExtractPalmFeaturesOutputSchema},
  prompt: `제공된 양손의 사진을 바탕으로 손금의 주요 특징(선의 굵기, 길이, 방향, 교차점 등)을 텍스트로 상세히 설명해주세요.
이 설명은 나중에 궁합 분석을 위한 기초 데이터로 사용됩니다.
왼손: {{media url=leftPhotoDataUri}}
오른손: {{media url=rightPhotoDataUri}}`,
});

const extractPalmFeaturesFlow = ai.defineFlow(
  {
    name: 'extractPalmFeaturesFlow',
    inputSchema: ExtractPalmFeaturesInputSchema,
    outputSchema: ExtractPalmFeaturesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) throw new Error("AI response empty");
    return output;
  }
);
