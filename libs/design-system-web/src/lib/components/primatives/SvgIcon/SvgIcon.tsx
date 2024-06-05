import {
  SvgIcon as MUISvgIcon,
  SvgIconProps as MuiSvgIconProps,
} from '@mui/material';

interface SvgIconProps extends Omit<MuiSvgIconProps, 'color'> {
  color?: any;
}

export const SvgIcon = ({ color, ...props }: SvgIconProps) => (
  <MUISvgIcon
    {...props}
    sx={{ ...props.sx, ...(color && { '& path': { fill: color } }) }}
  />
);
