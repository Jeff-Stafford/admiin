import type { Meta } from '@storybook/react';
import { Typography } from '../../primatives/Typography/Typography';
import { Modal } from './Modal';

//TODO: close modal

const Story: Meta<typeof Modal> = {
  component: Modal,
  title: 'composites/Modal',
};
export default Story;

export const Primary = {
  args: {
    open: true,
    title: 'Donec ac tempor ante, iaculis tincidunt arcu',
    children: (
      <Typography>
        Maecenas a dignissim leo. Suspendisse potenti. Nunc at consequat erat,
        eu semper leo. Nam quis elementum est, sed eleifend arcu. Vivamus
        fringilla a nulla dignissim euismod. Duis leo augue, aliquet eu
        consequat sed, accumsan in sapien. Cras tincidunt tempus dapibus.
        Vivamus consectetur porta leo quis lobortis. Cras porttitor tortor
        venenatis dolor euismod mattis. Fusce nisl tellus, vehicula in sapien
        in, rhoncus sodales enim. Nam tellus tellus, lobortis et fringilla sit
        amet, vestibulum vel dolor. Cras convallis volutpat vulputate. Mauris
        eget dignissim erat. Class aptent taciti sociosqu ad litora torquent per
        conubia nostra
      </Typography>
    ),
  },
};
