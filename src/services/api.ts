import axios from 'axios';

export interface DossierSubmitData {
  name: string;
  category: 'individual' | 'organisation';
  urls: string[];
}

export const submitDossierRequest = async (
  apiBaseUrl: string,
  data: DossierSubmitData,
  token: string // Firebase ID token
): Promise<Blob> => {
  // Remove trailing slash from apiBaseUrl if present
  const baseUrl = apiBaseUrl.replace(/\/$/, '');
  const response = await axios.post(`${baseUrl}/submit`, data, {
    responseType: 'blob',
    timeout: 900000, // 15 minutes in milliseconds (15 * 60 * 1000)
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Pass token in Authorization header
    }
  });
  
  return response.data;
};
