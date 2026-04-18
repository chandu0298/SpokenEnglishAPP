import apiClient from './client';

export interface PronunciationResult {
  word: string;
  american: string;
  british: string;
  difference: string;
  pitfalls?: string[];
}

export async function analyzePronunciation(word: string): Promise<PronunciationResult> {
  const response = await apiClient.get(`/api/pronunciation/analyze?word=${encodeURIComponent(word)}`);
  return response.data;
}
