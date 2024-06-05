import { WBButton } from '@admiin-com/ds-web';
import { Theme, useTheme } from '@mui/material';

interface ToggleButtonProps {
  onClick: () => void;
  label: string;
  isSelected: boolean;
}
export const ToggleButton = ({
  onClick,
  label,
  isSelected,
}: ToggleButtonProps) => {
  const theme = useTheme();
  const getButtonStyles = (theme: Theme, isSelected: boolean) => ({
    backgroundColor: isSelected ? theme.palette.common.black : 'transparent',
    color: isSelected ? theme.palette.common.white : theme.palette.common.black,
    '&:hover': {
      backgroundColor: isSelected ? theme.palette.common.black : 'transparent',
      color: isSelected
        ? theme.palette.common.white
        : theme.palette.common.black,
    },
  });
  return (
    <WBButton
      //disabled={isSelected}
      type="button"
      sx={getButtonStyles(theme, isSelected)}
      onClick={onClick}
    >
      {label}
    </WBButton>
  );
};
