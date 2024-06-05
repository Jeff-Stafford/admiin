import * as React from 'react';
import { WBChip, WBTableCell, WBTableRow, useTheme } from '@admiin-com/ds-web';
import { Entity, TaskDirection } from '@admiin-com/ds-graphql';
import { Skeleton } from '@mui/material';
import { CurrencyNumber } from '../../CurrencyNumber/CurrencyNumber';
import { useTasks } from '../../../hooks/useTasks/useTasks';
import { useAddAmount } from '../EntityList';
import { useTranslation } from 'react-i18next';

interface EntityTableList {
  entity?: Entity | null;
}
export function EntityTableListItem({ entity }: EntityTableList) {
  const theme = useTheme();
  const { t } = useTranslation();
  const {
    totalAmount: inboxAmount,
    isOverdue: inboxHasOverDue,
    totalNumber: inboxNumber,
    overDueCount,
  } = useTasks({
    direction: TaskDirection.RECEIVING,
    entityId: entity?.id,
  });

  const {
    totalAmount: outboxAmount,
    isOverdue: outboxHasOverDue,
    totalNumber: outboxNumber,
  } = useTasks({
    direction: TaskDirection.SENDING,
    entityId: entity?.id,
  });

  const addAmount = useAddAmount();

  React.useEffect(() => {
    addAmount({
      inboxAmount: inboxAmount ?? 0,
      entity,
      outboxAmount: outboxAmount ?? 0,
    });
  }, [addAmount, inboxAmount, entity?.id, outboxAmount]);

  const isOverDue = inboxHasOverDue || outboxHasOverDue;

  if (!entity) return <Skeleton width="100%" height={'70px'} />;
  return (
    <WBTableRow
      sx={{
        '&:hover th': {
          color: entity ? theme.palette.error.main : theme.palette.primary.main,
          textDecoration: 'underline',
        },
        '&:hover': {
          cursor: 'pointer',
        },
        '&:hover .MuiTableCell-root': {
          // Added a class and apply the background color when hovering over the row
          //backgroundColor: `rgba(0,0,0,0.07)`,
        },
      }}
    >
      <WBTableCell
        component="th"
        scope="row"
        sx={{ fontWeight: 'fontWeightBold' }}
      >
        {entity.name}

        {isOverDue ? (
          <WBChip
            component="span"
            label={t('overDue', { ns: 'taskbox', due: overDueCount })}
            color="error"
            size="small"
            sx={{ ml: 2, fontSize: '0.76rem', p: 2 }}
          />
        ) : null}
      </WBTableCell>

      <WBTableCell
        align="right"
        component="th"
        sx={{
          fontWeight: 'fontWeightBold',
          backgroundColor: theme.palette.background.default,
        }}
      >
        {inboxNumber}
      </WBTableCell>
      <WBTableCell
        align="right"
        sx={{
          fontWeight: 'fontWeightBold',
          textDecoration: 'none',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <CurrencyNumber number={inboxAmount} sup={false} textAlign={'right'} />
      </WBTableCell>
      <WBTableCell />
      <WBTableCell
        align="right"
        component="th"
        sx={{
          fontWeight: 'fontWeightBold',
          //borderLeft: '40px solid #FFF', // Border to simulate gap
          backgroundColor: theme.palette.background.default,
        }}
      >
        {outboxNumber}
      </WBTableCell>
      <WBTableCell
        align="right"
        sx={{
          fontWeight: 'fontWeightBold',
          textDecoration: 'none',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <CurrencyNumber number={outboxAmount} sup={false} textAlign={'right'} />
      </WBTableCell>
    </WBTableRow>
  );
}
