import { gql, useQuery } from '@apollo/client';
import {
  WBFlex,
  WBButton,
  WBModal,
  WBTypography,
  WBIcon,
  WBBox,
  downloadBlob,
} from '@admiin-com/ds-web';
import { WBS3Image } from '@admiin-com/ds-amplify-web';
import { Storage } from 'aws-amplify';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Message } from '@admiin-com/ds-graphql';
import { CSGetSub as GET_SUB } from '@admiin-com/ds-graphql';

export const MessageList = ({ messages }: { messages: Message[] }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [showAttachment, setShownAttachment] = useState<any>({});
  const { data: subData } = useQuery(gql(GET_SUB));

  const showDateTime = (message: Message, index: number): string => {
    if (message) {
      if (index === messages.length - 1) {
        return 'DD';
      }

      if (messages[index + 1]) {
        const dateTimePrevMessage = DateTime.fromISO(
          messages[index + 1].createdAt
        );
        const dateTimeMessage = DateTime.fromISO(message.createdAt);

        const { minutes } = dateTimePrevMessage
          .diff(dateTimeMessage, 'minutes')
          .toObject();

        if (minutes && minutes > 5) {
          return 'DD';
        }
      }
    }

    return '';
  };

  const onDownload = async () => {
    setLoading(true);
    try {
      const data = await Storage.get(showAttachment?.key, {
        identityId: showAttachment?.identityId,
        level: 'protected',
        download: true,
      });

      if (data?.Body && data.Body instanceof Blob) {
        await downloadBlob(data.Body, showAttachment?.key);
      }
    } catch (err) {
      console.log('ERROR get file: ', err);
    }

    setLoading(false);
  };

  return (
    <>
      <WBModal
        sx={{
          width: {
            xs: '95%',
            sm: '80%',
            md: '80%',
            lg: '65%',
          },
          height: {
            xs: '95%',
            sm: '80%',
            md: '80%',
            lg: '80%',
          },
        }}
        open={!!showAttachment?.key}
        onClose={() => setShownAttachment({})}
      >
        <>
          {showAttachment.type === 'IMAGE' && (
            <WBS3Image
              imgKey={showAttachment?.key}
              identityId={showAttachment?.identityId}
              level={showAttachment?.level}
              responsive
            />
          )}
          {showAttachment.type === 'FILE' && (
            <WBFlex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <WBIcon name="DocumentAttach" size="large" />
              <WBTypography mt={3}>
                {showAttachment.key.split('.').pop()?.toUpperCase()}
              </WBTypography>
            </WBFlex>
          )}
          <WBButton
            sx={{
              mt: 3,
              alignSelf: 'center',
            }}
            loading={loading}
            onClick={onDownload}
          >
            {t('download', { ns: 'common' })}
          </WBButton>
        </>
      </WBModal>
      {messages?.map((message: Message, index) => (
        <WBFlex key={message.id} flexDirection="column">
          {showDateTime(message, index) && (
            <WBTypography variant="body2" textAlign="center" mb={1}>
              {DateTime.fromISO(message.createdAt).toLocaleString(
                DateTime.DATETIME_MED
              )}
            </WBTypography>
          )}
          <WBFlex
            flexDirection={
              subData?.sub === message.createdBy ? 'row-reverse' : 'row'
            }
          >
            <WBBox sx={{ maxWidth: '70%' }}>
              {message?.attachments?.map((attachment: any) => (
                <WBButton
                  key={attachment.key}
                  variant="text"
                  onClick={() => setShownAttachment(attachment)}
                >
                  {attachment.type === 'IMAGE' && (
                    <WBS3Image
                      sx={{
                        width: '120px',
                        height: '80px',
                        backgroundColor: 'primary',
                        borderRadius: 2,
                      }}
                      imgKey={attachment.key}
                      identityId={attachment.identityId}
                      level={attachment.level}
                    />
                  )}

                  {attachment.type === 'FILE' && (
                    <WBFlex
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      width={'120px'}
                      height={'80px'}
                      px={2}
                      py={1}
                      bgcolor={
                        subData?.sub === message.createdBy
                          ? 'primary.main'
                          : 'lightGrey'
                      }
                      borderRadius={2}
                    >
                      <WBIcon
                        //library="ioniconSharp"
                        name="DocumentAttach"
                        size="large"
                      />
                      <WBTypography
                        color={
                          subData?.sub === message.createdBy ? 'white' : 'black'
                        }
                      >
                        {attachment.key.split('.').pop()}{' '}
                      </WBTypography>
                    </WBFlex>
                  )}
                </WBButton>
              ))}
              {message.text && (
                <WBBox
                  p={1}
                  mb={1}
                  sx={{
                    backgroundColor:
                      subData?.sub === message.createdBy
                        ? 'primary.main'
                        : 'lightGrey',
                    borderRadius: 2,
                  }}
                >
                  <WBTypography
                    sx={{
                      wordBreak: 'break-word',
                      display: 'inline-block',
                      whiteSpace: 'pre-line',
                      color:
                        subData?.sub === message.createdBy ? 'white' : 'black',
                    }}
                  >
                    {message.text}
                  </WBTypography>
                </WBBox>
              )}
            </WBBox>
          </WBFlex>
        </WBFlex>
      ))}
    </>
  );
};
