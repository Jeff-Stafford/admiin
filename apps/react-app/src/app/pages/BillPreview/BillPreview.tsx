import { S3Upload } from '@admiin-com/ds-common';
import { WBS3Image } from '@admiin-com/ds-amplify-web';

interface BillPreviewProps {
  document?: S3Upload | Array<S3Upload | null> | null;
}

export function BillPreview({ document }: BillPreviewProps) {
  return Array.isArray(document) ? (
    <WBS3Image
      src={document?.[0]?.src}
      identityId={document?.[0]?.identityId}
      contentType={document?.[0]?.type}
      sx={{
        bgcolor: 'background.paper',
        boxShadow: '0 8.5px 17px -10px rgba(0, 0, 0, 0.5);',
      }}
      imgKey={document?.[0]?.key}
      level={document?.[0]?.level}
    />
  ) : (
    <WBS3Image
      src={document?.src}
      identityId={document?.identityId}
      contentType={document?.type}
      sx={{
        bgcolor: 'background.paper',
        boxShadow: '0 8.5px 17px -10px rgba(0, 0, 0, 0.5);',
      }}
      imgKey={document?.key}
      level={document?.level}
    />
  );
}
