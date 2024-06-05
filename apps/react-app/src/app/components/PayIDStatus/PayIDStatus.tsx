import { WBFlex, WBTooltip, WBTypography } from '@admiin-com/ds-web';
import { t } from 'i18next';
import PayToIcon from '../PayToIcon/PayToIcon';

import {
  Timeline as MuiTimeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
  timelineItemClasses,
} from '@mui/lab';
import { Payment } from '@admiin-com/ds-graphql';
import { dateTimeFormatFromISO } from '@admiin-com/ds-common';

export interface PayIDStatusProps {
  payment: Payment | null | undefined;
}

export function PayIDStatus({ payment }: PayIDStatusProps) {
  if (!payment) return null;
  return (
    <WBTooltip
      title={
        <MuiTimeline
          sx={{
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }}
        >
          <TimelineItem sx={{ minHeight: '55px', maxWidth: '350px' }}>
            <TimelineSeparator>
              <TimelineDot
                variant="filled"
                sx={{ bgcolor: 'success.main', borderWidth: 0 }}
              />
              <TimelineConnector sx={{ my: '-4px' }} />
            </TimelineSeparator>
            <TimelineContent>
              <WBTypography color="inherit" variant="body2" fontWeight={'bold'}>
                {dateTimeFormatFromISO(payment.createdAt ?? '')}
              </WBTypography>
              <WBTypography color="inherit" variant="body2">
                {t('payIDSetUp', { ns: 'payment' })}
              </WBTypography>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem sx={{ minHeight: '55px', maxWidth: '350px' }}>
            <TimelineSeparator>
              <TimelineDot
                variant="filled"
                sx={{
                  bgcolor: payment.receivedAt ? 'success.main' : 'warning.main',
                  borderWidth: 0,
                }}
              />
              <TimelineConnector sx={{ my: '-4px' }} />
            </TimelineSeparator>
            <TimelineContent>
              <WBTypography color="inherit" variant="body2" fontWeight={'bold'}>
                {t('payIDWaitingMoney', { ns: 'payment' })}
              </WBTypography>
              <WBTypography color="inherit" variant="body2">
                {t('payIDWaitingMoneyHelper', { ns: 'payment' })}
              </WBTypography>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem sx={{ minHeight: '35px', maxWidth: '350px' }}>
            <TimelineSeparator>
              <TimelineDot
                variant="filled"
                sx={{
                  bgcolor: payment.receivedAt ? 'success.main' : 'grey',
                  borderWidth: 0,
                }}
              />
              <TimelineConnector sx={{ my: '-4px' }} />
            </TimelineSeparator>
            <TimelineContent>
              <WBTypography color="inherit" variant="body2" fontWeight={'bold'}>
                {t('payIDReceivedMoney', { ns: 'payment' })}
              </WBTypography>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem sx={{ minHeight: '35px', maxWidth: '350px' }}>
            <TimelineSeparator>
              <TimelineDot
                variant="filled"
                sx={{
                  bgcolor: payment.paidOutAt ? 'success.main' : 'grey',
                  borderWidth: 0,
                }}
              />
            </TimelineSeparator>
            <TimelineContent>
              <WBTypography color="inherit" variant="body2" fontWeight={'bold'}>
                {t('payIDPaidOut', { ns: 'payment' })}
              </WBTypography>
            </TimelineContent>
          </TimelineItem>
        </MuiTimeline>
      }
    >
      <WBFlex alignItems={'center'}>
        <WBTypography
          variant="h4"
          sx={{
            textDecoration: 'underline',
            textDecorationStyle: 'dotted',
            textUnderlineOffset: '6px',
          }}
          fontWeight={'normal'}
          marginBottom={0.5}
        >
          {t('PENDING', { ns: 'taskbox' })}
        </WBTypography>
        <PayToIcon type="PayID" />
      </WBFlex>
    </WBTooltip>
  );
}

export default PayIDStatus;
