import {
  WBBox,
  WBButton,
  WBFlex,
  WBSkeleton,
  WBTypography,
} from '@admiin-com/ds-web';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { usePaymentContext } from '../PaymentContainer/PaymentContainer';
import { useTaskBoxContext } from '../../pages/TaskBox/TaskBox';
import React from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  EntityPayId,
  getEntityPayId as GET_ENTITY_PAY_ID,
} from '@admiin-com/ds-graphql';
import { useCurrentEntityId } from '../../hooks/useSelectedEntity/useSelectedEntity';
import PayToIcon from '../PayToIcon/PayToIcon';
import { numberToCurrency } from '@admiin-com/ds-common';
import ErrorHandler from '../ErrorHandler/ErrorHandler';

/* eslint-disable-next-line */
export interface PayIdFormProps {
  onSubmitted: () => void;
}

export function PayIdForm({ onSubmitted }: PayIdFormProps) {
  const { t } = useTranslation();
  const { selectedTask: task, selectedTasks } = useTaskBoxContext();
  const { createPayId, getBillPayments } = usePaymentContext();

  const [error, setError] = React.useState<any>({});
  const entityId = useCurrentEntityId();
  const { data: getEntityPayIdData } = useQuery(gql(GET_ENTITY_PAY_ID), {
    variables: {
      entityId,
      billPayments: getBillPayments(task ? [task] : selectedTasks),
    },
    onError(err) {
      setError(err);
    },
  });
  const entityPayId: EntityPayId = getEntityPayIdData?.getEntityPayId;

  const onSubmit = () => {
    onSubmitted();
    createPayId(task ? [task] : [selectedTasks]);
  };

  return (
    <>
      <DialogTitle fontWeight={'bold'}>
        <WBFlex justifyContent="space-between" alignItems={'center'}>
          <WBTypography variant="h3" mt={2} fontWeight={'bold'}>
            {t('payIdTitle', {
              ns: 'payment',
            })}
          </WBTypography>
          <PayToIcon type="PayID" />
        </WBFlex>
      </DialogTitle>
      <DialogContent>
        <WBTypography>
          {t('payIdSubTitle1', {
            ns: 'payment',
          })}
          <b>
            {numberToCurrency(
              (entityPayId?.transferAmount || 0) / 100,
              entityPayId?.currency ?? undefined
            )}
          </b>
          {t('payIdSubTitle2', {
            ns: 'payment',
          })}
        </WBTypography>
        <WBBox mt={7}>
          <WBTypography variant="h5">
            {t('payIdLabel', { ns: 'payment' })}
          </WBTypography>
          {entityPayId ? (
            <WBTypography>{entityPayId.payId}</WBTypography>
          ) : (
            <WBSkeleton width={100} height={40} />
          )}
          <WBTypography variant="h5" mt={3}>
            {t('accountName', { ns: 'payment' })}
          </WBTypography>
          {entityPayId ? (
            <WBTypography>{entityPayId.payIdReference}</WBTypography>
          ) : (
            <WBSkeleton width={100} height={40} />
          )}
          <WBTypography variant="h5" mt={3}>
            {t('amount', { ns: 'payment' })}
          </WBTypography>
          {entityPayId ? (
            <WBTypography>
              {numberToCurrency(
                (entityPayId?.transferAmount || 0) / 100,
                entityPayId?.currency ?? undefined
              )}
            </WBTypography>
          ) : (
            <WBSkeleton width={100} height={40} />
          )}
        </WBBox>
      </DialogContent>
      <DialogActions>
        <WBBox sx={{ width: '100%', px: 2, mt: 5 }}>
          <WBButton onClick={onSubmit} fullWidth>
            {t('havePaid', { ns: 'payment' })}
          </WBButton>
          <WBTypography
            my={3}
            fontStyle={'italic'}
            variant="body2"
            textAlign={'center'}
          >
            {t('payIdHelper', { ns: 'payment' })}
          </WBTypography>
          <ErrorHandler errorMessage={error?.message} />
        </WBBox>
      </DialogActions>
    </>
  );
}

export default PayIdForm;
