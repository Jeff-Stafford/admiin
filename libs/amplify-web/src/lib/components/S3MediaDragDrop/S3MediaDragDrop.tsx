import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';
import {
  S3Level,
  fileType,
  Image,
  S3Upload,
  S3UploadType,
} from '@admiin-com/ds-common';
import {
  WBBox,
  WBDragDropFiles,
  WBTypography,
  WBProgressBar,
  imageResizer,
} from '@admiin-com/ds-web';
import { getFromS3Storage, uploadToS3Storage } from '@admiin-com/ds-amplify';
import { LinkProps } from 'libs/design-system-web/src/lib/components/primatives/Link/Link';

interface MediaUploadPreviewProps {
  maxFiles?: number;
  validFileTypes: string[];
  inputAccept: string;
  onImageUpload?: (img: Image, file: File) => void;
  onUploaded?: (img: S3Upload[]) => void;
  level?: S3Level;
  maxSizeMB?: number;
  uploadMessage: string | React.ReactNode;
  uploadBtnText: string;
  maxWidthOrHeight?: number;
  alwaysKeepResolution?: boolean;
  useWebWorker?: boolean;
  uploadBtnTextProps?: LinkProps;
}

export const S3MediaDragDrop = ({
  validFileTypes,
  inputAccept,
  onImageUpload,
  onUploaded,
  maxFiles = 1,
  level = 'protected',
  maxSizeMB,
  uploadMessage,
  uploadBtnText,
  maxWidthOrHeight = 1920,
  alwaysKeepResolution = true,
  useWebWorker = true,
  uploadBtnTextProps,
}: MediaUploadPreviewProps) => {
  const [identityId, setIdentityId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const getIdentityId = async () => {
      const data = await Auth.currentUserCredentials();
      setIdentityId(data?.identityId);
    };
    if (level !== 'public') {
      //TODO: see if condition is required for public
      getIdentityId();
    }
  }, [level]);

  const onFileDrop = async (files: FileList) => {
    if (!identityId && level !== 'public') {
      setError('Error uploading media. Please re-open screen');
    }

    //setLoading(true);
    const images: S3Upload[] = [];
    for (let i = 0; i < files.length; i++) {
      let file;
      if (maxSizeMB && files[i].type.startsWith('image/')) {
        const resizeOptions = {
          maxSizeMB,
          alwaysKeepResolution,
          maxWidthOrHeight,
          useWebWorker,
        };

        file = await imageResizer(files[i], resizeOptions);
      } else {
        file = files[i];
      }

      try {
        const fileName = `${uuidv4()}.${fileType(files[i].name)}`;
        const { key } = await uploadToS3Storage(
          {
            key: fileName,
            contentType: files[i].type,
            file,
            level,
          },
          (data: ProgressEvent) => setProgress((data.loaded / data.total) * 100)
        );

        const url = await getFromS3Storage(key, null, level);
        const image = {
          key,
          src: url,
          level,
          identityId,
        };
        let type: S3UploadType = 'FILE';
        if (files[i].type.startsWith('/image')) type = 'IMAGE';
        if (files[i].type.startsWith('/video')) type = 'VIDEO';
        if (files[i].type.startsWith('/pdf')) type = 'PDF';
        images.push({ ...image, type });
        onImageUpload && onImageUpload(image, file);
        //setLoading(false);
      } catch (err) {
        console.log('ERROR upload file S3MediaDragDrop: ', err);
        //setLoading(false);
      }
      onUploaded && onUploaded(images);
      setProgress(0);
    }

    setProgress(0);
  };

  return (
    <>
      <WBDragDropFiles
        onFileDrop={onFileDrop}
        validFileTypes={validFileTypes}
        inputAccept={inputAccept}
        maxFiles={maxFiles}
        uploadMessage={uploadMessage}
        btnText={uploadBtnText}
        btnTextProps={uploadBtnTextProps}
      />

      {error && <WBTypography color="error">{error}</WBTypography>}
      {progress > 0 && (
        <WBBox mt={1}>
          <WBProgressBar value={progress} variant="determinate" />
        </WBBox>
      )}
    </>
  );
};
