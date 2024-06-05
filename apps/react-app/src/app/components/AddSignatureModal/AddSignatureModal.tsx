import React, { useEffect, useMemo, useRef, useState } from 'react';
import SimpleDrawDlg from '../SimpleDrawDlg/SimpleDrawDlg';
import {
  DialogContent,
  DialogTitle,
  Typography,
  useTheme,
} from '@mui/material';
import {
  WBBox,
  WBButton,
  WBSelect,
  WBTextField,
  WBFlex,
} from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import {
  createSignature as CREATE_SIGNATURE,
  updateUser as UPDATE_USER,
  getUser as GET_USER,
  CSGetSub as GET_SUB,
} from '@admiin-com/ds-graphql';
import { Stage, Layer, Text } from 'react-konva';
import SignaturePad from 'react-signature-pad-wrapper';
import {
  getBlobFromCanvas,
  getExtensionFromContentType,
} from '../../helpers/signature';
import { S3MediaDragDrop } from 'libs/amplify-web/src/lib/components/S3MediaDragDrop/S3MediaDragDrop';
import { IMAGE_EXTENSIONS, Image } from '@admiin-com/ds-common';
import { v4 as uuidv4 } from 'uuid';
import { uploadToS3Storage } from '@admiin-com/ds-amplify';
import { gql, useMutation, useQuery } from '@apollo/client';
import { isEmpty } from 'lodash';
import { S3Image } from 'libs/amplify-web/src/lib/components/S3Image/S3Image';

enum SignatureType {
  SignPad = 'SignPad',
  Keyboard = 'Keyboard',
  Camera = 'Camera',
}

export interface AddSignatureModalProps {
  open: boolean;
  handleClose: () => void;
  handleSave?: (signatureKey?: string | Blob) => void;
  descriptionLabel?: string;
  isGuest?: boolean;
}

type SignatureFormData = {
  signatureType: string;
  signatureText: string;
};

