import { WBFlex, SxProps, Theme } from '@admiin-com/ds-web';
import { ReactNode } from 'react';

export const PageContainer = ({
  children,
  sx = {},
}: {
  children: ReactNode;
  sx?: SxProps<Theme>;
}) => {
  return (
    <WBFlex p={2} sx={{ flexDirection: 'column', flex: 1, ...sx }}>
      {children}
    </WBFlex>
  );
};
