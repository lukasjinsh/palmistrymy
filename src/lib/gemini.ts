import { GoogleGenAI, Type } from "@google/genai";

let genAI: GoogleGenAI | null = null;

function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

export const PALM_READING_PROMPT = `당신은 수만 명의 손금을 분석해 온 전설적인 손금술사입니다. 제공된 양손의 고해상도 이미지를 정밀 분석하여 인생의 여러 측면에 대한 종합 리포트를 작성해주세요.

각 운세별로 구체적이고 전문적인 통찰을 제공해주세요.`;

export const LOVE_LUCK_PROMPT = `당신은 손금 전문가이자 연애 상담가입니다. 사용자의 손금 데이터를 분석하여 다음 질문에 대해 상세하고 따뜻하게 답변해주세요: `;

export async function analyzePalmReading(leftPhotoBase64: string, rightPhotoBase64: string) {
  const ai = getGenAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { text: PALM_READING_PROMPT },
          { text: "왼손(선천적 운명): " },
          { inlineData: { data: leftPhotoBase64.split(',')[1], mimeType: "image/png" } },
          { text: "오른손(후천적 운명 및 현재): " },
          { inlineData: { data: rightPhotoBase64.split(',')[1], mimeType: "image/png" } }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          comprehensiveAnalysis: {
            type: Type.OBJECT,
            properties: {
              loveLuck: { type: Type.STRING },
              marriageLuck: { type: Type.STRING },
              healthLuck: { type: Type.STRING },
              wealthLuck: { type: Type.STRING },
              careerLuck: { type: Type.STRING },
              aptitudeLuck: { type: Type.STRING },
              interpersonalLuck: { type: Type.STRING },
            },
            required: ["loveLuck", "marriageLuck", "healthLuck", "wealthLuck", "careerLuck", "aptitudeLuck", "interpersonalLuck"]
          }
        },
        required: ["comprehensiveAnalysis"]
      }
    }
  });

  if (!response.text) throw new Error("AI response empty");
  return JSON.parse(response.text.trim());
}

export async function analyzeLoveLuck(leftPhotoBase64: string, rightPhotoBase64: string, question: string) {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
            {
                parts: [
                    { text: LOVE_LUCK_PROMPT + question },
                    { text: "왼손: " },
                    { inlineData: { data: leftPhotoBase64.split(',')[1], mimeType: "image/png" } },
                    { text: "오른손: " },
                    { inlineData: { data: rightPhotoBase64.split(',')[1], mimeType: "image/png" } }
                ]
            }
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    analysis: { type: Type.STRING }
                },
                required: ["analysis"]
            }
        }
    });

    if (!response.text) throw new Error("AI response empty");
    return JSON.parse(response.text.trim());
}

export async function extractFeatures(leftPhotoBase64: string, rightPhotoBase64: string) {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
            {
                parts: [
                    { text: "두 손의 손금 특징을 텍스트로 자세히 추출해주세요. 이 텍스트는 나중에 궁합 분석에 사용됩니다." },
                    { text: "왼손: " },
                    { inlineData: { data: leftPhotoBase64.split(',')[1], mimeType: "image/png" } },
                    { text: "오른손: " },
                    { inlineData: { data: rightPhotoBase64.split(',')[1], mimeType: "image/png" } }
                ]
            }
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    features: { type: Type.STRING }
                },
                required: ["features"]
            }
        }
    });

    if (!response.text) throw new Error("AI response empty");
    return JSON.parse(response.text.trim());
}

export async function analyzeFriendship(userAFeatures: string, userBPhotos: { left: string; right: string }) {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
            {
                parts: [
                    { text: "당신은 친구 사이의 궁합을 전문적으로 분석하는 손금 전문가입니다. 사용자 A의 손금 특정 정보와 사용자 B의 손금 사진을 비교 분석하여 우정 리포트를 작성해주세요." },
                    { text: `사용자 A의 손금 특징: ${userAFeatures}` },
                    { text: "사용자 B의 왼손: " },
                    { inlineData: { data: userBPhotos.left.split(',')[1], mimeType: "image/png" } },
                    { text: "사용자 B의 오른손: " },
                    { inlineData: { data: userBPhotos.right.split(',')[1], mimeType: "image/png" } }
                ]
            }
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    compatibilityScore: { type: Type.NUMBER, description: '궁합 점수 (0-100)' },
                    overallAnalysis: { type: Type.STRING, description: '종합 분석' },
                    strength: { type: Type.STRING, description: '주요 관계 강점' },
                    warning: { type: Type.STRING, description: '주의해야 할 점' },
                    advice: { type: Type.STRING, description: '관계를 위한 조언' },
                },
                required: ["compatibilityScore", "overallAnalysis", "strength", "warning", "advice"]
            }
        }
    });

    if (!response.text) throw new Error("AI response empty");
    return JSON.parse(response.text.trim());
}

export async function analyzeLove(userAFeatures: string, userBPhotos: { left: string; right: string }) {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
            {
                parts: [
                    { text: "당신은 연인 사이의 궁합을 전문적으로 분석하는 손금 전문가입니다. 사용자 A의 손금 특정 정보와 사용자 B의 손금 사진을 비교 분석하여 애정 리포트를 작성해주세요." },
                    { text: `사용자 A의 손금 특징: ${userAFeatures}` },
                    { text: "사용자 B의 왼손: " },
                    { inlineData: { data: userBPhotos.left.split(',')[1], mimeType: "image/png" } },
                    { text: "사용자 B의 오른손: " },
                    { inlineData: { data: userBPhotos.right.split(',')[1], mimeType: "image/png" } }
                ]
            }
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    compatibilityScore: { type: Type.NUMBER, description: '궁합 점수 (0-100)' },
                    overallAnalysis: { type: Type.STRING, description: '종합 분석' },
                    chemistryPoint: { type: Type.STRING, description: '주요 설렘 포인트' },
                    futureOutlook: { type: Type.STRING, description: '미래 전망' },
                    advice: { type: Type.STRING, description: '깊은 사랑을 위한 조언' },
                },
                required: ["compatibilityScore", "overallAnalysis", "chemistryPoint", "futureOutlook", "advice"]
            }
        }
    });

    if (!response.text) throw new Error("AI response empty");
    return JSON.parse(response.text.trim());
}
