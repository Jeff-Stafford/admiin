import {
  Drawer as MUIDrawer,
  DrawerProps as MUIDrawerProps,
} from '@mui/material';

export function Drawer({ children, ...props }: MUIDrawerProps) {
  return (
    <MUIDrawer
      {...props}
      sx={{ '& .MuiDrawer-paper': { maxHeight: '90vh' }, ...props.sx }}
    >
      {children}
    </MUIDrawer>
  );
}

export default Drawer;
