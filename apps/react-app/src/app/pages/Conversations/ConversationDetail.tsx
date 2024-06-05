import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  WBBox,
  WBButton,
  WBDivider,
  WBFlex,
  WBIconButton,
  WBModal,
  WBSkeleton,
  WBTypography,
} from '@admiin-com/ds-web';
import { WBS3ListItem } from '@admiin-com/ds-amplify-web';
import { PROFILE_PLACEHOLDER } from '@admiin-com/ds-common';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Link, ReportForm } from '../../components';
import { blockUser as BLOCK_USER } from '@admiin-com/ds-graphql';
import { UserConversation } from '@admiin-com/ds-graphql';
import { messagesByConversation as MESSAGES_BY_CONVERSATION } from '@admiin-com/ds-graphql';
import {
  CSgetConversation as GET_CONVERSATION,
  CSGetSub as GET_SUB,
  CSlistUserConversations as LIST_USER_CONVERSATIONS,
} from '@admiin-com/ds-graphql';
import { onCreateMessageForConversation as MESSAGES_SUBSCRIPTION } from '@admiin-com/ds-graphql';
import {
  deleteConversation as DELETE_CONVERSATION,
  updateConversation as UPDATE_CONVERSATION,
  updateMessage as UPDATE_MESSAGE,
} from '@admiin-com/ds-graphql';
import { CSdeleteUserConversation as DELETE_USER_CONVERSATION } from '@admiin-com/ds-graphql';
import { PATHS } from '../../navigation/paths';
import { MessageList } from './MessageList';
import { SendMessage } from './SendMessage';

