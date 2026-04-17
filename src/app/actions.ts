'use server';

import { generatePalmReadingReport, GeneratePalmReadingReportOutput } from '@/ai/flows/generate-palm-reading-report';
import { generateLoveLuckAnalysis, GenerateLoveLuckAnalysisOutput } from '@/ai/flows/generate-love-luck-analysis';
import { generateFriendshipAnalysis, GenerateFriendshipAnalysisInput, GenerateFriendshipAnalysisOutput } from '@/ai/flows/generate-friendship-analysis';
import { generateLoveAnalysis, GenerateLoveAnalysisInput, GenerateLoveAnalysisOutput } from '@/ai/flows/generate-love-analysis';
import { extractPalmFeatures, ExtractPalmFeaturesInput, ExtractPalmFeaturesOutput } from '@/ai/flows/extract-palm-features';

type PalmReadingResult = {
  report: GeneratePalmReadingReportOutput;
  error?: never;
} | { 
  error: string;
  report?: never;
};

export async function getPalmReading(leftPhotoDataUri: string, rightPhotoDataUri: string): Promise<PalmReadingResult> {
  console.log('[Checkpoint 1/4] getPalmReading: 서버 액션 시작.');
  if (!leftPhotoDataUri || !rightPhotoDataUri) {
    console.error('[오류] getPalmReading: 사진 데이터 누락.');
    return { error: '[getPalmReading] 양손의 사진 데이터가 모두 필요합니다.' };
  }

  try {
    console.log('[Checkpoint 2/4] getPalmReading: AI Flow 호출 직전.');
    const reportResult = await generatePalmReadingReport({ leftPhotoDataUri, rightPhotoDataUri });
    console.log('[Checkpoint 3/4] getPalmReading: AI Flow 호출 완료. 받은 데이터:', JSON.stringify(reportResult, null, 2));

    if (
      !reportResult?.comprehensiveAnalysis ||
      typeof reportResult.comprehensiveAnalysis.loveLuck !== 'string' ||
      typeof reportResult.comprehensiveAnalysis.marriageLuck !== 'string' ||
      typeof reportResult.comprehensiveAnalysis.healthLuck !== 'string' ||
      typeof reportResult.comprehensiveAnalysis.wealthLuck !== 'string' ||
      typeof reportResult.comprehensiveAnalysis.careerLuck !== 'string' ||
      typeof reportResult.comprehensiveAnalysis.aptitudeLuck !== 'string' ||
      typeof reportResult.comprehensiveAnalysis.interpersonalLuck !== 'string'
    ) {
      console.error('[오류] getPalmReading: AI 응답 데이터 구조 오류 또는 누락된 필드:', reportResult);
      return { error: `[getPalmReading] AI가 예상치 못한 형식의 손금 분석 결과를 반환했습니다. AI 응답: ${JSON.stringify(reportResult)}` };
    }
    
    console.log('[Checkpoint 4/4] getPalmReading: 데이터 검증 통과 및 결과 반환.');
    return {
      report: reportResult,
    };
  } catch (e: any) {
    console.error("[오류] getPalmReading: AI Flow 실행 중 또는 데이터 처리 중 심각한 오류 발생.", e);
    const errorMessage = e instanceof Error ? e.message : String(e);
    return { error: `[getPalmReading] 손금 분석 중 오류 발생: ${errorMessage}` };
  }
}

type LoveLuckAnalysisResult = {
  analysis: GenerateLoveLuckAnalysisOutput;
  error?: never;
} | {
  error: string;
  analysis?: never;
};

export async function getLoveLuckAnalysis(leftPhotoDataUri: string, rightPhotoDataUri: string, question: string): Promise<LoveLuckAnalysisResult> {
  console.log('[Checkpoint 1/4] getLoveLuckAnalysis: 서버 액션 시작.');
  if (!leftPhotoDataUri || !rightPhotoDataUri || !question) {
    console.error('[오류] getLoveLuckAnalysis: 데이터 누락.');
    return { error: '[getLoveLuckAnalysis] 사진 데이터와 질문이 모두 필요합니다.' };
  }

  try {
    console.log('[Checkpoint 2/4] getLoveLuckAnalysis: AI Flow 호출 직전.');
    const analysisResult = await generateLoveLuckAnalysis({ leftPhotoDataUri, rightPhotoDataUri, question });
    console.log('[Checkpoint 3/4] getLoveLuckAnalysis: AI Flow 호출 완료. 받은 데이터:', JSON.stringify(analysisResult, null, 2));
    
    if (!analysisResult?.analysis || typeof analysisResult.analysis !== 'string') {
       console.error('[오류] getLoveLuckAnalysis: AI 응답 데이터 구조 오류:', analysisResult);
       return { error: `[getLoveLuckAnalysis] AI가 예상치 못한 형식의 추가 분석 결과를 반환했습니다. 응답: ${JSON.stringify(analysisResult)}` };
    }

    console.log('[Checkpoint 4/4] getLoveLuckAnalysis: 데이터 검증 통과 및 결과 반환.');
    return {
      analysis: analysisResult,
    };
  } catch (e: any) {
    console.error("[오류] getLoveLuckAnalysis: AI Flow 실행 중 또는 데이터 처리 중 심각한 오류 발생.", e);
    const errorMessage = e instanceof Error ? e.message : String(e);
    return { error: `[getLoveLuckAnalysis] 추가 분석 중 오류 발생: ${errorMessage}` };
  }
}

type FriendshipAnalysisResult = {
  analysis: GenerateFriendshipAnalysisOutput;
  error?: never;
} | {
  error: string;
  analysis?: never;
};

