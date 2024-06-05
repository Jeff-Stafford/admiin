import React from 'react';
import { AppBar, Toolbar, Grid, AppBarProps, Box } from '@mui/material';
import { useContext } from 'react';
import { Button, ButtonProps } from '../../primatives/Button/Button';
import { SideMenu } from '../SideMenu/SideMenu';
import { Property } from 'csstype';
import { DesignSystemContext } from '../DesignSystemContextProvider/DesignSystemContextProvider';

export interface NavigationProps {
  forceMobile?: boolean;
  logo?: React.ReactNode;
  position?: AppBarProps['position'];
  navigation1: {
    label: string;
    ButtonProps?: Omit<ButtonProps, 'label'>;
    href?: string;
  }[];
  navigation2: {
    label: string;
    ButtonProps?: Omit<ButtonProps, 'label'>;
    href?: string;
  }[];
  mobileNavigation?: { color?: Property.Color };
}

export const OldNavigation = ({
  forceMobile = false,
  position = 'static',
  navigation1 = [],
  navigation2 = [],
  mobileNavigation = {},
  ...props
}: NavigationProps) => {
  const apptractiveDesignContext = useContext(DesignSystemContext);
  const isMobile = apptractiveDesignContext.isMobile || forceMobile;

  return (
    <AppBar color={'secondary'} position={position} elevation={0}>
      <Toolbar disableGutters variant="dense" style={{ maxHeight: 45 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Grid container alignItems="center">
              {props.logo && (
                <Grid item>
                  <Box
                    sx={{
                      maxWidth: apptractiveDesignContext.theme.spacing(8.125),
                    }}
                  >
                    {props.logo}
                  </Box>
                </Grid>
              )}
              {!isMobile && navigation1.length > 0 && (
                <Grid item>
                  <Grid container alignItems="center">
                    {navigation1.map(({ ButtonProps = {}, ...n }, idx) => {
                      return (
                        <Grid item key={`navigation-button-${idx}`}>
                          <Button
                            {...ButtonProps}
                            uppercase={false}
                            variant="text"
                            href={n.href}
                            size="small"
                          >
                            {n.label}
                          </Button>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
          {!isMobile && navigation2.length > 0 && (
            <Grid item>
              <Box sx={{ marginRight: 1 }}>
                <Grid container alignItems="center" columnSpacing={0.5}>
                  {navigation2.map(({ ButtonProps = {}, ...n }, idx) => {
                    return (
                      <Grid item key={`navigation-button-${idx}`}>
                        <Button
                          {...ButtonProps}
                          //label={n.label}
                          size="small"
                          href={n.href}
                        >
                          {n.label}
                        </Button>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            </Grid>
          )}
          {isMobile && (
            <Grid item>
              <Box sx={{ marginRight: 1 }}>
                <SideMenu
                  logo={props.logo}
                  navigation1={navigation1}
                  navigation2={navigation2}
                />
              </Box>
            </Grid>
          )}
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
