import { Breakpoint, Theme, useMediaQuery } from '@mui/material';
import React, { createContext, ReactNode } from 'react';
import { getTheme } from '../../../utils';

const useWidth = (theme: Theme) => {
  const keys = [...theme.breakpoints.keys].reverse();
  return (
    keys.reduce((output: string | undefined, key: Breakpoint) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key));
      return !output && matches ? key : output;
    }, undefined) || 'xs'
  );
};

export type DesignSystemContextType = {
  isMobile: boolean;
  theme: Theme;
  width: string;
};
export const DesignSystemContext = createContext<DesignSystemContextType>({
  isMobile: false,
  theme: getTheme(),
  width: 'xs',
});
export const DesignSystemContextProvider = (props: {
  children: ReactNode;
  theme: Theme;
}) => {
  const width = useWidth(props.theme);
  return (
    <DesignSystemContext.Provider
      value={{
        isMobile: width === 'xs' || width === 'sm',
        theme: props.theme,
        width,
      }}
    >
      {props.children}
    </DesignSystemContext.Provider>
  );
};
