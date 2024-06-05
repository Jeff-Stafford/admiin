import {
  WBBox,
  WBButton,
  WBFlex,
  WBLink,
  WBStack,
  WBTypography,
  useSnackbar,
} from '@admiin-com/ds-web';
import React from 'react';
import { useTranslation } from 'react-i18next';
import AddPaymentMethodModal from '../../components/AddPaymentMethodModal/AddPaymentMethodModal';
import { useSelectedEntity } from '../../hooks/useSelectedEntity/useSelectedEntity';
import {
  AccountDirection,
  PaymentMethod,
  PaymentMethodStatus,
  PaymentMethodType,
} from '@admiin-com/ds-graphql';
import CreditCardItem from '../../components/CreditCardItem/CreditCardItem';
import {
  ScrollViews,
  ScrollViewsContainer,
} from '../../components/ScrollViews/ScrollViews';
import BankAccountsList from '../../components/BankAccountsList/BankAccountsList';
import { useMediaQuery, useTheme } from '@mui/material';

export const PaymentMethods = () => {
  const { t } = useTranslation();
  const [addModal, setAddModal] = React.useState<boolean>(false);
  const { entity, loading } = useSelectedEntity();
  const showSnackbar = useSnackbar();
  const handleSuccess = () => {
    showSnackbar({
      message: t('paymentMethodCreated', { ns: 'settings' }),
      severity: 'success',
      horizontal: 'right',
      vertical: 'bottom',
    });
  };

  const ccs = loading
    ? [null, null]
    : entity?.paymentMethods?.items
    ? entity?.paymentMethods?.items?.filter(
        (paymentMethod: null | PaymentMethod) =>
          paymentMethod &&
          paymentMethod?.status === PaymentMethodStatus.ACTIVE &&
          paymentMethod?.paymentMethodType === PaymentMethodType.CARD
      )
    : // .sort((a, b) => {
      //   if (a?.id === entity?.paymentMethodId) return -1;
      //   if (b?.id === entity?.paymentMethodId) return 1;
      //   return 0;
      // })
      [];

  const bankAccounts = loading
    ? null
    : entity?.paymentMethods?.items
    ? entity?.paymentMethods?.items
        ?.filter(
          (paymentMethod: null | PaymentMethod) =>
            paymentMethod &&
            paymentMethod?.status === PaymentMethodStatus.ACTIVE &&
            paymentMethod?.paymentMethodType === PaymentMethodType.BANK &&
            paymentMethod?.accountDirection === AccountDirection.PAYMENT
        )
        .filter((method) => method)
    : [];
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <WBFlex
        flexDirection={'column'}
        position={'relative'}
        bgcolor={'background.paper'}
        minHeight="100%"
      >
        <ScrollViewsContainer data={ccs}>
          <WBBox
            p={8}
            sx={{
              backgroundImage:
                'linear-gradient(102deg, #8c51ff -8%, #ffcdf2 114%)',
              maxWidth: '100%',
            }}
            pt={{ xs: 10, lg: 8 }}
            pb={21}
          >
            <WBFlex
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <WBTypography variant="h2" color={'common.white'}>
                {t('paymentTitle', { ns: 'common' })}
              </WBTypography>
              <WBButton
                type="submit"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                }}
                onClick={() => setAddModal(true)}
              >
                {t('addNewPayment', { ns: 'settings' })}
              </WBButton>

              {/*<WBLink*/}
              {/*  variant="body2"*/}
              {/*  underline="always"*/}
              {/*  color="common.white"*/}
              {/*  fontWeight={'bold'}*/}
              {/*  display={{ xs: 'none', sm: 'block' }}*/}
              {/*  onClick={() => setAddModal(true)}*/}
              {/*>*/}
              {/*  {t('addNewPayment', { ns: 'settings' })}*/}
              {/*</WBLink>*/}
            </WBFlex>
            {!isMobile && ccs.length > 0 ? (
              <WBStack
                mt={4}
                mb={-3}
                direction="row"
                alignItems={'center'}
                justifyContent={'end'}
              >
                <ScrollViews.Back />
                <ScrollViews.Forward />
              </WBStack>
            ) : null}
          </WBBox>
          <WBBox mt={-15} ml={8}>
            <ScrollViews
              render={(paymentMethod) => <CreditCardItem cc={paymentMethod} />}
            />
          </WBBox>
        </ScrollViewsContainer>
        {bankAccounts && bankAccounts.length > 0 ? (
          <WBBox p={8} pt={0}>
            <WBTypography variant="h2" mb={4}>
              {t('bankAccounts', { ns: 'settings' })}
            </WBTypography>
            <BankAccountsList
              bankAccounts={bankAccounts}
              accountDirection={AccountDirection.PAYMENT}
            />
          </WBBox>
        ) : null}
        <WBBox flexGrow={1}></WBBox>
        <WBBox px={{ xs: 4, md: 8, lg: 8 }}>
          <WBButton
            fullWidth
            type="submit"
            sx={{
              mb: 7,
              display: { xs: 'block', sm: 'none' },
            }}
            onClick={() => setAddModal(true)}
          >
            {t('addNewPayment', { ns: 'settings' })}
          </WBButton>
        </WBBox>
      </WBFlex>

      <AddPaymentMethodModal
        open={addModal}
        handleClose={() => setAddModal(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
};
