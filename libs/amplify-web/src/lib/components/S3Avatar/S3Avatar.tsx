import React, { useCallback, useEffect, useState } from 'react';
import {
  Avatar as MUIAvatar,
  AvatarProps as MUIAvatarProps,
  Skeleton as MUISkeleton,
  useTheme,
} from '@mui/material';
import { fileType, Image, S3Level } from '@admiin-com/ds-common';
import { usePrevious } from '@admiin-com/ds-hooks';
import { Storage } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';
import { WBBox } from '@admiin-com/ds-web';
import { getFromS3Storage } from '@admiin-com/ds-amplify';

interface S3AvatarProps extends MUIAvatarProps {
  src?: string;
  identityId?: string | null;
  body?: any;
  contentType?: string;
  imgKey?: string | null;
  level?: S3Level;
  companyName?: string;
  fontSize?: string;
  badgeBgColor?: string;
  onUpload?: (img: Image) => void;
  sx?: any;
}

export const S3Avatar = ({
  src,
  imgKey,
  identityId = null,
  level = 'protected',
  body,
  contentType,
  fontSize = 'h2.fontSize',
  companyName,
  badgeBgColor,
  onUpload,
  sx = {},
  ...other
}: S3AvatarProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const prevBody = usePrevious(body);
  const [imageUri, setImageUri] = useState<string>(src || '');
  const theme = useTheme();

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
        console.log('key: ', key);
        if (onUpload) {
          onUpload({
            key,
            identityId,
            level,
          });
        }
        await getImageSource();
      } catch (err) {
        console.warn(err);
        setLoading(false);
      }
    } else if (imgKey) {
      setLoading(true);
      await getImageSource();
    }
  }, [body, contentType, getImageSource, identityId, imgKey, level, onUpload]);

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

  //const onError = async () => {
  //  if (!imageError) {
  //    try {
  //      await getImageSource();
  //    } catch (err) {
  //      setImageError(true);
  //    }
  //  }
  //};

  if (loading) {
    return (
      <MUISkeleton
        variant="rectangular"
        sx={sx}
        width={sx?.width || undefined}
        height={sx?.height || undefined}
      />
    );
  }
  const renderAvatarContent = () => {
    if (imageUri) {
      return null; // No children needed when displaying an image
    } else if (companyName) {
      return (
        <WBBox
          component="span"
          sx={{
            fontSize, // Use theme's h3 font size
            // Additional styling for the text if needed
          }}
        >
          {companyName.charAt(0).toUpperCase()}
        </WBBox>
      );
    }
    return null; // Fallback content
  };
  const avatarStyle = imageUri
    ? { ...sx }
    : {
        ...sx,
        borderRadius: 0,
        //backgroundColor: theme.palette.grey.A100, // Specific background color
        color: theme.palette.text.primary,
        fontWeight: 900,
        width: sx?.width || 40, // Default width if not specified
        height: sx?.height || 40, // Default height if not specified
        // Additional styles for rectangle shape, if necessary
      };
  return (
    <MUIAvatar src={imageUri || src} sx={avatarStyle} {...other}>
      {renderAvatarContent()}
      {badgeBgColor && (
        <WBBox
          sx={{
            backgroundColor: badgeBgColor,
            width: '5px',
            height: '5px',
            borderRadius: '9999px',
          }}
        />
      )}
    </MUIAvatar>
  );
};
