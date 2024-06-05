import React from 'react';
import { WBS3Avatar } from '@admiin-com/ds-amplify-web';
import {
  WBBox,
  WBFlex,
  WBIconButton,
  WBMenu,
  WBMenuItem,
  WBSkeleton,
  WBStack,
  WBSvgIcon,
  WBTypography,
  useSnackbar,
} from '@admiin-com/ds-web';
import DotIcon from '../../../assets/icons/tripledot.svg';
import InfoIcon from '../../../assets/icons/infoicon.svg';
import { useContact } from '../../hooks/useContact/useContact';
import { Paper, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CurrencyNumber } from '../../components/CurrencyNumber/CurrencyNumber';

import { frontDateFromBackendDate } from '@admiin-com/ds-common';
import { TaskDraft } from './TaskDraft';
import { BreakDownContainer } from '../../components/BreakDownContainer/BreakDownContainer';
import { useTaskBoxContext } from '../TaskBox/TaskBox';
import TaskInstallmentsTimeline from '../../components/TaskInstallmentsTimeline/TaskInstallmentsTimeline';
import { useTaskProperty } from '../../hooks/useTaskProperty/useTaskProperty';
import TaskPdfSignature from '../../components/TaskPdfSignature/TaskPdfSignature';
import {
  Task,
  TaskPaymentStatus,
  TaskStatus,
  updateTask as UPDATE_TASK,
} from '@admiin-com/ds-graphql';
import { gql, useMutation } from '@apollo/client';
import { downloadPdf } from '../../helpers/signature';
import TaskBreakDownBody from '../../components/TaskBreakDownBody/TaskBreakDownBody';

// import { gql, useMutation } from '@apollo/client';

