import { Collapse } from '@mui/material';
import { ReactNode, useState } from 'react';
import { Box } from '../../primatives/Box/Box';
import { Button } from '../../primatives/Button/Button';

export interface CollapsibleIconButtonProps {
  icon: ReactNode;
  buttonText: string;
}

export const CollapsibleIconButton = ({
  icon,
  buttonText,
}: CollapsibleIconButtonProps) => {
  const [hover, setHover] = useState(false);

  return (
    <Button
      variant="contained"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {icon}
      <Collapse in={hover} orientation="horizontal">
        <Box component="span" ml={1} sx={{ whiteSpace: 'nowrap' }}>
          {buttonText}
        </Box>
      </Collapse>
    </Button>
  );
};
