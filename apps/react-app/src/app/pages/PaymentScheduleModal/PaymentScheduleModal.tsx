import { WBButton, WBFlex, WBTypography } from '@admiin-com/ds-web';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CurrencyNumber } from '../../components/CurrencyNumber/CurrencyNumber';
import { Task } from '@admiin-com/ds-graphql';
import { frontDateFromUnixSeconds } from '@admiin-com/ds-common';
import DayPicker from '../../components/DayPicker/DayPicker';
import SimpleDrawDlg from '../../components/SimpleDrawDlg/SimpleDrawDlg';
import { useTaskProperty } from '../../hooks/useTaskProperty/useTaskProperty';

/* eslint-disable-next-line */
export interface PaymentScheduleModalProps {}

/* eslint-disable-next-line */
export interface PaymentScheduleModalProps {
  open: boolean;
  handleClose: () => void;
  task?: Task | null;
  value?: Date;
  onSuccess: (date: Date) => void;
}

export function PaymentScheduleModal({
  open,
  task,
  value,
  onSuccess,
  handleClose,
}: PaymentScheduleModalProps) {
  const { t } = useTranslation();

  const [scheduleDate, setScheduleDate] = React.useState<Date>(new Date());

  const taskProperty = useTaskProperty(task);

  React.useEffect(() => {
    if (!value && taskProperty?.scheduledAt)
      setScheduleDate(taskProperty?.scheduledAt);
    if (value) setScheduleDate(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.id, value]);

  return (
    <SimpleDrawDlg open={open} handleClose={handleClose} maxWidth="xs">
      <DialogTitle variant="h3" fontWeight={'bold'} component={'div'}>
        {t('schedule', { ns: 'taskbox' })}
        <WBTypography variant="body1" mt={1}>
          {t('scheduledSubTitle', { ns: 'taskbox' })}
        </WBTypography>
      </DialogTitle>
      <DialogContent>
        <WBFlex
          justifyContent="space-between"
          alignItems={'center'}
          my={2}
          bgcolor={'background.default'}
          padding={1.5}
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
            number={task?.amount ?? 0}
            textAlign={{ xs: 'start', sm: 'end' }}
            fontSize={'body1.fontSize'}
          />
        </WBFlex>

        <WBTypography variant="body2" mt={2} fontWeight={'bold'}>
          {t('scheduleHelper', { ns: 'taskbox' })}
        </WBTypography>

        <DayPicker
          onChange={(value) => {
            setScheduleDate(value);
          }}
          value={scheduleDate}
          dueDate={new Date(task?.dueAt ?? '')}
        />
      </DialogContent>
      <DialogActions sx={{ padding: 3, mt: 1, pt: 0 }}>
        <WBButton
          fullWidth
          type="submit"
          onClick={() => {
            onSuccess(scheduleDate);
            handleClose();
          }}
        >
          {t('scheduleOn', {
            ns: 'taskbox',
            date: frontDateFromUnixSeconds(scheduleDate.getTime() / 1000),
          })}
        </WBButton>
      </DialogActions>
    </SimpleDrawDlg>
  );
}

export default PaymentScheduleModal;
