import React from 'react';
import {
  Tooltip as MUITooltip,
  TooltipProps as MUITooltipProps,
  styled,
  tooltipClasses,
} from '@mui/material';
const LightTooltip = styled(({ className, ...props }: MUITooltipProps) => (
  <MUITooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: '0 0 27px 0 rgba(5, 8, 11, 0.14)',
    fontSize: 14,
    maxWidth: 'none',
    padding: '15px',
    borderRadius: '6px',
  },
}));

export const Tooltip = (props: MUITooltipProps) => {
  return <LightTooltip {...props} />;
};
