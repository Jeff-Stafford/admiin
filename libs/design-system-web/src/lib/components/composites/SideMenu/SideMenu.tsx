import React, { ReactNode } from 'react';
import {
  Drawer,
  Grid,
  Box,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { Icon } from '../../primatives/Icon/Icon';
import { useContext, useState } from 'react';
import { DesignSystemContext } from '../DesignSystemContextProvider/DesignSystemContextProvider';
import { IconButton } from '../IconButton/IconButton';

interface SideMenuProps {
  logo?: ReactNode;
  navigation2: {
    label: string;
    href?: string;
    icon?: string;
  }[];
  navigation1: {
    label: string;
    href?: string;
    icon?: string;
    selected?: boolean;
  }[];
}

export const SideMenu = ({
  navigation1 = [],
  navigation2 = [],
  ...props
}: SideMenuProps) => {
  const [open, setOpen] = useState(false);
  const { theme } = useContext(DesignSystemContext);
  return (
    <>
      <IconButton
        icon="Menu"
        onClick={() => {
          setOpen(!open);
        }}
      />
      <Drawer
        variant={'temporary'}
        elevation={0}
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box
          sx={{
            height: '100%',
          }}
        >
          <Grid
            container
            justifyContent="space-between"
            direction="column"
            sx={{ height: '100%' }}
          >
            <Grid item>
              {props.logo && (
                <Box
                  sx={{
                    marginLeft: theme.spacing(0.4),
                    maxWidth: theme.spacing(9),
                    marginTop: theme.spacing(0.2),
                  }}
                >
                  {props.logo}
                </Box>
              )}

              <List>
                {navigation1.map(({ selected = false, ...n }, idx) => {
                  let listItemButtonProps = {};
                  if (typeof n.href !== 'undefined') {
                    listItemButtonProps = {
                      ...listItemButtonProps,
                      component: 'a',
                      href: n.href,
                    };
                  }
                  return (
                    <ListItemButton
                      selected={selected}
                      key={idx}
                      {...listItemButtonProps}
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: 'transparent',
                          borderLeftWidth: theme.spacing(0.25),
                          borderLeftColor: theme.palette.primary.light,
                          borderLeftStyle: 'solid',
                        },
                      }}
                    >
                      {n.icon && (
                        <ListItemIcon>
                          <Icon name={n.icon} />
                        </ListItemIcon>
                      )}
                      <ListItemText
                        primaryTypographyProps={{
                          color: 'primary.contrastText',
                          fontWeight: 'medium',
                          marginLeft: theme.spacing(selected ? 2 - 0.25 : 2),
                        }}
                        primary={n.label}
                      />
                    </ListItemButton>
                  );
                })}
              </List>
            </Grid>
            <Grid item>
              <List>
                {navigation2.map((n, idx) => {
                  let listItemButtonProps = {};
                  if (typeof n.href !== 'undefined') {
                    listItemButtonProps = {
                      ...listItemButtonProps,
                      component: 'a',
                      href: n.href,
                    };
                  }
                  return (
                    <ListItemButton key={idx} {...listItemButtonProps}>
                      {n.icon && (
                        <ListItemIcon>
                          <Icon
                            name={n.icon}
                            color={theme.palette.primary.dark}
                          />
                        </ListItemIcon>
                      )}
                      <ListItemText
                        primaryTypographyProps={{
                          color: 'primary.dark',
                          fontWeight: 'medium',
                        }}
                        primary={n.label}
                      />
                    </ListItemButton>
                  );
                })}
              </List>
            </Grid>
          </Grid>
        </Box>
      </Drawer>
    </>
  );
};
