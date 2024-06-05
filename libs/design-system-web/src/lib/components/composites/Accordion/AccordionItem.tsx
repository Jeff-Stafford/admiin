import React, { useContext } from 'react';
import {
  Accordion as MUIAccordion,
  AccordionSummary as MUIAccordionSummary,
  AccordionDetails as MUIAccordionDetails,
  Grid,
} from '@mui/material';
import { useState } from 'react';
import { Icon } from '../../primatives/Icon/Icon';
import { useEffect } from 'react';
import { DesignSystemContext } from '../DesignSystemContextProvider/DesignSystemContextProvider';
import { Typography } from '../../primatives/Typography/Typography';

export interface AccordionItemProps {
  unmountOnExit?: boolean;
  showToggle?: boolean;
  title: string;
  body: string;
  forceMobile?: boolean;
  idx: number;
  expandedIndex: number;
  onChange: (expandedIndex: number, status: boolean) => void;
  icon?: string;
}

export const AccordionItem = ({
  unmountOnExit = false,
  showToggle = true,
  title,
  body,
  forceMobile = false,
  idx,
  expandedIndex,
  onChange,
  icon,
}: AccordionItemProps) => {
  const designContext = useContext(DesignSystemContext);
  const [expanded, setExpanded] = useState(false);

  const isMobile = designContext.isMobile || forceMobile;

  useEffect(() => {
    if (expandedIndex !== -1) {
      setExpanded(expandedIndex === idx);
    }
  }, [expandedIndex, idx]);

  const extraStyles = {};

  return (
    <MUIAccordion
      TransitionProps={{ unmountOnExit }}
      elevation={0}
      sx={{
        backgroundColor: 'transparent',
        ...extraStyles,
      }}
      expanded={expanded}
      onChange={() => {
        setExpanded(!expanded);
        onChange(idx, !expanded);
      }}
    >
      <MUIAccordionSummary
        className={
          isMobile
            ? `ApptractiveAccordionSummary-mobile`
            : `ApptractiveAccordionSummary-desktop`
        }
        expandIcon={
          showToggle ? (
            <Icon
              color={
                !expanded
                  ? designContext.theme.palette.primary.dark
                  : designContext.theme.palette.text.secondary
              }
              name={expanded ? 'CloseCircle' : 'AddCircle'}
              size={1.75}
            />
          ) : undefined
        }
      >
        <Grid container alignItems="center" columnSpacing={1}>
          {icon && (
            <Grid item>
              <Icon
                color={
                  !expanded
                    ? designContext.theme.palette.primary.dark
                    : designContext.theme.palette.text.secondary
                }
                name={icon}
              />
            </Grid>
          )}
          <Grid item xs={10}>
            <Typography>{title}</Typography>
          </Grid>
        </Grid>
      </MUIAccordionSummary>
      <MUIAccordionDetails
        className={
          isMobile
            ? `ApptractiveAccordionDetails-mobile`
            : `ApptractiveAccordionDetails-desktop`
        }
      >
        <Grid container columnSpacing={1}>
          {icon && (
            <Grid item>
              <Icon color="transparent" name={icon} />
            </Grid>
          )}
          <Grid item xs={10}>
            <Typography variant="body2">{body}</Typography>
          </Grid>
        </Grid>
      </MUIAccordionDetails>
    </MUIAccordion>
  );
};
