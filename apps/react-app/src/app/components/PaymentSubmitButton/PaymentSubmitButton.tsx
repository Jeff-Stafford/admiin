import {
  PaymentFrequency,
  PaymentMethod,
  PaymentType,
  Task,
  TaskPaymentStatus,
  TaskType,
} from '@admiin-com/ds-graphql';
import {
  useSnackbar,
  WBBox,
  WBButton,
  wbLoadingButtonPulse,
  WBStack,
  WBSvgIcon,
  WBTooltip,
  WBTypography,
} from '@admiin-com/ds-web';
import { alpha, useTheme } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import AdmiinLogo from '../../../assets/icons/admiin.svg';
import {
  isPaidTask,
  isPayableTask,
  isReocurringTask,
  isTaskScheduled,
  tasksSignPayLabel,
} from '../../helpers/tasks';
import { useTaskProperty } from '../../hooks/useTaskProperty/useTaskProperty';
import AddPaymentMethodModal from '../AddPaymentMethodModal/AddPaymentMethodModal';
import {
  PaymentAPIStatus,
  PaymentDetailData,
  usePaymentContext,
  usePaymentContextDetail,
} from '../PaymentContainer/PaymentContainer';
import AddSignatureModal from '../AddSignatureModal/AddSignatureModal';
import { useTaskBoxContext } from '../../pages/TaskBox/TaskBox';
import { gql, useQuery } from '@apollo/client';
import { CSGetSub as GET_SUB } from '@admiin-com/ds-graphql';
import { getAnnotation } from '../../helpers/signature';
import ReocurringConfirmModal from '../ReocurringConfirmModal/ReocurringConfirmModal';
import { useUserSignature } from '../../hooks/useUserSignature/useUserSignature';

interface InitialSingleButtonProps {
  task: Task | null;
  tasks: Task[];
  onClick: () => void;
}

const InitialButton = ({ task, tasks, onClick }: InitialSingleButtonProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const payableTasks = task ? [task] : tasks;
  const {
    isScheduled,
    isInstallments,
    totalInstallments,
    paidInstallments,
    isPending,
    isDeclined,
    scheduledDate,
    tooltip,
  } = useTaskProperty(task);
  const hasPaid = payableTasks.some((task) => isPaidTask(task));
  const { paymentDetail, paymentDetails } = usePaymentContextDetail(task);

  const hasPayableTask = payableTasks.some(
    (task) =>
      !isPayableTask(task) ||
      (isPayableTask(task) &&
        (!isTaskScheduled(task) ||
          (isTaskScheduled(task) &&
            paymentDetails.find(
              (detail: PaymentDetailData) => detail.task.id === task?.id
            )?.type === PaymentType.PAY_NOW)))
  );

  const reOcurringTasks = payableTasks.filter((task) => isReocurringTask(task));

  const [reocurringConfirmModal, setReocurringConfirmModal] =
    React.useState<boolean>(false);

  const onSubmit = () => {
    if (reOcurringTasks.length > 0) {
      setReocurringConfirmModal(true);
      return;
    } else onClick();
  };

  const scheduledColor = isDeclined
    ? theme.palette.error.main
    : theme.palette.warning.main;

  return (
    <>
      {isPending && task ? (
        <WBTooltip
          title={t(
            task.paymentStatus === TaskPaymentStatus.PENDING_PAYID_TRANSFER
              ? 'pendingPayIDTransfer'
              : 'pendingPayToAgreement',
            { ns: 'taskbox' }
          )}
        >
          <WBButton
            sx={{
              textTransform: 'uppercase',
              px: { xs: 10, xl: 15 },
              bgcolor: 'action.disabled',
              color: 'text.primary',
              fontWeight: 'bold',
              borderRadius: '30px',
              boxShadow: {
                xs: `0 8.5px 7px -9.5px ${theme.palette.action.disabled}`,
                xl: 'none',
              },
              '&:hover': {
                bgcolor: 'action.disabled',
              },
            }}
          >
            {t(task.paymentStatus ?? '', { ns: 'taskbox' })}
          </WBButton>
        </WBTooltip>
      ) : hasPaid ? (
        <WBButton
          sx={{
            textTransform: 'uppercase',
            px: { xs: 10, xl: 15 },
            bgcolor: 'success.main',
            color: 'black',
            fontWeight: 'bold',
            borderRadius: '30px',
            boxShadow: {
              xs: `0 8.5px 7px -9.5px ${theme.palette.success.main}`,
              xl: 'none',
            },
            '&:hover': {
              bgcolor: 'success.main',
            },
          }}
        >
          {t('paid', { ns: 'taskbox' })}
        </WBButton>
      ) : task && paymentDetail?.type !== PaymentType.PAY_NOW && isScheduled ? (
        <WBTooltip title={tooltip}>
          <WBButton
            sx={{
              px: { xs: 10, xl: 10 },
              bgcolor: scheduledColor,
              color: 'black',
              borderRadius: '30px',
              boxShadow: {
                xs: `0 8.5px 7px -9.5px ${scheduledColor}`,
                xl: 'none',
              },
              '&:hover': {
                bgcolor: scheduledColor,
              },
            }}
          >
            {isInstallments ? (
              <>
                {t('installment', { ns: 'taskbox' })}
                &nbsp;
                <b>{`${paidInstallments} / ${totalInstallments}`}</b>
              </>
            ) : (
              <>
                {t(scheduledDate === 0 ? 'paymentIs' : 'paymentIn', {
                  ns: 'taskbox',
                })}
                &nbsp;
                <b>{`${
                  scheduledDate !== 0
                    ? t(scheduledDate === 1 ? 'day' : 'days', {
                        day: scheduledDate,
                        ns: 'taskbox',
                      })
                    : t('today', { ns: 'taskbox' })
                }`}</b>
              </>
            )}
          </WBButton>
        </WBTooltip>
      ) : (
        <WBButton
          sx={{
            textTransform: 'uppercase',
            px: { xs: 10, xl: 10 },
            boxShadow: {
              xs: `0 8.5px 7px -9.5px ${theme.palette.primary.main}`,
              xl: 'none',
            },
          }}
          disabled={!hasPayableTask}
          onClick={onSubmit}
        >
          <WBSvgIcon fontSize="small" sx={{ mr: 1 }}>
            <AdmiinLogo />
          </WBSvgIcon>
          {t(tasksSignPayLabel(payableTasks), { ns: 'payment' })}
        </WBButton>
      )}
      <ReocurringConfirmModal
        reOcurringTasks={reOcurringTasks}
        onConfirm={onClick}
        open={reocurringConfirmModal}
        onClose={() => setReocurringConfirmModal(false)}
      />
    </>
  );
};

