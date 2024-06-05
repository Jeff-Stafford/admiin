import {
  Timeline as MuiTimeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
  timelineItemClasses,
} from '@mui/lab';
import { Payment, PaymentStatus } from '@admiin-com/ds-graphql';
import { ScrollViews, ScrollViewsContainer } from '../ScrollViews/ScrollViews';
import { WBBox, WBGrid, WBLinkButton, WBTypography } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import {
  frontDateFromBackendDate,
  frontDateFromISO,
} from '@admiin-com/ds-common';
import { CurrencyNumber } from '../CurrencyNumber/CurrencyNumber';
import { usePaymentContext } from '../PaymentContainer/PaymentContainer';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
// import ScheduleIcon from '@mui/icons-material/Schedule';

interface TaskInstallmentsTimelineProps {
  payments: Payment[];
}

export function TaskInstallmentsTimeline({
  payments,
}: TaskInstallmentsTimelineProps) {
  const { t } = useTranslation();
  const { retryPayment } = usePaymentContext();
  return (
    <ScrollViewsContainer data={payments}>
      <WBGrid container alignItems={'center'} spacing={0}>
        <WBGrid
          xs={1}
          padding={'18px 8px'}
          sx={{
            display: 'flex',
            justifyContent: 'end',
            boxShadow: '5px 1px 5px -5px rgba(0, 0, 0, 0.5)',
          }}
        >
          <ScrollViews.Back name="ChevronBack" />
        </WBGrid>
        <WBGrid xs={10}>
          <MuiTimeline
            sx={{
              [`& .${timelineItemClasses.root}:before`]: {
                flex: 0,
                padding: 0,
                marginLeft: -3,
                marginRight: -3,
              },
              pr: 0,
              pl: 3,
              // transform: 'rotate(90deg)',
              flexDirection: 'row',
              ml: -3,
              padding: -3,
            }}
          >
            <ScrollViews
              noPadding
              render={(item, index) => (
                <TimelineItem
                  sx={{
                    minHeight: '55px',
                    //  transform: 'rotate(180deg)'
                    flexDirection: 'column',
                    color:
                      item.status === PaymentStatus.COMPLETED
                        ? 'success.main'
                        : item.status === PaymentStatus.DECLINED
                        ? 'error.main'
                        : 'warning.main',
                    fontSize: 'body2.fontSize',
                  }}
                  key={index}
                >
                  <TimelineContent
                    sx={{
                      // transform: 'rotate(-180deg)',
                      textAlign: 'center',
                      position: 'relative',
                      fontSize: 'inherit',
                      minWidth: 50,
                      fontWeight: 'medium',
                    }}
                  >
                    <WBBox
                      sx={{
                        visibility:
                          item.status === PaymentStatus.DECLINED
                            ? 'visible'
                            : 'hidden',
                      }}
                      onClick={() => retryPayment(item)}
                    >
                      <WBLinkButton
                        color="primary.main"
                        sx={{
                          textDecoration: 'underline',
                        }}
                      >
                        {t('retry', { ns: 'taskbox' })}
                      </WBLinkButton>
                    </WBBox>
                    <WBTypography
                      color={'inherit'}
                      textAlign={'inherit'}
                      fontSize={'inherit'}
                      fontWeight={'inherit'}
                    >
                      {t(item.status, { ns: 'taskbox' })}
                    </WBTypography>
                  </TimelineContent>
                  <TimelineSeparator
                    sx={{ flexDirection: 'row', color: 'inherit' }}
                  >
                    <TimelineConnector
                      sx={{
                        height: '4px',
                        bgcolor:
                          index === 0
                            ? 'transparent'
                            : item.status === PaymentStatus.COMPLETED
                            ? 'success.main'
                            : 'grey.light',
                      }}
                    />
                    <TimelineDot
                      variant="outlined"
                      sx={{
                        bgcolor: 'white',
                        borderColor: 'inherit',
                        padding: '6px',
                        margin: 0,
                        borderWidth: 4,
                      }}
                    />
                    <TimelineConnector
                      sx={{
                        height: '4px',
                        bgcolor:
                          index < payments.length - 1
                            ? item.status === PaymentStatus.COMPLETED
                              ? 'success.main'
                              : 'grey.light'
                            : 'transparent',
                      }}
                    />
                  </TimelineSeparator>
                  <TimelineContent
                    sx={{
                      // transform: 'rotate(-180deg)',
                      textAlign: 'center',
                      minWidth: 50,
                      fontSize: 'inherit',
                    }}
                  >
                    <CurrencyNumber
                      number={item.amount / 100}
                      sup={false}
                      color={'text.primary'}
                      textAlign={'center'}
                    />
                    <WBTypography
                      fontWeight={'bold'}
                      fontSize="11px"
                      textAlign="center"
                      color="textSecondary"
                    >
                      {(item.status !== PaymentStatus.VOIDED &&
                        item.status !== PaymentStatus.COMPLETED &&
                        frontDateFromBackendDate(item.scheduledAt)) ??
                        ''}
                      {item.status === PaymentStatus.VOIDED &&
                        frontDateFromISO(item.voidedAt)}
                      {item.status === PaymentStatus.COMPLETED &&
                        frontDateFromISO(item.paidAt)}
                    </WBTypography>
                  </TimelineContent>
                </TimelineItem>
              )}
            />
          </MuiTimeline>
        </WBGrid>
        <WBGrid
          xs={1}
          padding={'18px 8px'}
          sx={{ boxShadow: '-5px 1px 5px -5px rgba(0, 0, 0, 0.5)' }}
        >
          <ScrollViews.Forward name="ChevronForward" />
        </WBGrid>
      </WBGrid>
    </ScrollViewsContainer>
  );
}

export default TaskInstallmentsTimeline;
