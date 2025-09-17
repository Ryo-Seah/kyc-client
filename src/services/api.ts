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

// Helper function for retry delays (used in legacy function)
// const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Legacy synchronous submission (kept for backward compatibility)
// export const submitDossierRequest = async (
//   apiBaseUrl: string,
//   data: DossierSubmitData,
//   token: string, // Firebase ID token
//   maxRetries: number = 3
// ): Promise<Blob> => {
//   // Remove trailing slash from apiBaseUrl if present
//   const baseUrl = apiBaseUrl.replace(/\/$/, '');
  
//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       const response = await axios.post(`${baseUrl}/submit`, data, {
//         responseType: 'blob',
//         timeout: 900000, // 15 minutes in milliseconds (15 * 60 * 1000)
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}` // Pass token in Authorization header
//         }
//       });
      
//       return response.data;
      
//     } catch (error: any) {
//       // Retry on 504 Gateway Timeout or connection errors
//       if (attempt < maxRetries && 
//           (error.response?.status === 504 || 
//            error.code === 'ECONNABORTED' ||
//            error.code === 'ECONNRESET')) {
        
//         console.log(`[RETRY] Attempt ${attempt} failed, retrying in ${attempt * 2} seconds...`);
//         await sleep(attempt * 2000); // Exponential backoff: 2s, 4s, 6s
//         continue;
//       }
      
//       // If final attempt or non-retryable error, throw
//       throw error;
//     }
//   }
  
//   throw new Error('All retry attempts failed');
// };

// New async submission that returns job ID
export const submitDossierAsync = async (
  apiBaseUrl: string,
  data: DossierSubmitData,
  token: string
): Promise<DossierSubmissionResponse> => {
  // Use relative URL in development to leverage Vite proxy
  const isDevelopment = import.meta.env.DEV;
  const baseUrl = isDevelopment ? '' : apiBaseUrl.replace(/\/$/, '');
  
  try {
    const response = await axios.post(`${baseUrl}/submit`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error: any) {
    throw error;
  }
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
  
  try {
    const response = await axios.get(`${baseUrl}/download/${jobId}`, {
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
