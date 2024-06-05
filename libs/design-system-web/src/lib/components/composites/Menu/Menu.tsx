import React from 'react';
import {
  Menu as MUIMenu,
  MenuProps as MUIMenuProps,
  styled,
} from '@mui/material';
export const StyledMenu = styled(MUIMenu)(({ theme }) => ({
  '& .MuiList-root': {
    bgcolor: 'background.paper',
    borderRadius: '13px',
  },
  '& .MuiPaper-root': {
    bgcolor: 'background.paper',
    borderRadius: '15px',
    marginTop: theme.spacing(4), // Adjust as needed for triangle placement
    overflow: 'visible', // Make sure the triangle is not cut off.
    boxShadow: '0 2px 12px 0 rgba(5, 8, 11, 0.09)',
    fontSize: 'body2.fontSize',
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: '-19px', // This should be the negative value of the triangle's height
      left: 'calc(50%)',
      width: 0,
      height: 0,
      transform: 'translateX(-50%)',
      borderWidth: '10px', // Adjust the size of the triangle
      borderStyle: 'solid',
      borderColor: `transparent transparent ${theme.palette.background.paper} transparent`, // The third value is the color of the triangle
    },
  },
}));
export const Menu = (props: MUIMenuProps) => {
  return <StyledMenu {...props} />;
};
