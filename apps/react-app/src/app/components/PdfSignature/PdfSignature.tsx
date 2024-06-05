import { WBFlex, WBIcon, WBTypography } from '@admiin-com/ds-web';
import { useTheme } from '@mui/material';
import { Annotation, AnnotationsUnion, Color } from 'pspdfkit';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { renderToString } from 'react-dom/server';
import { useTranslation } from 'react-i18next';
import ConfirmationDlg from '../ConfirmationDlg/ConfirmationDlg';
import { createCustomSignatureNode } from '../../helpers/signature';
import PdfPlaceholder from '../PdfPlaceholder/PdfPlaceholder';
import AddSignatureModal from '../AddSignatureModal/AddSignatureModal';
import { useUserSignature } from '../../hooks/useUserSignature/useUserSignature';

const { VITE_PSPDFKIT_KEY } = import.meta.env;

export interface PdfSignatureProps {
  documentUrl: string;
  pdfId: string;
  annotations?: any;
  userId?: string;
}

interface DeleteAnnotation {
  type: string; // to show different title for different annotation type
  id: string;
}

const renderConfigurations: Record<any, any> = {};

//function fileToDataURL(file) {
//  return new Promise((resolve) => {
//    const reader = new FileReader();
//
//    reader.onload = function () {
//      resolve(reader.result);
//    };
//    reader.readAsDataURL(file);
//  });
//}

