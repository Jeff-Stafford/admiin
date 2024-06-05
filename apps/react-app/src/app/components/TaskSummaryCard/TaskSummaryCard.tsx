import {
  AutocompleteResult,
  PaymentFrequency,
  Task,
  TaskGuest,
  TaskType,
} from '@admiin-com/ds-graphql';
import {
  WBBox,
  WBDialog,
  WBDivider,
  WBFlex,
  WBFullScreenModal,
  WBIconButton,
  WBLink,
  WBTypography,
} from '@admiin-com/ds-web';
import { alpha, useTheme } from '@mui/material';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { CurrencyNumber } from '../CurrencyNumber/CurrencyNumber';
import React from 'react';
import { getName } from '../../helpers/contacts';
import { truncateString } from '../../helpers/string';
import { BreakDownContainer } from '../BreakDownContainer/BreakDownContainer';
import TaskBreakDownBody from '../TaskBreakDownBody/TaskBreakDownBody';
import PdfViewer from '../PdfViewer/PdfViewer';
import TaskPdfSignature from '../TaskPdfSignature/TaskPdfSignature';

/* eslint-disable-next-line */
export interface TaskSummaryCardProps {
  task: TaskGuest | null | undefined;
  isGuest?: boolean;
}

export function TaskSummaryCard({ isGuest, task }: TaskSummaryCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [truncateStringLength, setTruncateStringLength] = React.useState<
    number | undefined
  >(60);

  const noData = (
    <WBTypography
      component={'span'}
      fontSize={'inherit'}
      fontStyle={'italic'}
      fontWeight={'medium'}
      color={'error.main'}
    >
      {t('noData', { ns: 'taskbox' })}
    </WBTypography>
  );

  const isTax =
    (task?.from as AutocompleteResult | undefined)?.metadata?.subCategory ===
    'TAX';
  const isBpay =
    !isTax &&
    //@ts-ignore
    (task?.from as AutocompleteResult | undefined)?.metadata?.type === 'BPAY';

  const dueDate = React.useMemo(() => {
    let dueAt: string | undefined | null = '';
    if (isTax) {
      dueAt = task?.paymentAt;
    } else if (task?.paymentFrequency !== PaymentFrequency.ONCE) {
      if (task && 'firstPaymentAt' in task)
        dueAt = task?.firstPaymentAt as string;
    } else {
      dueAt = task?.dueAt;
    }
    return dueAt;
  }, [isTax, task?.dueAt, task?.paymentAt, task?.paymentFrequency]);

  const [pdfViewerOpen, setPdfViewerOpen] = React.useState(false);

  return (
    <WBFlex
      sx={{
        flexDirection: 'column',
        minHeight: '630px',
        minWidth: '100%',
        boxShadow: theme.shadows[6],
        bgcolor: theme.palette.background.default,
      }}
    >
      <WBBox sx={{ px: 5 }} flexGrow={1}>
        <WBFlex justifyContent={'space-between'} mt={5}>
          <WBBox sx={{ fontSize: theme.typography.body2.fontSize }}>
            <WBTypography fontSize={'inherit'}>
              {t('from', { ns: 'taskbox' })}
            </WBTypography>
            <WBTypography fontSize={'inherit'} fontWeight={'bold'} my={0.3}>
              {isGuest
                ? getName(task?.fromEntity)
                : getName(task?.from) || noData}
            </WBTypography>
          </WBBox>

          {task?.lodgementAt && isTax ? (
            <WBBox sx={{ fontSize: theme.typography.body2.fontSize }}>
              <WBTypography fontSize={'inherit'} textAlign={'end'}>
                {t('lodgementAt', { ns: 'taskbox' })}
              </WBTypography>
              <WBTypography
                fontSize={'inherit'}
                fontWeight={'bold'}
                textAlign={'end'}
                my={0.3}
              >
                {DateTime.fromISO(task?.lodgementAt).toLocaleString(
                  DateTime.DATE_SHORT
                )}
              </WBTypography>
            </WBBox>
          ) : (
            <WBBox sx={{ fontSize: theme.typography.body2.fontSize }}>
              <WBTypography fontSize={'inherit'} textAlign={'end'}>
                {t('dueAt', { ns: 'taskbox' })}
              </WBTypography>
              <WBTypography
                fontSize={'inherit'}
                textAlign={'end'}
                fontWeight={'bold'}
                my={0.3}
              >
                {dueDate
                  ? DateTime.fromISO(dueDate).toLocaleString(
                      DateTime.DATE_SHORT
                    )
                  : ''}
              </WBTypography>
            </WBBox>
          )}
        </WBFlex>
        <WBFlex justifyContent={'space-between'} mt={5} my={2}>
          <WBBox sx={{ fontSize: theme.typography.body2.fontSize }}>
            <WBTypography fontSize={'inherit'} fontWeight={'normal'}>
              {t('to', { ns: 'taskbox' })}
            </WBTypography>
            <WBTypography fontSize={'inherit'} fontWeight={'bold'} my={0.3}>
              {isGuest
                ? getName(task?.toContact ?? task?.toEntity)
                : task?.to
                ? getName(task?.to)
                : // cloneContactWithSearchName(task?.to as Contact)?.searchName
                  noData}
            </WBTypography>
          </WBBox>
          {isTax && task?.type !== TaskType.SIGN_ONLY ? (
            <WBBox sx={{ fontSize: theme.typography.body2.fontSize }}>
              <WBTypography fontSize={'inherit'} textAlign={'end'}>
                {t('paymentAt', { ns: 'taskbox' })}
              </WBTypography>
              <WBTypography
                fontSize={'inherit'}
                textAlign={'end'}
                fontWeight={'bold'}
                my={0.3}
              >
                {dueDate
                  ? DateTime.fromISO(dueDate).toLocaleString(
                      DateTime.DATE_SHORT
                    )
                  : ''}
              </WBTypography>
            </WBBox>
          ) : null}
          {isGuest && (task?.documents ?? [])?.length > 0 ? (
            <WBFlex>
              <WBLink
                component={'button'}
                fontSize={'body2.fontSize'}
                underline="always"
                onClick={() => {
                  setPdfViewerOpen(true);
                  // setSelectedTask(task);
                }}
              >
                {t('viewInvoice', { ns: 'taskbox' })}
              </WBLink>
            </WBFlex>
          ) : null}
        </WBFlex>

        <WBDivider
          sx={{
            bgcolor: theme.palette.grey[300],
            my: 4,
          }}
          light
        />
        <BreakDownContainer>
          {(show: boolean) =>
            task?.type !== TaskType.SIGN_ONLY && (
              <WBFlex
                height={isGuest ? '380px' : '100%'}
                flexDirection={'column'}
              >
                <WBFlex>
                  {!show && isGuest && (
                    <WBFlex
                      flexDirection={'column'}
                      height={['220px', '300px']}
                      flex={{ sm: 6 }}
                      // px={[0, 5, 10]}
                      pr={[0, 2, 3]}
                      mb={[3, 10]}
                    >
                      {task && (
                        <TaskPdfSignature
                          task={task as any}
                          minHeight={['150px', '150px']}
                          isGuest={isGuest}
                        />
                      )}
                      {/* {task && <TaskPdfSignature task={task} />} */}
                      {/* <PdfViewer
                        documentUrl={task?.documents?.[0]?.key}
                        annotations={task?.annotations}
                      /> */}
                      {/* <PdfViewer documentUrl={task.value?.[0]?.src} /> */}
                    </WBFlex>
                  )}
                  <WBFlex
                    flexGrow={1}
                    flexDirection={'column'}
                    alignItems={'flex-end'}
                  >
                    <WBTypography variant="h5">
                      {t('amount', { ns: 'taskbox' })}
                    </WBTypography>
                    {task?.amount ? (
                      <CurrencyNumber
                        color={'text.primary'}
                        number={
                          ((typeof task?.amount === 'string'
                            ? parseFloat(task?.amount)
                            : task?.amount) ?? 0) / (isGuest ? 100 : 1)
                        }
                        variant="h2"
                      ></CurrencyNumber>
                    ) : (
                      <WBTypography
                        fontSize={'h2.fontSize'}
                        fontStyle={'italic'}
                        fontWeight={'medium'}
                        color={'grey'}
                      >
                        {t('noData', { ns: 'taskbox' })}
                      </WBTypography>
                    )}
                    {!isGuest ? (
                      <WBTypography
                        fontWeight={'medium'}
                        sx={{
                          textDecorationLine: 'underline',
                          textDecorationStyle: 'dashed',
                          textUnderlineOffset: '5px',
                          // borderBottom: `1px dashed ${theme.palette.common.black}`,
                        }}
                      >
                        {t(task?.paymentFrequency ?? '', { ns: 'taskbox' })}
                      </WBTypography>
                    ) : (
                      <BreakDownContainer.Link
                        title={t('showBreakDown', {
                          ns: 'taskbox',
                        })}
                      />
                    )}
                  </WBFlex>
                </WBFlex>
                <BreakDownContainer.Body>
                  <WBBox mt={3}>
                    <TaskBreakDownBody task={task} isGuest />
                  </WBBox>
                </BreakDownContainer.Body>
              </WBFlex>
            )
          }
        </BreakDownContainer>
      </WBBox>
      <WBFlex
        justifyContent={'space-between'}
        mt={3}
        sx={{
          bgcolor: alpha(theme.palette.warning.main, 0.1),
        }}
        p={5}
      >
        {!isGuest && (
          <WBBox flex={1} sx={{ fontSize: theme.typography.body2.fontSize }}>
            <WBTypography fontSize={'inherit'}>
              {t('type', { ns: 'taskbox' })}
            </WBTypography>
            <WBTypography fontSize={'inherit'} fontWeight={'bold'} my={0.3}>
              {t(task?.type ?? '', { ns: 'taskbox' })}
            </WBTypography>
          </WBBox>
        )}

        <WBBox
          flex={1}
          sx={{
            fontSize: theme.typography.body2.fontSize,
          }}
        >
          <WBTypography fontSize={'inherit'}>
            {t(
              isTax
                ? 'paymentReferenceNumber'
                : isBpay
                ? 'bpayReferenceNumber'
                : task?.type === TaskType.SIGN_ONLY
                ? 'referenceNumber'
                : 'invoiceNumber',
              {
                ns: 'taskbox',
              }
            )}
          </WBTypography>
          <WBTypography fontSize={'inherit'} fontWeight={'bold'} mt={0.3}>
            {task?.reference || noData}
          </WBTypography>
        </WBBox>

        {isGuest && (
          <WBBox
            flex={1}
            ml={2}
            sx={{ fontSize: theme.typography.body2.fontSize }}
          >
            <WBTypography fontSize={'inherit'}>
              {t('note', { ns: 'taskbox' })}
            </WBTypography>
            <WBTypography fontSize={'inherit'} fontWeight={'bold'} my={0.3}>
              {t(
                truncateString(task?.noteForOther ?? '', truncateStringLength),
                {
                  ns: 'taskbox',
                }
              )}{' '}
              {truncateStringLength ? (
                <WBLink
                  underline="always"
                  fontSize={'inherit'}
                  fontWeight={'bold'}
                  onClick={() => {
                    setTruncateStringLength(undefined);
                  }}
                  component={'button'}
                >
                  {t('viewMore', { ns: 'taskbox' })}
                </WBLink>
              ) : (
                <WBLink
                  underline="always"
                  fontSize={'inherit'}
                  fontWeight={'bold'}
                  onClick={() => {
                    setTruncateStringLength(60);
                  }}
                  component={'button'}
                >
                  {t('viewLess', { ns: 'taskbox' })}
                </WBLink>
              )}
            </WBTypography>
          </WBBox>
        )}
      </WBFlex>
      <WBDialog
        open={pdfViewerOpen}
        maxWidth={'sm'}
        fullWidth
        sx={{ '& .MuiPaper-root': { overflow: 'visible' } }}
        onClose={() => setPdfViewerOpen(false)}
      >
        <WBFlex
          flexDirection={'row'}
          height={'70vh'}
          overflow={'visible'}
          position={'relative'}
        >
          {task && (
            <TaskPdfSignature
              task={task as any}
              minHeight={['150px', '150px']}
              isGuest={isGuest}
            />
          )}
          <WBIconButton
            aria-label="close"
            icon="Close"
            onClick={(e) => setPdfViewerOpen(false)}
            sx={{
              position: 'absolute',
              right: -40,
              top: -40,
              color: (theme) => theme.palette.grey[500],
            }}
          />
        </WBFlex>
      </WBDialog>
    </WBFlex>
  );
}

export default TaskSummaryCard;
