import { useState } from 'react'
import './App.css'
import axios from 'axios';
import { Container, Typography, TextField, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

function App() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'individual' | 'organisation'>('individual');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Get API base URL from environment variables
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as 'individual' | 'organisation');
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setIsError(false);
    setMsg('');

    console.log("[DEBUG] Submitting name:", name, "category:", category);
    try {
      const res = await axios.post(`${API_BASE_URL}/submit`, 
        { name, category }, 
        { 
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Create filename based on name and category
      const filename = `${name.replace(/\s+/g, '_')}_${category}_dossier.docx`;
      
      // Download the file
      downloadFile(res.data, filename);
      
      setMsg(`Dossier for ${name} (${category}) downloaded successfully!`);
      console.log("[DEBUG] File downloaded:", filename);
      
    } catch (e: any) {
      setIsError(true);
      if (e.code === 'ECONNABORTED') {
        console.error("[ERROR] Request timed out.");
        setMsg("Server timeout: Backend did not respond in time.");
      } else if (e.response) {
        console.error("[ERROR] Server responded with an error:");
        // Try to read error message if response is JSON
        if (e.response.data instanceof Blob) {
          try {
            const text = await e.response.data.text();
            const errorData = JSON.parse(text);
            setMsg(`Server error ${e.response.status}: ${errorData.error || errorData.message || 'Unknown error'}`);
          } catch {
            setMsg(`Server error ${e.response.status}: ${e.response.statusText || 'Unknown error'}`);
          }
        } else {
          setMsg(`Server error ${e.response.status}: ${e.response.data?.error || e.response.statusText || 'Unknown error'}`);
        }
      } else if (e.request) {
        console.error("[ERROR] No response received from server.");
        setMsg(`No response from server. Check if backend is running on ${API_BASE_URL}.`);
      } else {
        console.error("[ERROR] Request setup failed:", e.message);
        setMsg(`Client error: ${e.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: 100 }}>
      <Typography variant="h4" gutterBottom>KYC Dossier Generator</Typography>
      
      <TextField
        fullWidth
        label="Enter Name"
        variant="outlined"
        margin="normal"
        value={name}
        onChange={e => setName(e.target.value)}
        disabled={loading}
      />
      
      <FormControl fullWidth margin="normal" disabled={loading}>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          id="category-select"
          value={category}
          label="Category"
          onChange={handleCategoryChange}
        >
          <MenuItem value="individual">Individual</MenuItem>
          <MenuItem value="organisation">Organisation</MenuItem>
        </Select>
      </FormControl>
      
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
        disabled={loading || !name.trim()}
        style={{ marginTop: 20 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Generate & Download Dossier'}
      </Button>
      
      <Typography style={{ marginTop: 20, color: isError ? 'red' : 'green' }}>
        {msg}
      </Typography>
    </Container>
  )
}

export default App
