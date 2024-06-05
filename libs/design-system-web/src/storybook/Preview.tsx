import React, { ReactNode } from 'react';
import { DesignSystemProvider } from '../lib/components/composites/DesignSystemProvider/DesignSystemProvider';
import { defaultTheme, getTheme } from '../lib/utils';

type PreviewProps = { story: ReactNode };
export const Preview = (props: PreviewProps) => {
  return (
    <DesignSystemProvider theme={getTheme(defaultTheme('light'))}>
      {props.story}
    </DesignSystemProvider>
  );
};
