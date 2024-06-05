import { WBBox, WBTab, useSnackbar } from '@admiin-com/ds-web';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { DialogContent, DialogTitle } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CCForm } from '../HostedFields/CCForm';
import SimpleDrawDlg from '../SimpleDrawDlg/SimpleDrawDlg';
import { BankForm } from '../HostedFields/BankForm';
import {
  AccountDirection,
  PayToAgreement,
  PaymentMethod,
} from '@admiin-com/ds-graphql';
import PayToForm from '../PayToForm/PayToForm';
import PageSelector from '../PageSelector/PageSelector';
import PayToCreateForm from '../PayToCreateForm/PayToCreateForm';
import PayIdForm from '../PayIdForm/PayIdForm';

export interface AddPaymentMethodModalProps {
  open: boolean;
  handleClose: () => void;
  type?: ModalType;
  onSuccess?: (paymentMethod?: PaymentMethod) => void;
}

type ModalType =
  | 'All'
  | 'CC'
  | 'BankAccount'
  | 'ReceivingAccount'
  | 'PAY_TO_VERIFY'
  | 'PAY_TO'
  | 'PAY_ID';

export function AddPaymentMethodModal({
  open,
  onSuccess,
  type = 'CC',
  handleClose,
}: AddPaymentMethodModalProps) {
  const [modalType, setModalType] = React.useState<ModalType>(type);
  React.useEffect(() => {
    setModalType(type);
  }, [type]);
  const { t } = useTranslation();

  const [agreements, setAgreements] = React.useState<PayToAgreement[]>([]);

  const handleChange = (event: React.SyntheticEvent, newValue: ModalType) => {
    setModalType(newValue);
  };
  const showSnackbar = useSnackbar();
  const handleSuccess = (paymentMethod: PaymentMethod | string) => {
    // showSnackbar({
    //   message: t('paymentMethodCreated', { ns: 'settings' }),
    //   severity: 'success',
    //   horizontal: 'right',
    //   vertical: 'bottom',
    // });
    if (typeof paymentMethod !== 'string') {
      onSuccess && onSuccess(paymentMethod);
    }
  };

  return (
    <SimpleDrawDlg
      open={open}
      handleClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <PageSelector current={modalType}>
        <PageSelector.Page value={'PAY_TO'}>
          {agreements.length > 0 ? (
            <PayToCreateForm
              agreements={agreements}
              onSubmitted={() => {
                handleClose();
              }}
            />
          ) : null}
        </PageSelector.Page>
        {/* <PageSelector.Page value={'BankAccount'}>

          <BankForm
            accountDirection={AccountDirection.DISBURSEMENT}
            onSuccess={(paymentMethod) => {
              handleSuccess(paymentMethod);
              onSuccess && onSuccess();
              handleClose();
            }}
          />
        </PageSelector.Page> */}
        <PageSelector.Page value={'PAY_ID'}>
          <PayIdForm
            onSubmitted={() => {
              handleClose();
            }}
          />
        </PageSelector.Page>
        <PageSelector.Page>
          <DialogTitle variant="h3" fontWeight={'bold'}>
            {t(modalType === 'CC' ? 'addPaymentMethod' : 'addBankAccount', {
              ns: 'settings',
            })}
          </DialogTitle>
          {(modalType === 'CC' ||
            modalType === 'BankAccount' ||
            modalType === 'ReceivingAccount' ||
            modalType === 'PAY_TO_VERIFY') && (
            <DialogContent>
              <TabContext value={modalType}>
                <WBBox sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  {/*<TabList*/}
                  {/*  TabIndicatorProps={{ style: { height: 0 } }}*/}
                  {/*  onChange={handleChange}*/}
                  {/*  //aria-label="lab API tabs example"*/}
                  {/*>*/}
                  {/*  <WBTab*/}
                  {/*    disabled={modalType === 'PAY_TO_VERIFY'}*/}
                  {/*    sx={{ fontWeight: 'medium' }}*/}
                  {/*    label={t('CC', { ns: 'settings' })}*/}
                  {/*    value={'CC'}*/}
                  {/*  />*/}
                  {/*  <WBTab*/}
                  {/*    disabled={modalType === 'CC'}*/}
                  {/*    sx={{ fontWeight: 'medium' }}*/}
                  {/*    label={t('BankAccount', { ns: 'settings' })}*/}
                  {/*    value={'PAY_TO_VERIFY'}*/}
                  {/*  />*/}
                  {/*</TabList>*/}
                </WBBox>
                <TabPanel value="BankAccount" sx={{ padding: 1 }}>
                  <BankForm
                    accountDirection={AccountDirection.PAYMENT}
                    hasAgreement
                    onSuccess={(paymentMethod) => {
                      handleSuccess(paymentMethod);
                      onSuccess && onSuccess();
                      handleClose();
                    }}
                  />
                </TabPanel>
                <TabPanel value="ReceivingAccount" sx={{ padding: 1 }}>
                  <BankForm
                    accountDirection={AccountDirection.DISBURSEMENT}
                    onSuccess={(paymentMethod) => {
                      handleSuccess(paymentMethod);
                      onSuccess && onSuccess();
                      handleClose();
                    }}
                  />
                </TabPanel>
                <TabPanel value="CC" sx={{ padding: 1, mt: 3 }}>
                  <CCForm
                    isGuest={false}
                    onSuccess={(paymentMethod) => {
                      handleSuccess(paymentMethod);
                      handleClose();
                    }}
                  />
                </TabPanel>
                <TabPanel value="PAY_TO_VERIFY" sx={{ padding: 1 }}>
                  <PayToForm
                    onFailed={(type: 'CC' | 'PayID') => {
                      if (type === 'CC') setModalType('CC');
                      else {
                        setModalType('PAY_ID');
                      }
                    }}
                    onSuccess={(agreements: PayToAgreement[]) => {
                      // if (agreement.status === 'VALIDATED') {
                      setModalType('PAY_TO');
                      setAgreements(agreements);
                      // } else setModal('PAY_ID');
                      // handleClose();
                    }}
                  />
                </TabPanel>
              </TabContext>
            </DialogContent>
          )}
        </PageSelector.Page>
      </PageSelector>
    </SimpleDrawDlg>
  );
}

export default AddPaymentMethodModal;
