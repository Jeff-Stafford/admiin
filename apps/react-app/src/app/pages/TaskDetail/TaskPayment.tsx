// Importing necessary libraries and components
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Theme,
  WBBox,
  WBFlex,
  WBLink,
  WBStack,
  WBTypography,
  useTheme,
  wbGlow,
} from '@admiin-com/ds-web';
import {
  PaymentType,
  Task,
  TaskPaymentStatus,
  TaskType,
} from '@admiin-com/ds-graphql';
import PaymentContainer, {
  usePaymentContext,
  usePaymentContextDetail,
} from '../../components/PaymentContainer/PaymentContainer';
import { PaymentDetail } from '../../components/PaymentDetail/PaymentDetail';
import { useTaskBoxContext } from '../TaskBox/TaskBox';
import { CurrencyNumber } from '../../components/CurrencyNumber/CurrencyNumber';
import { useTaskProperty } from '../../hooks/useTaskProperty/useTaskProperty';
import {
  isPaidTask,
  isPayableTask,
  tasksSignPayLabel,
} from '../../helpers/tasks';
import TaskBreakDownModal from '../../components/TaskBreakDownModal/TaskBreakDownModal';

// TaskPayment component refactored with TypeScript

export const TaskPayment: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { selectedTask: task, multiShow, selectedTasks } = useTaskBoxContext();
  const paymentContext = usePaymentContext();
  const [showBreakDownModal, setShowBreakDownModal] = React.useState(false);
  React.useEffect(() => {
    paymentContext?.setPaymentAPIStatus('INITIAL');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTasks, paymentContext?.setPaymentAPIStatus, task]);

  const payableTasks = (task ? [task] : selectedTasks).filter((task: Task) =>
    isPayableTask(task)
  );
  const totalPayment = payableTasks.reduce(
    (total: number, task: Task) => total + (task?.amount ?? 0),
    0
  );
  const hasPayable = payableTasks.length > 0;

  const isPaid: boolean =
    hasPayable && payableTasks.every((task: Task) => isPaidTask(task));

  const submitButton = (
    <PaymentContainer.SubmittButton tasks={selectedTasks} task={task} />
  );
  const taskProperty = useTaskProperty(task);
  const isSignOnly = tasksSignPayLabel(payableTasks) === TaskType.SIGN_ONLY;
  const { paymentDetail } = usePaymentContextDetail(task);
  if (!paymentContext) return null;
  const { paymentAPIStatus } = paymentContext;

  return (
    <WBFlex
      mx={{ xs: -4, md: -6, lg: -8 }}
      sx={{
        justifyContent: 'flex-end',
        flexDirection: 'column',
        flexGrow: 1,
        position: 'sticky',
        zIndex: (theme: Theme) => theme.zIndex.drawer + 2,
        bottom: 0,
        left: 0,
      }}
    >
      <WBFlex
        display={{ xs: 'flex', xl: 'none' }}
        justifyContent="center"
        width="100%"
        mb={3}
      >
        {submitButton}
      </WBFlex>
      <WBFlex
        flexDirection={'column'}
        justifyContent={{ xs: 'center', xl: 'end' }}
        sx={{
          bgcolor: 'common.black',
          ...((paymentAPIStatus !== 'INITIAL' || isPaid) && {
            boxShadow: ` 0 4px 77px 42.5px ${
              paymentAPIStatus === 'PAID' || isPaid
                ? theme.palette.success.main
                : theme.palette.warning.main
            }`,
          }),
          animation:
            paymentAPIStatus === 'PENDING'
              ? `${wbGlow(theme.palette.warning.main)} 2s infinite`
              : undefined,
          justifyContent: 'center',
          alignItems: 'center',
          px: { xs: 0, xl: 3 },
          py: 2,
        }}
      >
        {hasPayable ? (
          // {multiShow ? (
          <WBFlex
            width={'100%'}
            alignItems={{ xs: 'center', xl: 'end' }}
            mb={2}
            flexDirection={{ xs: 'column' }}
          >
            <WBFlex
              width={'100%'}
              flexDirection={{ xs: 'column', xl: 'row' }}
              justifyContent={{ xs: 'center', xl: 'end' }}
              alignItems={{ xs: 'center' }}
            >
              <WBTypography
                fontWeight={'medium'}
                mr={2}
                sx={{ textTransform: 'uppercase' }}
                color={'white'}
              >
                {t('totalPaymentAmount', {
                  ns: 'taskbox',
                  count: payableTasks.length,
                })}
              </WBTypography>
              <CurrencyNumber
                sup={false}
                number={totalPayment}
                color={'common.white'}
                fontSize={'h2.fontSize'}
              />
            </WBFlex>
            <WBFlex justifyContent={'end'}>
              <WBLink
                color={'text.primary'}
                underline="always"
                component={'button'}
                onClick={() => setShowBreakDownModal(true)}
              >
                {t('showBreakdown', { ns: 'taskbox' })}
              </WBLink>
            </WBFlex>
          </WBFlex>
        ) : null}
        {taskProperty.isInstallments && !taskProperty.isPaid ? (
          <WBFlex
            justifyContent={{ xs: 'center', xl: 'end' }}
            width={'100%'}
            alignItems={'center'}
            mb={2}
            flexDirection={{ xs: 'column', xl: 'row' }}
          >
            <WBTypography
              fontWeight={'medium'}
              mr={2}
              sx={{ textTransform: 'uppercase' }}
              color={'common.white'}
            >
              {t('remainingAmount', {
                ns: 'taskbox',
              })}
            </WBTypography>
            <CurrencyNumber
              sup={false}
              color={'common.white'}
              number={(taskProperty?.remainedAmount ?? 0) / 100}
              fontSize={'h2.fontSize'}
            />
          </WBFlex>
        ) : null}
        <WBFlex
          flexDirection={'row'}
          width={'100%'}
          justifyContent={{ xs: 'center', xl: 'space-between' }}
        >
          <WBStack
            spacing={{ xs: 1, sm: 2 }}
            alignItems={'center'}
            direction={'row'}
          >
            <PaymentDetail task={task} type="Method">
              <PaymentDetail.Selector
                fontColor="common.white"
                fontWeight="medium"
                disabled={
                  isSignOnly ||
                  isPaid ||
                  (paymentDetail?.type !== PaymentType.PAY_NOW &&
                    taskProperty?.isScheduled)
                }
              />
            </PaymentDetail>

            <PaymentDetail task={task} type="Signature">
              <PaymentDetail.Selector
                fontColor="common.white"
                fontWeight="medium"
                disabled={isPaid || taskProperty?.isScheduled}
              />
            </PaymentDetail>

            {multiShow ? null : (
              <PaymentDetail task={task} type="Type">
                <PaymentDetail.Selector
                  fontColor="common.white"
                  fontWeight="medium"
                  disabled={isPaid || isSignOnly}
                />
              </PaymentDetail>
            )}
          </WBStack>
          <WBFlex
            display={{ xs: 'none', xl: 'flex' }}
            ml={2}
            alignItems={'end'}
          >
            {submitButton}
          </WBFlex>
        </WBFlex>
      </WBFlex>
      <TaskBreakDownModal
        tasks={payableTasks}
        open={showBreakDownModal}
        onClose={() => setShowBreakDownModal(false)}
      />
    </WBFlex>
  );
};
