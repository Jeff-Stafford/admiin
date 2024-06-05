import { gql, useQuery, useSubscription } from '@apollo/client';
import { WBFlex, WBNoResults } from '@admiin-com/ds-web';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  onCreateMessageForSenderUser as SENDER_MESSAGE_SUBSCRIPTION,
  onDeleteUserConversation as DELETE_USER_CONVERSATION_SUBSCRIPTION,
  onCreateMessageForReceiverUser as RECEIVER_MESSAGE_SUBSCRIPTION,
} from '@admiin-com/ds-graphql';
import { UserConversation } from '@admiin-com/ds-graphql';
import {
  CSGetSub as GET_SUB,
  CSlistUserConversations as LIST_USER_CONVERSATIONS,
} from '@admiin-com/ds-graphql';
import { CSonCreateUserConversationForUser as USER_CONVERSATIONS_SUBSCRIPTION } from '@admiin-com/ds-graphql';
import { UserConversationWithMessage } from './UserConversationWithMessage';
import { UserConversationWithoutMessage } from './UserConversationWithoutMessage';

export const ConversationList = () => {
  const { t } = useTranslation();
  const [init, setInit] = useState(false);
  const [noMessageConversations, setNoMessageConversations] = useState<
    UserConversation[]
  >([]);
  const [messageConversations, setMessageConversations] = useState<
    UserConversation[]
  >([]);
  const { data: subData } = useQuery(gql(GET_SUB));
  const [dummyUserId, setDummyUserId] = useState('');
  const [subscriptionErrorCount, setSubscriptionErrorCount] = useState(0);

  const {
    data: userConversationsData,
    loading: listUserLoading,
    subscribeToMore,
  } = useQuery(gql(LIST_USER_CONVERSATIONS), {
    notifyOnNetworkStatusChange: true,
    skip: !subData?.sub || !init,
    variables: {
      sortDirection: 'DESC',
      limit: 1000,
    },
    fetchPolicy: 'cache-and-network',
  });

  //useEffect(() => {
  //  if (userConversationsData) {
  //    setNoMessageConversations([
  //      userConversationsData,
  //      ...noMessageConversations,
  //    ]);
  //  }
  //}, [userConversationsData]);

  const onSubscriptionError = useCallback(
    (err: any) => {
      console.log('ERROR subscription: ', err);
      setInit(false);
      setDummyUserId('');
      setTimeout(() => {
        setInit(true);
        setDummyUserId(subData?.sub);
        setSubscriptionErrorCount((prev) => prev + 1);
      }, 500);
    },
    [subData]
  );

  const { data: senderMessageData } = useSubscription(
    gql(SENDER_MESSAGE_SUBSCRIPTION),
    {
      skip: !subData?.sub || !init,
      variables: {
        sender: dummyUserId || subData?.sub,
      },
      onData: (options) => {
        options.client.cache.modify({
          fields: {
            listUserConversations(existing = []) {
              console.log(
                'SENDER_MESSAGE_SUBSCRIPTION existingexistingexisting: ',
                existing
              ); //TODO: this makes messages show in real time
            },
          },
        });
      },
      onError: (err) => onSubscriptionError(err),
      shouldResubscribe: true,
    }
  );

  useEffect(() => {
    setTimeout(() => {
      setInit(true);
    }, 3000);
  }, []);

  // subscription for messages for user as receiver
  const { data: receiverMessageData } = useSubscription(
    gql(RECEIVER_MESSAGE_SUBSCRIPTION),
    {
      skip: !subData?.sub || !init,
      variables: {
        receiver: dummyUserId || subData?.sub,
      },
      onData: (options) => {
        options.client.cache.modify({
          fields: {
            listUserConversations(existing = []) {
              console.log(
                'RECEIVER_MESSAGE_SUBSCRIPTION existingexistingexisting: ',
                existing
              ); //TODO: this makes messages show in real time
            },
          },
        });
      },
      onError: (err) => onSubscriptionError(err),
      shouldResubscribe: true,
    }
  );

  // subscription for delete user message
  useSubscription(gql(DELETE_USER_CONVERSATION_SUBSCRIPTION), {
    skip: !subData?.sub || !init,
    variables: {
      userId: dummyUserId || subData?.sub,
    },
    onData: (options) => {
      options.client.cache.modify({
        fields: {
          listUserConversations(existing = []) {
            console.log(
              'DELETE_USER_CONVERSATION_SUBSCRIPTION existingexistingexisting: ',
              existing
            );
          },
        },
      });
    },
    onError: (err) => onSubscriptionError(err),
    shouldResubscribe: true,
  });

  useEffect(() => {
    let unsubscribe: any;
    if (subData?.sub && init) {
      unsubscribe = subscribeToMore({
        document: gql(USER_CONVERSATIONS_SUBSCRIPTION),
        variables: { userId: subData.sub },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;

          const newRecord =
            subscriptionData.data.onCreateUserConversationForUser;

          return Object.assign({}, prev, {
            listUserConversations: {
              items: [newRecord, ...prev.listUserConversations.items],
              nextToken: prev.listUserConversations.nextToken || null,
            },
          });
        },
        onError: (err) => onSubscriptionError(err),
      });
    }

    return () => unsubscribe && unsubscribe();
  }, [
    subData,
    subscribeToMore,
    subscriptionErrorCount,
    onSubscriptionError,
    init,
  ]);

  useEffect(() => {
    const userConvos = userConversationsData?.listUserConversations?.items
      ? [...userConversationsData.listUserConversations.items]
      : [];

    const noMessageConvos =
      userConvos
        .filter(
          (convo: UserConversation) =>
            convo?.conversation?.messages?.items?.length === 0 &&
            convo.userId === subData?.sub
        )
        .sort((a, b) => {
          return a.conversation?.createdAt > b.conversation?.createdAt
            ? -1
            : a.conversation?.createdAt < b.conversation?.createdAt
            ? 1
            : 0;
        }) || [];

    setNoMessageConversations(noMessageConvos);
    const messageConvos =
      userConvos
        .filter(
          (convo: UserConversation) =>
            convo?.conversation?.messages?.items &&
            convo?.conversation?.messages?.items.length > 0 &&
            convo.userId === subData?.sub
        )
        .sort((a, b) => {
          return a.conversation?.messages?.items[0].createdAt >
            b.conversation?.messages?.items[0].createdAt
            ? -1
            : a.conversation?.messages?.items[0].createdAt <
              b.conversation?.messages?.items[0].createdAt
            ? 1
            : 0;
        }) || [];
    setMessageConversations(messageConvos);
  }, [userConversationsData, subData, senderMessageData]);

  useEffect(() => {
    const userConvos = userConversationsData?.listUserConversations?.items
      ? [...userConversationsData.listUserConversations.items]
      : [];

    const noMessageConvos =
      userConvos
        .filter(
          (convo: UserConversation) =>
            convo?.conversation?.messages?.items?.length === 0 &&
            convo.userId === subData?.sub
        )
        .sort((a, b) => {
          return a.conversation?.createdAt > b.conversation?.createdAt
            ? -1
            : a.conversation?.createdAt < b.conversation?.createdAt
            ? 1
            : 0;
        }) || [];

    setNoMessageConversations(noMessageConvos);

    const messageConvos =
      userConvos
        .filter(
          (convo: UserConversation) =>
            convo?.conversation?.messages?.items &&
            convo?.conversation?.messages?.items.length > 0 &&
            convo.userId === subData?.sub
        )
        .sort((a, b) => {
          return a.conversation?.messages?.items[0].createdAt >
            b.conversation?.messages?.items[0].createdAt
            ? -1
            : a.conversation?.messages?.items[0].createdAt <
              b.conversation?.messages?.items[0].createdAt
            ? 1
            : 0;
        }) || [];

    setMessageConversations(messageConvos);
  }, [userConversationsData, subData, receiverMessageData]);

  return (
    <>
      <WBFlex sx={{ overflowX: 'scroll' }} pb={[3, 1]}>
        {noMessageConversations.map(({ conversation }) => (
          <UserConversationWithoutMessage
            key={conversation?.id}
            conversation={conversation}
          />
        ))}
      </WBFlex>

      <WBFlex px={1} flexDirection="column" sx={{ overflow: 'auto' }}>
        {messageConversations.map(({ conversation }) => (
          <UserConversationWithMessage
            key={conversation?.id}
            conversation={conversation}
          />
        ))}
      </WBFlex>
      {!listUserLoading &&
        noMessageConversations?.length === 0 &&
        messageConversations?.length === 0 && (
          <WBNoResults description={t('noChats', { ns: 'conversations' })} />
        )}
    </>
  );
};
