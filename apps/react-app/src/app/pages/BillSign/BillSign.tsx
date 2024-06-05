import React, { useCallback, useEffect, useState } from 'react';
import {
  WBBox,
  WBButton,
  WBFlex,
  WBForm,
  WBIconButton,
  WBSvgIcon,
  WBTypography,
} from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { InputLabel, styled, useMediaQuery, useTheme } from '@mui/material';
import PdfSignature from '../../components/PdfSignature/PdfSignature';
import {
  BillCreateFormData,
  TaskCreation,
  useTaskCreationContext,
} from '../TaskCreation/TaskCreation';
import AutoCompleteLookup from '../../components/AutoCompleteLookup/AutoCompleteLookup';
import SignatureIcon from '../../../assets/icons/signature.svg';
import TextIcon from '../../../assets/icons/text.svg';
import DateIcon from '../../../assets/icons/date.svg';
import { gql, useQuery } from '@apollo/client';
import { CSGetSub as GET_SUB } from '@admiin-com/ds-graphql';

const SignatureField = styled(WBBox)(({ theme, disabled }) => ({
  padding: theme.spacing(2),
  border: `dotted 2px ${disabled ? theme.palette.grey['300'] : '#B4540A'}`,
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',
  backgroundColor: disabled ? theme.palette.grey['300'] : '#FFF8DB',
  marginBottom: theme.spacing(1.5),
  userSelect: 'none',
  cursor: disabled ? 'not-allowed' : 'grab',
}));

const SignatureFieldMobile = styled(WBBox)(({ theme, disabled }) => ({
  width: '50px',
  height: '50px',
  padding: theme.spacing(2),
  borderRadius: '4rem',
  border: `dotted 0.5px ${disabled ? theme.palette.grey['300'] : '#B4540A'}`,
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',
  backgroundColor: disabled ? theme.palette.grey['300'] : '#FFF8DB',
  userSelect: 'none',
  cursor: disabled ? 'not-allowed' : 'grab',
}));

// const DottedTextField = styled(WBTextField)(() => ({
//   '& .MuiInput-underline:before': {
//     borderBottom: `2px ${'dotted'} rgba(0, 0, 0, 1)`,
//   },
//   color: '#000',
// }));
{
  /* <Controller
  control={control}
  name={'customTextLabel'}
  render={({ field }) => (
    <DottedTextField
      sx={{ ml: 2, fontSize: 'body2.fontSize', height: '40px' }}
      placeholder={t('signatureTextPlaceholder', {
        ns: 'taskbox',
      })}
      {...field}
    />
  )}
/> */
}

