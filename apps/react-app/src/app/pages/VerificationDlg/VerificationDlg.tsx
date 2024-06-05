import SimpleDrawDlg from '../../components/SimpleDrawDlg/SimpleDrawDlg';
import { useSelectedEntity } from '../../hooks/useSelectedEntity/useSelectedEntity';
import {
  Entity,
  EntityType,
  OnUpdateBeneficialOwnerSubscription,
  OnUpdateEntitySubscription,
  VerificationStatus,
} from '@admiin-com/ds-graphql';
import React from 'react';
import VerificationStart from '../VerificationStart/VerificationStart';
import VerificationBusiness from '../VerificationBusiness/VerificationBusiness';
import VerificationBeneficialOwner from '../VerificationBeneficialOwner/VerificationBeneficialOwner';
import PageSelector from '../../components/PageSelector/PageSelector';
import VerificationComplete from '../VerificationComplete/VerificationComplete';
import {
  OnDataOptions,
  gql,
  useApolloClient,
  useMutation,
  useSubscription,
} from '@apollo/client';
import {
  BeneficialOwner,
  onUpdateEntity as ON_UPDATE_ENTITY,
  createVerificationToken as CREATE_VERIFICATION_TOKEN,
  onUpdateBeneficialOwner as ON_UPDATE_BENEFICIAL_OWNER,
} from '@admiin-com/ds-graphql';
import SmartUIDlg from '../../components/SmartUIDlg/SmartUIDlg';
import { useSnackbar } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { isIndividualEntity, isVerifiedEntity } from '../../helpers/entities';
import { useOneSdkForm } from '../../hooks/useOneSdkForm/useOneSdkForm';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
/* eslint-disable-next-line */
export interface VerificationDlgProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  entity: Entity;
}

type VerificationStep = 'Start' | 'Business' | 'BeneficialOwner' | 'Complete';

