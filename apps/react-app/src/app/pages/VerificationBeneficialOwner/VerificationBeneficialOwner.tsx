import {
  WBBox,
  WBButton,
  WBFlex,
  WBLink,
  WBTypography,
} from '@admiin-com/ds-web';
import { gql, useMutation } from '@apollo/client';
import {
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
  useTheme,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import {
  BeneficialOwner,
  lookupEntityOwnership as LOOKUP_ENTITY_OWNERSHIP,
  Entity,
  VerificationStatus,
} from '@admiin-com/ds-graphql';
import { isIndividualEntity, isVerifiedEntity } from '../../helpers/entities';
import { BeneficialOwnerItem } from './BeneficialOwnerItem';

export interface VerificationBeneficialOwnerProps {
  onSuccess: () => void;
  onBack: () => void;
  beneficialOwners: (BeneficialOwner | null | undefined)[];
  setBeneficialOwners: (
    benenficialOwners: (BeneficialOwner | null | undefined)[]
  ) => void;
  loadingVerification?: boolean;
  verifyOwner: (owner: BeneficialOwner) => void;
  onClose: () => void;
  onVerified: (owner: BeneficialOwner) => void;
  entity?: Entity | null;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
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
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  borderBottom: 0,
}));

export function VerificationBeneficialOwner({
  onSuccess,
  onBack,
  onVerified,
  verifyOwner,
  loadingVerification,
  setBeneficialOwners,
  onClose,
  beneficialOwners,
  entity,
}: VerificationBeneficialOwnerProps) {
  const { t } = useTranslation();

  const theme = useTheme();

  const verified = entity ? isVerifiedEntity(entity) : false;

  const [lookupEntityOwnership] = useMutation(gql(LOOKUP_ENTITY_OWNERSHIP));

  const [error, setError] = React.useState<any>('');
  const lookupBeneficialOwner = async () => {
    if (
      !(
        entity?.ubosCreated === null &&
        entity &&
        entity.id &&
        !isIndividualEntity(entity)
      )
    )
      return;
    try {
      await lookupEntityOwnership({
        variables: {
          input: {
            entityId: entity.id,
          },
        },
      });
    } catch (error) {
      setError(error);
    }
  };
  React.useEffect(() => {
    lookupBeneficialOwner();
  }, [entity]);
  const [beneficialOwner, setBeneficialOwner] = React.useState<any>(null);

  const lookingBeneficalOwner = entity?.ubosCreated === null;
  const noBeneficialOwner =
    entity &&
    entity?.ubosCreated !== null &&
    beneficialOwners?.length === 0 &&
    entity?.entityBeneficialOwners?.items?.length === 0;

  return (
    <>
      <DialogTitle variant="h3" fontWeight={'bold'} component={'div'}>
        <WBFlex justifyContent={'space-between'} width={'100%'}>
          <WBTypography variant="h3">
            {t('beneficialOwnerVerification', {
              ns: 'common',
            })}
          </WBTypography>
          <WBTypography
            variant="h4"
            fontWeight={'normal'}
          >{`2/2`}</WBTypography>
        </WBFlex>

        {noBeneficialOwner ? (
          <ErrorHandler
            errorMessage={t('noBeneficialOwner', { ns: 'common' })}
          />
        ) : null}
        {lookingBeneficalOwner ? (
          <WBTypography variant="body1" mt={1}>
            {t(
              beneficialOwners.length > 0
                ? 'beneficialOwnerVerificationSubTitle'
                : 'loadingBeneficialOwners',
              {
                ns: 'common',
              }
            )}
          </WBTypography>
        ) : null}
      </DialogTitle>

      <DialogContent>
        <WBBox mb={3}>
          {beneficialOwners.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead
                  sx={{
                    borderBottom: `1px solid ${theme.palette.grey[400]}`,
                  }}
                >
                  <StyledTableRow>
                    <StyledTableCell sx={{ px: 0, fontWeight: 'bold' }}>
                      {t('shareholder', { ns: 'common' })}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{ px: 0, fontWeight: 'bold', textAlign: 'right' }}
                    >
                      {t('verification', { ns: 'common' })}
                    </StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {beneficialOwners
                    ?.filter((owner) => owner)
                    ?.map((owner) => (
                      <BeneficialOwnerItem
                        key={owner?.id}
                        onUpdated={(updated) => {
                          setBeneficialOwners(
                            beneficialOwners.map((owner) =>
                              owner?.id === updated?.id ? updated : owner
                            )
                          );
                          if (
                            updated.verificationStatus ===
                              VerificationStatus.PASS ||
                            updated.verificationStatus ===
                              VerificationStatus.PASS_MANUAL
                          ) {
                            onVerified(updated);
                          }
                        }}
                        owner={owner}
                        loadingVerification={
                          loadingVerification &&
                          beneficialOwner?.id === owner?.id
                        }
                        entity={entity}
                        verifyOwner={(owner) => {
                          setBeneficialOwner(owner);
                          verifyOwner(owner);
                        }}
                      />
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : entity?.ubosCreated === null ? (
            <WBFlex mt={4} justifyContent={'center'}>
              <CircularProgress />
            </WBFlex>
          ) : null}
        </WBBox>
      </DialogContent>
      <DialogActions>
        <WBFlex
          width={'100%'}
          flexDirection={'column'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          {(entity?.entityBeneficialOwners?.items?.length &&
            entity?.entityBeneficialOwners?.items?.length > 0) ||
          beneficialOwners.length > 0 ? (
            <WBButton
              fullWidth
              onClick={() => {
                onSuccess();
              }}
              disabled={!verified}
              sx={{
                fontWeight: 'bold',
                ...(!verified && {
                  '&.Mui-disabled': { color: 'common.white' },
                }),
              }}
            >
              {t('confirm', { ns: 'common' })}
            </WBButton>
          ) : (
            entity?.ubosCreated && (
              <WBButton
                fullWidth
                sx={{
                  fontWeight: 'bold',
                  color: 'text.primary',
                }}
                color="warning"
              >
                {t('contactSupport', { ns: 'common' })}
              </WBButton>
            )
          )}
          {beneficialOwners.length > 0 ? (
            <WBLink
              component={'button'}
              underline="always"
              sx={{ mt: 4, fontWeight: 'bold' }}
              color={'text.primary'}
              onClick={onBack}
            >
              {t('back', { ns: 'common' })}
            </WBLink>
          ) : (
            <WBLink
              component={'button'}
              underline="always"
              sx={{ mt: 4, fontWeight: 'bold' }}
              color={'text.primary'}
              onClick={onClose}
            >
              {t('close', { ns: 'common' })}
            </WBLink>
          )}
        </WBFlex>
      </DialogActions>
      <ErrorHandler isDialog errorMessage={error?.message}></ErrorHandler>
    </>
  );
}

export default VerificationBeneficialOwner;
