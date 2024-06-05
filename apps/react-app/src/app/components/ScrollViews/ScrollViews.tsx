import { WBBox, WBIcon, WBIconButton } from '@admiin-com/ds-web';
import { useTheme } from '@mui/material';
import useResizeObserver from 'libs/hooks/src/lib/hooks/useResizeObserver';
import React, { useRef } from 'react';
import SwipeableViews from 'react-swipeable-views';

// import { mod } from 'react-swipeable-views-core';

/* eslint-disable-next-line */

export interface ScrollViewsContainer {
  data: any[];
  children: React.ReactNode;
}

const ScrolViewContext = React.createContext<any>(null);

export function ScrollViewsContainer({ data, children }: ScrollViewsContainer) {
  const [activeStep, setActiveStep] = React.useState(0);

  const [maxSteps, setMaxSteps] = React.useState<number>(data.length);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(Math.min(step, maxSteps));
  };
  return (
    <ScrolViewContext.Provider
      value={{
        data,
        activeStep,
        maxSteps,
        setMaxSteps,
        handleNext,
        handleBack,
        handleStepChange,
      }}
    >
      {children}
    </ScrolViewContext.Provider>
  );
}

export interface ScrollViewsProps {
  render: (data: any, index: number) => React.ReactNode;
  // size: keyof typeof ViewWidth;
  maxWidth?: number;
  noPadding?: boolean;
}

export function ScrollViews({ render, maxWidth, noPadding }: ScrollViewsProps) {
  const theme = useTheme();
  const [divRef, dimensions] = useResizeObserver();
  const ref = useRef<HTMLDivElement>(null);
  const {
    data: items,
    activeStep,
    handleStepChange,
    setMaxSteps,
  } = React.useContext(ScrolViewContext);

  React.useEffect(() => {
    if (dimensions.width) {
      const width = maxWidth ?? ref.current?.clientWidth;
      if (width)
        setMaxSteps(
          Math.floor(items.length / (dimensions.width / (width + 20)))
        );
    }
  }, [dimensions.width, maxWidth, items.length]);

  return (
    <WBBox sx={{ width: '100%', bgcolor: 'transparent' }} ref={divRef}>
      <SwipeableViews
        threshold={1}
        containerStyle={{
          backgroundColor: 'transparent',
        }}
        slideStyle={{
          paddingRight: noPadding ? 0 : 20,
          paddingBottom: noPadding ? 0 : '60px',
          width: undefined,
          float: 'left',
          backgroundColor: 'transparent',
        }}
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        // enableMouseEvents
        resistance
      >
        {/* @ts-ignore: Unreachable code error*/}
        {items.map((item, index) => (
          <WBBox key={index} ref={ref}>
            {render(item, index)}
          </WBBox>
        ))}
      </SwipeableViews>
    </WBBox>
  );
}

const ScrollViewsBackIcon = ({ name }: { name?: string }) => {
  const { handleBack, activeStep } = React.useContext(ScrolViewContext);
  return (
    <WBIconButton onClick={() => handleBack()} disabled={activeStep === 0}>
      <WBIcon name={name ?? 'ArrowBack'} size="small"></WBIcon>
    </WBIconButton>
  );
};
const ScrollViewsForwardIcon = ({ name }: { name?: string }) => {
  const { handleNext, maxSteps, activeStep } =
    React.useContext(ScrolViewContext);
  return (
    <WBIconButton
      onClick={() => handleNext()}
      disabled={activeStep === maxSteps}
    >
      <WBIcon name={name ?? 'ArrowForward'} size="small"></WBIcon>
    </WBIconButton>
  );
};
ScrollViews.Back = ScrollViewsBackIcon;
ScrollViews.Forward = ScrollViewsForwardIcon;
