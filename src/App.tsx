import { useState } from 'react'
import './App.css'
import { Container, Typography } from '@mui/material';
import { 
  NameInput, 
  CategorySelector, 
  CustomUrlsManager, 
  SubmitButton, 
  StatusMessage 
} from './components';
import { submitDossierRequest } from './services/api';
import { downloadFile, createFilename } from './utils/fileUtils';
import { handleApiError } from './utils/errorHandling';

function App() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'individual' | 'organisation'>('individual');
  const [customUrls, setCustomUrls] = useState<string[]>([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

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
    if (!name.trim()) return;
    setLoading(true);
    setIsError(false);
    setMsg('');

    // Filter out empty URLs
    const validCustomUrls = customUrls.filter(url => url.trim() !== '');

    console.log("[DEBUG] Submitting name:", name, "category:", category, "customUrls:", validCustomUrls);
    
    try {
      const blob = await submitDossierRequest(API_BASE_URL, {
        name,
        category,
        urls: validCustomUrls
      });
      
      // Create filename and download
      const filename = createFilename(name, category);
      downloadFile(blob, filename);
      
      setMsg(`Dossier for ${name} (${category}) downloaded successfully!`);
      console.log("[DEBUG] File downloaded:", filename);
      
    } catch (e: unknown) {
      setIsError(true);
      const errorMessage = await handleApiError(e, API_BASE_URL);
      setMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: 100 }}>
      <Typography variant="h4" gutterBottom>
        KYC Dossier Generator
      </Typography>
      
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
        loading={loading}
        disabled={!name.trim()}
        onClick={handleSubmit}
      />
      
      <StatusMessage 
        message={msg}
        isError={isError}
      />
    </Container>
  );
}

export default App
