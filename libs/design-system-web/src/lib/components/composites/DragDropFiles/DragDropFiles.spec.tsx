import { render } from '@testing-library/react';

import { DragDropFiles } from './DragDropFiles';

describe('DragDropUpload', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DragDropFiles
        btnText="Upload"
        inputAccept="images/*"
        uploadMessage="Upload images"
        validFileTypes={['image/jpeg', 'image/png']}
        onFileDrop={(files) => console.log('files: ', files)}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
