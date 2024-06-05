import { useSelectedEntity } from '../../hooks/useSelectedEntity/useSelectedEntity';
import {
  AccountDirection,
  PaymentMethod,
  PaymentMethodStatus,
  updatePaymentMethod as UPDATE_PAYMENT_METHOD,
} from '@admiin-com/ds-graphql';
import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { updateEntity as UPDATE_ENTITY } from '@admiin-com/ds-graphql';

import { useTranslation } from 'react-i18next';
import ActionDisplay from '../ActionDisplay/ActionDisplay';
import ConfirmationDlg from '../ConfirmationDlg/ConfirmationDlg';
import { WBTypography } from '@admiin-com/ds-web';
/* eslint-disable-next-line */
export interface PaymentMethodMenuProps {
  accountDirection: AccountDirection;
  paymentMethod: PaymentMethod | null;
}

export const useChangePrimaryPaymentMethod = () => {
  const [updateEntity, data] = useMutation(gql(UPDATE_ENTITY), {});

  return { updateEntity, data };
};

export function PaymentMethodMenu({
  accountDirection,
  paymentMethod,
}: PaymentMethodMenuProps) {
  const { entity } = useSelectedEntity();
  const [updateEntity] = useMutation(gql(UPDATE_ENTITY));
  const [updatePaymentMethod] = useMutation(gql(UPDATE_PAYMENT_METHOD));
  const [openRemoveModal, setOpenRemoveModal] = React.useState<boolean>(false);
  const [openPrimaryModal, setOpenPrimaryModal] =
    React.useState<boolean>(false);

  const handleMarkAsPrimary = () => {
    if (!paymentMethod) return;
    const input =
      accountDirection === AccountDirection.DISBURSEMENT
        ? { disbursementMethodId: paymentMethod.id }
        : {
            paymentMethodId: paymentMethod.id,
          };
    if (entity)
      updateEntity({
        variables: {
          input: {
            id: entity.id,
            ...input,
          },
        },
        // optimisticResponse: {
        //   updateEntity: {
        //     ...entity,
        //     ...input,
        //   },
        // },
      });
  };
  const handleRemoveAccount = () => {
    if (!paymentMethod) return;
    updatePaymentMethod({
      variables: {
        input: {
          id: paymentMethod.id,
          status: PaymentMethodStatus.ARCHIVED,
        },
      },
      optimisticResponse: {
        updatePaymentMethod: {
          ...paymentMethod,
          status: PaymentMethodStatus.ARCHIVED,
        },
      },
    });
  };
  const { t } = useTranslation();
  const menuItems = [
    {
      action: () => {
        if (accountDirection === AccountDirection.PAYMENT) {
          handleMarkAsPrimary();
        } else setOpenPrimaryModal(true);
      },
      title: t('markAsPrimary', { ns: 'taskbox' }),
    },
    {
      action: () => setOpenRemoveModal(true),
      color: 'error.main',
      title: t('removeAccount', { ns: 'taskbox' }),
    },
  ];
  return (
    <>
      <ActionDisplay items={menuItems} />
      <ConfirmationDlg
        open={openPrimaryModal}
        onClose={() => setOpenPrimaryModal(false)}
        onOK={handleMarkAsPrimary}
        title={t('markAsPrimary', { ns: 'settings' })}
      >
        <WBTypography>
          {t('confirmReceivingAccount', { ns: 'settings' })}
        </WBTypography>
      </ConfirmationDlg>
      <ConfirmationDlg
        open={openRemoveModal}
        onClose={() => setOpenRemoveModal(false)}
        onOK={handleRemoveAccount}
        title={t('removeEntityUser', { ns: 'settings' })}
      >
        <WBTypography>
          {t('confirmRemoveEntityUser', { ns: 'settings' })}
        </WBTypography>
      </ConfirmationDlg>
    </>
  );
}
