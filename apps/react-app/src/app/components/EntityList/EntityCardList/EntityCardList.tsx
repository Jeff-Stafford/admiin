import * as React from 'react';
import {
  WBCard,
  WBCardContent,
  WBFlex,
  WBGrid,
  WBTypography,
} from '@admiin-com/ds-web';
import { Entity } from '@admiin-com/ds-graphql';
import { EntityCardItem } from '../../EntityCardItem/EntityCardItem';
import { useTranslation } from 'react-i18next';
import { CurrencyNumber } from '../../CurrencyNumber/CurrencyNumber';
import { useAmounts } from '../EntityList';
//const WBCustomGrid = styled(WBGrid)(({ theme }) => ({
//  boxShadow: '0 16px 27px -15px rgba(5, 8, 11, 0.27)',
//  borderRadius: 0,
//}));

interface EntityCardListProps {
  entities: Entity[];
  loading: boolean;
}
export function EntityCardList({ entities, loading }: EntityCardListProps) {
  const { t } = useTranslation();

  const [inboxAmount, outboxAmount] = useAmounts();

  if (loading) {
    return (
      <WBGrid container spacing={2}>
        <WBGrid xs={12} md={6}>
          <EntityCardItem entity={null} />
        </WBGrid>
        <WBGrid xs={12} md={6}>
          <EntityCardItem entity={null} />
        </WBGrid>
      </WBGrid>
    );
  }
  return (
    <WBFlex flexDirection={'column'} height={'100%'}>
      <WBGrid container spacing={2} mb={[3, 0]} alignItems="stretch">
        {entities.map((entity, index) => (
          <WBGrid xs={12} md={6} key={index}>
            <EntityCardItem entity={entity} />
          </WBGrid>
        ))}
      </WBGrid>
      <WBFlex flexGrow={1}></WBFlex>
      <WBCard>
        <WBCardContent>
          <WBFlex
            justifyContent={'space-between'}
            alignItems={['start', 'center']}
            flexDirection={['column', 'row']}
          >
            <WBTypography
              sx={(theme) => ({ ...theme.typography.h3, mb: [1, 0] })}
            >
              {t('total', { ns: 'dashboard' })}
            </WBTypography>
            <WBFlex
              flexDirection={['column', 'column', 'row']}
              width={{ xs: '100%', sm: 'auto' }}
            >
              <WBFlex mr={[0, 0, 5]} justifyContent={'space-between'}>
                <WBTypography mr={2}>
                  {t('inbox', { ns: 'dashboard' })}
                </WBTypography>
                <CurrencyNumber number={inboxAmount} sup={false} />
              </WBFlex>
              <WBFlex justifyContent={'space-between'}>
                <WBTypography mr={2}>
                  {t('sent', { ns: 'dashboard' })}
                </WBTypography>
                <CurrencyNumber number={outboxAmount} sup={false} />
              </WBFlex>
            </WBFlex>
          </WBFlex>
        </WBCardContent>
      </WBCard>
    </WBFlex>
  );
}
