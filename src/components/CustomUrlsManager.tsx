import { Box, Typography, TextField, IconButton } from '@mui/material';

interface CustomUrlsManagerProps {
  customUrls: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, value: string) => void;
  disabled?: boolean;
  maxUrls?: number;
}

export const CustomUrlsManager = ({ 
  customUrls, 
  onAdd, 
  onRemove, 
  onUpdate, 
  disabled = false,
  maxUrls = 10 
}: CustomUrlsManagerProps) => {
  return (
    <Box style={{ marginTop: 20, marginBottom: 20 }}>
      <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <Typography variant="h6">Custom URLs</Typography>
        <IconButton 
          onClick={onAdd} 
          disabled={disabled || customUrls.length >= maxUrls}
          color="primary"
          size="small"
          sx={{
            borderRadius: 1, // Makes it square (0 for completely square, 1 for slightly rounded)
            border: '1px solid',
            borderColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.light',
            },
            '&:disabled': {
              borderColor: 'grey.300',
            }
          }}
        >
          +
        </IconButton>
      </Box>
      
      {customUrls.length > 0 && (
        <Typography variant="caption" color="textSecondary" style={{ marginBottom: 10, display: 'block' }}>
          {customUrls.length}/{maxUrls} URLs added
        </Typography>
      )}
      
      {customUrls.map((url, index) => (
        <Box key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          <TextField
            fullWidth
            label={`Custom URL ${index + 1}`}
            variant="outlined"
            size="small"
            value={url}
            onChange={(e) => onUpdate(index, e.target.value)}
            disabled={disabled}
            placeholder="https://example.com"
          />
          <IconButton 
            onClick={() => onRemove(index)}
            disabled={disabled}
            color="error"
            size="small"
            sx={{
              marginLeft: 1,
              borderRadius: 1, // Makes it square
              border: '1px solid',
              borderColor: 'error.main',
              '&:hover': {
                backgroundColor: 'error.light',
              },
              '&:disabled': {
                borderColor: 'grey.300',
              }
            }}
          >
            ×
          </IconButton>
        </Box>
      ))}
      
      {customUrls.length === 0 && (
        <Typography variant="body2" color="textSecondary" style={{ fontStyle: 'italic' }}>
          Click the + button to add custom URLs for additional research
        </Typography>
      )}
    </Box>
  );
};
