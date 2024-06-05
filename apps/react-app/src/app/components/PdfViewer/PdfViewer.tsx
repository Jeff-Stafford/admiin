import { WBFlex } from '@admiin-com/ds-web';
import { AnnotationsUnion } from 'pspdfkit';
import { forwardRef, useEffect, useRef } from 'react';
import PdfPlaceholder from '../PdfPlaceholder/PdfPlaceholder';
import { createCustomSignatureNode } from '../../helpers/signature';

const { VITE_PSPDFKIT_KEY } = import.meta.env;
// if domain is local host
export interface PdfViewerProps {
  documentUrl?: string;
  height?: any;
  key?: string;
  annotations?: any;
  onPdfLoad?: () => void;
}
const renderConfigurations: Record<any, any> = {};

export const PdfViewer = forwardRef(
  (
    { height, documentUrl, key, annotations, onPdfLoad }: PdfViewerProps,
    instanceRef: any
  ) => {
    const containerRef = useRef(null);

    useEffect(() => {
      const container = containerRef.current; // This `useRef` instance will render the PDF.

      let PSPDFKit: any;

      if (!instanceRef) {
        instanceRef = { current: null };
      }

      const getAnnotationRenderers = ({
        annotation,
      }: {
        annotation: AnnotationsUnion;
      }) => {
        // Use cached render configuration
        if (renderConfigurations[annotation.id]) {
          return renderConfigurations[annotation.id];
        }

        const { customData } = annotation;
        const placeholderUi = <PdfPlaceholder customData={customData} />;
        const customNode = createCustomSignatureNode(placeholderUi, customData);

        renderConfigurations[annotation.id] = {
          node: customNode,
          append: true,
        };
        return renderConfigurations[annotation.id] || null;
      };

      (async function () {
        try {
          PSPDFKit = await import('pspdfkit');

          PSPDFKit.unload(container); // Ensure that there's only one PSPDFKit instance.
          const pspdfParams: any = {
            // TODO: types for init pspdfkit
            container,
            document: documentUrl,
            licenseKey: VITE_PSPDFKIT_KEY,
            baseUrl: `${window.location.origin}/`,
            toolbarItems: [],
            disableTextSelection: false,
            customRenderers: {
              Annotation: getAnnotationRenderers,
            },
            styleSheets: ['/viewer.css'],
            initialViewState: new PSPDFKit.ViewState({ readOnly: true }),
          };

          console.log('annotations: ', annotations);
          if (annotations) {
            pspdfParams.instantJSON = JSON.parse(annotations);
          }

          instanceRef.current = await PSPDFKit.load(pspdfParams);

          const viewState = instanceRef?.current?.viewState;
          instanceRef?.current?.setViewState(
            viewState.set('showToolbar', false)
          );
          onPdfLoad && onPdfLoad();
        } catch (error) {
          console.log(error);
        }
      })();

      return () => PSPDFKit && PSPDFKit.unload(container);
    }, [documentUrl, instanceRef]);

    // This div element will render the document to the DOM.
    return (
      <WBFlex
        ref={containerRef}
        className="pdf-viewer"
        flex={1}
        // sx={{ width: '100%', height: height ?? ['250px', '150px'] }}
      />
    );
  }
);

export default PdfViewer;
