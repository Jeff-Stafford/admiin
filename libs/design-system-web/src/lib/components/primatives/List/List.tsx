import React from 'react';
import { List as MUIList, ListProps as MUIListProps } from '@mui/material';

export type Ref = HTMLUListElement;
interface ListProps extends MUIListProps {
  disc?: boolean;
}
export const List = React.forwardRef<Ref, ListProps>(
  ({ disc = false, sx, children, ...props }: ListProps, ref) => {
    const childrenWithProps = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { ...child.props, disc: disc });
      }
      return child;
    });
    return (
      <MUIList ref={ref} sx={sx} {...props}>
        {childrenWithProps}
      </MUIList>
    );
  }
);
