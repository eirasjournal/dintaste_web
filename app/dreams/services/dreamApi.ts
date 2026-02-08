// services/dreamApi.ts

// Change this to your actual Backend URL when deployed (e.g., https://my-python-api.onrender.com)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface DreamSubmission {
  content: string;
  date_occurred: string; // YYYY-MM-DD
}

export interface DreamCluster {
  date: string;
  dominant_topic: string;
  keywords: string[];
  count: number;
}

export const submitDream = async (data: DreamSubmission) => {
  const response = await fetch(`${API_BASE_URL}/dreams/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to submit dream');
  return response.json();
};

export const fetchDailyClusters = async (date: string) => {
  const response = await fetch(`${API_BASE_URL}/dreams/stats/${date}`);
  if (!response.ok) return null; // Handle empty days gracefully
  return response.json();
};