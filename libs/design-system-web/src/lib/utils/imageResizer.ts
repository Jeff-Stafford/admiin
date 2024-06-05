import imageCompression from 'browser-image-compression';

interface resizeOptions {
  /** @default Number.POSITIVE_INFINITY */
  maxSizeMB?: number;
  /** @default undefined */
  maxWidthOrHeight?: number;
  /** @default true */
  useWebWorker?: boolean;
  /** @default 10 */
  maxIteration?: number;
  /** Default to be the exif orientation from the image file */
  exifOrientation?: number;
  /** A function takes one progress argument (progress from 0 to 100) */
  onProgress?: (progress: number) => void;
  /** Default to be the original mime type from the image file */
  fileType?: string;
  /** @default 1.0 */
  initialQuality?: number;
  /** @default false */
  alwaysKeepResolution?: boolean;
  /** @default undefined */
  signal?: AbortSignal;
}
const defaultOptions = {
  maxSizeMB: 0.2,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  onProgress: (progress: number) => progress,
  alwaysKeepResolution: true,
};

//TODO: deep merge?
export const imageResizer = async (
  file: File,
  options: resizeOptions = defaultOptions
) => {
  return imageCompression(file, options);
};
