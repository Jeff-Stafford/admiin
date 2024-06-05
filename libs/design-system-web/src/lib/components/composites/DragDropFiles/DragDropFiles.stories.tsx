import type { Meta } from '@storybook/react';
import { DragDropFiles } from './DragDropFiles';

const Story: Meta<typeof DragDropFiles> = {
  component: DragDropFiles,
  title: 'composites/DragDropFiles',
};
export default Story;

export const Primary = {
  args: {
    onFileDrop: (files: FileList) => console.log('files: ', files),
    uploadMessage: 'Drag n Drop files to upload',
    btnText: 'Select files',
  },
};

export const MaxFiles = {
  args: {
    ...Primary.args,
    maxFiles: 1,
  },
};

export const ImagesOnly = {
  args: {
    ...Primary.args,
    validFileTypes: ['image/jpeg', 'image/png', 'video/webm'],
    inputAccept: 'images/*',
    uploadMessage: 'Drag n Drop images to upload',
    btnText: 'Select images',
    maxSizeMB: 0.1,
    maxFiles: 6,
    maxWidthOrHeight: 500,
  },
};

export const FilesOnly = {
  args: {
    ...Primary.args,
    validFileTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
    ],
    inputAccept:
      'image/*, doc, .docx, .xml, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .pdf, text/plain, .xlsx, .xls',
  },
};
