import apiClient from './client';

export interface UserProfile {
  id: string;
  firebase_uid: string;
  name: string;
  email: string;
  cefr_level: string;
  streak: number;
  plan: string;
}

export async function getMyProfile(): Promise<UserProfile> {
  const response = await apiClient.get('/api/user/me');
  return response.data;
}

export async function updateUserLevel(level: string): Promise<any> {
  const response = await apiClient.post('/api/user/update-level', { level });
  return response.data;
}
