import type { Meta } from '@storybook/react';
import { Alert } from './Alert';

const Story: Meta<typeof Alert> = {
  component: Alert,
  title: 'composites/Alert',
};
export default Story;

export const Primary = {
  args: {
    children: 'This is a default alert',
  },
};

export const Success = {
  args: {
    severity: 'success',
    children: 'This is a success alert',
  },
};

export const Info = {
  args: {
    severity: 'info',
    children: 'This is an info alert',
  },
};

export const Warning = {
  args: {
    severity: 'warning',
    children: 'This is a warning alert',
  },
};

export const Error = {
  args: {
    severity: 'error',
    children: 'This is an error alert',
  },
};
