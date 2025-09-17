import axios from 'axios';

export interface DossierSubmitData {
  name: string;
  category: 'individual' | 'organisation';
  urls: string[];
}

export interface DossierSubmissionResponse {
  job_id: string;
  status: 'started' | 'error';
  message?: string;
}

export interface ProgressUpdate {
  overall_progress: number;
  phase_name: string;
  current_task: string;
  status: 'in_progress' | 'completed' | 'error';
  message?: string;
  details?: {
    links_scraped?: number;
    total_links?: number;
    attributes_completed?: number;
    total_attributes?: number;
  };
}


// New async submission that returns job ID
export const submitDossierAsync = async (
  apiBaseUrl: string,
  data: DossierSubmitData,
  token: string
): Promise<DossierSubmissionResponse> => {
  // Use relative URL in development to leverage Vite proxy
  const isDevelopment = import.meta.env.DEV;
  const baseUrl = isDevelopment ? '' : apiBaseUrl.replace(/\/$/, '');
  
  const response = await axios.post(`${baseUrl}/submit`, data, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    validateStatus: (status) => status < 400 // Only throw for 4xx/5xx errors
  });
  
  return response.data;
};

// Download completed dossier
export const downloadDossier = async (
  apiBaseUrl: string,
  jobId: string,
  token: string
): Promise<Blob> => {
  // Use relative URL in development to leverage Vite proxy
  const isDevelopment = import.meta.env.DEV;
  const baseUrl = isDevelopment ? '' : apiBaseUrl.replace(/\/$/, '');
  const response = await axios.get(`${baseUrl}/download/${jobId}`, {
    responseType: 'blob',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    validateStatus: (status) => status < 400 // Only throw for 4xx/5xx errors
  });
  return response.data;
};
