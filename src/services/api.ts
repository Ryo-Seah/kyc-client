import axios from 'axios';

export interface SubmitData {
  name: string;
  category: 'individual' | 'organisation';
  urls: string[];
}

export const submitDossierRequest = async (apiBaseUrl: string, data: SubmitData): Promise<Blob> => {
  const response = await axios.post(`${apiBaseUrl}/submit`, data, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  return response.data;
};
