import apiClient from './client';

// ─── Types ───────────────────────────────────────────────────────

export interface VocabWord {
  id: number;
  word: string;
  phonetic: string;
  level: string;
  meaning: string;
  roots: string[];
  example_sentence: string;
}

export interface VocabCard extends VocabWord {
  word_id: number;
  bucket: string;
  correct_streak: number;
  total_attempts: number;
  is_new?: boolean;
}

export interface BucketCounts {
  buckets: {
    learning: number;
    reviewing: number;
    strong: number;
    mastered: number;
  };
  total_started: number;
  total_words: number;
  mastered_percentage: number;
  levels: Record<string, { total: number; mastered: number; percentage: number }>;
}

export interface SessionResponse {
  level: string;
  session_size: number;
  due_count: number;
  new_count: number;
  cards: VocabCard[];
  batch_info?: {
    current_batch: number;
    words_seen_total: number;
    words_in_current_batch: number;
    total_words_in_level: number;
    total_batches: number;
    level_complete: boolean;
    next_batch_locked: boolean;
  };
}

export interface ResultResponse {
  word_id: number;
  new_bucket: string;
  correct_streak: number;
  next_review: string;
  total_attempts: number;
}

export interface WordOrigin {
  word: string;
  origin_title: string;
  short_preview: string;
  full_story: string;
}

// ─── API Functions ───────────────────────────────────────────────

export async function fetchWordsByLevel(level: string): Promise<VocabWord[]> {
  const response = await apiClient.get(`/api/vocab/words?level=${level}`);
  return response.data.words;
}

export async function fetchDueCards(
  userId: string,
  level: string,
  limit: number = 10
): Promise<VocabCard[]> {
  const response = await apiClient.get(
    `/api/vocab/due?user_id=${userId}&level=${level}&limit=${limit}`
  );
  return response.data.cards;
}

export async function startSession(
  userId: string,
  level: string,
  limit: number = 10
): Promise<SessionResponse> {
  const response = await apiClient.post('/api/vocab/start-session', {
    user_id: userId,
    level: level,
    limit: limit,
  });
  return response.data;
}

export async function startRevision(
  userId: string,
  level: string,
  limit: number = 20
): Promise<SessionResponse> {
  const response = await apiClient.get(
    `/api/vocab/revision?user_id=${userId}&level=${level}&limit=${limit}`
  );
  return response.data;
}

export interface LevelStats {
  new: number;
  due: number;
  total: number;
  seen?: number;
  current_batch?: number;
  total_batches?: number;
}

export async function fetchLevelStats(userId: string): Promise<Record<string, LevelStats>> {
  const response = await apiClient.get(`/api/vocab/level-stats?user_id=${userId}`);
  return response.data;
}

export async function submitResult(
  userId: string,
  wordId: number,
  result: 'knew_it' | 'still_learning'
): Promise<ResultResponse> {
  const response = await apiClient.post('/api/vocab/result', {
    user_id: userId,
    word_id: wordId,
    result: result,
  });
  return response.data;
}

export async function fetchBuckets(userId: string): Promise<BucketCounts> {
  const response = await apiClient.get(`/api/vocab/buckets?user_id=${userId}`);
  return response.data;
}

export async function generateScenario(
  word: string,
  meaning: string,
  level: string = 'B1'
): Promise<string> {
  const response = await apiClient.post('/api/vocab/scenario', {
    word,
    meaning,
    level,
  });
  return response.data.scenario;
}

export async function fetchDailyOrigin(): Promise<WordOrigin> {
  const response = await apiClient.get('/api/vocab/daily-origin');
  return response.data;
}
