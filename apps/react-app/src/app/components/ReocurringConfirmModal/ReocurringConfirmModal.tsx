import React, { useEffect, useState } from 'react';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import SimpleDrawDlg from '../SimpleDrawDlg/SimpleDrawDlg';
import { useTranslation } from 'react-i18next';
import {
  WBButton,
  WBDivider,
  WBFlex,
  WBGrid,
  WBLink,
  WBTypography,
} from '@admiin-com/ds-web';
import { useTaskBoxContext } from '../../pages/TaskBox/TaskBox';
import { Task } from '@admiin-com/ds-graphql';
import { isReocurringTask } from '../../helpers/tasks';
import { CurrencyNumber } from '../CurrencyNumber/CurrencyNumber';
import { useTaskToName } from '../../hooks/useContact/useContact';

export interface ReocurringConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reOcurringTasks?: Task[];
}

export function ReocurringConfirmModal({
  open,
  reOcurringTasks,
  onClose,
  onConfirm,
}: ReocurringConfirmModalProps) {
  const handleClose = () => {
    onClose();
  };

  const { t } = useTranslation();
  const { dueTasks } = useTaskBoxContext();
  const onSubmit = () => {
    onConfirm();
    onClose();
  };

  const tasks = React.useMemo(
    () =>
      reOcurringTasks ??
      dueTasks?.filter((task: Task) => isReocurringTask(task)),
    [dueTasks, reOcurringTasks]
  );
  const getTaskToName = useTaskToName();

  const [taskNames, setTaskNames] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchTaskNames = async () => {
      const names: { [key: string]: string } = {};
      for (const task of tasks || []) {
        names[task.id] = (await getTaskToName(task?.contactId))?.name ?? '';
      }
      setTaskNames(names);
    };

    fetchTaskNames();
  }, [getTaskToName, tasks]);

  return (
    <SimpleDrawDlg open={open} handleClose={handleClose}>
      <DialogTitle variant="h3" fontWeight={'bold'} component={'div'}>
        {t('reocurringBillTitle', { ns: 'taskbox' })}
        <WBTypography variant="body1" mt={3}>
          {t('reocurringBillDescription', { ns: 'taskbox' })}
          {/*<b>{maskCreditCardNumberSimple(paymentMethod?.number ?? '')}</b>{' '}*/}
          {/*{t('reocurringBillDescription2', { ns: 'taskbox' })}*/}
        </WBTypography>
      </DialogTitle>
      <DialogContent sx={{ my: 3 }}>
        {tasks?.map((task: Task, index: number) => (
          <React.Fragment key={task.id}>
            <WBGrid container>
              <WBGrid xs={6} sm={8}>
                <WBTypography variant="body1" fontWeight={'bold'}>
                  {taskNames[task.id] ?? ''}
                </WBTypography>
              </WBGrid>

              <WBGrid xs={3} sm={2}>
                <CurrencyNumber
                  number={task?.amount ?? 0}
                  sup={false}
                  fontWeight={'normal'}
                />
              </WBGrid>
              <WBGrid xs={3} sm={2}>
                <WBTypography
                  textAlign={'right'}
                  variant="body1"
                  fontWeight={'bold'}
                >
                  {t(task?.paymentFrequency ?? '', { ns: 'taskbox' })}
                </WBTypography>
              </WBGrid>
            </WBGrid>
            {index < tasks.length - 1 && <WBDivider sx={{ my: 2 }} />}
          </React.Fragment>
        ))}
      </DialogContent>
      <DialogActions>
        <WBFlex
          sx={{ mt: 5, px: 2, width: '100%' }}
          flexDirection={'column'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <WBButton fullWidth onClick={onSubmit}>
            {t('confirm', { ns: 'common' })}
          </WBButton>
          <WBLink
            component={'button'}
            underline="always"
            sx={{ mt: 4, fontWeight: 'bold' }}
            color={'text.primary'}
            onClick={handleClose}
          >
            {t('cancelTitle', { ns: 'common' })}
          </WBLink>
        </WBFlex>
      </DialogActions>
    </SimpleDrawDlg>
  );
}

export default ReocurringConfirmModal;