export function VerificationDlg({
  open,
  onClose,
  entity,
  onSuccess,
}: VerificationDlgProps) {
  const [verificationStep, setVerficationStep] =
    React.useState<VerificationStep>('Start');

  const [reset, setReset] = React.useState<boolean>(false);

  // const [selectedEntity, setSelectedEntity] = React.useState<
  //   Entity | null | undefined
  // >();
  const mode = 'legacy';

  const handleClose = () => {
    onClose();
    setReset(true);
  };

  React.useEffect(() => {
    if (open)
      if (reset) {
        setVerficationStep('Start');
        setReset(false);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  const [loadingVerification, setLoadingVerification] =
    React.useState<boolean>(false);
  // const [tokens, setTokens] = React.useState<Record<string, any>>([]);
  const [verifyingBeneficialOwner, setVerifyingBeneficialOwner] =
    React.useState<BeneficialOwner>();
  const [error, setError] = React.useState<any>('');

  const {
    verifyOwner: initForm,
    form,
    ref,
  } = useOneSdkForm({
    entity: entity,
    mode: mode,
  });

  const [verificationModal, setVerificationModal] =
    React.useState<boolean>(false);

  const verifyOwner = async (owner: BeneficialOwner) => {
    try {
      setLoadingVerification(true);
      setVerifyingBeneficialOwner(owner);
      setVerificationModal(true);
      await initForm(owner);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoadingVerification(false);
    }
  };

  const [beneficialOwners, setBeneficialOwners] = React.useState<
    Array<BeneficialOwner | null | undefined>
  >([]);

  React.useEffect(() => {
    if (entity) {
      if (entity?.entityBeneficialOwners?.items) {
        const bowners = entity?.entityBeneficialOwners?.items.map(
          (entityBeneficialOwner) => entityBeneficialOwner?.beneficialOwner
        );
        setBeneficialOwners(bowners);
      }
    }
  }, [entity]);

  const showSnackbar = useSnackbar();
  const { t } = useTranslation();
  const [subscriptionErrorCount, setSubscriptionErrorCount] = React.useState(0);
  const [init, setInit] = React.useState(false);

  const onSubscriptionError = React.useCallback((err: any) => {
    console.log('ERROR subscription: ', err);
    setInit(false);
    setTimeout(() => {
      setInit(true);
      setSubscriptionErrorCount((prev) => prev + 1);
    }, 500);
  }, []);

  const client = useApolloClient();

  React.useEffect(() => {
    setTimeout(() => {
      setInit(true);
    }, 3000);
  }, []);

  React.useEffect(() => {
    if (verificationStep === 'Complete') {
      onSuccess && onSuccess();
    }
  }, [verificationStep]);

  useSubscription(
    gql`
      ${ON_UPDATE_ENTITY}
    `,
    {
      variables: {
        entityId: entity?.id,
      },
      skip: !entity?.id || !init,
      onData: (data: OnDataOptions<OnUpdateEntitySubscription>) => {
        const onUpdateEntity = data?.data?.data?.onUpdateEntity;
        if (
          onUpdateEntity &&
          isVerifiedEntity(onUpdateEntity) &&
          !isVerifiedEntity(entity)
        ) {
          setVerficationStep('Complete');
          showSnackbar({
            title: t('entityVerifiedTitle', { ns: 'common' }),
            message: t('entityVerifiedDescription', { ns: 'common' }),
          });
          setTimeout(() => setVerificationModal(false), 0);
          client.cache.modify({
            id: client.cache.identify(entity),
            fields: {
              verficationStatus() {
                return (
                  onUpdateEntity?.verificationStatus ?? VerificationStatus.PASS
                );
              },
            },
          });
        }
        if (
          entity?.type !== EntityType.INDIVIDUAL &&
          entity?.type !== EntityType.SOLE_TRADER &&
          onUpdateEntity?.ubosCreated !== null &&
          entity?.ubosCreated === null
        ) {
          if (onUpdateEntity?.entityBeneficialOwners?.items) {
            const bowners = onUpdateEntity?.entityBeneficialOwners?.items.map(
              (entityBeneficialOwner) => entityBeneficialOwner?.beneficialOwner
            );
            setBeneficialOwners(bowners);
          }

          showSnackbar({
            title: t('entityUbosCreatedTitle', { ns: 'common' }),
            message: t('entityUbosCreatedDescription', { ns: 'common' }),
          });
          if (entity)
            client.cache.modify({
              id: client.cache.identify(entity),
              fields: {
                ubosCreated() {
                  return onUpdateEntity?.ubosCreated ?? null;
                },
              },
            });
          // setSelectedEntity(onUpdateEntity);
        }
      },
      onError: (err) => onSubscriptionError(err),
      shouldResubscribe: true,
    }
  );

  return (
    <SimpleDrawDlg open={open} handleClose={handleClose} fullWidth>
      <PageSelector current={verificationStep}>
        <PageSelector.Page value={'Start'}>
          <VerificationStart
            onSuccess={() => {
              setVerficationStep('Business');
            }}
          />
        </PageSelector.Page>
        <PageSelector.Page value={'Business'}>
          <VerificationBusiness
            entity={entity}
            onSuccess={() => {
              if (isIndividualEntity(entity)) {
                if (entity?.entityBeneficialOwners?.items?.[0]?.beneficialOwner)
                  verifyOwner(
                    entity?.entityBeneficialOwners?.items?.[0]?.beneficialOwner
                  );
                else {
                  setError({ message: 'NO_BENEFICIAL_OWNER' });
                }
              } else setVerficationStep('BeneficialOwner');
            }}
            loadingVerification={loadingVerification}
            onBack={() => {
              setVerficationStep('Start');
            }}
          />
        </PageSelector.Page>
        <PageSelector.Page value={'BeneficialOwner'}>
          <VerificationBeneficialOwner
            beneficialOwners={beneficialOwners}
            setBeneficialOwners={setBeneficialOwners}
            onVerified={(owner: BeneficialOwner) => {
              if (verifyingBeneficialOwner?.id === owner?.id) {
                setTimeout(() => setVerificationModal(false), 2000);
              }
            }}
            entity={entity}
            onBack={() => setVerficationStep('Business')}
            onSuccess={() => {
              setVerficationStep('Complete');
            }}
            loadingVerification={loadingVerification}
            verifyOwner={verifyOwner}
            onClose={() => {
              onClose();
            }}
          />
        </PageSelector.Page>
        <PageSelector.Page value={'Complete'}>
          <VerificationComplete
            onClose={() => {
              onSuccess && onSuccess();
              onClose();
            }}
          />
        </PageSelector.Page>
      </PageSelector>
      <ErrorHandler errorMessage={error?.message} isDialog />

      <SmartUIDlg
        ref={ref}
        form={form}
        mode={mode}
        open={verificationModal}
        onClose={() => setVerificationModal(false)}
      />
    </SimpleDrawDlg>
  );
}

export default VerificationDlg;
