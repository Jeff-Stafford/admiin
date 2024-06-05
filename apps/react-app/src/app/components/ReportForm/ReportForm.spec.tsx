import { render } from '@testing-library/react';

import { ReportForm } from './ReportForm';

describe('ReportForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ReportForm
        loading={true}
        onReport={(reportReason: string) =>
          console.log('report:', reportReason)
        }
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
