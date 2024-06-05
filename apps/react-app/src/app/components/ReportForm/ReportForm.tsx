import { WBButton, WBFlex, WBRadio } from '@admiin-com/ds-web';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

type ReportFormProps = {
  onReport: (reportReason: string) => void;
  loading: boolean;
};
export const ReportForm = ({ onReport, loading }: ReportFormProps) => {
  const { t } = useTranslation();
  const reportReasons = useMemo(
    () => [
      {
        label: t('spamTitle', { ns: 'common' }),
        value: 'SPAM',
      },
      {
        label: t('offensiveTitle', { ns: 'common' }),
        value: 'OFFENSIVE',
      },
    ],
    [t]
  );
  const [reportReason, setReportReason] = useState('');

  return (
    <WBFlex flexDirection="column">
      {reportReasons?.map((reason) => (
        <WBRadio
          key={reason.value}
          label={reason.label}
          value={reason.value}
          checked={reportReason === reason.value}
          onChange={() => setReportReason(reason.value)}
        />
      ))}
      <WBButton
        sx={{
          mt: 3,
        }}
        disabled={!reportReason}
        loading={loading}
        color="error"
        onClick={() => onReport(reportReason)}
      >
        {t('reportAndBlock', { ns: 'common' })}
      </WBButton>
    </WBFlex>
  );
};
