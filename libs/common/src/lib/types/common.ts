export type RequestStatus =
  | 'idle'
  | 'loading'
  | 'submitting'
  | 'success'
  | 'error';
export type AppError =
  | { message?: string; field?: string; code?: string }
  | object;
export type SelectOption = { label: string; value: string };

export type S3Level = 'public' | 'protected' | 'private';
export type S3UploadType = 'IMAGE' | 'PDF' | 'VIDEO' | 'FILE';

export type Image = {
  alt?: string | null;
  identityId?: string | null;
  key: string;
  level?: S3Level;
  src?: string | null;
  subtitle?: string | null;
  title?: string | null;
};

export type S3Upload = {
  identityId?: string | null;
  key: string;
  src?: string;
  level: S3Level;
  type: S3UploadType;
};
