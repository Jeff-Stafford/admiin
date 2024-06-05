import { AccountDirection, PaymentMethod } from '@admiin-com/ds-graphql';
import {
  WBBox,
  WBCard,
  WBCardContent,
  WBChip,
  WBFlex,
  WBSkeleton,
  WBSvgIcon,
  WBTypography,
} from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';

import React from 'react';
import { useTheme } from '@mui/material';

import CreditCardIcon from '../CreditCardIcon/CreditCardIcon';
import { useSelectedEntity } from '../../hooks/useSelectedEntity/useSelectedEntity';
import { PaymentMethodMenu } from '../PaymentMethodMenu/PaymentMethodMenu';

export interface CreditCardItemProps {
  cc: PaymentMethod | null;
}

export function CreditCardItem({ cc }: CreditCardItemProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const { entity } = useSelectedEntity();

  const isPrimary = entity?.paymentMethodId === cc?.id;

  return (
    <WBCard
      sx={{
        borderRadius: '16px',
        boxShadow: ' 0 17px 17.5px -11.5px rgba(140, 81, 255, 0.33)',
        backgroundImage:
          'linear-gradient(118deg, transparent 2%, rgba(250, 150, 255, 0.33) 100%)',
        cursor: 'pointer',
        fontSize: isPrimary ? 'body2.fontSize' : '11px',
      }}
    >
      <WBCardContent sx={{ paddingX: 4, paddingTop: 2.5 }}>
        <WBFlex justifyContent={'space-between'} alignItems={'start'}>
          <WBBox
            mr={3}
            // onClick={handlePrimary}
          >
            {cc ? (
              <>
                <WBTypography fontSize="inherit" fontWeight={'bold'} mt={0.6}>
                  {t('cardNumber', { ns: 'settings' })}
                </WBTypography>

                <WBTypography fontSize="inherit" mt={1.5}>
                  {cc.number}
                </WBTypography>
              </>
            ) : (
              <WBSkeleton width={'120px'} height="40px"></WBSkeleton>
            )}
          </WBBox>
          {cc ? (
            isPrimary ? (
              <WBChip
                label={t('primary', { ns: 'settings' })}
                sx={{
                  margin: 0,
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  bgcolor: 'common.black',
                  color: 'common.white',
                }}
              />
            ) : (
              <PaymentMethodMenu
                accountDirection={AccountDirection.PAYMENT}
                paymentMethod={cc}
              />
            )
          ) : (
            <WBSkeleton
              sx={{ width: '40px', height: '40px', borderRadius: '20px' }}
            />
          )}
        </WBFlex>
        <WBFlex mt={2}>
          {cc ? (
            <WBFlex flex={1}>
              <WBFlex flex={1}>
                <WBBox mr={3}>
                  <WBTypography fontSize="inherit" fontWeight={'bold'} mt={0.6}>
                    {t('expiryDate', { ns: 'settings' })}
                  </WBTypography>

                  <WBTypography fontSize="inherit" mt={1.5}>
                    {`${cc.expMonth}/${parseInt(cc.expYear ?? '0') % 100}`}
                  </WBTypography>
                </WBBox>
                <WBBox mr={3}>
                  <WBTypography fontSize="inherit" fontWeight={'bold'} mt={0.6}>
                    {t('cvv', { ns: 'settings' })}
                  </WBTypography>

                  <WBTypography fontSize="inherit" mt={1.5}>
                    {/* {cc?.cvv ?? '443'} */}
                    {/* Todo: cc.cvv is undefined */}
                    {'443'}
                  </WBTypography>
                </WBBox>
              </WBFlex>
              {cc?.type ? (
                <WBSvgIcon
                  fontSize="large"
                  viewBox="0 0 40 40"
                  sx={{
                    alignSelf: 'flex-end',
                    '& path':
                      cc?.type === 'visa'
                        ? { fill: theme.palette.common.black }
                        : {},
                  }}
                >
                  <CreditCardIcon type={cc.type as any} />
                </WBSvgIcon>
              ) : null}{' '}
            </WBFlex>
          ) : (
            <WBSkeleton width={'100%'} height="60px"></WBSkeleton>
          )}
        </WBFlex>
      </WBCardContent>
    </WBCard>
  );
}

export default CreditCardItem;
