import { gql, useMutation, useQuery } from '@apollo/client';
import { WBS3AvatarUpload } from '@admiin-com/ds-amplify-web';
import {
  getNextOnboardingStep,
  Image,
  PROFILE_PLACEHOLDER,
} from '@admiin-com/ds-common';
import {
  CSGetSub as GET_SUB,
  getUser,
  updateUser as UPDATE_USER,
} from '@admiin-com/ds-graphql';
import { WBButton, WBTypography } from '@admiin-com/ds-web';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components';
import { getOnboardingPath } from '../../helpers/onboarding';

const OnboardingProfileImage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: subData } = useQuery(gql(GET_SUB));

  const { data: userData } = useQuery(gql(getUser), {
    variables: {
      id: subData?.sub,
    },
    skip: !subData || !subData?.sub,
  });
  const [updateUser] = useMutation(gql(UPDATE_USER));

  const user = useMemo(() => userData?.getUser || {}, [userData]);
  const onImageUpload = async (image: Image) => {
    try {
      await updateUser({
        variables: {
          input: {
            id: subData?.sub,
            profileImg: image,
            onboardingStatus: getNextOnboardingStep(user),
          },
        },
      });
    } catch (err) {
      console.log('err updating user: ', err);
    }
  };

  const onNext = () => {
    navigate(getOnboardingPath(user), {
      replace: true,
    });
  };

  return (
    <PageContainer
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <WBTypography variant="h1">
        {t('onboardingProfileImageTitle', { ns: 'onboarding' })}
      </WBTypography>
      <WBS3AvatarUpload
        onImageUpload={onImageUpload}
        imgKey={user?.profileImg?.key}
        src={PROFILE_PLACEHOLDER}
        maxSizeMB={0.2}
        maxWidthOrHeight={420}
        sx={{
          width: '120px',
          height: '120px',
        }}
      />
      <WBButton
        sx={{ mt: 3 }}
        disabled={!user?.profileImg?.key}
        onClick={onNext}
      >
        {t('nextTitle', { ns: 'common' })}
      </WBButton>
    </PageContainer>
  );
};

export default OnboardingProfileImage;
