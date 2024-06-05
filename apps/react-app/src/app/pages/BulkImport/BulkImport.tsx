import { WBFullScreenModal } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { Image } from '@admiin-com/ds-common';
import { CsvMapFields } from '../CSVMapFields/CsvMapFields';
import { CsvUpload } from '../CsvUpload/CsvUpload';
import PageSelector from '../../components/PageSelector/PageSelector';
interface BulkImportProps {
  open: boolean;
  handleCloseModal: () => void;
}

export type PageType = 'Upload' | 'Map';

export function BulkImport({ open, handleCloseModal }: BulkImportProps) {
  const { t } = useTranslation();

  const [csvFile, setCSVFile] = React.useState<File>();
  const [page, setPage] = React.useState<PageType>('Upload');
  const [uploadMedia, setUploadedMedia] = React.useState<Image | null>(null);

  const handleSubmitted = () => {
    setTimeout(() => {
      handleCloseModal();
      setPage('Map');
    }, 2500);
  };

  return (
    <WBFullScreenModal
      leftToolbarIconProps={{
        onClick: () =>
          page === 'Map' ? setPage('Upload') : handleCloseModal(),
      }}
      leftToolbarIconTitle={
        page === 'Upload'
          ? t('bulkImportContacts', { ns: 'contacts' })
          : t('contacts', { ns: 'contacts' })
      }
      onClose={handleCloseModal}
      title={
        page === 'Upload'
          ? t('mapCSVfields', { ns: 'contacts' })
          : t('bulkImportContacts', { ns: 'contacts' })
      }
      open={open}
    >
      <PageSelector current={page}>
        <PageSelector.Page value={'Map'}>
          <CsvMapFields
            file={csvFile}
            fileKey={uploadMedia?.key ?? ''}
            onSubmitted={handleSubmitted}
          />
        </PageSelector.Page>
        <PageSelector.Page value={'Upload'}>
          <CsvUpload
            onUploaded={(media, file) => {
              setPage('Map');
              setCSVFile(file);
              setUploadedMedia(media);
            }}
          />
        </PageSelector.Page>
      </PageSelector>
    </WBFullScreenModal>
  );
}
