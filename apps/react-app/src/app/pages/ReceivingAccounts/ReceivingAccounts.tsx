import {
  WBBox,
  WBButton,
  WBFlex,
  WBLink,
  WBTooltip,
  WBTypography,
} from '@admiin-com/ds-web';
import BankAccountsList from '../../components/BankAccountsList/BankAccountsList';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { useSelectedEntity } from '../../hooks/useSelectedEntity/useSelectedEntity';
import AddPaymentMethodModal from '../../components/AddPaymentMethodModal/AddPaymentMethodModal';
import {
  AccountDirection,
  EntityType,
  PaymentMethod,
  PaymentMethodType,
} from '@admiin-com/ds-graphql';
import VerificationDlg from '../VerificationDlg/VerificationDlg';
import { isVerifiedEntity } from '../../helpers/entities';
import { Link } from '@mui/material';

/* eslint-disable-next-line */
export interface ReceivingAccountsProps {}

export function ReceivingAccounts(props: ReceivingAccountsProps) {
  const { t } = useTranslation();
  const [addModal, setAddModal] = React.useState<boolean>(false);
  const { entity, loading } = useSelectedEntity();

  const receivingAccounts = loading
    ? null
    : entity?.paymentMethods?.items
    ? entity?.paymentMethods?.items
        ?.filter(
          (paymentMethod: null | PaymentMethod) =>
            paymentMethod &&
            paymentMethod?.paymentMethodType === PaymentMethodType.BANK &&
            paymentMethod.accountDirection === AccountDirection.DISBURSEMENT
        )
        .filter((method) => method)
    : [];

  console.log('receivingAccounts: ', receivingAccounts);

  const hasPermission =
    (!loading && entity === undefined) ||
    entity?.type === EntityType.INDIVIDUAL ||
    entity?.type === EntityType.SOLE_TRADER ||
    !entity?.taxNumber;

  const handleAddModal = () => {
    !hasPermission && setAddModal(true);
  };

  const [openVerificationModal, setOpenVerificationModal] =
    React.useState<boolean>(false);

  const handleAdd = () => {
    if (entity && isVerifiedEntity(entity)) handleAddModal();
    else !hasPermission && setOpenVerificationModal(true);
  };

  return (
    <>
      <WBFlex flexDirection={'column'} position={'relative'} minHeight="100%">
        <WBFlex
          flexDirection={'row'}
          p={8}
          alignItems={'center'}
          justifyContent={'space-between'}
          sx={{ backgroundColor: 'background.paper', maxWidth: '100%' }}
          pt={{ xs: 10, lg: 8 }}
        >
          <WBTypography variant="h2">
            {t('receivingAccounts', { ns: 'settings' })}
          </WBTypography>
          <WBTooltip
            title={
              !hasPermission
                ? ''
                : t('notAvailableForIndividual', { ns: 'settings' })
            }
          >
            <WBButton
              type="submit"
              sx={{
                display: { xs: 'none', sm: 'block' },
              }}
              disabled={hasPermission}
              onClick={handleAdd}
            >
              {t('addAccount', { ns: 'settings' })}
            </WBButton>
            {/*<Link*/}
            {/*  variant="body2"*/}
            {/*  underline="always"*/}
            {/*  fontWeight={'bold'}*/}
            {/*  color={!hasPermission ? 'primary.main' : 'action.disabled'}*/}
            {/*  display={{ xs: 'none', sm: 'block' }}*/}
            {/*  onClick={handleAdd}*/}
            {/*>*/}
            {/*  {t('addAccount', { ns: 'settings' })}*/}
            {/*</Link>*/}
          </WBTooltip>
        </WBFlex>

        <WBBox p={8} pt={0}>
          {hasPermission ? (
            <></>
          ) : !hasPermission &&
            receivingAccounts &&
            receivingAccounts.length > 0 ? (
            <BankAccountsList
              bankAccounts={receivingAccounts}
              accountDirection={AccountDirection.DISBURSEMENT}
            />
          ) : loading ? (
            <BankAccountsList
              bankAccounts={[null, null]}
              accountDirection={AccountDirection.DISBURSEMENT}
            />
          ) : null}
        </WBBox>
        <WBBox px={{ xs: 4, md: 8, lg: 8 }}>
          <WBButton
            fullWidth
            type="submit"
            sx={{
              mb: 7,
              display: { xs: 'block', sm: 'none' },
            }}
            disabled={hasPermission}
            onClick={handleAdd}
          >
            {t('addAccount', { ns: 'settings' })}
          </WBButton>
        </WBBox>
      </WBFlex>

      {entity ? (
        <VerificationDlg
          entity={entity}
          onSuccess={handleAddModal}
          open={openVerificationModal}
          onClose={() => setOpenVerificationModal(false)}
        />
      ) : null}

      <AddPaymentMethodModal
        open={addModal}
        type="ReceivingAccount"
        handleClose={() => setAddModal(false)}
      />
    </>
  );
}

export default ReceivingAccounts;