export function AddSignatureModal({
  open,
  handleClose,
  isGuest,
  handleSave,
  descriptionLabel,
}: AddSignatureModalProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { data: subData } = useQuery(gql(GET_SUB));
  const userId = subData?.sub;

  const [createSignature, { loading: createSignatureLoading }] = useMutation(
    gql(CREATE_SIGNATURE),
    {
      refetchQueries: [gql(GET_USER)],
    }
  );

  const [updateUser, { loading: updateUserLoading }] = useMutation(
    gql(UPDATE_USER)
  );

  const [uploadSignatureLoading, setUploadSignatureLoading] = useState(false);

  // Signature Pad
  const signaturePadRef = useRef<any>(null);
  // Signature Keyboard
  const signatureKeyboardRef = useRef<any>(null);
  // Signature Camera
  const [uploadSignatureKey, setUploadSignatureKey] = useState('');

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignatureFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const inputs = useMemo(
    () =>
      ({
        signatureType: {
          name: 'signatureType',
          type: 'select',
          defaultValue: '',
        },
        signatureText: {
          name: 'signatureText',
          type: 'text',
          placeholder: t('namePlaceholder', { ns: 'settings' }),
          defaultValue: '',
        },
      } as const),
    [t]
  );

  const signatureType = watch('signatureType');
  const signatureText = watch('signatureText');

  useEffect(() => {
    setValue('signatureType', SignatureType.SignPad);
  }, []);

  const onSignatureUploaded = (image: Image) => {
    setUploadSignatureKey(image.key);
  };

  const onClear = () => {
    switch (signatureType) {
      case SignatureType.SignPad:
        signaturePadRef?.current?.clear();
        break;
      case SignatureType.Keyboard:
        setValue('signatureText', '');
        break;
      case SignatureType.Camera:
        setUploadSignatureKey('');
        break;
    }
  };

  const uploadSignature = async (blob: Blob) => {
    try {
      setUploadSignatureLoading(true);
      const fileName = `${uuidv4()}.${getExtensionFromContentType(blob.type)}`;
      const data: any = await uploadToS3Storage(
        {
          key: fileName,
          contentType: blob.type,
          file: blob,
          level: 'private',
        },
        () => null
      );
      return data.key;
    } catch (err) {
      console.log('ERROR upload signature: ', err);
    } finally {
      setUploadSignatureLoading(false);
    }
  };

  const saveSignature = async (key: string) => {
    try {
      await createSignature({
        variables: {
          input: {
            key: key,
          },
        },
      });
      const { data } = await updateUser({
        variables: {
          input: {
            id: userId,
            selectedSignatureKey: key,
          },
        },
      });
      if (data?.updateUser) {
        handleSave && handleSave(data?.updateUser?.signatures?.items[0]?.key);
      }
    } catch (err) {
      console.log('ERROR createSignature: ', err);
    }
  };

  const uploadAndSaveSignature = async (blob: Blob) => {
    if (isGuest) return handleSave && handleSave(blob);
    else {
      const key = await uploadSignature(blob);
      saveSignature(key);
    }
  };

  const onSubmit = async () => {
    switch (signatureType) {
      case SignatureType.SignPad:
        if (!signaturePadRef?.current?.isEmpty()) {
          uploadAndSaveSignature(
            getBlobFromCanvas(signaturePadRef?.current?.signaturePad?.canvas)
          );
        }
        break;
      case SignatureType.Keyboard:
        if (!isEmpty(signatureText)) {
          uploadAndSaveSignature(
            getBlobFromCanvas(
              signatureKeyboardRef?.current?.toCanvas({ pixelRatio: 2 })
            )
          );
        }
        break;
      case SignatureType.Camera:
        if (!isEmpty(uploadSignatureKey)) {
          saveSignature(uploadSignatureKey);
        }
        break;
    }
  };

  return (
    <SimpleDrawDlg
      open={open}
      handleClose={handleClose}
      maxWidth="xs"
      fullWidth={true}
    >
      <DialogTitle variant="h3" fontWeight={'bold'}>
        {t('signatureRequiredTitle', { ns: 'settings' })}
        <Typography>
          {descriptionLabel ??
            t('signatureRequiredDescription', { ns: 'settings' })}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <WBBox mb={2}>
          <Controller
            control={control}
            name={inputs.signatureType.name}
            defaultValue={inputs.signatureType.defaultValue}
            render={({ field }) => (
              <WBSelect
                options={[
                  ...Object.keys(SignatureType).map((value) => ({
                    label: t(value + 'OptionLabel', { ns: 'settings' }),
                    value: value,
                  })),
                ]}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </WBBox>
        {signatureType === SignatureType.SignPad && (
          <WBBox>
            <div style={{ backgroundColor: '#E1E8EE' }}>
              <SignaturePad ref={signaturePadRef} />
            </div>
            <WBBox border="1px solid grey" mt={-3} mx={3} />
            <Typography mt={4}>
              {t('signPadDescriptionLabel', { ns: 'settings' })}
            </Typography>
          </WBBox>
        )}
        {signatureType === SignatureType.Keyboard && (
          <WBBox>
            <Stage ref={signatureKeyboardRef} width={300} height={40}>
              <Layer>
                <Text
                  text={signatureText}
                  verticalAlign="middle"
                  fillStyle="#FF0000"
                  fontSize={30}
                  fontFamily="Ms Madi"
                  width={300}
                  height={40}
                />
              </Layer>
            </Stage>
            <Controller
              control={control}
              name={inputs.signatureText.name}
              defaultValue={inputs.signatureText.defaultValue}
              render={({ field }) => (
                <WBTextField
                  {...field}
                  type={inputs.signatureText.type}
                  placeholder={inputs.signatureText.placeholder}
                />
              )}
            />
          </WBBox>
        )}
        {signatureType === SignatureType.Camera && (
          <WBBox>
            {uploadSignatureKey ? (
              <WBFlex
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100%"
                width="100%"
                sx={{
                  borderRadius: '10px',
                  //TODO: colour based on primary colour
                  backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%238F8F8F' stroke-width='5' stroke-dasharray='1%2c 12' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");`,
                }}
                p={4}
              >
                <S3Image
                  imgKey={uploadSignatureKey}
                  level={'private'}
                  responsive={false}
                />
              </WBFlex>
            ) : (
              <S3MediaDragDrop
                validFileTypes={IMAGE_EXTENSIONS}
                inputAccept="images/*"
                uploadMessage={t('cameraUploadMessage', { ns: 'settings' })}
                uploadBtnText={t('CameraOptionLabel', { ns: 'settings' })}
                level="private"
                onImageUpload={(image: Image, file) => {
                  onSignatureUploaded(image);
                }}
              />
            )}
          </WBBox>
        )}
        <WBFlex flexDirection="row" mt={3} gap={2}>
          <WBButton variant="outlined" size="small" onClick={onClear}>
            {t('clear', { ns: 'common' })}
          </WBButton>
          <WBButton
            size="small"
            loading={
              uploadSignatureLoading ||
              createSignatureLoading ||
              updateUserLoading
            }
            onClick={onSubmit}
            sx={{
              flex: 1,
            }}
          >
            {t('confirm', { ns: 'common' })}
          </WBButton>
        </WBFlex>
      </DialogContent>
    </SimpleDrawDlg>
  );
}

export default AddSignatureModal;
