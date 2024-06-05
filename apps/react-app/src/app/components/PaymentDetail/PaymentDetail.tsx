import { PaymentType, Task, TaskType } from '@admiin-com/ds-graphql';
import React, { useMemo } from 'react';
import PaymentInstallmentModal from '../../pages/PaymentInstallmentModal/PaymentInstallmentModal';
import { usePaymentContextDetail } from '../PaymentContainer/PaymentContainer';
import PaymentScheduleModal from '../../pages/PaymentScheduleModal/PaymentScheduleModal';
import {
  ISelectOption,
  PaymentDetailSelector,
  PaymentDetailType,
} from '../PaymentDetailSelector/PaymentDetailSelector';
import { useTranslation } from 'react-i18next';
import { useTaskProperty } from '../../hooks/useTaskProperty/useTaskProperty';
import AddPaymentMethodModal from '../AddPaymentMethodModal/AddPaymentMethodModal';
import { useTaskBoxContext } from '../../pages/TaskBox/TaskBox';
import { S3Image } from 'libs/amplify-web/src/lib/components/S3Image/S3Image';
import { gql, useQuery } from '@apollo/client';
import { CSGetSub as GET_SUB } from '@admiin-com/ds-graphql';
import { getUser } from '@admiin-com/ds-graphql';
import { getTomorrowDate } from '../../helpers/datetime';
import { maskCreditCardNumberSimple } from '@admiin-com/ds-common';

export interface PaymentDetailProps {
  task: Task | null;
  type: PaymentDetailType;
  bulkData?: Task[];
  children: React.ReactNode;
}

