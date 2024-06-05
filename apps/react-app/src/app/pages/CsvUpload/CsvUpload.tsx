import { WBBox, WBFlex, WBLink, WBTypography } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { S3MediaDragDrop } from 'libs/amplify-web/src/lib/components/S3MediaDragDrop/S3MediaDragDrop';
import { Image } from '@admiin-com/ds-common';
import { ConnectDisconnectXero } from '../../components/ConnectDisconnectXero/ConnectDisconnectXero';

interface CsvUploadProps {
  onUploaded: (media: Image, file: File) => void;
}

export function CsvUpload({ onUploaded }: CsvUploadProps) {
  const { t } = useTranslation();
  return (
    <WBFlex width={'100%'} justifyContent={'center'}>
      <WBFlex
        flexDirection="column"
        alignItems="center"
        width={{
          xs: '100%',
          sm: '80%',
          md: '80%',
          lg: '60%',
        }}
      >
        <WBFlex
          flexDirection={'column'}
          alignItems={'center'}
          justifyContent={'center'}
          alignSelf="stretch"
          mt={[1, 7, 15]}
        >
          <WBTypography
            component={'div'}
            align="center"
            fontWeight={'regular'}
            textAlign={'center'}
            justifyContent={'center'}
          >
            <WBLink
              underline="always"
              display={'inline'}
              fontWeight={'medium'}
              component={'span'}
            >
              {t('downloadCSVTemplates', { ns: 'contacts' })}
            </WBLink>{' '}
            {t('toUploadCSV', { ns: 'contacts' })}
          </WBTypography>
          <WBBox mt={10} width="100%">
            <S3MediaDragDrop
              validFileTypes={['text/csv']}
              inputAccept={'text/csv'}
              level="private"
              onImageUpload={(image: Image, file) => {
                onUploaded(image, file);
              }}
              uploadMessage={
                <>
                  <WBTypography
                    textAlign={'center'}
                    fontWeight={'bold'}
                    variant="body1"
                    mt={3}
                  >
                    {t('clickToUploadCSV', { ns: 'contacts' })}
                  </WBTypography>

                  <WBTypography
                    color={'text.secondary'}
                    textAlign={'center'}
                    variant="body1"
                    mt={1}
                  >
                    {`${t('supportedFiles', { ns: 'contacts' })}: CSV`}
                  </WBTypography>
                </>
              }
              uploadBtnText={'Select File'}
            />
          </WBBox>
          <WBBox width="100%" mt={8}>
            <ConnectDisconnectXero />
          </WBBox>
        </WBFlex>
      </WBFlex>
    </WBFlex>
  );
}