export async function getFriendshipAnalysis(input: GenerateFriendshipAnalysisInput): Promise<FriendshipAnalysisResult> {
    console.log('[Checkpoint 1/4] getFriendshipAnalysis: 서버 액션 시작.');
    if (!input.userAFeatures || !input.userBPhotos?.left || !input.userBPhotos?.right) {
        console.error('[오류] getFriendshipAnalysis: 데이터 누락.');
        return { error: '[getFriendshipAnalysis] 궁합 분석에 필요한 데이터가 모두 필요합니다.' };
    }
  try {
    console.log('[Checkpoint 2/4] getFriendshipAnalysis: AI Flow 호출 직전.');
    const analysisResult = await generateFriendshipAnalysis(input);
    console.log('[Checkpoint 3/4] getFriendshipAnalysis: AI Flow 호출 완료. 받은 데이터:', JSON.stringify(analysisResult, null, 2));

    if (!analysisResult || typeof analysisResult.title !== 'string' || typeof analysisResult.score !== 'number' || typeof analysisResult.analysis !== 'string') {
      console.error('[오류] getFriendshipAnalysis: AI 응답 데이터 구조 오류:', analysisResult);
      return { error: `[getFriendshipAnalysis] AI가 예상치 못한 형식의 친구 궁합 분석 결과를 반환했습니다. 응답: ${JSON.stringify(analysisResult)}` };
    }
    console.log('[Checkpoint 4/4] getFriendshipAnalysis: 데이터 검증 통과 및 결과 반환.');
    return { analysis: analysisResult };
  } catch (e: any) {
    console.error("[오류] getFriendshipAnalysis: AI Flow 실행 중 또는 데이터 처리 중 심각한 오류 발생.", e);
    const errorMessage = e instanceof Error ? e.message : String(e);
    return { error: `[getFriendshipAnalysis] 친구 궁합 분석 중 오류 발생: ${errorMessage}` };
  }
}


type LoveAnalysisResult = {
  analysis: GenerateLoveAnalysisOutput;
  error?: never;
} | {
  error: string;
  analysis?: never;
};

export async function getLoveAnalysis(input: GenerateLoveAnalysisInput): Promise<LoveAnalysisResult> {
    console.log('[Checkpoint 1/4] getLoveAnalysis: 서버 액션 시작.');
    if (!input.userAFeatures || !input.userBPhotos?.left || !input.userBPhotos?.right) {
        console.error('[오류] getLoveAnalysis: 데이터 누락.');
        return { error: '[getLoveAnalysis] 궁합 분석에 필요한 데이터가 모두 필요합니다.' };
    }
  try {
    console.log('[Checkpoint 2/4] getLoveAnalysis: AI Flow 호출 직전.');
    const analysisResult = await generateLoveAnalysis(input);
    console.log('[Checkpoint 3/4] getLoveAnalysis: AI Flow 호출 완료. 받은 데이터:', JSON.stringify(analysisResult, null, 2));

    if (!analysisResult || typeof analysisResult.title !== 'string' || typeof analysisResult.score !== 'number' || typeof analysisResult.analysis !== 'string') {
      console.error('[오류] getLoveAnalysis: AI 응답 데이터 구조 오류:', analysisResult);
      return { error: `[getLoveAnalysis] AI가 예상치 못한 형식의 연인 궁합 분석 결과를 반환했습니다. 응답: ${JSON.stringify(analysisResult)}` };
    }
    console.log('[Checkpoint 4/4] getLoveAnalysis: 데이터 검증 통과 및 결과 반환.');
    return { analysis: analysisResult };
  } catch (e: any) {
    console.error("[오류] getLoveAnalysis: AI Flow 실행 중 또는 데이터 처리 중 심각한 오류 발생.", e);
    const errorMessage = e instanceof Error ? e.message : String(e);
    return { error: `[getLoveAnalysis] 연인 궁합 분석 중 오류 발생: ${errorMessage}` };
  }
}

type PalmFeaturesResult = {
  features: ExtractPalmFeaturesOutput;
  error?: never;
} | {
  error: string;
  features?: never;
};

export async function getPalmFeatures(input: ExtractPalmFeaturesInput): Promise<PalmFeaturesResult> {
    console.log('[Checkpoint 1/4] getPalmFeatures: 서버 액션 시작.');
    if (!input.leftPhotoDataUri || !input.rightPhotoDataUri) {
        console.error('[오류] getPalmFeatures: 데이터 누락.');
        return { error: '[getPalmFeatures] 양손의 사진 데이터가 모두 필요합니다.' };
    }
    
    try {
        console.log('[Checkpoint 2/4] getPalmFeatures: AI Flow 호출 직전.');
        const featuresResult = await extractPalmFeatures(input);
        console.log('[Checkpoint 3/4] getPalmFeatures: AI Flow 호출 완료. 받은 데이터:', JSON.stringify(featuresResult, null, 2));

        if (!featuresResult || typeof featuresResult.features !== 'string') {
            console.error('[오류] getPalmFeatures: AI 응답 데이터 구조 오류:', featuresResult);
            return { error: `[getPalmFeatures] AI가 예상치 못한 형식의 손금 특징 추출 결과를 반환했습니다. 응답: ${JSON.stringify(featuresResult)}` };
        }
        console.log('[Checkpoint 4/4] getPalmFeatures: 데이터 검증 통과 및 결과 반환.');
        return { features: featuresResult };
    } catch (e: any) {
        console.error("[오류] getPalmFeatures: AI Flow 실행 중 또는 데이터 처리 중 심각한 오류 발생.", e);
        const errorMessage = e instanceof Error ? e.message : String(e);
        return { error: `[getPalmFeatures] 손금 특징 추출 중 오류 발생: ${errorMessage}` };
    }
}
