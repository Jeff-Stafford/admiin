// @Deprecated
//import { Skeleton } from '@mui/material';
import React, { useEffect, useState } from 'react';
//import { Image } from '@admiin-com/ds-common';
//import { SxProps, Theme } from '@admiin-com/ds-web';
import {
  WBAspectRatio,
  WBBox,
  WBCard,
  WBCardActions,
  WBCardContent,
  WBCardMedia,
  WBIcon,
  WBTypography,
} from '@admiin-com/ds-web';
import { getFromS3Storage } from '@admiin-com/ds-amplify';

//export interface S3CardProps extends MUICardProps {
//  image?: Image | undefined | null;
//  title?: string;
//  subTitle?: string;
//  description?: string;
//  cardActions?: ReactNode;
//  sx?: SxProps<Theme>;
//  mediaAspectRatio?: number;
//  additional?: ReactNode;
//}

export const S3Card = ({
  image,
  title,
  subTitle,
  description,
  cardActions,
  sx,
  variant = 'outlined',
  mediaAspectRatio = 16 / 9,
  additional,
}: any) => {
  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState<string>(image?.src || '');

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

  console.log('image: ', image);

  return (
    <WBCard variant={variant} sx={sx}>
      <WBAspectRatio
        ratio={mediaAspectRatio}
        bgcolor="grey.100"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}
      >
        {image && (
          <WBCardMedia
            component="img"
            image={imgUrl}
            //alt={image.alt || ''}
          >
            {/*{ loading && <Skeleton width="100%" height="100%"/> }*/}
          </WBCardMedia>
        )}

        {/*{loading && <Skeleton width="100%" height="100%"/>}*/}

        {!loading && !image && (
          <WBBox flex={1} textAlign="center">
            <WBIcon name="Image" size={8} />
          </WBBox>
        )}
      </WBAspectRatio>
      <WBCardContent>
        {title && (
          <WBTypography
            gutterBottom
            variant="h4"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
            }}
          >
            {title}
          </WBTypography>
        )}

        {subTitle && (
          <WBTypography
            variant="h5"
            color="error"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
            }}
          >
            {subTitle}
          </WBTypography>
        )}
        {additional}
        <WBBox>
          {description && (
            <WBTypography
              variant="body2"
              color="text.secondary"
              whiteSpace="pre-line"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: '3',
                WebkitBoxOrient: 'vertical',
              }}
            >
              {description}
            </WBTypography>
          )}
        </WBBox>
      </WBCardContent>
      {cardActions && <WBCardActions>{cardActions}</WBCardActions>}
    </WBCard>
  );
};