interface SubmittedButtonProps {
  status: PaymentAPIStatus;
}

const SubmittedButton = ({ status }: SubmittedButtonProps) => {
  const { t } = useTranslation();
  return (
    <WBBox
      sx={{
        borderRadius: '30px',
        p: 2,
        px: 4,
        bgcolor: status !== 'PAID' ? 'warning.main' : 'success.main',
      }}
    >
      <WBStack direction={'row'} alignItems={'center'} spacing={3}>
        <WBTypography variant="body1" fontWeight={'bold'} color="black">
          {t('signed', { ns: 'taskbox' })}
        </WBTypography>
        <WBStack direction={'row'} alignItems={'center'} spacing={1.5}>
          <WBBox
            sx={{
              width: '12px',
              height: '12px',
              borderWidth: '12px',
              borderRadius: '12px',
              bgcolor:
                status === 'PAID' || status === 'SIGNED'
                  ? '#5FC53C'
                  : '#CD953C',
              border: 'solid 6px #ecad46',
              borderColor:
                status === 'PAID' || status === 'SIGNED'
                  ? '#85EC62'
                  : '#ECAD46',
              boxSizing: 'initial',
            }}
          />
          <WBBox
            sx={{
              width: '12px',
              height: '12px',
              borderRadius: '12px',
              bgcolor:
                status === 'PAID'
                  ? alpha('#5FC53C', 0.5)
                  : status === 'SIGNED'
                  ? 'common.white'
                  : alpha('#CD953C', 0.5),
              animation:
                status === 'PENDING' || status === 'SIGNED'
                  ? `${wbLoadingButtonPulse('#CD953C')} 2s 0s infinite`
                  : undefined,
            }}
          />
          <WBBox
            sx={{
              width: '12px',
              height: '12px',
              borderRadius: '12px',
              bgcolor:
                status === 'PAID'
                  ? alpha('#5FC53C', 0.5)
                  : status === 'SIGNED'
                  ? 'common.white'
                  : alpha('#CD953C', 0.5),
              animation:
                status === 'PENDING' || status === 'SIGNED'
                  ? `${wbLoadingButtonPulse('#CD953C')} 2s 0.3s infinite`
                  : undefined,
            }}
          />
          <WBBox
            sx={{
              width: '12px',
              height: '12px',
              borderRadius: '12px',
              bgcolor: alpha(status === 'PAID' ? '#5FC53C' : '#CD953C', 0.5),
              animation:
                status === 'PENDING' || status === 'SIGNED'
                  ? `${wbLoadingButtonPulse('#CD953C')} 2s 0.6s infinite`
                  : undefined,
            }}
          />
          <WBBox
            sx={{
              width: '12px',
              height: '12px',
              borderWidth: '12px',
              borderRadius: '12px',
              bgcolor: status === 'PAID' ? '#5FC53C' : '#CD953C',
              border: 'solid 6px #ecad46',
              borderColor: status === 'PAID' ? '#85EC62' : '#ECAD46',
              boxSizing: 'initial',
            }}
          />
        </WBStack>
        <WBTypography variant="body1" fontWeight={'bold'} color="black">
          {t('paid', { ns: 'taskbox' })}
        </WBTypography>
      </WBStack>
    </WBBox>
  );
};