const ConversationDetail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const { data: subData } = useQuery(gql(GET_SUB));
  const bottomRef = useRef<HTMLDivElement>(null);
  const [
    getConversation,
    { data: conversationData, loading: conversationLoading },
  ] = useLazyQuery(gql(GET_CONVERSATION));

  const [messagesByConversation, { data: messagesData, subscribeToMore }] =
    useLazyQuery(gql(MESSAGES_BY_CONVERSATION), {
      fetchPolicy: 'cache-and-network',
    });

  const [updateMessage] = useMutation(gql(UPDATE_MESSAGE));
  const [updateConversation] = useMutation(gql(UPDATE_CONVERSATION));

  const [deleteConversation] = useMutation(gql(DELETE_CONVERSATION));
  const [deleteUserConversation] = useMutation(gql(DELETE_USER_CONVERSATION));

  const [blockUser, { loading: blockLoading }] = useMutation(gql(BLOCK_USER));

  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [showReport, setShowReport] = useState<boolean>(false);

  const [subscriptionErrorCount, setSubscriptionErrorCount] = useState(0);

  const onSubscriptionError = (err: any) => {
    console.log('ERROR subscription: ', err);
    setTimeout(() => {
      setSubscriptionErrorCount((prev) => prev + 1);
    }, 500);
  };

  useEffect(() => {
    let unSubscribe: any;
    const getConvo = async () => {
      try {
        await getConversation({
          variables: {
            id: conversationId,
          },
        });
      } catch (err) {
        console.log('ERROR getConvo: ', err);
      }

      try {
        await messagesByConversation({
          variables: {
            conversationId,
          },
        });
      } catch (err) {
        console.log('ERROR getConvo: ', err);
      }

      unSubscribe = subscribeToMore({
        document: gql(MESSAGES_SUBSCRIPTION),
        variables: { conversationId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const readBy =
            subscriptionData.data.onCreateMessageForConversation.readBy;
          if (subData.sub && !readBy.includes(subData?.sub)) {
            readBy.push(subData.sub);

            try {
              updateMessage({
                variables: {
                  input: {
                    id: subscriptionData.data.onCreateMessageForConversation.id,
                    readBy,
                  },
                },
              });
            } catch (err) {
              console.log('ERROR update message: ', err);
            }
          }

          const newRecord = {
            ...subscriptionData.data.onCreateMessageForConversation,
            readBy,
          };

          //return prev;

          return Object.assign({}, prev, {
            messagesByConversation: {
              items: prev?.messagesByConversation?.items
                ? //? [...prev.messagesByConversation.items, newRecord] //TODO: removed because message for sender duplicating twice
                  [...prev.messagesByConversation.items, newRecord]
                : [newRecord],
              nextToken: prev?.messagesByConversation?.nextToken || null,
            },
          });
        },
        onError: (err) => onSubscriptionError(err),
      });
    };

    if (conversationId) {
      getConvo();
    }

    return () => unSubscribe && unSubscribe();
  }, [
    conversationId,
    getConversation,
    messagesByConversation,
    subData,
    subscribeToMore,
    updateMessage,
    subscriptionErrorCount,
  ]);

  const conversation = useMemo(
    () => conversationData?.getConversation || {},
    [conversationData]
  );

  const otherUserConversations: UserConversation[] = useMemo(
    () =>
      conversationData?.getConversation?.userConversations?.items?.filter(
        (userConversation: UserConversation) =>
          userConversation.userId !== subData?.sub
      ),
    [conversationData, subData]
  );

  const otherUserIds: string[] = useMemo(
    () => otherUserConversations?.map((otherUser) => otherUser.userId) || [],
    [otherUserConversations]
  );

  const messages = useMemo(
    () => messagesData?.messagesByConversation?.items || [],
    [messagesData]
  );

  const [listUserConversations] = useLazyQuery(gql(LIST_USER_CONVERSATIONS), {
    notifyOnNetworkStatusChange: true,
    variables: {
      sortDirection: 'DESC',
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    bottomRef?.current?.scrollIntoView && bottomRef?.current?.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    if (subData?.sub) {
      if (conversation?.id && !conversation?.readBy?.includes(subData.sub)) {
        const readBy = conversation?.readBy || [];
        readBy.push(subData.sub);
        try {
          updateConversation({
            variables: {
              input: {
                id: conversation.id,
                readBy,
              },
            },
          });
        } catch (err) {
          console.log('ERROR update conversation: ', err);
        }
      }

      if (
        conversation?.messages?.items?.[0] &&
        !conversation?.messages?.items?.[0]?.readBy?.includes(subData.sub)
      ) {
        const readBy = conversation?.messages?.items?.[0]?.readBy || [];
        readBy.push(subData.sub);
        try {
          updateMessage({
            variables: {
              input: {
                id: conversation?.messages?.items?.[0]?.id,
                readBy,
              },
            },
          });
        } catch (err) {
          console.log('ERROR update message: ', err);
        }
      }
    }
  }, [conversation, subData, updateMessage, updateConversation]);

  const onDeleteConversation = async () => {
    const deleteConversationRequest = deleteConversation({
      variables: {
        input: {
          id: conversationId,
        },
      },
    });

    const requests = [deleteConversationRequest];
    conversationData?.getConversation?.userConversations?.items?.forEach(
      (userConversation: UserConversation) => {
        const deleteUserConversationRequest = deleteUserConversation({
          variables: {
            input: {
              id: userConversation?.id,
            },
          },
        });

        requests.push(deleteUserConversationRequest);
      }
    );

    try {
      await Promise.all(requests);
    } catch (err) {
      console.log('ERROR delete conversation: ', err);
    }

    setShowInfo(false);
    navigate(PATHS.conversations);
  };

  const onShowReport = () => {
    setShowInfo(false);
    setShowReport(true);
  };

  const onReportBlock = async (reason: string) => {
    if (otherUserConversations?.[0]?.user?.id) {
      try {
        await blockUser({
          variables: {
            input: {
              userId: otherUserConversations[0].user.id,
              reason,
            },
          },
        });
      } catch (err) {
        console.log('ERROR block user: ', err);
      }

      setTimeout(async () => {
        try {
          await listUserConversations();
        } catch (err) {
          console.log('ERROR list user conversations: ', err);
        }
      }, 3000);
    }

    setShowReport(false);
  };

  return (
    <>
      <WBModal
        title={t('reportAndBlock', { ns: 'common' })}
        open={showReport}
        onClose={() => setShowReport(false)}
        sx={{
          width: '80%',
          height: '80%',
        }}
      >
        <ReportForm onReport={onReportBlock} loading={blockLoading} />
      </WBModal>
      <WBModal
        open={showInfo}
        onClose={() => setShowInfo(false)}
        title={
          conversation?.title ||
          (!conversationLoading && t('productDeleted', { ns: 'products' }))
        }
        sx={{
          width: '80%',
          height: '80%',
        }}
      >
        <WBFlex flexDirection="column">
          <WBDivider sx={{ my: 1 }} />
          <WBTypography variant="h4">
            {t('membersTitle', { ns: 'conversations' })}
          </WBTypography>
          {otherUserConversations?.map((userConversation) => (
            <Link
              key={userConversation?.id}
              to={`${PATHS.user}/${userConversation?.user?.id}`}
            >
              <WBS3ListItem
                primary={
                  userConversation?.user?.id
                    ? `${userConversation?.user?.firstName} ${userConversation?.user?.lastName}`
                    : t('deletedUser', { ns: 'common' })
                }
                imgKey={userConversation?.user?.profileImg?.key}
                identityId={userConversation?.user?.profileImg?.identityId}
                level={userConversation?.user?.profileImg?.level}
                src={PROFILE_PLACEHOLDER}
              />
            </Link>
          ))}

          <WBDivider sx={{ my: 1 }} />

          <WBFlex mt={3} flexDirection={['column', 'column', 'row']}>
            <WBButton
              variant="text"
              color="error"
              onClick={onDeleteConversation}
            >
              {t('deleteConversation', { ns: 'conversations' })}
            </WBButton>

            <WBButton
              variant="text"
              color="error"
              onClick={() => onShowReport()}
            >
              {t('reportAndBlock', { ns: 'common' })}
            </WBButton>
          </WBFlex>
        </WBFlex>
      </WBModal>

      <WBFlex
        sx={{ borderBottom: '1px solid lightgrey' }}
        alignItems="center"
        justifyContent="space-between"
        p={1}
        height="73px"
        minHeight="73px"
      >
        {conversationId && (
          <WBFlex alignItems="center">
            <WBFlex flexDirection="column">
              {otherUserConversations?.map((otherUser: UserConversation) => (
                <Link
                  key={otherUser.id}
                  to={
                    otherUser?.user?.id
                      ? `${PATHS.user}/${otherUser?.user?.id}`
                      : `${PATHS.user}/${otherUser?.user?.id}`
                  }
                >
                  <WBTypography>
                    {otherUser?.user?.firstName} {otherUser?.user?.lastName}
                  </WBTypography>
                </Link>
              )) ||
                (conversationLoading && <WBSkeleton width={80} />)}
            </WBFlex>
          </WBFlex>
        )}
        {!conversationLoading && conversationId && (
          <WBIconButton
            icon="EllipsisVertical"
            onClick={() => setShowInfo(true)}
          />
        )}
      </WBFlex>
      <WBBox
        sx={{
          overflowY: 'scroll',
          flexGrow: 1,
        }}
        p={2}
      >
        {!conversationLoading && conversationId && (
          <MessageList messages={messages} />
        )}

        <WBBox ref={bottomRef} />
      </WBBox>
      <SendMessage users={otherUserIds} />
    </>
  );
};

export default ConversationDetail;
