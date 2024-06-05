import {
  PaymentMethod,
  PaymentType,
  Task,
  retryPayment as RETRY_PAYMENT,
  Payment,
  PaymentMethodStatus,
  PaymentMethodType,
  PayToAgreement,
  getTask,
  tasksByEntityTo,
  PaymentFrequency,
  TaskType,
} from '@admiin-com/ds-graphql';
import React from 'react';
import {
  useCurrentEntityId,
  useSelectedEntity,
} from '../../hooks/useSelectedEntity/useSelectedEntity';
import {
  createPayment as CREATE_PAYMENT,
  createTaskPayment as CREATE_TASK_PAYMENT,
} from '@admiin-com/ds-graphql';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  backendDateFromUnixSeconds,
  maskCreditCardNumberSimple,
} from '@admiin-com/ds-common';
import { useSnackbar } from '@admiin-com/ds-web';

import {
  createPayToAgreement as CREATE_PAY_TO_AGREEMENT,
  createPaymentPayId as CREATE_PAYMENT_PAYID,
} from '@admiin-com/ds-graphql';
import PaymentSubmitButton from '../PaymentSubmitButton/PaymentSubmitButton';
import { calculateFee } from '../../helpers/tasks';

export interface PaymentContainerProps {
  children: React.ReactNode;
}

export type PaymentDetailData = {
  task: Task;
  scheduledAt?: Date;
  id: string;
  installments?: number;
  type?: PaymentType;
  paymentFrequency?: PaymentFrequency;
};

const PaymentContext = React.createContext<any>(null);

export type PaymentAPIStatus = 'INITIAL' | 'PENDING' | 'SIGNED' | 'PAID';

