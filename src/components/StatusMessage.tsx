import { Typography } from '@mui/material';

interface StatusMessageProps {
  message: string;
  isError: boolean;
}

export const StatusMessage = ({ message, isError }: StatusMessageProps) => {
  if (!message) return null;

  return (
    <Typography style={{ marginTop: 20, color: isError ? 'red' : 'green' }}>
      {message}
    </Typography>
  );
};
