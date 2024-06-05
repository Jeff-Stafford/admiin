import { render } from '@testing-library/react';

import { Accordion } from './Accordion';

describe('Accordion', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Accordion
        items={[
          {
            title: 'Nullam quis nisl vel orci tempus',
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ac justo arcu. Nunc quis lectus faucibus, fringilla nunc vitae, posuere mi',
            icon: 'Briefcase',
          },
        ]}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
