import { render } from '@testing-library/react';
import { Flex } from '../../primatives/Flex/Flex';
import { Tooltip } from './Tooltip';

describe('ToolTip', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Tooltip title="Tooltip">
        <Flex />
      </Tooltip>
    );
    expect(baseElement).toBeTruthy();
  });
});
