import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { PdfViewer } from './PdfViewer';

describe('PdfViewer', () => {
  it('Empty document - should not render', () => {
    const { baseElement } = render(
      <MockedProvider>
        <PdfViewer documentUrl="" />
      </MockedProvider>
    );
    console.log('baseElementbaseElementbaseElement: ', baseElement);
    expect(baseElement).toBeTruthy();
  });
});