interface PaymentSubmitButtonProps {
  tasks: Task[];
  task: Task | null;
}

const PaymentSubmitButton = ({ tasks, task }: PaymentSubmitButtonProps) => {
  const paymentContext = usePaymentContext();
  const {
    paymentAPIStatus,
    setPaymentAPIStatus,
    paymentMethod,
    setBankPaymentMethod,
    bankPaymentMethod,
    setPaymentMethod,
    taskPaymentSubmit,
    paymentSubmit,
    paymentDetails,
  } = paymentContext ?? {};
  const [addModal, setAddModal] = React.useState<boolean>(false);
  const [modalType, setModalType] = React.useState<
    'CC' | 'PAY_TO_VERIFY' | 'PAY_ID' | 'BankAccount'
  >('CC');
  const { pdfSignatureRef, selectedSignatureKey } = useTaskBoxContext();
  const { data: subData } = useQuery(gql(GET_SUB));
  const userId = subData?.sub;

  const { getSignatureBlob } = useUserSignature();

  const [showAddSignModal, setShowAddSignModal] =
    React.useState<boolean>(false);

  const handleAddPaymentMethod = (paymentMethod?: PaymentMethod) => {
    if (paymentMethod) {
      if (modalType === 'BankAccount') {
        setBankPaymentMethod(paymentMethod);
      } else setPaymentMethod(paymentMethod);
      submit();
    }
  };
  const handleModalShow = (): boolean => {
    if (
      !selectedSignatureKey &&
      tasksSignPayLabel(task ? [task] : tasks) !== TaskType.PAY_ONLY
    ) {
      setShowAddSignModal(true);
      return true;
    }
    if (!paymentMethod) {
      setModalType('CC');
      setAddModal(true);
      return true;
    } else if (typeof paymentMethod === 'string') {
      if (!bankPaymentMethod) {
        setModalType('BankAccount');
        setAddModal(true);
      }
      return true;
    }
    return false;
  };
  const submit = async () => {
    let payableTasks = task ? [task] : tasks;
    for (const payableTask of payableTasks) {
      if (
        payableTask &&
        paymentDetails.find(
          (detail: PaymentDetailData) =>
            detail.type === 'PAY_NOW' && detail.task.id === payableTask.id
        ) &&
        isTaskScheduled(payableTask)
      ) {
        await taskPaymentSubmit(payableTask);
      }
    }
    payableTasks = payableTasks.filter((task) => !isTaskScheduled(task));
    await paymentSubmit(payableTasks);
  };

  const addSignatureAndDate = (signatureAttachmentId: string) => {
    if (task?.annotations) {
      const annotationsData = JSON.parse(task?.annotations);
      const annotations = annotationsData?.annotations;
      const filteredAnnotations = annotations?.filter(
        (annotation: any) =>
          annotation?.customData?.userId === userId &&
          annotation?.customData?.status === 'PENDING' //AnnotationStatus.PENDING
      );

      filteredAnnotations.forEach((annotation: any) => {
        console.log(annotation);
        const updateAnnotation = getAnnotation(
          annotation,
          signatureAttachmentId
        );
        pdfSignatureRef.current.create(updateAnnotation);
        pdfSignatureRef.current.delete(annotation?.id);
      });
    }
  };
  const showSnackbar = useSnackbar();
  const signDocument = async (signatureKey: string) => {
    try {
      setPaymentAPIStatus('PENDING');
      const signatureBlob = await getSignatureBlob(signatureKey);
      const signatureAttachmentId =
        await pdfSignatureRef.current.createAttachment(signatureBlob);
      addSignatureAndDate(signatureAttachmentId);
      setPaymentAPIStatus('SIGNED');
    } catch (e: any) {
      showSnackbar({
        message: e?.message ?? 'Sign document failed',
        severity: 'error',
        vertical: 'bottom',
      });
      setPaymentAPIStatus('INITIAL');
    }
  };

  const handleClick = async (signatureKey = selectedSignatureKey) => {
    if (handleModalShow()) return;
    if (tasksSignPayLabel(task ? [task] : tasks) !== TaskType.PAY_ONLY)
      await signDocument(signatureKey);
    submit();
  };

  const signatureAddHandler = async (signatureKey?: string | Blob) => {
    if (signatureKey && typeof signatureKey === 'string') {
      handleClick(signatureKey);
    }
    setShowAddSignModal(false);
  };

  return (
    <>
      {paymentAPIStatus !== 'INITIAL' ? (
        <SubmittedButton status={paymentAPIStatus} />
      ) : (
        <InitialButton onClick={handleClick} task={task} tasks={tasks} />
      )}
      <AddPaymentMethodModal
        open={addModal}
        type={modalType}
        handleClose={() => setAddModal(false)}
        onSuccess={handleAddPaymentMethod}
      />
      {showAddSignModal && (
        <AddSignatureModal
          open={showAddSignModal}
          handleClose={() => setShowAddSignModal(false)}
          handleSave={signatureAddHandler}
        />
      )}
    </>
  );
};

export default PaymentSubmitButton;
