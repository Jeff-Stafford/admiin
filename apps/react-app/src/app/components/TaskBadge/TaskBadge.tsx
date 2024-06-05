import React from 'react';
import {
  Task,
  TaskDirection,
  TaskPaymentStatus,
  TaskSignatureStatus,
} from '@admiin-com/ds-graphql';
import {
  WBBox,
  WBChip,
  WBFlex,
  WBStack,
  WBTooltip,
  WBTypography,
} from '@admiin-com/ds-web';
import { styled, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTaskProperty } from '../../hooks/useTaskProperty/useTaskProperty';

export interface TaskBadgeProps {
  task: Task | null;
  listView?: boolean;
  direction?: TaskDirection;
}

const Dot = styled(WBBox)(({ theme }) => ({
  height: theme.spacing(2),
  borderRadius: '10px',
  display: 'inline-block',
  width: theme.spacing(2),
}));

export function TaskBadge({ task, listView, direction }: TaskBadgeProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    isPaid,
    isScheduled,
    dueDate,
    totalInstallments,
    isPayment,
    isDeclined,
    paidInstallments,
    tooltip,
    scheduledDate,
  } = useTaskProperty(task);

  if (!task) return;

  return (
    <WBBox>
      {!listView && !isPaid && (
        <WBTypography color={'text.primary'}>
          {t(
            isPayment
              ? isScheduled
                ? totalInstallments > 1
                  ? 'paidInInstallments'
                  : 'scheduledIn'
                : dueDate > 0
                ? 'paymentDue'
                : dueDate === 0
                ? 'paymentToday'
                : 'paymentOverDue'
              : dueDate > 0
              ? 'signatureDue'
              : dueDate === 0
              ? 'signatureToday'
              : 'signatureOverDue',
            {
              ns: 'taskbox',
            }
          )}
        </WBTypography>
      )}
      <WBFlex
        alignItems={'center'}
        flexDirection={listView ? 'row-reverse' : 'row'}
      >
        <WBTooltip title={tooltip}>
          <WBBox>
            {!isPaid ? (
              isScheduled ? (
                isDeclined ? (
                  <WBChip
                    component="span"
                    label={t(scheduledDate === 1 ? 'day' : 'days', {
                      day: scheduledDate,
                      ns: 'taskbox',
                    })}
                    size="medium"
                    sx={{
                      fontWeight: 'bold',
                      p: 2,
                      mt: 1,
                      color: 'text.primary',
                      backgroundColor: 'warning.main',
                    }}
                  />
                ) : (
                  <WBChip
                    component="span"
                    label={
                      totalInstallments > 1
                        ? `${paidInstallments} / ${totalInstallments}`
                        : scheduledDate !== 0
                        ? t(scheduledDate === 1 ? 'day' : 'days', {
                            day: scheduledDate,
                            ns: 'taskbox',
                          })
                        : t('today', { ns: 'taskbox' })
                    }
                    size="medium"
                    sx={{
                      fontWeight: 'bold',
                      p: 2,
                      mt: 1,
                      //color: 'text.primary',
                      //backgroundColor:
                      //  scheduledDate > 0 || totalInstallments > 1
                      //    ? 'warning.main'
                      //    : 'error.main',
                      color: 'black',
                      backgroundColor: 'warning.main',
                    }}
                  />
                )
              ) : (
                <WBChip
                  component="span"
                  label={
                    dueDate !== 0
                      ? `${dueDate} ${t(dueDate === 1 ? 'day' : 'days', {
                          ns: 'common',
                        })}`
                      : t('today', { ns: 'taskbox' })
                  }
                  color={'error'}
                  size="medium"
                  sx={{
                    fontWeight: 'bold',
                    p: 2,
                    mt: 1,
                    ...(dueDate > 0
                      ? {
                          color: 'text.primary',
                          backgroundColor: theme.palette.background.default,
                        }
                      : {}),
                  }}
                />
              )
            ) : (
              <WBChip
                component="span"
                label={t('paid', { ns: 'taskbox' })}
                color={'error'}
                size="medium"
                sx={{
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  p: 2,
                  mt: 1,
                  color: theme.palette.common.black,
                  backgroundColor: 'success.main',
                }}
              />
            )}
          </WBBox>
        </WBTooltip>
        {direction === TaskDirection.SENDING ? (
          <WBTooltip
            title={
              <WBBox>
                <WBTypography
                  color={'inherit'}
                  fontSize={'inherit'}
                  fontWeight={'inherit'}
                  sx={{
                    ...((task?.signatureStatus === TaskSignatureStatus.SIGNED ||
                      task?.signatureStatus ===
                        TaskSignatureStatus.NOT_SIGNABLE) && {
                      textDecoration: 'line-through',
                    }),
                  }}
                >
                  {t('signed', { ns: 'taskbox' })}
                </WBTypography>
                <WBTypography
                  color={'inherit'}
                  fontSize={'inherit'}
                  fontWeight={'inherit'}
                  sx={{
                    ...((task?.paymentStatus === TaskPaymentStatus.PAID ||
                      task?.paymentStatus ===
                        TaskPaymentStatus.NOT_PAYABLE) && {
                      textDecoration: 'line-through',
                    }),
                  }}
                >
                  {t('paid', { ns: 'taskbox' })}
                </WBTypography>
              </WBBox>
            }
          >
            <WBBox>
              <WBStack ml={1} direction={'row'} spacing={0.5}>
                <Dot
                  sx={{
                    bgcolor:
                      task?.signatureStatus === TaskSignatureStatus.NOT_SIGNABLE
                        ? theme.palette.action.disabled
                        : task?.signatureStatus === TaskSignatureStatus.SIGNED
                        ? theme.palette.success.main
                        : theme.palette.warning.main,
                  }}
                />
                <Dot
                  sx={{
                    bgcolor:
                      task?.paymentStatus === TaskPaymentStatus.NOT_PAYABLE
                        ? theme.palette.action.disabled
                        : task?.paymentStatus === TaskPaymentStatus.PAID
                        ? theme.palette.success.main
                        : theme.palette.warning.main,
                  }}
                />
              </WBStack>
            </WBBox>
          </WBTooltip>
        ) : null}
      </WBFlex>
    </WBBox>
  );
}

export default TaskBadge;
