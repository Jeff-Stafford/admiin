import React, { useCallback, useEffect, useState } from 'react';
import { WBBox, WBSkeleton, SxProps, Theme } from '@admiin-com/ds-web';
import { fileType, S3Level } from '@admiin-com/ds-common';
import { Storage } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';
import { getFromS3Storage } from '@admiin-com/ds-amplify';
import { usePrevious } from '@admiin-com/ds-hooks';

interface S3ImageProps {
  src?: string | null;
  identityId?: string | null;
  body?: any;
  contentType?: string;
  imgKey?: string | null | undefined;
  level?: S3Level;
  alt?: string | null;
  sx?: SxProps<Theme>;
  responsive?: boolean;
}

export const S3Image = ({
  src,
  imgKey,
  identityId = null,
  level = 'protected',
  alt,
  body,
  contentType,
  responsive = true,
  sx = {},
  ...other
}: S3ImageProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const prevBody = usePrevious(body);
  const [imageUri, setImageUri] = useState(src || '');
  const [imageError, setImageError] = useState(false);

  const getImageSource = useCallback(
    async (byPassCache = false) => {
      if (imgKey) {
        try {
          const url = await getFromS3Storage(
            imgKey,
            identityId || null,
            level,
            byPassCache
          );
          setImageUri(url);
        } catch (err) {
          console.warn('Err get image:', err);
        }

        setLoading(false);
      }
    },
    [identityId, imgKey, level]
  );

  const load = useCallback(async () => {
    if (body) {
      setLoading(true);
      const type = contentType ? contentType : 'binary/octet-stream';
      const config = {
        contentType: type,
        level,
      };
      try {
        const key = `${uuidv4()}.${fileType(body.name)}`;
        await Storage.put(key, body, config);
        await getImageSource();
      } catch (err) {
        console.warn(err);
      }
    } else if (imgKey) {
      setLoading(true);
      await getImageSource();
    }
  }, [body, contentType, getImageSource, imgKey, level]);

  useEffect(() => {
    if (imgKey) {
      setLoading(true);
      getImageSource();
    }
  }, [getImageSource, imgKey]);

  useEffect(() => {
    if (prevBody !== body) {
      load();
    }
  }, [body, load, prevBody]);

  const onError = async () => {
    console.log('image error');
    if (!imageError) {
      try {
        await getImageSource(true);
      } catch (err) {
        setImageError(true);
      }
    }
  };

  if (loading) {
    return <WBSkeleton variant="circular" sx={sx} />;
  }

  return (
    <WBBox
      component="img"
      src={imageUri || src}
      srcSet={imageUri}
      alt={alt}
      onError={onError}
      loading="lazy"
      sx={
        responsive
          ? {
              objectFit: 'cover',
              minWidth: '100%',
              minHeight: '100%',
              ...sx,
            }
          : sx
      }
      {...other}
    />
  );
};
