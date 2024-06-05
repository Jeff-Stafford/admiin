import {
  AccountDirection,
  ContactBankAccount,
  Entity,
  PaymentMethod,
  PaymentMethodType,
  entityUsersByUser,
} from '@admiin-com/ds-graphql';
import { WBButton, WBFlex } from '@admiin-com/ds-web';
import { createPaymentMethod as CREATE_PAYMENT_METHOD } from '@admiin-com/ds-graphql';
import { gql, useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import ErrorHandler from '../ErrorHandler/ErrorHandler';
import PdfViewer from '../PdfViewer/PdfViewer';
import { useRef, useState } from 'react';
import PSPDFKit, { AnnotationsUnion } from 'pspdfkit';
import { isIndividualEntity } from '../../helpers/entities';
import { useUserSignature } from '../../hooks/useUserSignature/useUserSignature';
import AddSignatureModal from '../AddSignatureModal/AddSignatureModal';
/* eslint-disable-next-line */
export interface DirectDebitFormProps {
  account?: ContactBankAccount | null;
  entity?: Entity | null | undefined;
  onSuccess?: (paymentMethod: PaymentMethod) => void;
}

export function DirectDebitForm({
  account,
  onSuccess,
  entity,
}: DirectDebitFormProps) {
  const pdfInstanceRef: any = useRef(null);

  const [createPaymentMethod, { loading, error }] = useMutation(
    gql(CREATE_PAYMENT_METHOD),
    {
      refetchQueries: [gql(entityUsersByUser)],
    }
  );
  const [showAddSignModal, setShowAddSignModal] = useState<boolean>(false);
  const { userSignatureKey, getSignatureBlob } = useUserSignature();

  const { t } = useTranslation();

  const onSubmit = async () => {
    if (!userSignatureKey) {
      setShowAddSignModal(true);
      return;
    }
    const createdPaymentMethodData = await createPaymentMethod({
      variables: {
        input: {
          entityId: entity?.id,
          paymentMethodId: account?.id,
          paymentMethodType: PaymentMethodType.BANK,
          accountDirection: AccountDirection.PAYMENT,
        },
      },
    });

    const createdPaymentMethod =
      createdPaymentMethodData?.data?.createPaymentMethod;
    onSuccess && onSuccess(createdPaymentMethod);
  };

  const insertSignature = async (signatureKey: string) => {
    if (!signatureKey) {
      return;
    }
    const annotations = await pdfInstanceRef.current.getAnnotations(0);
    const widget = annotations.find(
      (annotation: AnnotationsUnion) => annotation.formFieldName === 'signature'
    );
    const boundingBox = widget.boundingBox;
    const pageIndex = widget.pageIndex;

    const signatureBlob = await getSignatureBlob(signatureKey);
    const attachmentId = await pdfInstanceRef.current.createAttachment(
      signatureBlob
    );
    const annotation = new PSPDFKit.Annotations.ImageAnnotation({
      pageIndex,
      boundingBox,
      contentType: 'image/jpeg',
      imageAttachmentId: attachmentId,
    });
    pdfInstanceRef.current.create(annotation);
  };

  const pdfLoadHanlder = () => {
    if (pdfInstanceRef?.current) {
      const companyName = isIndividualEntity(entity)
        ? entity?.legalName
        : entity?.name;
      const name = isIndividualEntity(entity)
        ? entity?.name
        : entity?.taxNumber;
      const bankName = account?.bankName;
      const accountName = account?.accountName;
      const bsbNum = account?.routingNumber;
      const accountNum = account?.accountNumber;
      const signName = account?.accountName;
      if (pdfInstanceRef?.current) {
        pdfInstanceRef.current.setFormFieldValues({
          companyName,
          name,
          bankName,
          accountName,
          bsbNum,
          accountNum,
          signName,
        });
        insertSignature(userSignatureKey);
      }
    }
  };

  const signatureAddHandler = (signatureKey?: string | Blob) => {
    setShowAddSignModal(false);
    if (signatureKey) {
      insertSignature(signatureKey as string);
    }
  };

  return (
    <>
      <WBFlex flex={1} sx={{ minHeight: '350px' }}>
        <PdfViewer
          ref={pdfInstanceRef}
          documentUrl={'dda-placeholder.pdf'}
          onPdfLoad={pdfLoadHanlder}
        />
      </WBFlex>
      <WBButton
        fullWidth
        sx={{ mt: 7 }}
        type="submit"
        onClick={onSubmit}
        loading={loading}
      >
        {userSignatureKey
          ? t('addBankAccount', { ns: 'settings' })
          : t('confirmAndSign', { ns: 'settings' })}
      </WBButton>
      {showAddSignModal && (
        <AddSignatureModal
          descriptionLabel={t('addSignatureDescDda', { ns: 'settings' })}
          open={showAddSignModal}
          handleClose={() => setShowAddSignModal(false)}
          handleSave={signatureAddHandler}
        />
      )}
      <ErrorHandler errorMessage={error?.message} />
    </>
  );
}

export default DirectDebitForm;
