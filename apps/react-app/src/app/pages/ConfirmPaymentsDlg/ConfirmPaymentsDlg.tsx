import SimpleDrawDlg from '../../components/SimpleDrawDlg/SimpleDrawDlg';
import { useTranslation } from 'react-i18next';
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableContainer,
  useTheme,
} from '@mui/material';
import { WBButton, WBTypography } from '@admiin-com/ds-web';
import React from 'react';
import { useUpcomingPayments } from '../../hooks/useUpcomingPayments/useUpcomingPayments';
import { UpcomingPaymentRow } from './UpcomingPaymentRow';
import { gql, useMutation } from '@apollo/client';
import { confirmPayments as CONFIRM_PAYMENTS } from '@admiin-com/ds-graphql';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';

export interface ConfirmPaymentsDlgProps {
  open: boolean;
  onClose: () => void;
}

export function ConfirmPaymentsDlg({ open, onClose }: ConfirmPaymentsDlgProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { paymentsData } = useUpcomingPayments();
  const [confirmPayments, { loading, error }] = useMutation(
    gql(CONFIRM_PAYMENTS)
  );
  const onClick = async () => {
    try {
      await confirmPayments({
        variables: {
          input: {
            payments: paymentsData.map((item) => item.payment.id),
          },
        },
      });

      onClose();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <SimpleDrawDlg open={open && paymentsData.length > 0} handleClose={onClose}>
      <DialogTitle variant="h3" fontWeight={'bold'} component={'div'}>
        {t('confirmUpcomingPayments', { ns: 'payment' })}
        <WBTypography variant="body1" mt={1}>
          {t('confirmUpcomingPaymentsSubTitle', { ns: 'payment' })}
        </WBTypography>
      </DialogTitle>
      <DialogContent>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table>
            <TableBody
              sx={{
                '& .MuiTableCell-root': {
                  borderColor: theme.palette.grey[300],
                },
              }}
            >
              {paymentsData.map((item) => (
                <UpcomingPaymentRow
                  entity={item.entity}
                  key={item.payment.id}
                  payment={item.payment}
                  task={item.task}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions sx={{ px: 3, mt: 8 }}>
        <WBButton fullWidth onClick={onClick} loading={loading}>
          {t('confirmPayment', { ns: 'payment' })}
        </WBButton>
      </DialogActions>
      <ErrorHandler errorMessage={error?.message} />
    </SimpleDrawDlg>
  );
}

export default ConfirmPaymentsDlg;
