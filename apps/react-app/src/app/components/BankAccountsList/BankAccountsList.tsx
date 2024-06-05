import {
  AccountDirection,
  PaymentMethod,
  PaymentMethodStatus,
} from '@admiin-com/ds-graphql';
import { WBChip, WBTypography } from '@admiin-com/ds-web';
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  styled,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { useSelectedEntity } from '../../hooks/useSelectedEntity/useSelectedEntity';
import { PaymentMethodMenu } from '../PaymentMethodMenu/PaymentMethodMenu';

export interface BankAccountsListProps {
  bankAccounts: (PaymentMethod | null)[];
  accountDirection: AccountDirection;
}

const BottomBorderdTableRow = styled(TableRow)(() => ({
  '&:last-child td, &:last-child th': { border: 0 },
}));

export function BankAccountsList({
  accountDirection,
  bankAccounts,
}: BankAccountsListProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const { entity } = useSelectedEntity();

  const primaryId =
    accountDirection === AccountDirection.DISBURSEMENT
      ? entity?.disbursementMethodId
      : entity?.paymentMethodId;

  return (
    <TableContainer sx={{ overflowX: 'auto' }}>
      <Table>
        <TableBody
          sx={{
            '& .MuiTableCell-root': {
              borderColor: theme.palette.grey[300],
            },
          }}
        >
          {bankAccounts.map((account) =>
            account
              ? account?.status === PaymentMethodStatus.ACTIVE && (
                  <BottomBorderdTableRow key={account.id}>
                    <TableCell>
                      <WBTypography fontWeight={'bold'}>
                        {t('accountName', { ns: 'settings' })}
                      </WBTypography>

                      <WBTypography>{account.accountName}</WBTypography>
                    </TableCell>
                    <TableCell>
                      <WBTypography fontWeight={'bold'}>
                        {t('BSB', { ns: 'settings' })}
                      </WBTypography>

                      <WBTypography>{account.routingNumber}</WBTypography>
                    </TableCell>

                    <TableCell>
                      <WBTypography fontWeight={'bold'}>
                        {t('accountNumber', { ns: 'settings' })}
                      </WBTypography>

                      <WBTypography>{account.accountNumber}</WBTypography>
                    </TableCell>

                    <TableCell
                      align={primaryId !== account.id ? 'right' : 'left'}
                    >
                      {primaryId === account.id ? (
                        <WBChip
                          label={t('primary', { ns: 'settings' })}
                          sx={{
                            margin: 0,
                            fontSize: '10px',
                            textTransform: 'uppercase',
                            bgcolor: 'common.black',
                            color: 'common.white',
                            mr: 3,
                          }}
                        />
                      ) : (
                        <PaymentMethodMenu
                          accountDirection={accountDirection}
                          paymentMethod={account}
                        />
                      )}
                    </TableCell>
                  </BottomBorderdTableRow>
                )
              : [0, 1].map((value) => (
                  <BottomBorderdTableRow key={value}>
                    <TableCell>
                      <Skeleton width={'100%'} height="30px" />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={'100%'} height="30px" />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={'100%'} height="30px" />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={'100%'} height="30px" />
                    </TableCell>
                  </BottomBorderdTableRow>
                ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default BankAccountsList;
