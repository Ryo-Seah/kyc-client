import { useState, useRef } from 'react'
import './App.css'
import { Container, Typography } from '@mui/material';
import { 
  NameInput, 
  CategorySelector, 
  CustomUrlsManager, 
  SubmitButton, 
  StatusMessage,
  SignInUI,
  ProgressTracker
} from './components';
import { submitDossierAsync, downloadDossier, type ProgressUpdate } from './services/api';
import { DossierProgressTracker } from './services/progressTracker';
import { downloadFile, createFilename } from './utils/fileUtils';
import { handleApiError } from './utils/errorHandling';
import type { User } from 'firebase/auth';

function App() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'individual' | 'organisation'>('individual');
  const [customUrls, setCustomUrls] = useState<string[]>([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  // Progress tracking state
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState<ProgressUpdate | null>(null);
  const [showDownload, setShowDownload] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  
  // Progress tracker ref
  const progressTrackerRef = useRef<DossierProgressTracker | null>(null);

  // Get API base URL from environment variables
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  const addCustomUrl = () => {
    if (customUrls.length < 10) {
      setCustomUrls([...customUrls, '']);
    }
  };

  const removeCustomUrl = (index: number) => {
    const newUrls = customUrls.filter((_, i) => i !== index);
    setCustomUrls(newUrls);
  };

  const updateCustomUrl = (index: number, value: string) => {
    const newUrls = [...customUrls];
    newUrls[index] = value;
    setCustomUrls(newUrls);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !user) return;
    setLoading(true);
    setIsError(false);
    setMsg('');
    setShowProgress(false);
    setShowDownload(false);
    setProgress(null);

    // Filter out empty URLs
    const validCustomUrls = customUrls.filter(url => url.trim() !== '');

    console.log("[DEBUG] Submitting name:", name, "category:", category, "customUrls:", validCustomUrls);
    
    try {
      // Get Firebase ID token
      const token = await user.getIdToken();
      
      // Submit dossier and get job ID
      const response = await submitDossierAsync(API_BASE_URL, {
        name,
        category,
        urls: validCustomUrls
      }, token);
      
      if (response.status === 'started') {
        setCurrentJobId(response.job_id);
        setShowProgress(true);
        setMsg('Dossier generation started...');
        
        // Start progress tracking
        startProgressTracking(response.job_id, token);
      } else {
        setIsError(true);
        setMsg(response.message || 'Failed to start dossier generation');
      }
      
    } catch (e: unknown) {
      setIsError(true);
      const errorMessage = await handleApiError(e, API_BASE_URL);
      setMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const startProgressTracking = (jobId: string, token: string) => {
    // Stop any existing tracker
    if (progressTrackerRef.current) {
      progressTrackerRef.current.stop();
    }

    // Create new tracker
    progressTrackerRef.current = new DossierProgressTracker(
      jobId,
      (progress) => {
        setProgress(progress);
        console.log('Progress update:', progress);
      },
      (completedJobId) => {
        console.log('Dossier generation completed for job:', completedJobId);
        setShowDownload(true);
        setMsg('Dossier generation completed! Click download to get your file.');
      },
      (errorMessage) => {
        console.error('Progress tracking error:', errorMessage);
        setIsError(true);
        setMsg(errorMessage);
        setShowProgress(false);
      }
    );

    // Start tracking
    progressTrackerRef.current.start(API_BASE_URL, token);
  };

  const handleCancelJob = () => {
    if (progressTrackerRef.current) {
      progressTrackerRef.current.stop();
      progressTrackerRef.current = null;
    }
    setShowProgress(false);
    setProgress(null);
    setMsg('Job cancelled');
  };

  const handleDownload = async () => {
    if (!currentJobId || !user) return;

    try {
      setLoading(true);
      const token = await user.getIdToken();
      const blob = await downloadDossier(API_BASE_URL, currentJobId, token);
      
      const filename = createFilename(name, category);
      downloadFile(blob, filename);
      
      setMsg(`Dossier for ${name} (${category}) downloaded successfully!`);
      setShowDownload(false);
      setShowProgress(false);
      setProgress(null);
      setCurrentJobId(null);
      
    } catch (e: unknown) {
      setIsError(true);
      const errorMessage = await handleApiError(e, API_BASE_URL);
      setMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Only show SignInUI if not signed in
  if (!user) {
    return (
      <Container maxWidth="sm" style={{ marginTop: 100 }}>
        <SignInUI onSignIn={setUser} />
      </Container>
    );
  }

  // Show main app if signed in
  return (
    <Container maxWidth="sm" style={{ marginTop: 100 }}>
      <Typography variant="h4" gutterBottom>
        KYC Dossier Generator
      </Typography>
      <div style={{ marginBottom: 16 }}>
        <span>Signed in as: {user.email}</span>
      </div>
      <NameInput 
        value={name}
        onChange={setName}
        disabled={loading}
      />
      <CategorySelector 
        value={category}
        onChange={setCategory}
        disabled={loading}
      />
      <CustomUrlsManager 
        customUrls={customUrls}
        onAdd={addCustomUrl}
        onRemove={removeCustomUrl}
        onUpdate={updateCustomUrl}
        disabled={loading}
      />
      <SubmitButton 
        loading={loading || showProgress}
        disabled={!name.trim() || showProgress}
        onClick={handleSubmit}
      />
      <StatusMessage 
        message={msg}
        isError={isError}
      />
      <ProgressTracker
        progress={progress}
        isVisible={showProgress}
        onCancel={handleCancelJob}
        onDownload={handleDownload}
        showDownload={showDownload}
      />
    </Container>
  );
}

export default App
