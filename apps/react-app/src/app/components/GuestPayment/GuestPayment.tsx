import {
  getTaskGuest as GET_TASK_GUEST,
  PaymentMethod,
  TaskGuest,
  createPaymentGuest as CREATE_PAYMENT_GUEST,
  TaskType,
  updateTaskGuest as UPDATE_TASK_GUEST,
  TaskPaymentStatus,
  TaskSignatureStatus,
  Task,
  getPaymentGuest as GET_PAYMENT_GUEST,
  PaymentGuest,
  createPaymentScheduledGuest as CREATE_SCHEDULED_PAYMENT_GUEST,
} from '@admiin-com/ds-graphql';
import {
  WBBox,
  WBContainer,
  WBFlex,
  WBLink,
  WBSkeleton,
  WBStack,
  WBTypography,
  useTheme,
} from '@admiin-com/ds-web';
import { gql, useMutation, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import TaskSummaryCard from '../TaskSummaryCard/TaskSummaryCard';
import { CCForm } from '../HostedFields/CCForm';
import CreditCardIcons from '../../../assets/icons/creditcards.svg';
import { CSIsLoggedIn as IS_LOGGED_IN } from '@admiin-com/ds-graphql';
import React, { useRef } from 'react';
import { useClientContext } from '../ApolloClientProvider/ApolloClientProvider';
import AdmiinLogo from '../AdmiinLogo/AdmiinLogo';
import ErrorHandler from '../ErrorHandler/ErrorHandler';
import AddSignatureModal from '../AddSignatureModal/AddSignatureModal';
import { getAnnotation } from '../../helpers/signature';
import { TaskBoxContext } from '../../pages/TaskBox/TaskBox';
import { tasksSignPayLabel } from '../../helpers/tasks';

/* eslint-disable-next-line */
export interface GuestPaymentProps {}

const StyledGuestPayment = styled.div`
  color: pink;
  background: linear-gradient(
    to bottom,
    rgba(140, 81, 255, 0.7) 0%,
    transparent 50%
  );
  height: 100%;
`;

export function GuestPayment(props: GuestPaymentProps) {
  const { t } = useTranslation();
  const { clientType, setClientType } = useClientContext();
  const { data: loggedInData } = useQuery(gql(IS_LOGGED_IN));
  const isLoggedIn = React.useMemo(
    () => loggedInData?.isLoggedIn || false,
    [loggedInData]
  );
  React.useEffect(() => {
    if (!isLoggedIn && clientType === 'userPool') {
      setClientType('iam');
    } else if (isLoggedIn && clientType === 'iam') setClientType('userPool');
  }, [isLoggedIn, clientType, setClientType]);

  const [searchParams] = useSearchParams();
  const entityId = searchParams.get('entityId');
  const taskId = searchParams.get('taskId');
  const paymentId = searchParams.get('paymentId');
  const {
    data: paymentGuestData,
    loading: paymentLoading,
    error: paymentError,
  } = useQuery(gql(GET_PAYMENT_GUEST), {
    variables: {
      id: paymentId,
    },
    notifyOnNetworkStatusChange: true,
    skip: !paymentId,
  });

  const paymentGuest: PaymentGuest | undefined =
    paymentGuestData?.getPaymentGuest;

  const {
    data: taskGuestData,
    loading,
    error,
  } = useQuery(gql(GET_TASK_GUEST), {
    variables: {
      id: taskId ?? paymentGuest?.taskId,
      entityId: entityId ?? paymentGuest?.entityId,
    },
    notifyOnNetworkStatusChange: true,
    skip:
      (!taskId && !paymentGuest) ||
      (!entityId && !paymentGuest) ||
      (!isLoggedIn && clientType === 'userPool'),
  });
  const taskGuest: TaskGuest | undefined = taskGuestData?.getTaskGuest;

  const updatePaidSignedStatus = async (task: any) => {
    if (
      (task?.paymentStatus === 'PAID' && task?.type === TaskType.PAY_ONLY) ||
      (task?.paymentStatus === 'PAID' &&
        task?.type === TaskType.SIGN_PAY &&
        task?.signatureStatus === TaskSignatureStatus.SIGNED) ||
      (task?.type === TaskType.SIGN_ONLY &&
        task?.signatureStatus === TaskSignatureStatus.SIGNED)
    ) {
      setIsPaid(true);
    }
  };
  React.useEffect(() => {
    updatePaidSignedStatus(taskGuest);
  }, [taskGuest]);

  const theme = useTheme();
  const [createPaymentGuest] = useMutation(gql(CREATE_PAYMENT_GUEST));
  const [createPaymentScheduledGuest] = useMutation(
    gql(CREATE_SCHEDULED_PAYMENT_GUEST)
  );
  const [paid, setIsPaid] = React.useState(false);
  const [showAddSignModal, setShowAddSignModal] =
    React.useState<boolean>(false);
  const pdfSignatureRef = useRef<any>(null);

  const addSignatureAndDate = (signatureAttachmentId: string) => {
    if (taskGuest?.annotations) {
      const annotationsData = JSON.parse(taskGuest?.annotations);
      const annotations = annotationsData?.annotations;
      console.log(annotations);
      const filteredAnnotations = annotations?.filter(
        (annotation: any) =>
          annotation?.customData?.status === 'PENDING' &&
          annotation?.customData?.userId === 'undefined'
      );

      filteredAnnotations.forEach((annotation: any) => {
        const updateAnnotation = getAnnotation(
          annotation,
          signatureAttachmentId
        );
        if (pdfSignatureRef.current) {
          pdfSignatureRef.current.create(updateAnnotation);
          pdfSignatureRef.current.delete(annotation?.id);
        }
      });
    }
  };

  const getAnnotationData = async () => {
    const allAnnotations = await Promise.all(
      Array.from({ length: pdfSignatureRef.current?.totalPageCount }).map(
        (_, pageIndex) => pdfSignatureRef.current.getAnnotations(pageIndex)
      )
    );

    const flattenedAnnotations = allAnnotations.flat();
    const instantJSON = await pdfSignatureRef.current.exportInstantJSON(
      flattenedAnnotations
    );
    return JSON.stringify(instantJSON);
  };
  const [updateTaskGuest] = useMutation(gql(UPDATE_TASK_GUEST));
  const taskAction = tasksSignPayLabel([taskGuest as any]);
  const updateAnnotations = async () => {
    const annotations = await getAnnotationData();
    if (taskGuest) {
      const updateTaskData: any = await updateTaskGuest({
        variables: {
          input: {
            id: taskGuest.id,
            entityId: taskGuest.entityId,
            annotations: annotations,
          },
        },
      });
      const updatedTask: Task = updateTaskData.data?.updateTaskGuest;
      if (updatedTask.signatureStatus === TaskSignatureStatus.SIGNED) {
        updatePaidSignedStatus(updatedTask);
      }
    }
  };

  const signDocument = async () => {
    await updateAnnotations();
  };

  const [signatureBlob, setSignatureBlob] = React.useState<Blob>();

  const signatureAddHandler = async (signatureBlob?: string | Blob) => {
    setShowAddSignModal(false);
    if (signatureBlob && typeof signatureBlob !== 'string') {
      setSignatureBlob(signatureBlob);
      if (pdfSignatureRef.current) {
        const signatureAttachmentId =
          await pdfSignatureRef.current.createAttachment(signatureBlob);
        await addSignatureAndDate(signatureAttachmentId);
      }
    }
  };

  const submitInvoice = async (paymentMethod: PaymentMethod | string) => {
    let paymentMethodId = '';
    if (typeof paymentMethod === 'string') {
      paymentMethodId = paymentMethod;
    } else paymentMethodId = paymentMethod.id;

    if (!paymentId)
      await createPaymentGuest({
        variables: {
          input: {
            entityId,
            taskId,
            paymentMethodId,
          },
        },
      });
    else {
      await createPaymentScheduledGuest({
        variables: {
          input: {
            paymentId,
            paymentMethodId,
          },
        },
      });
    }
    setIsPaid(true);
  };

  return (
    <StyledGuestPayment>
      <WBContainer>
        <WBBox py={8} width={'100%'}>
          <WBFlex justifyContent={'center'} alignContent={'center'}>
            <WBTypography variant="h4" fontWeight="bold" mb={0}>
              {t('paymentDueTitle', {
                ns: 'payment',
                invoice: taskGuest?.reference,
              })}
            </WBTypography>
          </WBFlex>
          <WBFlex
            mt={9}
            width={'100%'}
            flexDirection={{ xs: 'column', md: 'row' }}
          >
            <WBFlex flex={[7]} mr={[0, 0, 5]}>
              {!loading && taskGuest ? (
                <TaskBoxContext.Provider value={{ pdfSignatureRef }}>
                  <TaskSummaryCard task={taskGuest} isGuest />
                </TaskBoxContext.Provider>
              ) : (
                <WBSkeleton
                  variant="rectangular"
                  width={'509px'}
                  height={'630px'}
                />
              )}
            </WBFlex>
            <WBFlex
              flex={5}
              mt={[5, 5, 0]}
              ml={[0, 0, 5]}
              flexDirection={'column'}
              justifyContent={'space-between'}
            >
              {!loading && taskGuest ? (
                <>
                  <WBBox
                    p={5}
                    sx={{
                      boxShadow: theme.shadows[6],
                      bgcolor: 'background.default',
                    }}
                  >
                    <WBFlex
                      justifyContent={'center'}
                      mb={7}
                      mt={3}
                      alignItems={'center'}
                    >
                      <AdmiinLogo />
                    </WBFlex>
                    <CCForm
                      isGuest
                      entityId={entityId ?? ''}
                      taskId={taskId ?? ''}
                      onSubmit={async () => {
                        if (
                          !signatureBlob &&
                          taskAction !== TaskType.PAY_ONLY
                        ) {
                          setShowAddSignModal(true);
                          return false;
                        } else if (taskAction !== TaskType.PAY_ONLY) {
                          await signDocument();
                          if (taskAction === TaskType.SIGN_ONLY) return false;
                        }
                        return true;
                      }}
                      onSuccess={submitInvoice}
                      paid={paid}
                      submitButtonText={
                        paid
                          ? t(
                              taskGuest?.paymentStatus ===
                                TaskPaymentStatus.PAID &&
                                taskGuest?.signatureStatus !==
                                  TaskSignatureStatus.SIGNED
                                ? 'invoicePaid'
                                : taskGuest?.paymentStatus !==
                                    TaskPaymentStatus.PAID &&
                                  taskGuest?.signatureStatus ===
                                    TaskSignatureStatus.SIGNED
                                ? 'documentSigned'
                                : taskGuest?.paymentStatus ===
                                    TaskPaymentStatus.PAID &&
                                  taskGuest?.signatureStatus ===
                                    TaskSignatureStatus.SIGNED
                                ? 'invoicePaid&Signed'
                                : '',
                              { ns: 'payment' }
                            )
                          : t(
                              taskAction === TaskType.PAY_ONLY
                                ? 'payInvoice'
                                : taskAction === TaskType.SIGN_ONLY
                                ? 'signDocument'
                                : taskAction === TaskType.SIGN_PAY
                                ? 'sign&PayDocument'
                                : '',
                              { ns: 'payment' }
                            )
                      }
                    />
                  </WBBox>
                  <WBFlex
                    justifyContent={'end'}
                    alignItems="center"
                    flexDirection={'column'}
                    flexGrow={1}
                  >
                    <WBStack direction={'row'} spacing={2} mb={2}>
                      {/*@ts-ignore */}
                      <CreditCardIcons width="170px" height="50px" />
                      {/* <CreditCardIcon type={'visa'} width={100} height={50} />
                  <CreditCardIcon type={'mastercard'} />
                  <CreditCardIcon type={'american_express'} /> */}
                    </WBStack>
                    <WBTypography>
                      {t('needHelp', { ns: 'common' })}{' '}
                      <WBLink
                        to={'mailto:support@admiin.com'}
                        underline="always"
                      >
                        support@admiin.com
                      </WBLink>
                    </WBTypography>
                  </WBFlex>
                </>
              ) : (
                <WBSkeleton
                  width={'100%'}
                  height={'100%'}
                  variant="rectangular"
                ></WBSkeleton>
              )}
            </WBFlex>
          </WBFlex>
        </WBBox>
      </WBContainer>
      <ErrorHandler isDialog errorMessage={error?.message} />
      {showAddSignModal && (
        <AddSignatureModal
          open={showAddSignModal}
          handleClose={() => setShowAddSignModal(false)}
          handleSave={signatureAddHandler}
          isGuest
        />
      )}
    </StyledGuestPayment>
  );
}

export default GuestPayment;
