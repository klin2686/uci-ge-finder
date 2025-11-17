import axios from 'axios';
import type { CoursesResponse, GEFilterParams } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCourses = async (params: GEFilterParams): Promise<CoursesResponse> => {
  const queryParams = new URLSearchParams();

  if (params.category1) queryParams.append('filter1', params.category1);
  if (params.category2) queryParams.append('filter2', params.category2);
  if (params.take) queryParams.append('take', params.take.toString());
  if (params.cursor) queryParams.append('cursor', params.cursor);

  const response = await apiClient.get<CoursesResponse>(`/api/ge-courses?${queryParams.toString()}`);
  return response.data;
};

export const healthCheck = async (): Promise<{ status: string }> => {
  const response = await apiClient.get('/health');
  return response.data;
};
