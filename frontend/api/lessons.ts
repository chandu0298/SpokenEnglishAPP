import apiClient from './client';

export interface LessonSummary {
  id: number;
  category: string;
  title: string;
  difficulty: string;
  description: string;
}

export interface LessonDetail {
  id: number;
  cat: string;
  title: string;
  level: string;
  levelColor: string;
  desc: string;
  a: string;
  b: string;
  phrases: string[];
  user_progress?: {
    current_phase: number;
    is_completed: boolean;
    score: number;
  };
}

export async function fetchAllLessons(): Promise<LessonSummary[]> {
  const response = await apiClient.get('/api/lessons/');
  return response.data.lessons;
}

export async function fetchLessonDetail(id: number, userId?: string): Promise<LessonDetail> {
  const url = userId ? `/api/lessons/${id}?user_id=${userId}` : `/api/lessons/${id}`;
  const response = await apiClient.get(url);
  return response.data;
}

export interface HomeMission {
  lesson_id: number;
  title: string;
  phase: number;
  est_time: string;
  path_title: string;
}

export interface PathLesson {
  id: number;
  title: string;
  difficulty: string;
  description: string;
  emoji: string;
  phase: number;
  is_completed: boolean;
  is_locked: boolean;
  is_active: boolean;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  lessons: PathLesson[];
}

export interface HomeLessonsResponse {
  streak: number;
  today_mission?: HomeMission;
  paths: LearningPath[];
}

export async function fetchLessonsHome(): Promise<HomeLessonsResponse> {
  const response = await apiClient.get('/api/lessons/home');
  return response.data;
}

export async function saveLessonScore(
  lessonId: number,
  userId: string,
  fluencyScore: number,
  grammarScore: number,
  vocabularyScore: number,
  completedPhase: number = 4
) {
  const response = await apiClient.post(`/api/lessons/${lessonId}/score`, {
    user_id: userId,
    lesson_id: lessonId,
    fluency_score: fluencyScore,
    grammar_score: grammarScore,
    vocabulary_score: vocabularyScore,
    completed_phase: completedPhase
  });
  return response.data;
}
