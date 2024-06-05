import React, { useEffect } from 'react';

export interface PageSelectorProps {
  current: any;
  children: React.ReactNode;
}

const PageSelectionContext = React.createContext<any>({
  current: null,
  selected: false,
});

export function PageSelector({ current, children }: PageSelectorProps) {
  const [selected, setSelected] = React.useState<boolean>(false);

  // Use useEffect to manage side-effects like setting state based on props
  useEffect(() => {
    let isSelected = false; // Default to false
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.props.value === current) {
        isSelected = true; // Set local flag if condition is met
      }
    });
    setSelected(isSelected); // Update state based on local flag
  }, [current, children]); // Depend on 'current' and 'children'

  return (
    <PageSelectionContext.Provider value={{ current, selected }}>
      {children}
    </PageSelectionContext.Provider>
  );
}

interface PageProps {
  value?: any;
  children: React.ReactNode;
}

export function Page({ value, children }: PageProps) {
  const { current, selected } = React.useContext<any>(PageSelectionContext);
  return current === value || (!value && !selected) ? children : null;
}

PageSelector.Page = Page;
export default PageSelector;
