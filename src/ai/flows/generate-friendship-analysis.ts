
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFriendshipAnalysisInputSchema = z.object({
  userAFeatures: z.string().describe("상대방의 손금 특징 설명"),
  userBPhotos: z.object({
    left: z.string().describe("나의 왼손 사진 URI"),
    right: z.string().describe("나의 오른손 사진 URI"),
  }),
});
export type GenerateFriendshipAnalysisInput = z.infer<typeof GenerateFriendshipAnalysisInputSchema>;

const GenerateFriendshipAnalysisOutputSchema = z.object({
  title: z.string().describe("분석 결과 제목"),
  score: z.number().describe("우정 궁합 점수 (0-100)"),
  analysis: z.string().describe("상세 우정 궁합 분석 내용"),
});
export type GenerateFriendshipAnalysisOutput = z.infer<typeof GenerateFriendshipAnalysisOutputSchema>;

export async function generateFriendshipAnalysis(input: GenerateFriendshipAnalysisInput): Promise<GenerateFriendshipAnalysisOutput> {
  return generateFriendshipAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFriendshipAnalysisPrompt',
  model: 'googleai/gemini-3-flash-preview',
  input: {schema: GenerateFriendshipAnalysisInputSchema},
  output: {schema: GenerateFriendshipAnalysisOutputSchema},
  prompt: `두 사람의 우정 궁합을 손금을 통해 분석해주세요.

상대방의 손금 특징: {{{userAFeatures}}}
나의 왼손: {{media url=userBPhotos.left}}
나의 오른손: {{media url=userBPhotos.right}}

두 분이 친구로서 얼마나 잘 맞는지, 서로에게 어떤 시너지를 줄 수 있는지 분석해주세요.`,
});

const generateFriendshipAnalysisFlow = ai.defineFlow(
  {
    name: 'generateFriendshipAnalysisFlow',
    inputSchema: GenerateFriendshipAnalysisInputSchema,
    outputSchema: GenerateFriendshipAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) throw new Error("AI response empty");
    return output;
  }
);
