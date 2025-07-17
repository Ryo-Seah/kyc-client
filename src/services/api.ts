import axios from 'axios';

export interface DossierSubmitData {
  name: string;
  category: 'individual' | 'organisation';
  urls: string[];
}

export const submitDossierRequest = async (apiBaseUrl: string, data: DossierSubmitData): Promise<Blob> => {
  const response = await axios.post(`${apiBaseUrl}/submit`, data, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  return response.data;
};
