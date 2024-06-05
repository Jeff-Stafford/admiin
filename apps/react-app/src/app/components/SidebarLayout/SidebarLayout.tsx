import React from 'react';
import {
  WBBox,
  WBDrawer,
  WBFlex,
  WBIcon,
  WBIconButton,
  WBImage,
} from '@admiin-com/ds-web';
import NavDrawer from '../NavDrawer/NavDrawer';
import { useCurrentEntityId } from '../../hooks/useSelectedEntity/useSelectedEntity';

interface SideBarProps {
  drawerWidth: number;
  children: React.ReactNode;
  logoFullSrc: string;
  logoIconSrc: any;
  window?: () => Window;
}
export const SidebarContext = React.createContext<any>(null);

export function SidebarLayout({
  drawerWidth,
  children,
  logoFullSrc,
  logoIconSrc,
  window,
}: SideBarProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <NavDrawer
      logo={<WBImage src={logoFullSrc} />}
      onNavigated={() => setMobileOpen(false)}
    />
  );
  const entityId = useCurrentEntityId();

  return (
    <WBFlex>
      <WBBox
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        <WBDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: 'common.black',
            },
          }}
        >
          {drawer}
        </WBDrawer>
        <WBDrawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              bgcolor: 'common.black',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </WBDrawer>
      </WBBox>
      <WBBox
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: { sm: `calc(100% - ${drawerWidth}px)`, xs: '100%' },
          // width: '100%',
        }}
        key={entityId}
      >
        <SidebarContext.Provider value={{ mobileOpen, handleDrawerToggle }}>
          {children}
        </SidebarContext.Provider>
      </WBBox>
    </WBFlex>
  );
}
function MenuButton() {
  const context = React.useContext(SidebarContext);
  if (!context) return;
  const { handleDrawerToggle } = context;
  return (
    <WBIconButton
      color="inherit"
      aria-label="open drawer"
      onClick={handleDrawerToggle}
      sx={{ mr: 2, display: { sm: 'none' } }}
    >
      <WBIcon name="Menu" color="inherit" size="small" />
    </WBIconButton>
  );
}

SidebarLayout.MenuButton = MenuButton;
