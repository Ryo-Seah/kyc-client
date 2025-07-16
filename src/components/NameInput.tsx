import { TextField } from '@mui/material';

interface NameInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const NameInput = ({ value, onChange, disabled = false }: NameInputProps) => {
  return (
    <TextField
      fullWidth
      label="Enter Name"
      variant="outlined"
      margin="normal"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  );
};
