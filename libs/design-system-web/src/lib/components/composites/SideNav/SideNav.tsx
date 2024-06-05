import React, { useEffect } from 'react';
import { List, ListItemIcon, Link } from '@mui/material';
import { ListItemText } from '../ListItemText/ListItemText';
import { ListItem } from '../ListItem/ListItem';
import { Icon } from '../../primatives/Icon/Icon';

interface Path {
  to: string;
  title: string;
  subTitle?: string;
  icon: string;
}

interface ISideNavProps {
  paths: Path[];
}

export const SideNav = ({ paths }: ISideNavProps) => {
  const [selected, setSelected] = React.useState<Path | null | undefined>(null);
  useEffect(() => {
    // Use window.location.pathname to get the current path
    const currentPath = window.location.pathname;
    // Find the path object that matches the current path
    const matchedPath = paths.find((path) => path.to === currentPath);
    setSelected(matchedPath);
  }, [paths]);
  return (
    <>
      <List disablePadding>
        {paths.map((path) => (
          <Link
            key={path.title}
            href={path.to}
            sx={{
              color: selected?.to === path.to ? 'primary.main' : 'text.primary',
            }}
            onClick={() => setSelected(path)}
          >
            <ListItem
              title={path.title}
              disablePadding
              sx={{ marginY: { xs: 2, lg: 3 } }}
            >
              <ListItemText
                primary={path.title}
                primaryTypographyProps={{
                  fontSize: { xs: 'h3.fontSize', lg: 'h2.fontSize' },
                  fontWeight: 'bold',
                  sx: {
                    textDecoration:
                      selected?.to === path.to ? 'underline' : 'none',
                  },
                }}
                secondary={path.subTitle}
                secondaryTypographyProps={{
                  color: 'text.primary',
                }}
              />
              <ListItemIcon
                sx={{
                  display: { xs: 'block', lg: 'none' },
                }}
              >
                <Icon name={path.icon} size="small" />
              </ListItemIcon>
            </ListItem>
          </Link>
        ))}
      </List>
      {/*<Divider/>*/}
    </>
  );
};
