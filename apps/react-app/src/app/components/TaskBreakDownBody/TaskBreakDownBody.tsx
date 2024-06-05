import { WBDivider, WBGrid, WBTypography, useTheme } from '@admiin-com/ds-web';
import { CurrencyNumber } from '../CurrencyNumber/CurrencyNumber';
import { useTranslation } from 'react-i18next';
import { PaymentMethodType, Task, TaskGuest } from '@admiin-com/ds-graphql';
import { usePaymentContext } from '../PaymentContainer/PaymentContainer';
import React from 'react';
import { INSTALLMENT_FEE } from '../../constants/config';

/* eslint-disable-next-line */
export interface TaskBreakDownBodyProps {
  isGuest?: boolean;
  tasks?: Task[];
  task: Task | undefined | TaskGuest | null;
}

export function TaskBreakDownBody({
  task,
  tasks,
  isGuest,
}: TaskBreakDownBodyProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  // const amount = (task?.amount ?? 0) / (isGuest ? 100 : 1);

  const { getFees } = usePaymentContext();
  const { fees, totalAmount } = getFees(
    tasks ?? [task],
    isGuest ? PaymentMethodType.CARD : undefined
  );

  return (
    <WBGrid
      container
      padding={2}
      px={4}
      spacing={2}
      fontSize={'body2.fontSize'}
      //TODO: make a theme for this paper colour?
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[300]
            : theme.palette.grey[700],
      }}
    >
      {Object.entries(fees).map(([name, value], index) => (
        <React.Fragment key={name}>
          <WBGrid xs={6}>
            <WBTypography fontSize={'inherit'}>
              {t(name, {
                ns: 'taskbox',
                ...(name === 'installmentFee'
                  ? { percent: INSTALLMENT_FEE }
                  : {}),
              })}
            </WBTypography>
          </WBGrid>
          <WBGrid xs={6}>
            <CurrencyNumber
              fontSize={'inherit'}
              textAlign={'right'}
              number={(value as number) / (isGuest ? 100 : 1)}
              sup={false}
            />
          </WBGrid>
        </React.Fragment>
      ))}

      <WBGrid xs={12}>
        <WBDivider
          sx={{
            height: '2px',
            bgcolor: theme.palette.grey[400],
          }}
        />
      </WBGrid>
      <WBGrid xs={6}>
        <WBTypography fontWeight={'bold'} fontSize={'inherit'}>
          {t('totalAmount', { ns: 'taskbox' })}
        </WBTypography>
      </WBGrid>

      <WBGrid xs={6}>
        <CurrencyNumber
          textAlign={'right'}
          fontSize={'inherit'}
          number={totalAmount / (isGuest ? 100 : 1)}
          sup={false}
        />
      </WBGrid>
    </WBGrid>
  );
}

export default TaskBreakDownBody;
