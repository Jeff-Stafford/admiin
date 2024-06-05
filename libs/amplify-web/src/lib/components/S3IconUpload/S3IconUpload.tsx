import {
  fileType,
  S3Level,
  IMAGE_EXTENSIONS,
  S3Upload,
} from '@admiin-com/ds-common';
import { Auth } from 'aws-amplify';
import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WBBox, WBIconButton, imageResizer } from '@admiin-com/ds-web';
import { getFromS3Storage, uploadToS3Storage } from '@admiin-com/ds-amplify';

export interface S3IconUploadProps {
  icon: string;
  validFileTypes: string[];
  inputAccept: string;
  inputName?: string;
  level?: S3Level;
  maxFiles?: number | null;
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  alwaysKeepResolution?: boolean;
  useWebWorker?: boolean;
  onProgress?: (progress: number) => void;
  onUpload: (file: S3Upload) => void;
}

export const S3IconUpload = ({
  icon,
  validFileTypes = [],
  inputAccept,
  maxFiles = 1,
  inputName,
  level = 'protected',
  maxSizeMB,
  maxWidthOrHeight = 1920,
  alwaysKeepResolution = true,
  useWebWorker = true,
  onProgress,
  onUpload,
}: S3IconUploadProps) => {
  const [identityId, setIdentityId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const onSelect = () => {
    if (!inputRef.current?.files) {
      window.alert('Invalid upload');
      return;
    } else {
      if (maxFiles && inputRef.current?.files.length > maxFiles) {
        window.alert(`Only ${maxFiles} file can be uploaded`);
      } else if (inputRef.current?.files.length) {
        handleFiles(inputRef.current.files);
      }
    }
  };

  const handleFiles = (files: FileList) => {
    let isError = false;
    for (let i = 0; i < files.length; i++) {
      const invalidFileType = validFileTypes.indexOf(files[i].type) === -1;
      if (invalidFileType) {
        window.alert(`Invalid file type ${files[i].type}`);
        isError = true;
        break;
      }
    }

    if (!isError) {
      onFileDrop(files);
    }
  };

  const onFileDrop = async (files: FileList) => {
    if (onProgress) {
      onProgress(1);
    }

    console.log('fies: ', files);
    //setLoading(true);
    for (let i = 0; i < files.length; i++) {
      let file;
      if (maxSizeMB && IMAGE_EXTENSIONS.includes(files[i].type)) {
        const resizeOptions = {
          maxSizeMB,
          maxWidthOrHeight,
          alwaysKeepResolution,
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
            //}, (data: ProgressEvent) => setProgress((data.loaded / data.total) * 100));
          },
          !onProgress
            ? (data: ProgressEvent) => data
            : (data: ProgressEvent) =>
                onProgress((data.loaded / data.total) * 100)
        );

        const url = await getFromS3Storage(key, null, 'protected');
        console.log('url: ', url);
        onUpload({
          key,
          src: url,
          level,
          identityId,
          type: IMAGE_EXTENSIONS.includes(files[i].type) ? 'IMAGE' : 'FILE',
        });
        //setLoading(false);
      } catch (err) {
        //setLoading(false);
        if (onProgress) {
          onProgress(0);
        }
      }
    }

    // setProgress(0);
  };

  return (
    <>
      <WBIconButton icon={icon} onClick={() => inputRef.current?.click()} />
      <WBBox display="none">
        <input
          ref={inputRef}
          type="file"
          accept={inputAccept}
          name={inputName}
          multiple={maxFiles === null || maxFiles > 1}
          onChange={onSelect}
        />
      </WBBox>
    </>
  );
};
