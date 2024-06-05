import { Entity, TaskDirection } from '@admiin-com/ds-graphql';
import {
  WBBox,
  WBFlex,
  WBList,
  WBListItem,
  WBListItemText,
  WBSkeleton,
  WBStack,
  WBTooltip,
  WBTypography,
} from '@admiin-com/ds-web';
import { ClickAwayListener, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTasks } from '../../hooks/useTasks/useTasks';
import { CurrencyNumber } from '../CurrencyNumber/CurrencyNumber';
import { EntityCardBadge } from './EntityCardBadge';
import React from 'react';
import { useAddAmount } from '../EntityList/EntityList';

interface EntityCardTasksProps {
  entity?: Entity | null;
  direction: TaskDirection;
}

export function EntityCardTasks({
  entity,
  direction,
  ...props
}: EntityCardTasksProps) {
  const { t } = useTranslation();

  const {
    tasks,
    isOverdue,
    numberToPaySign,
    numberToPay,
    numberToSign,
    loading,
    totalAmount,
  } = useTasks({
    direction,
    isCompleted: 'INCOMPLETE',
    limit: 50,
    entityId: entity?.id,
  });

  const addAmount = useAddAmount();

  React.useEffect(() => {
    if (totalAmount > 0 && entity) {
      addAmount({
        entity,
        ...(direction === TaskDirection.RECEIVING
          ? { inboxAmount: totalAmount }
          : { outboxAmount: totalAmount }),
      });
    }
  }, [addAmount, direction, entity, totalAmount]);

  return (
    <WBTooltip
      enterTouchDelay={10}
      leaveTouchDelay={10000}
      {...props}
      PopperProps={{
        style: {
          maxWidth: 'none', // Removes the default maxWidth
        },
      }}
      disableHoverListener={!entity}
      title={
        <WBList dense sx={{ px: 3, maxWidth: 'none' }} disc>
          <WBListItem
            dense
            sx={{
              p: 0,
            }}
          >
            <WBListItemText
              primary={
                <>
                  <b>{numberToPaySign}</b>{' '}
                  {t('paidSignedDocuments', {
                    ns: 'dashboard',
                    count: numberToPaySign,
                  })}{' '}
                  <b>{t('paid', { ns: 'taskbox' })}</b>{' '}
                  {t('and', { ns: 'common' })}{' '}
                  <b>{t('signed', { ns: 'taskbox' })}</b>
                </>
              }
              primaryTypographyProps={{
                fontWeight: 'medium',
                fontSize: 'body2.fontSize',
              }}
            />
          </WBListItem>
          <WBListItem dense sx={{ p: 0 }}>
            <WBListItemText
              primaryTypographyProps={{
                fontWeight: 'medium',
                fontSize: 'body2.fontSize',
              }}
              primary={
                <>
                  {' '}
                  <b>{numberToPay}</b>{' '}
                  {t('paidSignedDocuments', {
                    ns: 'dashboard',
                    count: numberToPay,
                  })}{' '}
                  <b>{t('paid', { ns: 'taskbox' })}</b>
                </>
              }
            ></WBListItemText>
          </WBListItem>

          <WBListItem dense sx={{ p: 0 }}>
            <WBListItemText
              primaryTypographyProps={{
                fontWeight: 'medium',
                fontSize: 'body2.fontSize',
              }}
              primary={
                <>
                  {' '}
                  <b>{numberToSign}</b>{' '}
                  {t('paidSignedDocuments', {
                    ns: 'dashboard',
                    count: numberToSign,
                  })}{' '}
                  <b>{t('signed', { ns: 'taskbox' })}</b>
                </>
              }
            ></WBListItemText>
          </WBListItem>
        </WBList>
      }
    >
      <WBBox>
        {entity && tasks && !loading ? (
          <WBStack
            flexDirection={'row'}
            p={2}
            sx={{
              backgroundColor: 'background.default',
            }}
          >
            <WBBox flex={1}>
              <WBTypography
                color="text.primary"
                sx={{ opacity: 0.5 }}
                mb={0.5}
                mr={[0, 2]}
                variant="body2"
                fontWeight="bold"
              >
                {direction === TaskDirection.RECEIVING
                  ? t('inbox', { ns: 'dashboard' })
                  : t('sent', { ns: 'dashboard' })}
              </WBTypography>
              <CurrencyNumber number={totalAmount} />
            </WBBox>
            <WBFlex alignItems={'center'} width={'100%'} justifyContent={'end'}>
              <WBBox>
                <EntityCardBadge
                  amount={tasks?.length ?? 0}
                  color={isOverdue ? 'error' : 'warning'}
                />
              </WBBox>
            </WBFlex>
          </WBStack>
        ) : (
          <Skeleton width={'100%'} height={'80px'} />
        )}
      </WBBox>
    </WBTooltip>
  );
}
