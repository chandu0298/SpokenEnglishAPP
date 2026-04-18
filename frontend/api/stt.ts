import apiClient from './client';

export interface TranscriptionResponse {
  text: string;
  language: string;
}

export async function transcribeAudio(uri: string): Promise<TranscriptionResponse> {
  const formData = new FormData();
  
  // In React Native, we need to append the file with a specific structure
  // @ts-ignore
  formData.append('file', {
    uri,
    name: 'recording.m4a',
    type: 'audio/m4a',
  });

  const response = await apiClient.post('/api/stt/transcribe', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}
