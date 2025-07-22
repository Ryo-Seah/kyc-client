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
  const response = await axios.post(`${apiBaseUrl}/submit`, data, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Pass token in Authorization header
    }
  });
  
  return response.data;
};
