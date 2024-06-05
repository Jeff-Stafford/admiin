import { PRIVACY_POLICY_URL } from '@admiin-com/ds-common';
import {
  WBBox,
  WBButton,
  WBCheckbox,
  WBFlex,
  WBLink,
  WBTextField,
  WBTypography,
} from '@admiin-com/ds-web';
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  styled,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import AutoCompleteLookup from '../../components/AutoCompleteLookup/AutoCompleteLookup';
import { Entity } from '@admiin-com/ds-graphql';
import React from 'react';
import { useSelectedEntity } from '../../hooks/useSelectedEntity/useSelectedEntity';
import { isIndividualEntity } from '../../helpers/entities';

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: 3,
  width: 16,
  height: 16,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 0 0 1px rgb(16 22 26 / 40%)'
      : 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
  backgroundColor: theme.palette.mode === 'dark' ? '#394B59' : '#F5F8FA',
  backgroundImage:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))'
      : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    backgroundColor: theme.palette.mode === 'dark' ? '#30404D' : '#EBF1F5',
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background:
      theme.palette.mode === 'dark'
        ? 'rgba(57,75,89,.5)'
        : 'rgba(206,217,224,.5)',
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: '#137CBD',
  backgroundImage:
    'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
  '&::before': {
    display: 'block',
    width: 16,
    height: 16,
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
      " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
      "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
    content: '""',
  },
  'input:hover ~ &': {
    backgroundColor: '#106BA3',
  },
});

/* eslint-disable-next-line */
export interface VerificationBusinessProps {
  onSuccess: (entity: Entity | null | undefined) => void;
  onBack: () => void;
  entity?: Entity | null;
  loadingVerification?: boolean;
}

export function VerificationBusiness({
  onSuccess,
  onBack,
  entity,
  loadingVerification,
}: VerificationBusinessProps) {
  const { t } = useTranslation();
  const [business, setBusiness] = React.useState<Entity | null | undefined>(
    undefined
  );
  const [confirmChecked, setConfirmChecked] = React.useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmChecked(event.target.checked);
  };

  const { entity: selectedEntity } = useSelectedEntity();

  const defaultEntity = entity ?? selectedEntity;
  React.useEffect(() => {
    if (defaultEntity && business === undefined) {
      setBusiness(defaultEntity);
    }
  }, [business, defaultEntity]);

  const isIndividual = isIndividualEntity(business);

  return (
    <>
      <DialogTitle variant="h3" fontWeight={'bold'} component={'div'}>
        <WBFlex justifyContent={'space-between'} width={'100%'}>
          <WBTypography variant="h3">
            {t(
              isIndividual
                ? 'individualVerificationTitle'
                : 'businessVerificationTitle',
              {
                ns: 'verification',
              }
            )}
          </WBTypography>
          {!isIndividual && (
            <WBTypography
              variant="h4"
              fontWeight={'normal'}
            >{`1/2`}</WBTypography>
          )}
        </WBFlex>

        <WBTypography variant="body1" mt={1}>
          {t(
            isIndividual
              ? 'individualVerificationSubTitle'
              : 'businessVerificationSubTitle',
            {
              ns: 'verification',
            }
          )}
        </WBTypography>
      </DialogTitle>
      <DialogContent>
        <WBBox mb={6}>
          <WBTextField
            focused
            label={t(isIndividual ? 'fullName' : 'businessName', {
              ns: 'common',
            })}
            value={`${business?.name ?? ''}${business?.taxNumber ? ' - ' : ''}${
              business?.taxNumber ?? ''
            }`}
          />
          {/* <WBTypography fontWeight={'bold'}>
           {t(isIndividual ? 'fullName' : 'businessName', {
           ns: 'common',
           })}
           </WBTypography>
           <WBTypography mt={1}>
           {`${business?.name ?? ''}${business?.taxNumber ? ' - ' : ''}${
           business?.taxNumber ?? ''
           }`}
           </WBTypography> */}
          {/* <AutoCompleteLookup
           type={'Entity'}
           value={business}
           label={t(isIndividual ? 'fullName' : 'businessName', {
           ns: 'common',
           })}
           placeholder={t('searchYourBusiness', { ns: 'common' })}
           onChange={(option) => {
           setBusiness(option);
           }}
           getOptionLabel={
           business
           ? (option) =>
           `${option.name ?? ''}${option.taxNumber ? ' - ' : ''}${
           option.taxNumber ?? ''
           }`
           : undefined
           }
           disabled
           />*/}
        </WBBox>
        {business && (
          <WBCheckbox
            sx={{
              '&:hover': { bgcolor: 'transparent' },
            }}
            disableRipple
            color="default"
            checkedIcon={<BpCheckedIcon />}
            icon={<BpIcon />}
            inputProps={{ 'aria-label': 'Checkbox demo' }}
            label={
              <>
                {t('confirmBusinessBefore', { ns: 'common' })}
                <WBLink
                  href={PRIVACY_POLICY_URL} // replace with your privacy policy URL
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ fontSize: 'small' }}
                >
                  {t('privacyPolicyTitle', { ns: 'common' })}
                </WBLink>
                {t('confirmBusinessAfter', { ns: 'common' })}
              </>
            }
            onChange={handleChange}
            value={confirmChecked}
          />
        )}
      </DialogContent>
      <DialogActions>
        <WBFlex
          width={'100%'}
          flexDirection={'column'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <WBButton
            fullWidth
            loading={isIndividual ? loadingVerification : false}
            onClick={() => {
              onSuccess(business);
            }}
            sx={{
              fontWeight: 'bold',
              ...(!confirmChecked && {
                '&.Mui-disabled': { color: 'common.white' },
              }),
            }}
            disabled={!confirmChecked}
          >
            {isIndividual
              ? t('verifyIdentity', { ns: 'verification' })
              : t('next', { ns: 'common' })}
          </WBButton>
          <WBLink
            component={'button'}
            underline="always"
            sx={{ mt: 4, fontWeight: 'bold' }}
            color={'text.primary'}
            onClick={onBack}
          >
            {t('back', { ns: 'common' })}
          </WBLink>
        </WBFlex>
      </DialogActions>
    </>
  );
}

export default VerificationBusiness;
