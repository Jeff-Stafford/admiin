import {
  WBAlert,
  WBButton,
  WBFlex,
  WBLink,
  WBStack,
  WBTypography,
} from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../../../components';
import { WBS3AvatarUpload } from '@admiin-com/ds-amplify-web';
import { Image } from '@admiin-com/ds-common';
import { gql, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { updateEntity as UPDATE_ENTITY } from '@admiin-com/ds-graphql';
import { useTheme } from '@mui/system';
import { useOnboardingProcess } from '../../../components/OnboardingContainer/OnboadringContainer';

const OnboardingBusinessLogo = () => {
  const theme = useTheme();
  const [image, setImage] = useState<Image>();
  const { t } = useTranslation();
  const [updateEntity, { error: updateError }] = useMutation(
    gql(UPDATE_ENTITY)
  );

  const [loading, setLoading] = useState(false);
  const {
    finishOnboarding,
    setOnboardingEntity,
    onboardingEntity,
    createEntityError,
    isDialog,
  } = useOnboardingProcess();

  const [error, setError] = useState<{ message: string }>();

  const onImageUpload = async (image: Image) => {
    setImage(image);
  };
  useEffect(() => {
    if (updateError) {
      setError(updateError);
    }
  }, [updateError]);

  const onSubmit = async (hasLogo = false) => {
    // otherwise update entity
    if (loading) return;
    setLoading(true);
    try {
      if (hasLogo) {
        const logo = {
          alt: image?.alt,
          identityId: image?.identityId,
          key: image?.key,
          level: image?.level,
        };
        if (!isDialog) {
          await updateEntity({
            variables: {
              input: {
                id: onboardingEntity.id,
                logo,
              },
            },
          });
        } else {
          setOnboardingEntity({ ...onboardingEntity, logo });
          return;
        }
      }
      await finishOnboarding();
      setLoading(false);
    } catch (err: any) {
      console.log('ERROR updating entity: ', err);
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading && onboardingEntity && onboardingEntity.logo) {
      finishOnboarding()
        .catch((err: any) => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [onboardingEntity, loading]);

  return (
    <PageContainer
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        paddingY: 6,
      }}
    >
      <WBTypography variant="h3" mb={15}>
        {t('onboardingBusinessLogoTitle', { ns: 'onboarding' })}
      </WBTypography>
      <WBFlex
        flexDirection="column"
        alignItems="center"
        width={{
          xs: '100%',
          sm: '80%',
          md: '60%',
          lg: '40%',
        }}
      >
        <WBStack direction={'column'} spacing={2}>
          <WBS3AvatarUpload
            companyName={onboardingEntity?.name ?? 'Logo'}
            onImageUpload={onImageUpload}
            imgKey={image?.key}
            maxSizeMB={0.2}
            maxWidthOrHeight={420}
            sx={{
              width: '120px',
              height: '120px',
            }}
            label={
              image
                ? t('updateBusinessLogo', { ns: 'onboarding' })
                : t('addBusinessLogo', { ns: 'onboarding' })
            }
          />
        </WBStack>
        <WBButton
          sx={{
            mt: {
              xs: 5,
              sm: 10,
            },
          }}
          disabled={!image}
          onClick={() => onSubmit(true)}
          fullWidth
          loading={loading && onboardingEntity.logo}
        >
          {t('nextTitle', { ns: 'common' })}
        </WBButton>
        <WBLink
          variant="body2"
          sx={{ mt: 5 }}
          underline="always"
          color={theme.palette.text.primary}
          onClick={() => {
            onSubmit();
          }}
        >
          {t('doThisLater', { ns: 'common' })}
        </WBLink>

        {(error?.message ||
          createEntityError?.message ||
          updateError?.message) && (
          <WBAlert
            title={
              error?.message ??
              createEntityError?.message ??
              updateError?.message
            }
            severity="error"
            sx={{ my: 2 }}
          />
        )}
      </WBFlex>
    </PageContainer>
  );
};
export default OnboardingBusinessLogo;
