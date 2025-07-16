interface ApiError {
  code?: string;
  response?: {
    status: number;
    statusText: string;
    data?: unknown;
  };
  request?: unknown;
  message?: string;
}

export const handleApiError = async (error: unknown, apiBaseUrl: string): Promise<string> => {
  const apiError = error as ApiError;
  
  if (apiError.code === 'ECONNABORTED') {
    console.error("[ERROR] Request timed out.");
    return "Server timeout: Backend did not respond in time.";
  } 
  
  if (apiError.response) {
    console.error("[ERROR] Server responded with an error:");
    
    // Try to read error message if response is JSON
    if (apiError.response.data instanceof Blob) {
      try {
        const text = await apiError.response.data.text();
        const errorData = JSON.parse(text);
        return `Server error ${apiError.response.status}: ${errorData.error || errorData.message || 'Unknown error'}`;
      } catch {
        return `Server error ${apiError.response.status}: ${apiError.response.statusText || 'Unknown error'}`;
      }
    } else {
      const responseData = apiError.response.data as { error?: string } | undefined;
      return `Server error ${apiError.response.status}: ${responseData?.error || apiError.response.statusText || 'Unknown error'}`;
    }
  }
  
  if (apiError.request) {
    console.error("[ERROR] No response received from server.");
    return `No response from server. Check if backend is running on ${apiBaseUrl}.`;
  }
  
  console.error("[ERROR] Request setup failed:", apiError.message);
  return `Client error: ${apiError.message || 'Unknown error'}`;
};
