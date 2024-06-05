import React, { ReactNode, useEffect, useState } from 'react';
import { Image } from '@admiin-com/ds-common';
import { SxProps, Theme, WBCardMedia } from '@admiin-com/ds-web';
import { getFromS3Storage } from '@admiin-com/ds-amplify';

export interface S3CardMediaProps {
  image?: Image | undefined | null;
  title?: string;
  subTitle?: string;
  description?: string;
  cardActions?: ReactNode;
  sx?: SxProps<Theme>;
  mediaAspectRatio?: number;
  additional?: ReactNode;
}

export const S3CardMedia = ({ image }: S3CardMediaProps) => {
  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState<string>(image?.src || '');

  useEffect(() => {
    console.log('loading: ', loading);
  }, [loading]);

  useEffect(() => {
    const getImage = async () => {
      setLoading(true);
      if (image?.key) {
        try {
          const url = await getFromS3Storage(
            image.key,
            image?.identityId || null
          );
          setImgUrl(url);
        } catch (err) {
          console.log('ERROR load S3 card image: ', err);
        }
      }

      setLoading(false);
    };

    if (image?.key && !image?.src) {
      getImage();
    }
  }, [image]);

  return image ? (
    <WBCardMedia
      //component="img"
      image={imgUrl}
      //alt={image.alt || ''}
    />
  ) : null;
};
