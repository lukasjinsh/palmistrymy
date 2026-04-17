
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePalmPhotoInputSchema = z.object({
  photoDataUri: z.string().describe("손금 사진 데이터 URI (Base64)"),
});
export type AnalyzePalmPhotoInput = z.infer<typeof AnalyzePalmPhotoInputSchema>;

const AnalyzePalmPhotoOutputSchema = z.object({
  lineAnalysis: z.array(z.object({
    lineType: z.string().describe("손금 선의 종류 (예: 생명선, 두뇌선 등)"),
    color: z.string().describe("분석된 선의 색상"),
    interpretation: z.string().describe("해당 선에 대한 해석"),
  })),
});
export type AnalyzePalmPhotoOutput = z.infer<typeof AnalyzePalmPhotoOutputSchema>;

export async function analyzePalmPhoto(input: AnalyzePalmPhotoInput): Promise<AnalyzePalmPhotoOutput> {
  return analyzePalmPhotoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePalmPhotoPrompt',
  model: 'googleai/gemini-3-flash-preview',
  input: {schema: AnalyzePalmPhotoInputSchema},
  output: {schema: AnalyzePalmPhotoOutputSchema},
  prompt: `손금 전문가로서 다음 사진을 정밀 분석해주세요: {{media url=photoDataUri}}
각 주요 손금 라인을 식별하고 상세한 해석을 제공해주세요.`,
});

const analyzePalmPhotoFlow = ai.defineFlow(
  {
    name: 'analyzePalmPhotoFlow',
    inputSchema: AnalyzePalmPhotoInputSchema,
    outputSchema: AnalyzePalmPhotoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) throw new Error("AI response empty");
    return output;
  }
);
