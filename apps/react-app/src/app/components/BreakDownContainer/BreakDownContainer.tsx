import { WBBox, WBCollapse, WBIcon, WBLink } from '@admiin-com/ds-web';
import { LinkProps } from 'libs/design-system-web/src/lib/components/primatives/Link/Link';
import React from 'react';

export interface BreakDownContainerProps {
  children: React.ReactNode | ((show: boolean) => React.ReactNode);
  grey?: boolean;
}

const BreakDownContext = React.createContext<any>(null);

export function BreakDownContainer(props: BreakDownContainerProps) {
  const [show, setShow] = React.useState<boolean>(false);
  const renderChildren = () => {
    if (typeof props.children === 'function') {
      return props.children(show);
    }
    return props.children;
  };
  return (
    <BreakDownContext.Provider
      value={{
        show,
        setShow,
      }}
    >
      {props.grey ? (
        <WBBox bgcolor={'background.default'} borderRadius={'5px'}>
          {renderChildren()}
        </WBBox>
      ) : (
        renderChildren()
      )}
    </BreakDownContext.Provider>
  );
}

interface BreakDownLinkProps extends LinkProps {
  title: string;
}
const BreakDownLink = ({ title, color, ...props }: BreakDownLinkProps) => {
  const { show, setShow } = React.useContext(BreakDownContext);
  return (
    <WBLink
      variant="body2"
      component={'button'}
      underline="always"
      noWrap
      fontWeight={'bold'}
      onClick={() => setShow((prev: boolean) => !prev)}
      color={!show ? color ?? 'action.disabled' : 'primary.main'}
      {...props}
    >
      {title} <WBIcon name={!show ? 'ChevronUp' : 'ChevronDown'} size={1.3} />
    </WBLink>
  );
};
interface BreakDownBodyProps {
  children: React.ReactNode;
}
const BreakDownBody = ({ children }: BreakDownBodyProps) => {
  const { show } = React.useContext(BreakDownContext);
  return (
    <WBCollapse in={show} timeout="auto">
      {children}
    </WBCollapse>
  );
};
BreakDownContainer.Body = BreakDownBody;
BreakDownContainer.Link = BreakDownLink;
