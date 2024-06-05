import React, { useState, useEffect } from 'react';
import { Box } from '../../primatives/Box/Box';
import { AccordionItem } from './AccordionItem';
import { Property } from 'csstype';
interface AccordionProps {
  AccordionItemProps?: {
    showToggle?: boolean;
    color?: Property.Color;
  };
  items: { title: string; body: string; icon: string }[];
  exclusive?: boolean;
  onChange?: (index: number | undefined) => void;
  expandedIndex?: number;
}

export const Accordion = ({
  AccordionItemProps = {},
  items = [],
  exclusive = false,
  ...props
}: AccordionProps) => {
  const [expandedIndex, setExpandedIndex] = useState(props.expandedIndex ?? -1);

  useEffect(() => {
    if (typeof props.expandedIndex !== 'undefined') {
      if (props.expandedIndex !== expandedIndex)
        setExpandedIndex(props.expandedIndex);
    }
  }, [props.expandedIndex, expandedIndex]);

  const onAccordionChange = (index: number, status: boolean) => {
    const computedIndex = status ? index : -1;
    if (exclusive) {
      setExpandedIndex(computedIndex);
    }
    if (props.onChange) {
      if (computedIndex !== props.expandedIndex) {
        props.onChange(computedIndex === -1 ? undefined : computedIndex);
      }
    }
  };

  return (
    <Box>
      {items.map((item, idx) => {
        return (
          <AccordionItem
            key={idx}
            icon={item.icon}
            idx={idx}
            expandedIndex={expandedIndex}
            onChange={onAccordionChange}
            title={item.title}
            body={item.body}
            {...AccordionItemProps}
          />
        );
      })}
    </Box>
  );
};
