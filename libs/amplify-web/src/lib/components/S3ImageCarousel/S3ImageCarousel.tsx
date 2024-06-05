import React, { useState } from 'react';
import { Image } from '@admiin-com/ds-common';
import { WBAspectRatio, WBBox, WBIcon } from '@admiin-com/ds-web';
import { S3ImageList } from '../S3ImageList/S3ImageList';
import { S3Image } from '../S3Image/S3Image';

interface S3ImageCarouselProps {
  images: Image[];
  mediaAspectRatio: number;
}

export const S3ImageCarousel = ({
  images,
  mediaAspectRatio,
}: S3ImageCarouselProps) => {
  const [active, setActive] = useState(0);
  return (
    <>
      {images?.length === 0 && (
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
          <WBBox flex={1} textAlign="center">
            <WBIcon name="Image" size={8} />
          </WBBox>
        </WBAspectRatio>
      )}
      {images?.length > 0 && (
        <WBAspectRatio
          ratio={4 / 3}
          bgcolor="grey.100"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <S3Image
            src={images[active].src}
            imgKey={images[active].key}
            alt={images[active].alt}
            identityId={images[active].identityId}
            level={images[active].level}
            responsive
            sx={{}}
          />
        </WBAspectRatio>
      )}
      {images?.length > 1 && (
        <S3ImageList
          images={images}
          cols={2}
          onImageClick={(index: number) => setActive(index)}
        />
      )}
    </>
  );
};
