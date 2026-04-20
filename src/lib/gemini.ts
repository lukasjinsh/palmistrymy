import { GoogleGenAI, Type } from "@google/genai";

let genAI: GoogleGenAI | null = null;

function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    // Debug logging for missing key issues
    if (apiKey) {
      console.log(`Gemini API key found: ${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`);
    } else {
      console.error("Gemini API key is MISSING (NEXT_PUBLIC_GEMINI_API_KEY)");
    }

    if (!apiKey) {
      throw new Error("Gemini API key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in your Vercel environment variables and REDEPLOY.");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

export const PALM_READING_PROMPT = `당신은 수만 명의 손금을 분석해 온 전설적인 손금술사입니다. 제공된 양손의 고해상도 이미지를 정밀 분석하여 인생의 여러 측면에 대한 종합 리포트를 작성해주세요.

주의사항:
1. 전문적인 용어를 사용하되 친절하게 설명하세요.
2. 각 항목별로 최소 3문장 이상의 상세한 분석을 제공하세요.
3. 모든 분석 내용은 반드시 한국어로 작성하세요. (All responses must be in Korean.)`;

export const LOVE_LUCK_PROMPT = `당신은 손금 전문가이자 연애 상담가입니다. 사용자의 손금 데이터를 분석하여 다음 질문에 대해 상세하고 따뜻하게 답변해주세요. 모든 답변은 반드시 한국어로 작성하세요: `;

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
              loveLuck: { type: Type.STRING, description: "연애운 분석 (한국어)" },
              marriageLuck: { type: Type.STRING, description: "결혼운 분석 (한국어)" },
              healthLuck: { type: Type.STRING, description: "건강운 분석 (한국어)" },
              wealthLuck: { type: Type.STRING, description: "재물운 분석 (한국어)" },
              careerLuck: { type: Type.STRING, description: "직업운 분석 (한국어)" },
              aptitudeLuck: { type: Type.STRING, description: "적성 및 성격 분석 (한국어)" },
              interpersonalLuck: { type: Type.STRING, description: "대인관계운 분석 (한국어)" },
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
                    { text: LOVE_LUCK_PROMPT + question + "\n반드시 한국어로 작성하세요." },
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
                    analysis: { type: Type.STRING, description: "연애운 상세 답변 (한국어)" }
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
                    { text: "두 손의 손금 특징을 텍스트로 자세히 추출해주세요. 모든 특징 설명은 한국어로 작성하세요." },
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
                    features: { type: Type.STRING, description: "손금 특징 텍스트 (한국어)" }
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
                    { text: "당신은 친구 사이의 궁합을 전문적으로 분석하는 손금 전문가입니다. 사용자 A의 손금 특정 정보와 사용자 B의 손금 사진을 비교 분석하여 우정 리포트를 한국어로 작성해주세요." },
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
                    overallAnalysis: { type: Type.STRING, description: '종합 분석 (한국어)' },
                    strength: { type: Type.STRING, description: '주요 관계 강점 (한국어)' },
                    warning: { type: Type.STRING, description: '주의해야 할 점 (한국어)' },
                    advice: { type: Type.STRING, description: '관계를 위한 조언 (한국어)' },
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
                    { text: "당신은 연인 사이의 궁합을 전문적으로 분석하는 손금 전문가입니다. 사용자 A의 손금 특정 정보와 사용자 B의 손금 사진을 비교 분석하여 애정 리포트를 한국어로 작성해주세요." },
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
                    overallAnalysis: { type: Type.STRING, description: '종합 분석 (한국어)' },
                    chemistryPoint: { type: Type.STRING, description: '주요 설렘 포인트 (한국어)' },
                    futureOutlook: { type: Type.STRING, description: '미래 전망 (한국어)' },
                    advice: { type: Type.STRING, description: '깊은 사랑을 위한 조언 (한국어)' },
                },
                required: ["compatibilityScore", "overallAnalysis", "chemistryPoint", "futureOutlook", "advice"]
            }
        }
    });

    if (!response.text) throw new Error("AI response empty");
    return JSON.parse(response.text.trim());
}
