import { render } from '@testing-library/react';
import { Flex } from '../../primatives/Flex/Flex';

import { Modal } from './Modal';

describe('Modal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Modal open={true}>
        <Flex></Flex>
      </Modal>
    );
    expect(baseElement).toBeTruthy();
  });
});
