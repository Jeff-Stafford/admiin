import React, { ReactNode } from 'react';
import {
  WBListItem,
  WBListItemAvatar,
  WBListItemText,
} from '@admiin-com/ds-web';
import { S3Avatar } from '../S3Avatar/S3Avatar';
import { S3Level } from '@admiin-com/ds-common';

export interface ListItemAvatarIconText {
  secondaryAction?: ReactNode;
  imgKey?: string;
  identityId?: string | null;
  level?: S3Level;
  primary: string;
  secondary?: string | ReactNode | null;
  src?: string;
}

export const S3ListItem = ({
  secondaryAction,
  imgKey,
  identityId,
  level,
  primary,
  secondary,
  src,
}: ListItemAvatarIconText) => {
  return (
    <WBListItem secondaryAction={secondaryAction || null}>
      {(imgKey || src) && (
        <WBListItemAvatar>
          <S3Avatar
            imgKey={imgKey}
            identityId={identityId}
            level={level}
            src={src}
          />
        </WBListItemAvatar>
      )}
      <WBListItemText primary={primary} secondary={secondary || null} />
    </WBListItem>
  );
};