export function TaskDetail() {
  const taskboxContext = useTaskBoxContext();
  const {
    selectedTask: task,
    setSelectedTask,
    loadingTask,
    loading,
    statusFilter,
    tasks,
    pdfSignatureRef,
    setStatusFilter,
  } = taskboxContext ?? {};
  const { contact, contactLoading } = useContact(task);
  const {
    isInstallments,
    isAchivable,
    isPayable,
    isCreatedBy,
    isDownloadable,
  } = useTaskProperty(task);
  const theme = useTheme();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [updateTask] = useMutation(gql(UPDATE_TASK));

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const showSnackbar = useSnackbar();

  const handleArchiveTask = async () => {
    handleMenuClose();
    if (task) {
      try {
        await updateTask({
          variables: {
            input: {
              id: task.id,
              entityId: task.entityId,
              status: TaskStatus.ARCHIVED,
            },
          },
        });
        showSnackbar({
          message: t('taskArchived', { ns: 'taskbox' }),
          severity: 'success',
          horizontal: 'center',
          vertical: 'bottom',
        });
        setSelectedTask(null);
      } catch (error: any) {
        showSnackbar({
          title: t('taskArchivedFailed', { ns: 'taskbox' }),
          message: error?.message,
          severity: 'error',
          horizontal: 'center',
          vertical: 'bottom',
        });
      }
    }
  };

  const handleMarkAsPaidTask = async () => {
    handleMenuClose();
    if (task) {
      try {
        await updateTask({
          variables: {
            input: {
              id: task.id,
              entityId: task.entityId,
              paymentStatus: TaskPaymentStatus.MARKED_AS_PAID,
            },
          },
        });
        // setStatusFilter('Completed');
      } catch (error: any) {
        showSnackbar({
          title: t('markAsPaidFailed', { ns: 'taskbox' }),
          message: error?.message,
          severity: 'error',
          horizontal: 'center',
          vertical: 'bottom',
        });
      }
    }
  };

  const downloadDocument = () => {
    downloadPdf(pdfSignatureRef);
  };

  React.useEffect(() => {
    if (
      task &&
      !loading &&
      tasks &&
      !tasks.find((t: Task) => t.id === task.id)
    ) {
      if (
        statusFilter !== 'Scheduled' &&
        task.paymentStatus === TaskPaymentStatus.SCHEDULED
      ) {
        setStatusFilter('Scheduled');
      }
      if (
        statusFilter !== 'Completed' &&
        task.paymentStatus === TaskPaymentStatus.PAID
      ) {
        setStatusFilter('Completed');
      }
    }
  }, [task]);

  if (!task && !loadingTask) return null;

  return (
    <WBFlex minHeight={'100vh'} mt={3} key={task?.id} flexDirection={'column'}>
      <WBFlex
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <WBFlex justifyContent={'center'} alignItems={'center'}>
          {contact ? (
            <WBS3Avatar
              sx={{ width: '52px', height: '52px' }}
              companyName={contact.searchName}
              fontSize="h6.fontSize"
            />
          ) : contactLoading || task === null ? (
            <WBSkeleton
              variant="circular"
              sx={{ mr: 3 }}
              width={60}
              height={60}
            />
          ) : null}
          <WBBox ml={3}>
            {contact && task ? (
              <>
                <WBTypography variant="h2" fontWeight="bold" mb={0}>
                  {contact.searchName}
                </WBTypography>
                <WBTypography fontWeight={'medium'}>
                  {task?.reference}
                </WBTypography>
              </>
            ) : contactLoading ? (
              <WBSkeleton width={80} height={80}></WBSkeleton>
            ) : null}
          </WBBox>
        </WBFlex>
        <WBStack
          direction={'row'}
          spacing={1}
          sx={{
            position: { xs: 'absolute', lg: 'relative' },
            right: { xs: '24px', md: '64px', lg: '0px' },
            top: { xs: '32px', lg: '0px' },
            // ...(contact
            //   ? { mt: { xs: -32, lg: 0 }, ml: { xs: -14, lg: 0 } }
            //   : { mt: { xs: -10, lg: 0 }, ml: { xs: -6, lg: 0 } }),
          }}
        >
          <WBIconButton>
            <WBSvgIcon fontSize="small" color={theme.palette.text.primary}>
              <InfoIcon />
            </WBSvgIcon>
          </WBIconButton>

          <WBIconButton onClick={handleOpenMenu}>
            <WBSvgIcon fontSize="small" color={theme.palette.text.primary}>
              <DotIcon />
            </WBSvgIcon>
          </WBIconButton>
        </WBStack>
      </WBFlex>
      {task &&
      task.payments &&
      (isInstallments || task.numberOfPayments > 1) ? (
        <TaskInstallmentsTimeline payments={task?.payments?.items} />
      ) : null}
      <Paper
        sx={{
          p: { xs: 2, md: 3, lg: 3, xl: 9 },
          mt: 4,
          mb: 5,
          fontWeight: 'bold',
          fontSize: 'body2.fontSize',
          bgcolor: theme.palette.background.default,
          boxShadow: '0 41px 45px -35.5px #636363',
        }}
      >
        {task ? (
          <BreakDownContainer>
            <WBFlex
              justifyContent={'space-between'}
              flexDirection={['column', 'column', 'row']}
              alignItems={'start'}
              width={'100%'}
            >
              <WBFlex
                mt={{ xs: 1, sm: 0 }}
                mr={2}
                alignSelf={{ xs: 'start', md: 'end' }}
              >
                <WBBox>
                  <WBTypography fontWeight={'inherit'} fontSize={'inherit'}>
                    {t('dueAt', { ns: 'taskbox' })}
                  </WBTypography>
                  <WBTypography
                    fontWeight={'inherit'}
                    fontSize={'inherit'}
                    bgcolor={'background.paper'}
                    p={1}
                    px={2}
                    noWrap
                    mt={2}
                  >
                    {frontDateFromBackendDate(task.dueAt)}
                  </WBTypography>
                </WBBox>

                {isPayable ? (
                  <WBBox ml={{ xs: 2 }}>
                    <WBTypography fontWeight={'inherit'} fontSize={'inherit'}>
                      {t('frequency', { ns: 'taskbox' })}
                    </WBTypography>
                    {task.paymentFrequency ? (
                      <WBTypography
                        noWrap
                        fontWeight={'inherit'}
                        fontSize={'inherit'}
                        bgcolor={'background.paper'}
                        p={1}
                        px={2}
                        mt={2}
                      >
                        {t(task.paymentFrequency, { ns: 'taskbox' })}{' '}
                        {task.numberOfPayments
                          ? `(${task.numberOfPayments})`
                          : ''}
                      </WBTypography>
                    ) : null}
                  </WBBox>
                ) : null}
              </WBFlex>
              {isPayable ? (
                <WBBox
                  ml={2}
                  mt={{ xs: 3, md: 0, textAlign: { xs: 'start', md: 'end' } }}
                >
                  <WBTypography
                    textAlign={{ xs: 'start', md: 'end' }}
                    fontWeight={'inherit'}
                    textTransform={'uppercase'}
                  >
                    {t('totalAmount', { ns: 'taskbox' })}
                  </WBTypography>
                  <CurrencyNumber
                    sup={false}
                    number={task.amount ?? 0}
                    textAlign={{ xs: 'start', md: 'end' }}
                    fontSize={{ xs: 'h2.fontSize' }}
                  />
                  {isPayable && (
                    <WBFlex
                      justifyContent={{ xs: 'start', md: 'end' }}
                      width={'100%'}
                    >
                      <BreakDownContainer.Link
                        title={t('showBreakDown', {
                          ns: 'taskbox',
                        })}
                      />
                    </WBFlex>
                  )}
                </WBBox>
              ) : null}
            </WBFlex>
            <BreakDownContainer.Body>
              <WBBox mt={3}>
                <TaskBreakDownBody task={task} />
              </WBBox>
            </BreakDownContainer.Body>
            <WBBox mt={4}>
              {task?.documents?.length > 0 && <TaskPdfSignature task={task} />}
            </WBBox>
            {/* <TaskPdfSignature task={task} /> */}
          </BreakDownContainer>
        ) : (
          <WBSkeleton height={'800px'} variant="rectangular" />
        )}
      </Paper>
      {/* task.status===TaskStatus.DRAFT? */}
      {task ? (
        <>
          <TaskDraft task={task} />
          {/* :null */}
          <WBMenu
            sx={{ mt: -2 }}
            id="customized-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            {/* Todo: check if user is entity owner and bill is in status(TBC)*/}
            {isAchivable ? (
              <WBMenuItem
                onClick={handleArchiveTask}
                sx={{
                  ...theme.typography.body2,
                  fontWeight: 'bold',
                  color: 'error.main',
                }}
              >
                {t('archiveTask', { ns: 'taskbox' })}
              </WBMenuItem>
            ) : null}
            {isDownloadable && (
              <WBMenuItem
                onClick={downloadDocument}
                sx={{
                  ...theme.typography.body2,
                }}
              >
                {t('download', { ns: 'taskbox' })}
              </WBMenuItem>
            )}
            {isCreatedBy &&
              task?.paymentStatus === TaskPaymentStatus.PENDING_PAYMENT && (
                <WBMenuItem
                  onClick={handleMarkAsPaidTask}
                  sx={{
                    ...theme.typography.body2,
                  }}
                >
                  {t('markAsPaid', { ns: 'taskbox' })}
                </WBMenuItem>
              )}
          </WBMenu>
        </>
      ) : null}
    </WBFlex>
  );
}
