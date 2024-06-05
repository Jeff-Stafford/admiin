//TODO: improve this => dont load all icons
//TODO: access index of object https://stackoverflow.com/questions/69449384/element-implicitly-has-an-any-type-because-expression-of-type-string-cant-b
import * as ioniconOutline from '@emotion-icons/ionicons-outline';
import * as ioniconSharp from '@emotion-icons/ionicons-sharp';
import * as ioniconSolid from '@emotion-icons/ionicons-solid';
import { EmotionIcon } from '@emotion-icons/emotion-icon';
import React, { useContext } from 'react';
import { Property } from 'csstype';
import { DesignSystemContext } from '../../composites/DesignSystemContextProvider/DesignSystemContextProvider';

const iconLibraries = {
  ioniconOutline,
  ioniconSharp,
  ioniconSolid,
};

export interface IconProps {
  library?: 'ioniconOutline' | 'ioniconSharp' | 'ioniconSolid';
  name: string;
  size?: 'small' | 'medium' | 'large' | number;
  color?: Property.Color;
}

export const Icon = ({
  library = 'ioniconOutline',
  name,
  size = 'medium',
  color,
}: IconProps) => {
  const { theme } = useContext(DesignSystemContext);
  const sizeMap = {
    small: theme.spacing(3),
    medium: theme.spacing(4),
    large: theme.spacing(5),
  };

  // @ts-ignore // TODO - remove or refactor icon component
  const ResolvedIcon: EmotionIcon = iconLibraries[library][name] || null;
  return ResolvedIcon ? (
    <ResolvedIcon
      color={color || theme.palette.text.primary}
      size={typeof size === 'number' ? theme.spacing(size) : sizeMap[size]}
    />
  ) : null;
};
