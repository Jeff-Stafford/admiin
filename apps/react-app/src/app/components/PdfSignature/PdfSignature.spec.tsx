import { render } from '@testing-library/react';
import { createRef } from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { PdfSignature } from './PdfSignature';

describe('PdfSignature', () => {
  it('Empty document - should not render', () => {
    const mockRef = createRef();
    const { baseElement } = render(
      <MockedProvider>
        <PdfSignature
          ref={mockRef}
          documentUrl=""
          pdfId={'uuid'}
          annotations=""
        />
      </MockedProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
