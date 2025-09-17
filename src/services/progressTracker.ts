import type { ProgressUpdate } from './api';

export class DossierProgressTracker {
  private jobId: string;
  private eventSource: EventSource | null = null;
  private isTracking: boolean = false;
  private onProgressUpdate: (progress: ProgressUpdate) => void;
  private onCompletion: (jobId: string) => void;
  private onError: (message: string) => void;

  constructor(
    jobId: string,
    onProgressUpdate: (progress: ProgressUpdate) => void,
    onCompletion: (jobId: string) => void,
    onError: (message: string) => void
  ) {
    this.jobId = jobId;
    this.onProgressUpdate = onProgressUpdate;
    this.onCompletion = onCompletion;
    this.onError = onError;
  }

  start(apiBaseUrl: string, token: string) {
    console.log(apiBaseUrl);
    if (this.isTracking) return;

    this.isTracking = true;
    // EventSource doesn't work with Vite proxy, so always use full URL
    const baseUrl = apiBaseUrl.replace(/\/$/, '');
    this.eventSource = new EventSource(`${baseUrl}/api/progress/${this.jobId}?token=${encodeURIComponent(token)}`);

    this.eventSource.onopen = () => {
      console.log('Connected to progress stream');
    };

    this.eventSource.onmessage = (event) => {
      try {
        const progress: ProgressUpdate = JSON.parse(event.data);
        
        this.onProgressUpdate(progress);
        
        // Handle completion/error
        if (progress.status === 'completed') {
          this.handleCompletion();
        } else if (progress.status === 'error') {
          this.handleError(progress.message || 'An error occurred');
        }
      } catch (error) {
        console.error('Error parsing progress data:', error);
        this.handleError('Failed to parse progress data');
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      this.handleError('Connection lost');
    };
  }

  private handleCompletion() {
    this.stop();
    this.onCompletion(this.jobId);
  }

  private handleError(message: string) {
    this.stop();
    this.onError(message);
  }

  stop() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.isTracking = false;
  }

  getJobId(): string {
    return this.jobId;
  }

  isActive(): boolean {
    return this.isTracking;
  }
}
