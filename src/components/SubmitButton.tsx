import { Button, CircularProgress } from '@mui/material';

interface SubmitButtonProps {
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}

export const SubmitButton = ({ loading, disabled, onClick }: SubmitButtonProps) => {
  return (
    <Button
      variant="contained"
      color="primary"
      fullWidth
      onClick={onClick}
      disabled={disabled}
      style={{ marginTop: 20 }}
    >
      {loading ? <CircularProgress size={24} /> : 'Generate & Download Dossier'}
    </Button>
  );
};
