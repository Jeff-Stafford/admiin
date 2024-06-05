import {
  BeneficialOwner,
  VerificationStatus,
  onUpdateBeneficialOwner as ON_UPDATE_BENEFICIAL_OWNER,
  Entity,
  OnUpdateBeneficialOwnerSubscription,
} from '@admiin-com/ds-graphql';
import SecurityIcon from '../../../assets/icons/security.svg';
import {
  CircularProgress,
  TableCell,
  TableRow,
  styled,
  tableCellClasses,
} from '@mui/material';
import { WBFlex, WBLink, WBSvgIcon, WBTypography } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { OnDataOptions, gql, useSubscription } from '@apollo/client';
import React from 'react';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  borderBottom: 0,
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontWeight: 'bold',
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
    boxShadow: 'none',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  [`&.${tableCellClasses.root}`]: {
    borderBottom: 0,
  },
}));

interface BeneficialOwnerProps {
  loadingVerification?: boolean;
  verifyOwner: (owner: BeneficialOwner) => void;
  owner: BeneficialOwner | undefined | null;
  entity?: Entity | null;
  onUpdated: (owner: BeneficialOwner) => void;
}

export const BeneficialOwnerItem = ({
  owner,
  loadingVerification,
  onUpdated,
  verifyOwner,
  entity,
}: BeneficialOwnerProps) => {
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

  React.useEffect(() => {
    setTimeout(() => {
      setInit(true);
    }, 3000);
  }, []);

  useSubscription(gql(ON_UPDATE_BENEFICIAL_OWNER), {
    variables: {
      beneficialOwnerId: owner?.id,
      entityId: entity?.id,
    },
    skip: !owner?.id || !entity?.id || !init,
    onData: (data: OnDataOptions<OnUpdateBeneficialOwnerSubscription>) => {
      const onUpdateBeneficialOwner = data?.data?.data?.onUpdateBeneficialOwner;
      if (onUpdateBeneficialOwner) onUpdated(onUpdateBeneficialOwner);
    },
    onError: (err) => onSubscriptionError(err),
    shouldResubscribe: true,
  });

  return (
    <StyledTableRow key={owner?.id}>
      <StyledTableCell sx={{ px: 0 }}>{owner?.name}</StyledTableCell>
      <StyledTableCell
        sx={{
          px: 0,
          textAlign: 'right',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'end',
          alignItems: 'center',
        }}
        align="right"
      >
        {owner?.verificationStatus === VerificationStatus.UNCHECKED ||
        owner?.verificationStatus === VerificationStatus.FAIL ? (
          <WBFlex alignItems={'center'} px={loadingVerification ? 0.5 : 0}>
            <WBLink
              component={'button'}
              onClick={() => !loadingVerification && verifyOwner(owner)}
              color={loadingVerification ? 'action.disabled' : 'primary.main'}
              underline="always"
            >
              {t('verify', { ns: 'common' })}
            </WBLink>
            {loadingVerification && (
              <CircularProgress sx={{ ml: 2 }} size={'1rem'} />
            )}
          </WBFlex>
        ) : (
          <>
            <WBSvgIcon fontSize="small" viewBox="0 0 24 24">
              <SecurityIcon />
            </WBSvgIcon>
            <WBTypography ml={1} mb={0.5} textAlign={'right'} variant="body1">
              {t('verified', { ns: 'common' })}
            </WBTypography>
          </>
        )}
      </StyledTableCell>
    </StyledTableRow>
  );
};