export function PaymentDetail({
  task,
  type,
  bulkData,
  children,
}: PaymentDetailProps) {
  const { t } = useTranslation();
  const {
    updatePayment,
    setBankPaymentMethod,
    paymentDetail,
    paymentMethods,
    paymentMethod,
    setPaymentMethod,
  } = usePaymentContextDetail(task);
  const { isListView, setSelectedSignatureKey } = useTaskBoxContext();

  const [showScheduleModal, setShowScheduleModal] =
    React.useState<boolean>(false);
  const [showInstallmentModal, setShowInstallmentModal] =
    React.useState<boolean>(false);
  const [showPaymentMethodModal, setShowPaymentMethodModal] =
    React.useState<boolean>(false);

  const { isInstallments } = useTaskProperty(task);

  const [modalType, setModalType] = React.useState<
    'CC' | 'PAY_TO_VERIFY' | 'BankAccount'
  >('CC');

  const { data: subData } = useQuery(gql(GET_SUB));
  const userId = subData?.sub;
  const { data: userData } = useQuery(gql(getUser), {
    variables: {
      id: userId,
    },
    skip: !userId,
  });

  const user = useMemo(() => userData?.getUser || {}, [userData]);

  let options: ISelectOption[] = [];
  const [value, setValue] = React.useState<any>('');

  const updatePaymentDetails = React.useCallback(
    (updatedData: any) => {
      if (task) {
        updatePayment({ task, ...updatedData });
      }
      if (bulkData) {
        bulkData.forEach((task) => {
          if (task) updatePayment({ task, ...updatedData });
        });
      }
    },
    [task, bulkData, updatePayment]
  );

  const onChange = (e: React.ChangeEvent<{ value: any }>) => {
    const value = e.target.value;

    let updatedData = {};
    switch (type) {
      case 'Type':
        if (value === PaymentType.SCHEDULED) {
          setShowScheduleModal(true);
        } else if (value === PaymentType.INSTALLMENTS) {
          setShowInstallmentModal(true);
        } else if (value === PaymentType.PAY_NOW) {
          updatedData = {
            installments: task?.numberOfPayments ?? 1,
            type: value,
            scheduledAt: new Date(),
          };
          setValue(value);
          updatePaymentDetails(updatedData);
        }
        break;
      case 'Method':
        if (value === 'newCard') {
          setModalType('CC');
          setShowPaymentMethodModal(true);
        } else if (value === 'newBank') {
          setShowPaymentMethodModal(true);
          setModalType('BankAccount');
          // setPaymentMethod(value);
        } else {
          setPaymentMethod(value);
        }
        break;
      case 'Signature':
        setValue(value);
        setSelectedSignatureKey(value);
        // TODO: Signature change handling
        break;
    }
  };

  const taskProperty = useTaskProperty(task);

  React.useEffect(() => {
    if (type === 'Type') {
      if (paymentDetail && paymentDetail.type) {
        setValue(paymentDetail.type);
      } else
        setValue(
          taskProperty?.isInstallments
            ? PaymentType.INSTALLMENTS
            : taskProperty?.isScheduled
            ? PaymentType.SCHEDULED
            : PaymentType.PAY_NOW
        );
    }
  }, [
    type,
    paymentDetail,
    taskProperty?.isInstallments,
    taskProperty?.isScheduled,
  ]);

  React.useEffect(() => {
    if (type === 'Method' && paymentMethod) {
      setValue(paymentMethod);
    }
  }, [paymentMethod, task, type, updatePayment]);

  React.useEffect(() => {
    const signatureKey = user?.signatures?.items[0]?.key;
    if (type === 'Signature' && signatureKey) {
      setValue(signatureKey);
      setSelectedSignatureKey(signatureKey);
    }
  }, [user, type]);

  switch (type) {
    case 'Signature':
      //@ts-ignore - supposed to be string
      options = user?.signatures?.items.map((item) => ({
        label: (
          <S3Image
            imgKey={item?.key}
            level={'private'}
            responsive={false}
            sx={{ maxWidth: '40px' }}
          />
        ),
        value: item?.key,
        icon: (
          <S3Image
            imgKey={item?.key}
            level={'private'}
            sx={{ maxWidth: '40px' }}
          />
        ),
      }));
      break;
    case 'Type':
      options = Object.values(PaymentType).map((type) => ({
        value: type,
        label: t(
          type === PaymentType.INSTALLMENTS &&
            (paymentDetail?.installments ?? taskProperty.totalInstallments) > 1
            ? 'installmentsCount'
            : type,
          {
            ns: 'taskbox',
            installments:
              paymentDetail?.installments ?? taskProperty.totalInstallments,
          }
        ),
        disabled:
          !task?.paymentTypes.includes(type) ||
          (type === PaymentType.SCHEDULED && isInstallments) ||
          (task.type === TaskType.SIGN_ONLY && type === PaymentType.PAY_NOW),
      }));

      break;
    case 'Method':
      options = paymentMethods;
      break;
  }

  return (
    <>
      {React.Children.map(children, (child) => {
        // Ensure child is a valid React element before cloning
        if (React.isValidElement(child)) {
          return React.cloneElement<any>(child, {
            options,
            type,
            value,
            onChange,
          });
        }
        return child;
      })}

      <AddPaymentMethodModal
        open={showPaymentMethodModal}
        onSuccess={(paymentMethod) => {
          // if (modalType === 'CC') {
          console.log(paymentMethod);
          setPaymentMethod({
            ...paymentMethod,
            label: maskCreditCardNumberSimple(
              paymentMethod?.number ?? paymentMethod?.accountNumber ?? ''
            ),
          });
          if (modalType === 'BankAccount') {
            setPaymentMethod(paymentMethod?.id);
          }
          // } else {
          // setBankPaymentMethod(paymentMethod);
          // setPaymentMethod(paymentMethod.id);
          // }
        }}
        type={modalType}
        handleClose={() => setShowPaymentMethodModal(false)}
      />

      <PaymentScheduleModal
        task={task}
        value={paymentDetail?.scheduledAt ?? taskProperty.scheduledAt}
        onSuccess={(date) =>
          updatePaymentDetails({
            type: PaymentType.SCHEDULED,
            scheduledAt: date,
            installments: task?.numberOfPayments ?? 1,
          })
        }
        open={showScheduleModal}
        handleClose={() => setShowScheduleModal(false)}
      />
      <PaymentInstallmentModal
        task={task}
        value={paymentDetail?.installments ?? taskProperty.totalInstallments}
        onSuccess={(value) =>
          updatePaymentDetails({
            type: PaymentType.INSTALLMENTS,
            installments: value,
            scheduledAt: getTomorrowDate(),
            paymentFrequency: 'MONTHLY',
          })
        }
        open={showInstallmentModal}
        handleClose={() => setShowInstallmentModal(false)}
      />
    </>
  );
}
PaymentDetail.Selector = PaymentDetailSelector;
export default PaymentDetail;
