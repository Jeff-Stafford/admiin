//import { AnnotationStatus } from '@admiin-com/ds-graphql';
import PSPDFKit, { AnnotationsUnion, Color } from 'pspdfkit';
import { renderToString } from 'react-dom/server';
import { v4 as uuidv4 } from 'uuid';

export const dataURLToBlob = (dataURL: string) => {
  const parts = dataURL.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const uInt8Array = new Uint8Array(raw.length);

  for (let i = 0; i < raw.length; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
};

// remove blank space from canvas
export function trimCanvas(canvas: HTMLCanvasElement) {
  const croppedCanvas = document.createElement('canvas');
  const croppedCtx = croppedCanvas.getContext('2d');
  if (!croppedCtx) {
    return '';
  }
  croppedCanvas.width = canvas.width;
  croppedCanvas.height = canvas.height;
  croppedCtx.drawImage(canvas, 0, 0);

  let w = croppedCanvas.width;
  let h = croppedCanvas.height;
  const pix: {
    x: number[];
    y: number[];
  } = { x: [], y: [] };
  const imageData = croppedCtx.getImageData(0, 0, w, h);

  let index = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      index = (y * w + x) * 4;

      if (
        imageData.data[index] === 255 &&
        imageData.data[index + 1] === 255 &&
        imageData.data[index + 2] === 255 &&
        imageData.data[index + 3] === 255
      ) {
        continue;
      }

      if (imageData.data[index + 3] > 0) {
        pix.x.push(x);
        pix.y.push(y);
      }
    }
  }

  pix.x.sort((a, b) => a - b);
  pix.y.sort((a, b) => a - b);
  const n = pix.x.length - 1;

  if (pix.x.length === 0 && pix.y.length === 0) {
    return '';
  }
  w = pix.x[n] - pix.x[0];
  h = pix.y[n] - pix.y[0];
  const cut = croppedCtx.getImageData(pix.x[0], pix.y[0], w, h);

  croppedCanvas.width = w + 40;
  croppedCanvas.height = h + 40;
  croppedCtx.putImageData(cut, 20, 20);

  return croppedCanvas.toDataURL();
}

export const getExtensionFromContentType = (contentType: string) =>
  contentType.split('/').pop();

export function getBlobFromCanvas(canvas: HTMLCanvasElement) {
  const dataUrl: string = trimCanvas(canvas);
  return dataURLToBlob(dataUrl);
}

export async function downloadPdf(pdfSignatureRef: any) {
  const pdf = await pdfSignatureRef?.current?.exportPDF();
  const blob = new Blob([pdf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'document.pdf';
  a.click();
  URL.revokeObjectURL(url);
}

export const createCustomSignatureNode = (
  placeholderUi: any,
  customData: any
) => {
  const isPlaceholderView = customData?.status === 'PENDING'; //AnnotationStatus.PENDING;
  const div = document.createElement('div');
  if (isPlaceholderView) {
    div.style.cssText = 'height: 100%;display: flex;align-items: center;';
    //@ts-ignore TODO: resolve type issue
    div.innerHTML = renderToString(placeholderUi);
  }
  return div;
};

const getDefaultAnnotationData = (annotation: AnnotationsUnion) => {
  const { pageIndex, bbox, name, id, customData } = annotation;

  const updatedId = uuidv4();
  const annotationObj = {
    pageIndex,
    boundingBox: new PSPDFKit.Geometry.Rect({
      left: bbox[0],
      top: bbox[1],
      width: bbox[2],
      height: bbox[3],
    }),
    id: updatedId,
    lockedContents: true,
    customData: {
      ...customData,
      //status: AnnotationStatus.ACTIONED,
      status: 'ACTIONED',
    },
    backgroundColor: Color.TRANSPARENT,
  };
  return annotationObj;
};

export const getAnnotation = (
  annotation: AnnotationsUnion,
  signatureAttachmentId: string
) => {
  const defaultdAnnotation = getDefaultAnnotationData(annotation);
  let updateAnnotation;
  if (annotation?.customData?.type === 'DATE') {
    updateAnnotation = new PSPDFKit.Annotations.TextAnnotation({
      ...defaultdAnnotation,
      text: {
        format: 'plain',
        value: new Date().toLocaleDateString(),
      },
    });
  } else if (annotation?.customData?.type === 'SIGNATURE') {
    updateAnnotation = new PSPDFKit.Annotations.ImageAnnotation({
      ...defaultdAnnotation,
      contentType: 'image/jpeg',
      imageAttachmentId: signatureAttachmentId,
    });
  } else if (annotation?.customData?.type === 'TEXT') {
    updateAnnotation = new PSPDFKit.Annotations.TextAnnotation({
      ...defaultdAnnotation,
      text: {
        format: 'plain',
        value: 'Sample text', // TODO : added text
      },
    });
  }
  return updateAnnotation;
};
