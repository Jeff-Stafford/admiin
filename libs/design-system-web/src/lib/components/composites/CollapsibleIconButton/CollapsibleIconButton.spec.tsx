import { render } from '@testing-library/react';
import { Icon } from '../../primatives/Icon/Icon';

import { CollapsibleIconButton } from './CollapsibleIconButton';

describe('CollapsibleIconButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <CollapsibleIconButton buttonText="Add item" icon={<Icon name="Add" />} />
    );
    expect(baseElement).toBeTruthy();
  });
});
