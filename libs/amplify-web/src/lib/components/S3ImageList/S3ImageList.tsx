import React from 'react';
import { Image } from '@admiin-com/ds-common';
import {
  WBButton,
  WBIconButton,
  WBImageList,
  WBImageListItem,
  WBImageListItemBar,
} from '@admiin-com/ds-web';
import { S3Image } from '../S3Image/S3Image';

export interface ImageListProps {
  images: Image[];
  cols?: number;
  actionIcon?: string;
  onActionClick?: (index: number, image: Image) => void; //TODO: set as required if actionIcon set and vice versa
  onImageClick?: (index: number, image: Image) => void;
}

export const S3ImageList = ({
  images,
  cols = 3,
  actionIcon,
  onActionClick,
  onImageClick = (index: number, image: Image) =>
    console.log('image clicked: ', image, index),
}: ImageListProps) => {
  return (
    <WBImageList cols={cols}>
      {images.map((image: Image, index) => (
        <WBImageListItem key={image?.key || image?.src}>
          <WBButton
            variant="text"
            sx={{
              objectFit: 'cover',
              width: '100%',
              minHeight: '100%',
            }}
            type="button"
            onClick={() => onImageClick(index, image)}
          >
            <S3Image
              src={image.src}
              imgKey={image.key}
              identityId={image.identityId}
              level={image.level}
              alt={image.alt}
              sx={{
                objectFit: 'cover',
                width: '100%',
                minHeight: '100%',
              }}
            />
            {actionIcon && onActionClick && (
              <WBImageListItemBar
                sx={{
                  background: 'transparent',
                }}
                position="top"
                actionPosition="right"
                actionIcon={
                  <WBIconButton
                    icon={actionIcon}
                    onClick={() => onActionClick(index, image)}
                  />
                }
              />
            )}
            {image.title && (
              <WBImageListItemBar
                sx={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.7) 0%, ' +
                    'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                }}
                title={image.title}
                subtitle={image.subtitle || null}
              />
            )}
          </WBButton>
        </WBImageListItem>
      ))}
    </WBImageList>
  );
};
