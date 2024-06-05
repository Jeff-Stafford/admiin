import React from 'react';
import { WBS3Avatar } from '@admiin-com/ds-amplify-web';
import { Task, TaskPaymentStatus, TaskType } from '@admiin-com/ds-graphql';
import {
  WBBox,
  WBChip,
  WBFlex,
  WBGrid,
  WBLink,
  WBSkeleton,
  WBTypography,
} from '@admiin-com/ds-web';
import { Backdrop, Paper, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CurrencyNumber } from '../../components/CurrencyNumber/CurrencyNumber';

import { frontDateFromBackendDate } from '@admiin-com/ds-common';
import { useContact } from '../../hooks/useContact/useContact';
import PaymentDetail from '../PaymentDetail/PaymentDetail';
import { useTaskProperty } from '../../hooks/useTaskProperty/useTaskProperty';
import { useUpdateTask } from '../../hooks/useUpdateTask/useUpdateTask';
import { useCurrentEntityId } from '../../hooks/useSelectedEntity/useSelectedEntity';
import PdfViewer from '../PdfViewer/PdfViewer';
import TaskPdfSignature from '../TaskPdfSignature/TaskPdfSignature';

interface TaskDetailCardProps {
  task: Task | null;
}
export function TaskDetailCard({ task }: TaskDetailCardProps) {
  const { contact, contactLoading } = useContact(task);
  const { isPaid } = useTaskProperty(task);
  const theme = useTheme();
  const entityId = useCurrentEntityId();
  const { t } = useTranslation();

  const [updateTask] = useUpdateTask(task);

  const markAsPaid = async (paymentStatus: TaskPaymentStatus) => {
    if (task) {
      await updateTask({
        variables: {
          input: {
            id: task.id,
            entityId,
            paymentStatus,
            dueAt: task.dueAt,
          },
        },
      });
    }
  };
  if (!task) return null;
  return (
    <WBBox>
      <Paper
        sx={{
          p: [2, 3, 6],
          mb: 5,
          position: 'relative', // This makes the Box a new positioning context for the Backdrop
          fontWeight: 'bold',
          fontSize: 'body2.fontSize',
          ...{
            boxShadow: `0 41px 45px -35.5px ${
              isPaid ? theme.palette.success.main : theme.palette.common.black
            }`,
          },
          bgcolor: theme.palette.background.default,
        }}
      >
        <WBFlex justifyContent={contact ? 'space-between' : 'end'}>
          <WBFlex
            justifyContent={'space-between'}
            alignItems={['start', 'start', 'center']}
            flexDirection={['column', 'column', 'row']}
            width={'100%'}
          >
            <WBFlex justifyContent={'center'} alignItems={'center'}>
              {contact ? (
                <WBS3Avatar
                  sx={{ width: '52px', height: '52px' }}
                  companyName={contact.searchName}
                  fontSize="h6.fontSize"
                />
              ) : contactLoading || task === null ? (
                <WBSkeleton variant="circular" width={40} height={40} />
              ) : null}
              {contact ? (
                <WBBox ml={3}>
                  <WBTypography variant="h2" fontWeight="bold" mb={0}>
                    {contact.searchName}
                  </WBTypography>
                </WBBox>
              ) : contactLoading ? (
                <WBSkeleton width={80}></WBSkeleton>
              ) : null}
            </WBFlex>
            <WBFlex sx={{ flexGrow: 1 }} justifyContent={'end'}>
              <PaymentDetail task={task} type="Type">
                <PaymentDetail.Selector
                  bgcolor="#3d47ff"
                  fontColor={theme.palette.text.primary}
                  disabled={task.type === TaskType.SIGN_ONLY}
                />
              </PaymentDetail>
            </WBFlex>
          </WBFlex>
        </WBFlex>
        <WBGrid container mt={2} spacing={2}>
          <WBGrid xs={6}>
            <WBBox mr={2} flex={1} width={'100%'}>
              <WBFlex
                mt={{ xs: 1, sm: 0 }}
                flexDirection={['column', 'column', 'row']}
              >
                <WBBox flex={1}>
                  <WBTypography fontWeight={'inherit'} fontSize={'inherit'}>
                    {t('dueAt', { ns: 'taskbox' })}
                  </WBTypography>
                  <WBTypography
                    fontWeight={'inherit'}
                    fontSize={'inherit'}
                    bgcolor={'background.paper'}
                    p={1}
                    px={2}
                    mt={2}
                  >
                    {frontDateFromBackendDate(task.dueAt)}
                  </WBTypography>
                </WBBox>

                {task.reference && (
                  <WBBox ml={[0, 0, 2, 3]} mt={[2, 2, 0]} flex={1}>
                    <WBTypography fontWeight={'inherit'} fontSize={'inherit'}>
                      {t('reference', { ns: 'taskbox' })}
                    </WBTypography>
                    {/* {task.paymentFrequency ? ( */}
                    <WBTypography
                      fontWeight={'inherit'}
                      fontSize={'inherit'}
                      bgcolor={'background.paper'}
                      p={1}
                      px={2}
                      mt={2}
                    >
                      {task.reference}
                    </WBTypography>
                    {/* ) : null} */}
                  </WBBox>
                )}
              </WBFlex>
              {task?.amount ? (
                <WBBox mt={{ xs: 3, sm: 5 }}>
                  <WBTypography
                    fontWeight={'inherit'}
                    textTransform={'uppercase'}
                  >
                    {t('totalAmount', { ns: 'taskbox' })}
                  </WBTypography>
                  <CurrencyNumber
                    number={task.amount ?? 0}
                    fontSize={{ xs: 'h3.fontSize', sm: 'h2.fontSize' }}
                  />
                </WBBox>
              ) : null}
            </WBBox>
          </WBGrid>
          <WBGrid xs={6} sx={{ display: 'flex', justifyContent: 'end' }}>
            <WBFlex
              flexDirection={'column'}
              justifyContent={'center'}
              alignItems={['center']}
            >
              <WBBox
                sx={{
                  width: ['100px', '150px'],
                }}
                mb={3}
              >
                <TaskPdfSignature task={task} minHeight={['150px', '150px']} />
              </WBBox>
              {task.type !== TaskType.SIGN_ONLY && (
                <WBLink
                  color={'text.primary'}
                  underline="always"
                  variant="body2"
                  fontWeight={'bold'}
                  onClick={() => markAsPaid(TaskPaymentStatus.MARKED_AS_PAID)}
                >
                  {t('markAsPaid', { ns: 'taskbox' })}
                </WBLink>
              )}
            </WBFlex>
          </WBGrid>
        </WBGrid>
        <Backdrop
          sx={{
            color: '#fff',
            position: 'absolute', // Position it absolutely within the Box
            top: 0, // Align to the top of the Box
            left: 0, // Align to the left of the Box
            width: '100%', // Cover the entire width of the Box
            height: '100%', // Cover the entire height of the Box
            zIndex: (theme) => theme.zIndex.drawer + 1,
            flexDirection: 'column',
          }}
          open={isPaid}
        >
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
              color: 'black',
              backgroundColor: 'success.main',
            }}
          />
          {task.paymentStatus === TaskPaymentStatus.MARKED_AS_PAID && (
            <WBLink
              underline="always"
              variant="body2"
              color={'common.white'}
              onClick={() => markAsPaid(TaskPaymentStatus.PENDING_PAYMENT)}
            >
              {t('undo', { ns: 'taskbox' })}
            </WBLink>
          )}
        </Backdrop>
      </Paper>
    </WBBox>
  );
}
