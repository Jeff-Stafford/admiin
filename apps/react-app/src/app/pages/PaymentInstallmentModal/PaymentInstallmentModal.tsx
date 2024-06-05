import {
  WBBox,
  WBButton,
  WBDivider,
  WBFlex,
  WBTypography,
} from '@admiin-com/ds-web';
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
  useTheme,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CurrencyNumber } from '../../components/CurrencyNumber/CurrencyNumber';
import { Task } from '@admiin-com/ds-graphql';
import {
  frontDateFromUnixSeconds,
  getDateNMonthsFromNow,
  getOrdinal,
  userDateFromUnixSeconds,
} from '@admiin-com/ds-common';
import { BreakDownContainer } from '../../components/BreakDownContainer/BreakDownContainer';
import Timeline from '../../components/Timeline/Timeline';
import SimpleDrawDlg from '../../components/SimpleDrawDlg/SimpleDrawDlg';
import { useTaskProperty } from '../../hooks/useTaskProperty/useTaskProperty';

/* eslint-disable-next-line */
export interface PaymentInstallmentModalProps {}

export interface PaymentInstallmentModalProps {
  open: boolean;
  handleClose: () => void;
  task?: Task | null;
  value?: number;
  onSuccess: (value: number) => void;
}

export function PaymentInstallmentModal({
  task,
  value: installments,
  open,
  handleClose,
  onSuccess,
}: PaymentInstallmentModalProps) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const amount = task?.amount ?? 0;
  const [value, setValue] = React.useState<number>(
    task?.category === 'TAX' ? 12 : 3
  );
  const handleChange = (_: any, value: any) => {
    setValue(value);
  };

  const taskProperty = useTaskProperty(task);

  React.useEffect(() => {
    if (!installments && taskProperty?.totalInstallments)
      setValue(taskProperty?.totalInstallments);
    if (installments) setValue(installments);
    if (!installments && task) {
      setValue(task?.category === 'TAX' ? 12 : 3);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.id, installments]);

  return (
    <SimpleDrawDlg open={open} handleClose={handleClose} maxWidth="xs">
      <DialogTitle variant="h3" fontWeight={'bold'} component={'div'}>
        {t('installments', { ns: 'taskbox' })}
        <WBTypography variant="body1" mt={1}>
          {t('installmentSubTitle', { ns: 'taskbox' })}
        </WBTypography>
      </DialogTitle>
      <DialogContent>
        <WBFlex alignItems={'center'} justifyContent={'center'}>
          <WBFlex
            width={'40px'}
            height={'40px'}
            mr={1}
            bgcolor={'primary.main'}
            alignItems={'center'}
            justifyContent={'center'}
            borderRadius={'10px'}
          >
            <WBTypography
              color={'white'}
              p={1.5}
              fontWeight={'900'}
              fontSize={'h4.fontSize'}
            >
              {value}
            </WBTypography>
          </WBFlex>
          <WBTypography>{t('installments', { ns: 'taskbox' })}</WBTypography>
        </WBFlex>
        <WBBox mt={{ xs: 1, sm: 4 }}>
          <Slider
            value={value}
            onChange={handleChange}
            min={2}
            max={24}
            step={1}
            aria-label="Default"
          />
          <WBBox sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <WBTypography
              variant="body1"
              fontWeight={'bold'}
              onClick={() => setValue(2)}
              sx={{ cursor: 'pointer' }}
            >
              {2}
            </WBTypography>
            <WBTypography
              fontWeight={'bold'}
              variant="body1"
              onClick={() => setValue(task?.category === 'TAX' ? 24 : 3)}
              sx={{ cursor: 'pointer' }}
            >
              {task?.category === 'TAX' ? 24 : 3}
            </WBTypography>
          </WBBox>
          <WBFlex
            justifyContent="space-between"
            alignItems={'center'}
            mt={{ xs: 1, sm: 4 }}
            bgcolor={'background.default'}
            padding={1.5}
            paddingX={3}
            borderRadius={'5px'}
          >
            <WBTypography
              variant="body1"
              fontWeight={'medium'}
              color={'text.secondary'}
            >
              {t('firstPaymentDate', { ns: 'taskbox' })}
            </WBTypography>
            <WBTypography
              textAlign={{ xs: 'start', sm: 'end' }}
              fontWeight={'bold'}
              fontSize={'body1.fontSize'}
            >
              {userDateFromUnixSeconds(new Date().getTime() / 1000)}
            </WBTypography>
          </WBFlex>
          <WBFlex
            justifyContent="space-between"
            alignItems={'center'}
            mt={2}
            bgcolor={'background.default'}
            padding={1.5}
            paddingX={3}
            borderRadius={'5px'}
          >
            <WBTypography
              variant="body1"
              fontWeight={'medium'}
              color={'text.secondary'}
            >
              {t('totalAmount', { ns: 'taskbox' })}
            </WBTypography>
            <CurrencyNumber
              sup={false}
              number={amount}
              textAlign={{ xs: 'start', sm: 'end' }}
              fontSize={'body1.fontSize'}
            />
          </WBFlex>
          <BreakDownContainer grey={true}>
            <WBBox padding={1.5} paddingX={3} mt={2}>
              <BreakDownContainer.Link
                variant="body1"
                //color={'common.black'}
                fontWeight={'bold'}
                title={t('installmentBreakdown', { ns: 'taskbox' })}
              />
              <BreakDownContainer.Body>
                <Timeline
                  items={Array.from({ length: value }, (_, index) => index)}
                  render={(index: number) => (
                    <WBFlex
                      justifyContent={'space-between'}
                      alignItems={'center'}
                    >
                      <WBBox>
                        <WBTypography fontWeight={'bold'}>
                          {t('ordinalPayment', {
                            ns: 'taskbox',
                            ordinal: getOrdinal(index + 1),
                          })}
                        </WBTypography>
                        <WBTypography
                          color={'grey'}
                          fontWeight={'bold'}
                          fontSize={'body2.fontSize'}
                        >
                          {index === 0
                            ? t('dueToday', { ns: 'taskbox' })
                            : frontDateFromUnixSeconds(
                                getDateNMonthsFromNow(index).getTime() / 1000
                              )}
                        </WBTypography>
                      </WBBox>
                      <CurrencyNumber sup={false} number={amount / value} />
                    </WBFlex>
                  )}
                />
                <WBBox mx={2}>
                  <WBDivider
                    sx={{
                      height: '1px',
                      bgcolor: theme.palette.grey[400],
                    }}
                  />
                  <WBFlex
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    mt={1}
                  >
                    <WBTypography fontSize={'inherit'} mr={2} noWrap my={1}>
                      {t('installmentFee', { ns: 'taskbox', percent: 5 })}
                    </WBTypography>
                    <CurrencyNumber mr={2} sup={false} number={amount * 0.05} />
                  </WBFlex>
                </WBBox>
              </BreakDownContainer.Body>
            </WBBox>
          </BreakDownContainer>
        </WBBox>
      </DialogContent>
      <DialogActions sx={{ padding: 3, mt: 1, pt: 0 }}>
        <WBButton
          fullWidth
          type="submit"
          onClick={() => {
            onSuccess(value);
            handleClose();
          }}
        >
          {t('confirmPay', {
            ns: 'taskbox',
            installments: value,
            amount: new Intl.NumberFormat(i18n.language, {
              style: 'currency',
              currency: 'AUD',
            }).format(amount / value),
          }).replace('A$', '$')}
        </WBButton>
      </DialogActions>
    </SimpleDrawDlg>
  );
}

export default PaymentInstallmentModal;