export const PdfSignature = forwardRef(
  (
    { documentUrl, pdfId, annotations, userId }: PdfSignatureProps,
    instanceRef: any
  ) => {
    const { t } = useTranslation();
    //TODO: valid ref type
    const PSPDFKit = useRef<any>(null); //TODO: types
    const theme = useTheme();
    const containerRef = useRef(null);
    //let isDragAndDropSupported = false; //TODO: purpose?
    const [showDeleteDlg, setShowDeleteDlg] =
      useState<DeleteAnnotation | null>();
    const [showAddSignModal, setShowAddSignModal] = useState<any>(null);
    const { userSignatureKey, getSignatureBlob } = useUserSignature();

    //TODO: this is rendering each movement / event, should it be so?

    const isLoggedInUser = (signerUserId: string) => {
      return userId === signerUserId;
    };

    useEffect(() => {
      const container = containerRef.current; // render PSPDFKit ui to this container
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

      const annotationTooltipCallback = (annotation: Annotation) => {
        const deleteIcon = (
          <WBIcon name="CloseCircle" color={theme.palette.error.light} />
        );
        const tooltipNode = document.createElement('div');
        tooltipNode.style.cssText = 'height: 2rem;';
        //@ts-ignore TODO: resolve type issue
        tooltipNode.innerHTML = renderToString(deleteIcon);
        const customTooltipItem = {
          type: 'custom',
          node: tooltipNode,
          onPress: function () {
            setShowDeleteDlg({
              type: 'Signature',
              id: annotation.id,
            });
          },
        };
        return [customTooltipItem];
      };

      (async function () {
        PSPDFKit.current = await import('pspdfkit'); // Load PSPDFKit asynchronously.
        PSPDFKit.current.unload(container); // unload any existing instances

        // pdf toolbar menu items
        // const toolbarItems = PSPDFKit.current.defaultToolbarItems.filter(
        //   (item: any) => {
        //     return /\b("pager|pan|search|sidebar-document-outline|sidebar-document-outline|sidebar-thumbnails|zoom-in|zoom-mode|zoom-out|layout")\b/.test(
        //       item.type
        //     );
        //   }
        // );
        //let baseUrl = '';
        //if (!isLocalHost)
        //  baseUrl = `${window.location.protocol}//${window.location.hostname}/`;
        //else baseUrl = `${window.location.protocol}//${window.location.host}/`;
        //baseUrl: `${window.location.origin}/`, // Use the origin of the current window as a base URL. PSPDFKit.current will download its library assets from here.
        const input = {
          container,
          document: documentUrl,
          autoSaveMode: 'INTELLIGENT', //TODO: may not require
          instantJSON: undefined,
          //TODO: env variable
          licenseKey: VITE_PSPDFKIT_KEY,
          baseUrl: `${window.location.origin}/`, // Use the public directory URL as a base URL. PSPDFKit.current will download its library assets from here.
          toolbarItems: [],
          enableHistory: true,
          disableTextSelection: true,
          electronicSignatures: {
            creationModes: [
              PSPDFKit.current.ElectronicSignatureCreationMode.DRAW,
              PSPDFKit.current.ElectronicSignatureCreationMode.IMAGE,
              PSPDFKit.current.ElectronicSignatureCreationMode.TYPE,
            ],
          },
          customRenderers: {
            Annotation: getAnnotationRenderers,
          },
          annotationTooltipCallback,
          styleSheets: ['/viewer.css'], //TODO: review
        };

        if (annotations) {
          input.instantJSON = JSON.parse(annotations);
        }

        // load new instance
        instanceRef.current = await PSPDFKit.current.load(input);
        const viewState = instanceRef?.current?.viewState;
        instanceRef?.current?.setViewState(viewState.set('showToolbar', false));
        if (instanceRef?.current) {
          instanceRef.current.handleDrop = handleDrop;
        }
      })();
      return () => PSPDFKit.current?.unload(container);
    }, [annotations, documentUrl, instanceRef, theme]);

    const handleDrop = useCallback(
      (event: any, clickEvent?: any) => {
        //TODO: type
        if (!PSPDFKit.current || !instanceRef.current) return;
        event.preventDefault();
        event.stopPropagation();

        const createPlaceholderAnnotation = (
          annotationObj: any,
          label: string
        ) => {
          return new PSPDFKit.current.Annotations.TextAnnotation({
            ...annotationObj,
            text: { format: 'plain', value: label },
            opacity: 0,
          });
        };

        (async function () {
          const label =
            event?.dataTransfer?.getData('label') ?? clickEvent?.label;
          const type = event?.dataTransfer?.getData('type') ?? clickEvent?.type;
          const signerUserId =
            event?.dataTransfer?.getData('userId') ?? clickEvent?.userId;
          const pageIndex = instanceRef.current.viewState.currentPageIndex;

          const height = type === 'SIGNATURE' ? 55 : 15;
          const width = type === 'SIGNATURE' ? 110 : 80;
          const left = clickEvent
            ? window.innerWidth / 2 - width / 2
            : event.clientX - width / 2;
          const top = clickEvent
            ? window.innerHeight / 2 - height / 2
            : event.clientY - height / 2;
          const clientRect = new PSPDFKit.current.Geometry.Rect({
            left,
            top,
            height,
            width,
          });

          const pageRect =
            instanceRef.current.transformContentClientToPageSpace(
              clientRect,
              pageIndex
            );

          const id = uuidv4();
          const annotationObj = {
            pageIndex,
            boundingBox: pageRect,
            id: id,
            lockedContents: true,
            customData: {
              type,
              userId: signerUserId,
              label,
              status: isLoggedInUser(signerUserId) ? 'ACTIONED' : 'PENDING',
              //status: isLoggedInUser(signerUserId)
              //  ? AnnotationStatus.ACTIONED
              //  : AnnotationStatus.PENDING,
            },
            backgroundColor: Color.TRANSPARENT,
          };

          let annotation;
          if (isLoggedInUser(signerUserId)) {
            if (type === 'SIGNATURE') {
              if (userSignatureKey) {
                const signatureBlob = await getSignatureBlob();
                const attachmentId = await instanceRef.current.createAttachment(
                  signatureBlob
                );
                annotation = new PSPDFKit.current.Annotations.ImageAnnotation({
                  ...annotationObj,
                  contentType: 'image/jpeg',
                  imageAttachmentId: attachmentId,
                });
              } else {
                setShowAddSignModal(annotationObj);
                return;
              }
            } else if (type === 'TEXT') {
              annotation = new PSPDFKit.current.Annotations.TextAnnotation({
                ...annotationObj,
                text: { format: 'plain', value: label },
              });
            } else if (type === 'DATE') {
              annotation = new PSPDFKit.current.Annotations.TextAnnotation({
                ...annotationObj,
                text: {
                  format: 'plain',
                  value: new Date().toLocaleDateString(),
                },
              });
            }
          } else {
            annotation = createPlaceholderAnnotation(annotationObj, label);
          }
          instanceRef.current.create(annotation);
        })();
      },
      [instanceRef, userSignatureKey]
    );

    const addSignatureToPdf = async (
      signatureKey: string,
      annotationObj: any
    ) => {
      const signatureBlob = await getSignatureBlob(signatureKey);
      const attachmentId = await instanceRef.current.createAttachment(
        signatureBlob
      );
      const annotation = new PSPDFKit.current.Annotations.ImageAnnotation({
        ...annotationObj,
        contentType: 'image/jpeg',
        imageAttachmentId: attachmentId,
      });
      instanceRef.current.create(annotation);
    };

    const hanldeDeleteOK = () => {
      instanceRef.current.delete(showDeleteDlg?.id);
    };

    const signatureAddHandler = (signatureKey?: string | Blob) => {
      if (signatureKey && typeof signatureKey === 'string') {
        addSignatureToPdf(signatureKey, showAddSignModal);
      }
      setShowAddSignModal(null);
    };

    // This div element will render the document to the DOM.
    return (
      <>
        <WBFlex
          flex={1}
          ref={containerRef}
          onDrop={handleDrop}
          onDragOver={(ev) => {
            ev.preventDefault();
          }}
        />
        {!!showDeleteDlg && (
          <ConfirmationDlg
            open={!!showDeleteDlg}
            onClose={() => setShowDeleteDlg(null)}
            onOK={hanldeDeleteOK}
            title={t('deleteConfirmationTitle', { ns: 'taskbox' })}
          >
            <WBTypography>
              {t('deleteConfirmationDescription', { ns: 'taskbox' })}
            </WBTypography>
          </ConfirmationDlg>
        )}
        {showAddSignModal && (
          <AddSignatureModal
            open={showAddSignModal}
            handleClose={() => setShowAddSignModal(null)}
            handleSave={signatureAddHandler}
          />
        )}
      </>
    );
  }
);

export default PdfSignature;
