import type { Meta } from '@storybook/react';
import React from 'react';
import { Image } from '../../primatives/Image/Image';
import { IphoneDevice } from './IphoneDevice';
import IPHONE_PLACEHOLDER from '../../../../assets/images/iphone-13-screenshot.png';

const Story: Meta<typeof IphoneDevice> = {
  component: IphoneDevice,
  title: 'composites/IPhoneDevice',
};
export default Story;

export const Primary = {
  args: {
    children: <Image src={IPHONE_PLACEHOLDER} responsive />,
  },
};