export function BillSign() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { pdfSignatureRef, setPage, showSignFields, setShowSignFields } =
    useTaskCreationContext();
  const { control, handleSubmit, setValue } = useFormContext<
    BillCreateFormData | any
  >();
  const { documents, customTextLabel, signer, annotations } = useWatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: subData } = useQuery(gql(GET_SUB));
  const userId = subData?.sub;

  useEffect(() => {
    pdfSignatureRef?.current?.setSelectedAnnotation(null);
  }, [showSignFields]);

  const onSubmit = async () => {
    const allAnnotations = await Promise.all(
      Array.from({ length: pdfSignatureRef.current?.totalPageCount }).map(
        (_, pageIndex) => pdfSignatureRef.current.getAnnotations(pageIndex)
      )
    );

    const flattenedAnnotations = allAnnotations.flat();
    const instantJSON = await pdfSignatureRef.current.exportInstantJSON(
      flattenedAnnotations
    );
    const annotationsString = JSON.stringify(instantJSON);
    setValue('annotations', annotationsString);
    setPage('Summary');
  };

  function getFieldLabel(type: string) {
    let label;
    if (type === 'SIGNATURE') {
      label = `${signer?.firstName}'s ${t('signature', { ns: 'taskbox' })}`;
    } else if (type === 'TEXT') {
      label = signer?.firstName;
    } else if (type === 'DATE') {
      label = t('date', { ns: 'taskbox' });
    } else {
      label = Math.random().toString();
    }
    return label;
  }

  const onDragStart = useCallback(
    (event: any, type: string) => {
      // if (!signer?.userId) return;
      event.target.style.opacity = 0.5;
      event.dataTransfer.dropEffect = 'move';

      event.dataTransfer.setData('label', getFieldLabel(type));
      event.dataTransfer.setData('type', type);
      event.dataTransfer.setData('userId', signer?.userId);
    },
    [signer?.userId, signer?.firstName, t, customTextLabel]
  );

  const onDragEnd = (event: any) => {
    event.target.style.opacity = 1;
  };

  const SignatureFieldContainer = (props: any) => {
    const { type, icon, label, signer } = props;
    return (
      <SignatureField
        // disabled={!signer?.userId}
        onDragEnd={onDragEnd}
        onDragStart={(e: DragEvent) => onDragStart(e, type)}
        // draggable={!!signer?.userId}
        draggable={true}
      >
        <WBSvgIcon sx={{ fontSize: '16px' }} viewBox="0 0 16 16">
          {icon}
        </WBSvgIcon>
        <WBTypography
          ml={2}
          fontWeight={'bold'}
          fontSize={'body2.fontSize'}
          color="#000"
        >
          {label}
        </WBTypography>
      </SignatureField>
    );
  };

  const fieldClickHandler = (event: any, type: string) => {
    const clickEvent = {
      label: getFieldLabel(type),
      type,
      userId: signer.userId,
    };
    pdfSignatureRef?.current?.handleDrop(event, clickEvent);
  };

  const SignatureFieldMobileContainer = (props: any) => {
    const { type, icon, label, signer } = props;
    return (
      <WBFlex flex={1} alignItems={'center'} flexDirection={'column'}>
        <SignatureFieldMobile
          onDragEnd={onDragEnd}
          onDragStart={(e: Event) => onDragStart(e, type)}
          draggable={!!signer?.userId}
          onClick={(e: any) => fieldClickHandler(e, type)}
        >
          <WBSvgIcon sx={{ fontSize: '16px' }} viewBox="0 0 16 16">
            {icon}
          </WBSvgIcon>
        </SignatureFieldMobile>
        <WBTypography
          fontWeight={'bold'}
          fontSize={'body2.fontSize'}
          color="#000"
        >
          {t(label, { ns: 'taskbox' })}
        </WBTypography>
      </WBFlex>
    );
  };

  const pdfSignature = documents?.[0]?.src ? (
    <PdfSignature
      ref={pdfSignatureRef}
      pdfId={documents?.[0]?.key}
      documentUrl={documents?.[0]?.src}
      annotations={annotations}
      userId={userId}
    />
  ) : null;

  return (
    <WBForm onSubmit={handleSubmit(onSubmit)} mt={0}>
      <WBFlex
        flexDirection={['column-reverse', 'row']}
        justifyContent={'center'}
        mt={[0, 8, 10]}
      >
        {isMobile &&
          (showSignFields ? (
            <WBFlex flexDirection={['column']} p={2}>
              <WBFlex padding={2}>
                <SignatureFieldMobileContainer
                  type="SIGNATURE"
                  icon={<SignatureIcon />}
                  label="signature"
                  signer={signer}
                />
                <SignatureFieldMobileContainer
                  type="DATE"
                  icon={<DateIcon />}
                  label="date"
                  signer={signer}
                />
                <SignatureFieldMobileContainer
                  type="TEXT"
                  icon={<TextIcon />}
                  label="name"
                  signer={signer}
                />
              </WBFlex>
              <WBButton
                onClick={() => setShowSignFields(false)}
                sx={{
                  fontSize: theme.typography.body2.fontSize,
                }}
                fullWidth
              >
                {t('save', { ns: 'taskbox' })}
              </WBButton>
            </WBFlex>
          ) : (
            <WBBox width="100%" mb={2} display={{ xs: 'block', sm: 'none' }}>
              <TaskCreation.SubmitButtons />
            </WBBox>
          ))}

        <WBFlex
          flex={{ xs: 1, sm: 3 }}
          px={{ xs: 0, sm: 10 }}
          mb={{ xs: 0, sm: 10 }}
          margin={{ xs: '-20px -20px 0 -20px', sm: '0' }}
          minHeight={{ xs: 'calc(100vh - 276px)', sm: '500px' }}
          position={'relative'}
        >
          {pdfSignature}
          {
            // Add fields Button in mobile view
            isMobile && !showSignFields && (
              <WBBox
                width="100%"
                height="100%"
                position={'absolute'}
                bgcolor="rgba(0, 0, 0, 0.5)"
              >
                <WBButton
                  disabled={!signer?.userId}
                  onClick={() => setShowSignFields(true)}
                  sx={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {t('addFields', { ns: 'taskbox' })}
                </WBButton>
              </WBBox>
            )
          }
        </WBFlex>

        <WBFlex
          flex={2}
          alignItems={'start'}
          justifyContent={'center'}
          mb={3}
          sx={{
            display: isMobile && showSignFields ? 'none' : 'block',
          }}
        >
          <WBBox
            flexDirection={'column'}
            alignItems={'start'}
            justifyContent={'start'}
            alignSelf="stretch"
            fontSize={theme.typography.body2.fontSize}
            sx={{
              width: ['100%', '80%', '100%', '100%'],
            }}
          >
            <WBBox>
              <Controller
                control={control}
                name={'signer'}
                // TODO: maybe need to add default value for signer, RECEVING current user, SENDING contact
                // defaultValue={signer}
                render={({ field }) => (
                  <AutoCompleteLookup
                    {...field}
                    label={t('signers', { ns: 'taskbox' })}
                    placeholder={t('signerPlaceholder', { ns: 'taskbox' })}
                    type={'EntityUser'}
                  />
                )}
              />
              <WBBox
                mt={{ xs: 5, sm: 10 }}
                sx={{
                  visibility: signer ? 'visible' : 'hidden',
                }}
              >
                <InputLabel focused={true}>
                  {t('fields', { ns: 'taskbox' })}
                </InputLabel>
                <WBTypography variant="body2" color={'grey'} mt={1} mb={3}>
                  {isMobile
                    ? t('dragAndDropFieldPlaceholderMobile', { ns: 'taskbox' })
                    : t('dragAndDropFieldPlaceholder', { ns: 'taskbox' })}
                </WBTypography>
                <WBBox
                  sx={{
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  <SignatureFieldContainer
                    type="SIGNATURE"
                    icon={<SignatureIcon />}
                    signer={signer}
                    label={
                      signer?.firstName
                        ? `${signer?.firstName}'s ${t('signature', {
                            ns: 'taskbox',
                          })}`
                        : t('signature', { ns: 'taskbox' })
                    }
                  />
                  <SignatureFieldContainer
                    type="DATE"
                    icon={<DateIcon />}
                    label={t('date', { ns: 'taskbox' })}
                    signer={signer}
                  />
                  <SignatureFieldContainer
                    type="TEXT"
                    icon={<TextIcon />}
                    label={t('name', { ns: 'taskbox' })}
                    signer={signer}
                  />
                </WBBox>
              </WBBox>
              <WBBox width="100%" display={{ xs: 'none', sm: 'block' }}>
                <TaskCreation.SubmitButtons />
              </WBBox>
            </WBBox>
          </WBBox>
        </WBFlex>

        {isMobile && showSignFields && (
          <WBFlex alignItems={'center'} p={4} pt={6} pb={2}>
            <WBIconButton
              icon="ArrowBack"
              size={'small'}
              onClick={() => setShowSignFields(false)}
            ></WBIconButton>
            <WBTypography variant="h3" textAlign={'center'} sx={{ flex: 2 }}>
              {t('addFields', { ns: 'taskbox' })}
            </WBTypography>
          </WBFlex>
        )}
      </WBFlex>
    </WBForm>
  );
}
