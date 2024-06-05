import {
  WBBox,
  WBCard,
  WBCardContent,
  WBFlex,
  WBSkeleton,
  WBTypography,
} from '@admiin-com/ds-web';
import { CurrencyNumber } from '../CurrencyNumber/CurrencyNumber';
import { Task, TaskDirection } from '@admiin-com/ds-graphql';
import PdfViewer from '../PdfViewer/PdfViewer';
import TaskBadge from '../TaskBadge/TaskBadge';
import TaskPdfSignature from '../TaskPdfSignature/TaskPdfSignature';

interface ContactFileCardProps {
  contactFile: Task | undefined;
}
export function ContactFileCard({ contactFile }: ContactFileCardProps) {
  return (
    <WBCard
      sx={{
        px: 3,
        pt: 2,
        bgcolor: 'background.default',
        minWidth: '300px',
      }}
    >
      <WBCardContent>
        <WBFlex justifyContent={'space-between'} width={'100%'}>
          {contactFile ? (
            <>
              <WBTypography variant="h5" mr={2} noWrap>
                {contactFile.reference}
              </WBTypography>
              <CurrencyNumber
                number={(contactFile.amount || 0) / 100}
                variant="h5"
                fontWeight={800}
              />
            </>
          ) : (
            <WBSkeleton height={'48px'} width="100%" />
          )}
        </WBFlex>
        <WBFlex justifyContent={'space-between'} mt={2}>
          {contactFile ? (
            <TaskBadge task={contactFile} direction={TaskDirection.RECEIVING} />
          ) : (
            <WBSkeleton height={'96px'} width="100%" />
          )}
          {contactFile ? (
            <WBBox
              sx={{
                width: '80px',
                height: '100px',
              }}
              mb={3}
            >
              <TaskPdfSignature task={contactFile} minHeight={100} />
            </WBBox>
          ) : (
            <WBSkeleton sx={{ ml: 4 }} height={'96px'} width="100%" />
          )}
        </WBFlex>
      </WBCardContent>
    </WBCard>
  );
}
