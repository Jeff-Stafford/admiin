import { gql, useMutation, useQuery } from '@apollo/client';
import {
  WBBox,
  WBFlex,
  WBIcon,
  WBIconButton,
  WBProgressBar,
  WBTextField,
} from '@admiin-com/ds-web';
import { WBS3IconUpload, WBS3Image } from '@admiin-com/ds-amplify-web';
import {
  FILES_EXTENSIONS,
  IMAGE_EXTENSIONS,
  S3Upload,
} from '@admiin-com/ds-common';
import { isEmpty } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { CSGetSub as GET_SUB } from '@admiin-com/ds-graphql';
import { createMessage as CREATE_MESSAGE } from '@admiin-com/ds-graphql';
import { v4 as uuidv4 } from 'uuid';

export const SendMessage = ({ users }: { users: string[] }) => {
  const { t } = useTranslation();
  const { conversationId } = useParams();
  const { data: subData } = useQuery(gql(GET_SUB));
  const [attachments, setAttachments] = useState<S3Upload[]>([]);
  const [progress, setProgress] = useState(0);
  const messageRef = useRef(null);

  const {
    control,
    handleSubmit,
    formState: { isValid },
    setValue,
    setFocus,
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });

  const [createMessage] = useMutation(gql(CREATE_MESSAGE));

  useEffect(() => {
    setFocus('message');
  }, [setFocus]);

  const onSubmit = async ({ message }: { message?: string }, e: any) => {
    console.log(e);
    e.preventDefault();
    if (!isEmpty(message) || !isEmpty(attachments)) {
      try {
        createMessage({
          variables: {
            input: {
              conversationId,
              text: message,
              attachments: attachments.map(
                ({ identityId, key, level, type }) => ({
                  identityId,
                  key,
                  level,
                  type,
                })
              ),
              sender: subData?.sub,
              receiver: users[0] || null,
              users: [subData?.sub, ...users],
              createdBy: subData?.sub,
              readBy: [subData?.sub],
              conversationMessagesId: uuidv4(),
            },
          },
          optimisticResponse: {
            createMessage: {
              id: `temp:${uuidv4()}`,
              conversationId,
              text: message,
              attachments: attachments.map(
                ({ identityId, key, level, type }) => ({
                  identityId,
                  key,
                  level,
                  type,
                })
              ),
              sender: subData?.sub,
              receiver: users[0] || null,
              readBy: [subData?.sub],
              users: [subData?.sub, ...users],
              createdBy: subData?.sub,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              conversationMessagesId: uuidv4(),
              __typename: 'Message',
            },
          },
        });
      } catch (err) {
        console.log('ERROR creating message: ', err);
      }

      setValue('message', '');
      //@ts-ignore
      messageRef?.current?.focus();
      if (attachments?.length > 0) {
        setAttachments([]);
      }
    }
  };

  const onUpload = (attachment: S3Upload) => {
    setAttachments((currentAttachments) => [attachment, ...currentAttachments]);
    setProgress(0);
  };

  const onDelete = (attachment: S3Upload) => {
    setAttachments(attachments.filter((att) => att.key !== attachment.key));
  };

  return (
    <WBFlex
      flexDirection="column"
      py={2}
      sx={{ borderTop: '1px solid lightgrey' }}
      height="91px"
    >
      {conversationId && (attachments?.length > 0 || progress > 0) && (
        <>
          <WBFlex maxHeight="120px" px={2} pb={2}>
            {attachments.map((attachment) => (
              <WBFlex key={attachment.key} position="relative">
                <WBBox position="absolute" top={-10} right={6}>
                  <WBIconButton
                    color="error"
                    onClick={() => onDelete(attachment)}
                    icon="Close"
                  />
                </WBBox>

                {attachment?.type === 'IMAGE' && (
                  <WBBox
                    width="80px"
                    height="80px"
                    overflow="hidden"
                    borderRadius={2}
                    mr={2}
                  >
                    <WBS3Image
                      imgKey={attachment.key}
                      identityId={attachment.identityId}
                      level={attachment.level}
                      //alt={image.alt}
                      sx={{
                        objectFit: 'cover',
                        height: '100%',
                      }}
                    />
                  </WBBox>
                )}

                {attachment?.type === 'FILE' && (
                  <WBBox mt={1}>
                    <WBIcon color="white" name="DocumentAttach" size="small" />
                  </WBBox>
                )}
              </WBFlex>
            ))}
          </WBFlex>
          {progress > 0 && (
            <WBBox my={1}>
              <WBProgressBar value={progress} />
            </WBBox>
          )}
        </>
      )}
      {conversationId && (
        <WBFlex alignItems="center">
          <WBS3IconUpload
            alwaysKeepResolution={false}
            useWebWorker
            icon="AddCircle"
            onUpload={onUpload}
            onProgress={setProgress}
            maxFiles={6}
            validFileTypes={[...IMAGE_EXTENSIONS, ...FILES_EXTENSIONS]}
            inputAccept="image/*, doc, .docx, .xml, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .pdf, text/plain, .xlsx, .xls"
            maxSizeMB={0.1}
          />
          <Controller
            control={control}
            name="message"
            defaultValue=""
            render={({ field }) => (
              <WBTextField
                {...field}
                inputRef={messageRef}
                multiline
                maxRows={3}
                sx={{
                  p: 0,
                }}
                placeholder={t('sendMessagePlaceholder', {
                  ns: 'conversations',
                })}
              />
            )}
          />
          <WBIconButton
            icon="Send"
            disabled={!isValid}
            onClick={handleSubmit(onSubmit)}
          />
        </WBFlex>
      )}
    </WBFlex>
  );
};
