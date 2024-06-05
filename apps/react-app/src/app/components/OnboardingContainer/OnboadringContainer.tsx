import React, { useEffect, useMemo } from 'react';

import { Entity, User, selectedEntityIdInVar } from '@admiin-com/ds-graphql';
import { CSGetSub as GET_SUB, OnboardingStatus } from '@admiin-com/ds-graphql';
import {
  updateUser as UPDATE_USER,
  getUser as GET_USER,
  createEntity as CREATE_ENTITY,
  entityUsersByUser as ENTITY_USERS_BY_USER,
  getEntity as GET_ENTITY,
} from '@admiin-com/ds-graphql';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { getOnboardingPath } from '../../helpers/onboarding';
import {
  getNextOnboardingStep,
  getPrevOnboardingStep,
} from '@admiin-com/ds-common';
import { PATHS } from '../../navigation/paths';

export enum OnboardingBusinessStep {
  ADD_BUSINESS = 'add-business',
  BUSINESS_ADDRESS = 'business-address',
  BUSINESS_LOGO = 'business-logo',
}
export const onBoardingBusinessSteps = Object.values(OnboardingBusinessStep);

export const OnboardingProcessContext = React.createContext<any>(null);

interface BusinessProcessProviderProps {
  children: React.ReactNode;
  isDialog?: boolean;
  onFinal?: () => void;
}
export const BusinessProcessProvider = ({
  isDialog = false,
  children,
  onFinal,
}: BusinessProcessProviderProps) => {
  const { data: subData, loading: loadingSub } = useQuery(gql(GET_SUB));
  const { data: userData, loading: loadingUser } = useQuery(gql(GET_USER), {
    variables: {
      id: subData?.sub,
    },
    skip: !subData || !subData?.sub,
  });
  const sub = subData?.sub;
  const user: User = useMemo(() => userData?.getUser || {}, [userData]);

  const currentOnboardingStatus = user.onboardingStatus;
  const { data: entityData, loading: loadingEntity } = useQuery(
    gql(GET_ENTITY),
    {
      variables: {
        id: user.onboardingEntity,
      },
      skip:
        !user.onboardingEntity ||
        currentOnboardingStatus !== OnboardingStatus.BUSINESS,
    }
  );

  const [updateUser, { error: updateUserError, loading: updatingUser }] =
    useMutation(gql(UPDATE_USER));

  const [createEntity, { error: createEntityError }] = useMutation(
    gql(CREATE_ENTITY),
    {
      // update: (cache, { data: { createEntity } }) => {
      //   // Define the variables used in the GET_CONTACT query
      //   const variables = {
      //     filter: {
      //       owner: { eq: sub },
      //     },
      //   };
      //   // Read the current data from the cache for the GET_CONTACT query
      //   const entitiesData = cache.readQuery<{
      //     listEntities: { items: Entity[] };
      //   }>({
      //     query: gql(LIST_ENTITIES),
      //     variables: variables,
      //   });
      //   console.log(createEntity, entitiesData);
      //   const entities = entitiesData?.listEntities.items || [];
      //   // Update the cache with the new contact data
      //   cache.writeQuery({
      //     query: gql(LIST_ENTITIES),
      //     variables,
      //     data: {
      //       listEntities: {
      //         ...entitiesData?.listEntities,
      //         items: [createEntity, ...entities],
      //       },
      //     },
      //   });
      // },
      refetchQueries: [gql(ENTITY_USERS_BY_USER)],
    }
  );

  const navigate = useNavigate();
  // useEffect(() => {
  //   if (
  //     currentOnboardingStatus &&
  //     pathname !== getOnboardingPath(currentOnboardingStatus)
  //   ) {
  //     navigate(getOnboardingPath(currentOnboardingStatus));
  //   }
  // }, [pathname, currentOnboardingStatus, navigate]);

  const [currentBusinessStepIndex, setCurrentBusinessStepIndex] =
    React.useState(0);

  const [onboardingEntity, setOnboardingEntity] = React.useState<Entity | null>(
    null
  );

  useEffect(() => {
    if (entityData) setOnboardingEntity(entityData?.getEntity);
  }, [entityData]);
  const currentBusinessStep = useMemo(
    () => onBoardingBusinessSteps[currentBusinessStepIndex],
    [currentBusinessStepIndex]
  );
  const getNextStep = () =>
    onBoardingBusinessSteps[currentBusinessStepIndex + 1];
  const previous = () =>
    setCurrentBusinessStepIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  const nextBusiness = () =>
    setCurrentBusinessStepIndex((prevIndex) =>
      Math.min(prevIndex + 1, onBoardingBusinessSteps.length - 1)
    );

  const createEntityFromOnboarding = async (input: any) => {
    const updatedData = await createEntity({ variables: { input } });
    await updateUser({
      variables: {
        input: {
          onboardingEntity: updatedData?.data.createEntity.id,
          id: sub,
        },
      },
    });
    setOnboardingEntity(updatedData?.data.createEntity);
    selectedEntityIdInVar(updatedData?.data.createEntity?.id);
    localStorage.setItem(
      'selectedEntityId',
      updatedData?.data.createEntity?.id
    );
  };

  const gotoOnboarding = async (onboardingStatus: OnboardingStatus) => {
    if (isDialog) {
      if (onboardingStatus === OnboardingStatus.COMPLETED) {
        if (onboardingEntity) {
          await createEntityFromOnboarding({
            ...onboardingEntity,
            addressText: undefined,
          });
        }
        onFinal && onFinal();
      }
      return;
    }
    try {
      const updatedData = await updateUser({
        variables: {
          input: {
            onboardingStatus: onboardingStatus,
            id: subData?.sub,
          },
        },
      });

      const updatedUser = updatedData?.data?.updateUser;
      navigate(
        onboardingStatus !== OnboardingStatus.COMPLETED
          ? getOnboardingPath(updatedUser)
          : PATHS.onboardingComplete
      );
      initBusinessStep();
    } catch (error) {
      throw new Error("can't go to next onboarding step");
    }
  };

  const nextOnboarding = async () => {
    await gotoOnboarding(getNextOnboardingStep(user));
  };
  const prevOnboarding = async () => {
    await gotoOnboarding(getPrevOnboardingStep(user));
  };

  const finishOnboarding = async () => {
    await gotoOnboarding(OnboardingStatus.COMPLETED);
  };

  const initBusinessStep = () => {
    setCurrentBusinessStepIndex(0);
  };

  const gotoPrev = () => {
    if (isDialog) {
      if (currentBusinessStep === OnboardingBusinessStep.ADD_BUSINESS) {
        onFinal && onFinal();
        return;
      }
      previous();
    }
    if (
      currentOnboardingStatus !== OnboardingStatus.BUSINESS ||
      (currentOnboardingStatus === OnboardingStatus.BUSINESS &&
        currentBusinessStep === OnboardingBusinessStep.ADD_BUSINESS)
    ) {
      prevOnboarding();
    } else {
      previous();
    }
  };

  const loading = useMemo(
    () => loadingUser || loadingEntity || loadingSub,
    [loadingEntity, loadingSub, loadingUser]
  );

  return (
    <OnboardingProcessContext.Provider
      value={{
        isDialog,
        currentOnboardingStatus,
        currentBusinessStep,
        getNextStep,
        initBusinessStep,
        updatingUser,
        updateUser,
        updateUserError,
        user,
        sub: subData?.sub,
        nextBusiness,
        onboardingEntity,
        gotoPrev,
        setOnboardingEntity,
        onFinal,
        nextOnboarding,
        loading,
        createEntityFromOnboarding,
        finishOnboarding,
        createEntityError,
      }}
    >
      {children}
    </OnboardingProcessContext.Provider>
  );
};

export const useOnboardingProcess = () => {
  const context = React.useContext(OnboardingProcessContext);
  if (!context) {
    throw new Error(
      'useBusinessProcess must be used within a BusinessProcessProvider'
    );
  }
  return context;
};
