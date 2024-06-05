import { WBFlex, WBGrid, WBIcon, WBIconButton } from '@admiin-com/ds-web';

/* eslint-disable-next-line */
export type MainLayoutGridType = 'All' | 'Left' | 'Right';

export interface MainLayoutProps {
  children?: React.ReactNode;
  gridType?: MainLayoutGridType;
  background?: string;
  toolbarComponent: React.ReactNode;
  onBackToLeft?: () => void;
  fullWidth?: boolean;
}

export function MainLayout({
  gridType,
  toolbarComponent,
  children,
  fullWidth,
  background,
  onBackToLeft,
}: MainLayoutProps) {
  return (
    <WBGrid
      container
      sx={{
        height: '100vh',
        // flexShrink: { sm: 0 },
        // width: { sm: `calc(100% - ${drawerWidth}px)`, xs: '100%' },
      }}
      overflow="scroll"
      flexDirection={'column'}
    >
      <WBGrid
        alignSelf={'stretch'}
        flexDirection={'column'}
        display={'flex'}
        sx={{
          height: `100%`,
          overflowY: 'scroll',
          boxShadow: '0 1px 22px 0 rgba(0, 0, 0, 0.08)',
        }}
        xs={gridType === 'All' ? 5 : gridType === 'Left' ? 12 : 0}
      >
        {toolbarComponent}
      </WBGrid>
      {gridType === 'Left' ? null : (
        <WBGrid
          xs={gridType === 'All' ? 7 : gridType === 'Right' ? 12 : 0}
          flexDirection={'column'}
          sx={{
            background: background || 'background.paper',
            bgcolor: 'background.paper',
            position: 'relative',
            height: `100%`,
            overflowY: 'scroll',
          }}
          px={fullWidth ? {} : { xs: 4, md: 6, lg: 8 }}
        >
          {onBackToLeft && gridType === 'Right' ? (
            <WBFlex
              justifyContent="space-between"
              mt={4}
              sx={{ display: { lg: 'none', xs: 'flex' } }}
            >
              <WBIconButton
                name="ArrowBack"
                onClick={() => {
                  onBackToLeft();
                }}
              >
                <WBIcon name="ArrowBack" size={'small'}></WBIcon>
              </WBIconButton>
            </WBFlex>
          ) : null}
          <WBFlex flexDirection={'column'} height="100%">
            {children}
          </WBFlex>
        </WBGrid>
      )}
    </WBGrid>
  );
}

export default MainLayout;
