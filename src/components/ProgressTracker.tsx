import React from 'react';
import { 
  Box, 
  LinearProgress, 
  Typography, 
  Card, 
  CardContent,
  Button
} from '@mui/material';
import type { ProgressUpdate } from '../services/api';

interface ProgressTrackerProps {
  progress: ProgressUpdate | null;
  isVisible: boolean;
  onCancel: () => void;
  onDownload: () => void;
  showDownload: boolean;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  progress,
  isVisible,
  onCancel,
  onDownload,
  showDownload
}) => {
  if (!isVisible) return null;

  const progressPercentage = progress ? Math.round(progress.overall_progress) : 0;

  return (
    <Card sx={{ mt: 2, mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Generating Dossier
        </Typography>
        
        {/* Overall Progress */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Overall Progress:
            </Typography>
            <Typography variant="body2" color="primary">
              {progressPercentage}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progressPercentage} 
            sx={{ height: 8, borderRadius: 4 }}
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </Box>

        {/* Current Phase */}
        {progress && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Current Phase:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {progress.phase_name}
            </Typography>
          </Box>
        )}

        {/* Current Task */}
        {progress && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Current Task:
            </Typography>
            <Typography variant="body2">
              {progress.current_task}
            </Typography>
          </Box>
        )}

        {/* Phase Details */}
        {progress?.details && (
          <Box sx={{ mb: 2 }}>
            {progress.details.links_scraped !== null && progress.details.total_links !== null && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Links Scraped:
                </Typography>
                <Typography variant="body2">
                  {progress.details.links_scraped} / {progress.details.total_links}
                </Typography>
              </Box>
            )}
            
            {progress.details.attributes_completed !== null && progress.details.total_attributes !== null && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Attributes Processed:
                </Typography>
                <Typography variant="body2">
                  {progress.details.attributes_completed} / {progress.details.total_attributes}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {!showDownload && (
            <Button
              variant="outlined"
              onClick={onCancel}
              color="error"
            >
              Cancel
            </Button>
          )}
          
          {showDownload && (
            <Button
              variant="contained"
              onClick={onDownload}
              color="primary"
            >
              Download Result
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
