import {
  WBBox,
  WBButton,
  WBDivider,
  WBFlex,
  WBTypography,
} from '@admiin-com/ds-web';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { usePaymentContext } from '../PaymentContainer/PaymentContainer';
import { useTaskBoxContext } from '../../pages/TaskBox/TaskBox';
import React from 'react';
import { PayToAgreement } from '@admiin-com/ds-graphql';
import PayToIcon from '../PayToIcon/PayToIcon';
import { CurrencyNumber } from '../CurrencyNumber/CurrencyNumber';

export interface PayToFormProps {
  agreements: PayToAgreement[];
  onSubmitted: () => void;
}

export function PayToForm({ agreements, onSubmitted }: PayToFormProps) {
  const { t } = useTranslation();
  const { selectedTask: task, selectedTasks } = useTaskBoxContext();
  const { createPayTo } = usePaymentContext();

  const onSubmit = () => {
    onSubmitted();
    createPayTo(agreements, task ? [task] : selectedTasks);
  };

  return (
    <>
      <DialogTitle fontWeight={'bold'}>
        <WBFlex justifyContent="space-between" alignItems={'center'}>
          <WBTypography variant="h3" mt={2} fontWeight={'bold'}>
            {t('payToTitle', {
              ns: 'payment',
            })}
          </WBTypography>
          <PayToIcon type="PayTo" />
        </WBFlex>
      </DialogTitle>
      <DialogContent>
        <WBTypography>{t('payToSubTitle', { ns: 'payment' })}</WBTypography>
        <WBBox>
          {agreements.map((agreement) => (
            <WBBox key={agreement.id} mt={4}>
              <WBTypography variant="h5">{agreement.from?.name}</WBTypography>
              <WBDivider sx={{ mt: 2 }} />
              <WBFlex justifyContent={'space-between'} sx={{ mt: 2 }}>
                <WBTypography>{t('frequency', { ns: 'taskbox' })}</WBTypography>
                <WBTypography>
                  {t(agreement.paymentFrequency, { ns: 'taskbox' })}
                </WBTypography>
              </WBFlex>

              <WBFlex justifyContent={'space-between'} sx={{ mt: 2 }}>
                <WBTypography fontWeight={'bold'}>
                  {t('amount', { ns: 'taskbox' })}
                </WBTypography>
                <CurrencyNumber sup={false} number={agreement.amount / 100} />
              </WBFlex>
            </WBBox>
          ))}
        </WBBox>
      </DialogContent>
      <DialogActions>
        <WBBox sx={{ mt: 5, px: 2, width: '100%' }}>
          <WBButton fullWidth onClick={onSubmit}>
            {t('confirmAgreements', { ns: 'payment' })}
          </WBButton>
        </WBBox>
      </DialogActions>
    </>
  );
}

export default PayToForm;
