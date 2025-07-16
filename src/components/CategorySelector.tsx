import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

interface CategorySelectorProps {
  value: 'individual' | 'organisation';
  onChange: (value: 'individual' | 'organisation') => void;
  disabled?: boolean;
}

export const CategorySelector = ({ value, onChange, disabled = false }: CategorySelectorProps) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as 'individual' | 'organisation');
  };

  return (
    <FormControl fullWidth margin="normal" disabled={disabled}>
      <InputLabel id="category-label">Category</InputLabel>
      <Select
        labelId="category-label"
        id="category-select"
        value={value}
        label="Category"
        onChange={handleChange}
      >
        <MenuItem value="individual">Individual</MenuItem>
        <MenuItem value="organisation">Organisation</MenuItem>
      </Select>
    </FormControl>
  );
};