export function PaymentContainer({ children }: PaymentContainerProps) {
  const [paymentDetails, setPaymentDetails] = React.useState<
    Array<PaymentDetailData>
  >([]);
  const [paymentMethod, setPaymentMethod] = React.useState<
    PaymentMethod | null | undefined | string
  >(null);
  const [bankPaymentMethod, setBankPaymentMethod] = React.useState<
    PaymentMethod | null | undefined
  >(null);

  const [paymentAPIStatus, setPaymentAPIStatus] =
    React.useState<PaymentAPIStatus>('INITIAL');

  const { entity } = useSelectedEntity();
  const paymentMethods = React.useMemo(
    () =>
      entity?.paymentMethods?.items
        ?.filter(
          (method) =>
            method?.status === PaymentMethodStatus.ACTIVE &&
            (method?.paymentMethodType === PaymentMethodType.CARD ||
              method?.paymentMethodType === PaymentMethodType.BANK ||
              method?.paymentMethodType === PaymentMethodType.PAYID ||
              method?.paymentMethodType === PaymentMethodType.PAYTO)
        )
        ?.map((method) => ({
          ...method,
          value: method,
          label:
            maskCreditCardNumberSimple(
              method?.number ?? method?.accountNumber ?? ''
            ) ?? '',
        })) ?? [],
    [entity]
  );
  const showSnackbar = useSnackbar();
  const [createPayment] = useMutation(gql(CREATE_PAYMENT));
  const [retryPayment] = useMutation(gql(RETRY_PAYMENT));
  const [createPayToAgreement] = useMutation(gql(CREATE_PAY_TO_AGREEMENT));
  const [createPaymentPayId] = useMutation(gql(CREATE_PAYMENT_PAYID));

  const { startPolling: startPollingComplete } = useQuery(
    gql(tasksByEntityTo),
    {
      variables: {
        entityId: entity?.id,
        status: 'COMPLETED',
      },
      pollInterval: 0,
    }
  );
  const { startPolling: startPollingInComplete } = useQuery(
    gql(tasksByEntityTo),
    {
      variables: {
        entityId: entity?.id,
        status: 'INCOMPLETE',
      },
      pollInterval: 0,
    }
  );

  const paymentMethodId =
    typeof paymentMethod === 'string'
      ? bankPaymentMethod?.id
      : paymentMethod?.id;

  const updatePayment = React.useCallback(
    async (paymentData: PaymentDetailData) => {
      setPaymentDetails((payments) =>
        payments.map((payment) =>
          payment.task.id === paymentData?.task?.id
            ? { ...payment, ...paymentData }
            : payment
        )
      );
      if (
        !paymentDetails.find(
          (payment) => payment.task.id === paymentData?.task?.id
        )
      ) {
        setPaymentDetails(paymentDetails.concat(paymentData));
      }
    },
    [paymentDetails, setPaymentDetails]
  );

  React.useEffect(() => {
    if (
      entity?.paymentMethods?.items &&
      entity?.paymentMethods?.items.length > 0
    ) {
      setPaymentMethod(
        entity?.paymentMethods?.items?.find(
          (item) => item?.id === entity?.paymentMethodId
        ) ?? entity?.paymentMethods?.items?.[0]
      );
    }
  }, [entity?.paymentMethodId, entity?.paymentMethods?.items]);

  // const signSubmit = () => {
  //   return new Promise((resolve, reject) =>
  //     setTimeout(() => {
  //       setPaymentAPIStatus('SIGNED');
  //       resolve('resolved');
  //     }, 1000)
  //   );
  // };

  // const signPay = async () => {
  //   setPaymentAPIStatus('PENDING');
  //   await signSubmit();
  // };

  const retryFailedPayment = async (payment: Payment) => {
    setPaymentAPIStatus('PENDING');
    setPaymentAPIStatus('SIGNED');
    try {
      if (paymentMethod && typeof paymentMethod !== 'string')
        await retryPayment({
          variables: {
            input: { id: payment.id, paymentMethodId: paymentMethodId },
          },
          refetchQueries: [
            {
              query: gql(tasksByEntityTo),
              variables: {
                entityId: entityId,
                status: 'INCOMPLETE',
              },
            },
          ],
        });
      setPaymentAPIStatus('INITIAL');
    } catch (error: any) {
      showSnackbar({
        message: error?.message ?? 'Create payment failed',
        severity: 'error',
        vertical: 'bottom',
      });
      setPaymentAPIStatus('INITIAL');
    }
  };

  const getBillPayments = (tasks: Task[]) => {
    return tasks
      .map((task: Task) => getUpdatedBillPaymenet(task))
      .map((payment: PaymentDetailData) => {
        return {
          id: payment.id,
          installments: payment.installments,
          paymentType: payment.type,
          paymentFrequency: payment.paymentFrequency,
          scheduledAt: backendDateFromUnixSeconds(
            (payment?.scheduledAt ?? new Date()).getTime() / 1000
          ),
        };
      });
  };

  const getUpdatedBillPaymenet = (task: Task) => {
    return {
      id: task.id,
      type: PaymentType.PAY_NOW,
      scheduledAt: new Date(),
      paymentFrequency: task.paymentFrequency,
      installments: task?.numberOfPayments ?? 1,
      ...paymentDetails.find(
        (paymentDetail) => paymentDetail.task.id === task?.id
      ),
    } as PaymentDetailData;
  };

  const entityId = useCurrentEntityId();

  const createPayId = async (tasks: Task[]) => {
    setPaymentAPIStatus('SIGNED');

    try {
      await createPaymentPayId({
        variables: {
          input: {
            entityId,
            billPayments: getBillPayments(tasks),
          },
        },
        refetchQueries: [
          {
            query: gql(tasksByEntityTo),
            variables: {
              entityId: entityId,
              status: 'INCOMPLETE',
            },
          },
        ],
      });
      setPaymentAPIStatus('PAID');
    } catch (error: any) {
      showSnackbar({
        message: error?.message ?? 'Create payment failed',
        severity: 'error',
        vertical: 'bottom',
      });
      setPaymentAPIStatus('INITIAL');
    }
  };

  const createPayTo = async (agreements: PayToAgreement[], tasks: Task[]) => {
    setPaymentAPIStatus('SIGNED');
    try {
      await createPayToAgreement({
        variables: {
          input: {
            agreementUuids: agreements.map(
              (agreement) => agreement.agreementUuid
            ),
            billPayments: getBillPayments(tasks),
          },
        },
        refetchQueries: [
          {
            query: gql(tasksByEntityTo),
            variables: {
              entityId: entityId,
              status: 'INCOMPLETE',
            },
          },
        ],
      });
      startPollingComplete(3000);
      startPollingInComplete(3000);
      setPaymentAPIStatus('PAID');
    } catch (error: any) {
      showSnackbar({
        message: error?.message ?? 'Create payment failed',
        severity: 'error',
        vertical: 'bottom',
      });
      setPaymentAPIStatus('INITIAL');
    }
  };

  const paymentSubmit = React.useCallback(
    async (tasks: Task[]) => {
      if (!paymentMethod || typeof paymentMethod === 'string') return;
      tasks = tasks.filter((task) => task.type !== TaskType.SIGN_ONLY);
      if (tasks.length === 0) return;

      setPaymentAPIStatus('SIGNED');
      if (entity) {
        const billPayments = getBillPayments(tasks);

        try {
          await createPayment({
            variables: {
              input: {
                entityId: entity.id,
                paymentMethodId: paymentMethodId,
                billPayments,
              },
            },
            refetchQueries: [
              {
                query: gql(tasksByEntityTo),
                variables: {
                  entityId: entity.id,
                  status: 'INCOMPLETE',
                },
              },
              ...(tasks.length === 1
                ? [
                    {
                      query: gql(getTask),
                      variables: {
                        id: tasks[0].id,
                        entityId: entity.id,
                      },
                    },
                  ]
                : []),
            ],
          });
          setPaymentAPIStatus('PAID');
        } catch (error: any) {
          showSnackbar({
            message: error?.message ?? 'Create payment failed',
            severity: 'error',
            vertical: 'bottom',
          });

          setPaymentAPIStatus('INITIAL');
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [entity, paymentDetails, createPayment, paymentMethod, showSnackbar]
  );

  const [createTaskPayment] = useMutation(gql(CREATE_TASK_PAYMENT));
  const taskPaymentSubmit = async (task: Task) => {
    setPaymentAPIStatus('PENDING');
    setPaymentAPIStatus('SIGNED');

    try {
      await createTaskPayment({
        variables: {
          input: {
            taskId: task?.id,
            entityId: entity?.id,
            paymentMethodId: paymentMethodId,
          },
        },
        refetchQueries: [
          {
            query: gql(tasksByEntityTo),
            variables: {
              entityId: entity?.id,
              status: 'INCOMPLETE',
            },
          },
          {
            query: gql(getTask),
            variables: {
              id: task?.id,
              entityId: entity?.id,
            },
          },
        ],
      });
      setPaymentAPIStatus('PAID');
    } catch (error: any) {
      showSnackbar({
        message: error?.message ?? 'Create payment failed',
        severity: 'error',
        vertical: 'bottom',
      });
      setPaymentAPIStatus('INITIAL');
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        paymentDetails,
        taskPaymentSubmit,
        paymentMethod,
        paymentMethods,
        createPayTo,
        createPayId,
        setPaymentMethod,
        retryPayment: retryFailedPayment,
        paymentSubmit,
        bankPaymentMethod,
        setBankPaymentMethod,
        setPaymentAPIStatus,
        paymentAPIStatus,
        updatePayment,
        getBillPayments,
        setPaymentDetails,
        paymentMethodId,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

PaymentContainer.SubmittButton = PaymentSubmitButton;

export const usePaymentContext = () => {
  const context = React.useContext(PaymentContext);
  const getFees = React.useCallback(
    (tasks: Task[], paymentMethodType?: PaymentMethodType) => {
      const fees = calculateFee(
        tasks,
        paymentMethodType ??
          (!context?.paymentMethod || typeof context?.paymentMethod === 'string'
            ? undefined
            : context?.paymentMethod.paymentMethodType)
      );
      return fees;
    },
    [context?.paymentMethod]
  );
  return { getFees, ...(context ?? {}) };
};

export const usePaymentContextDetail = (task: Task | null) => {
  const context = React.useContext(PaymentContext);

  const paymentDetail = React.useMemo(
    () =>
      context.paymentDetails?.find(
        (payment: PaymentDetailData) => payment?.task?.id === task?.id
      ),
    [context.paymentDetails, task?.id]
  );

  return { ...context, paymentDetail };
};

export default PaymentContainer;
