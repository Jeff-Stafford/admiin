import { gql, useQuery } from '@apollo/client';
import { WBFlex, WBTypography } from '@admiin-com/ds-web';
import { WBS3Avatar } from '@admiin-com/ds-amplify-web';
import { PROFILE_PLACEHOLDER } from '@admiin-com/ds-common';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Conversation, User } from '@admiin-com/ds-graphql';
import { Link } from '../../components';
import { CSGetSub as GET_SUB } from '@admiin-com/ds-graphql';
import { PATHS } from '../../navigation/paths';

interface UserConversationWithoutMessageProps {
  conversation?: Conversation | null;
}

export const UserConversationWithoutMessage = ({
  conversation,
}: UserConversationWithoutMessageProps) => {
  const { t } = useTranslation();
  const { data: subData } = useQuery(gql(GET_SUB));

  const otherUsers = useMemo(() => {
    const users = conversation?.userConversations?.items?.map(
      (userConvo: any) => userConvo.user
    );

    return (
      users?.filter(
        (otherUser: User) => otherUser && otherUser.id !== subData?.sub
      ) || []
    );
  }, [conversation, subData]);

  return (
    <Link
      to={`${PATHS.conversations}/${conversation?.id}`}
      underline="none"
      key={conversation?.id}
    >
      <WBFlex
        flexDirection="column"
        mt={1}
        alignItems="center"
        width="120px"
        overflow="hidden"
        sx={{ textOverflow: 'ellipsis' }}
      >
        {/*{otherUsers?.map((user: User) => (*/}
        <WBS3Avatar
          key={`${conversation?.id}-${otherUsers?.[0]?.profileImg?.key}`}
          sx={{
            width: {
              xs: '36px',
              sm: '48px',
            },
            height: {
              xs: '36px',
              sm: '48px',
            },
          }}
          imgKey={otherUsers?.[0]?.profileImg?.key}
          identityId={otherUsers?.[0]?.profileImg?.identityId}
          level={otherUsers?.[0]?.profileImg?.level}
          src={PROFILE_PLACEHOLDER}
        />
        {/*))}*/}

        <WBTypography
          textAlign="center"
          variant="body2"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '3',
            WebkitBoxOrient: 'vertical',
            fontWeight: 600,
          }}
        >
          {conversation?.title || t('productDeleted', { ns: 'products' })}
        </WBTypography>
        {otherUsers?.map((user: User) => (
          <WBTypography
            key={`${conversation?.id}-${user?.id}`}
            textAlign="center"
            variant="body2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '1',
              WebkitBoxOrient: 'vertical',
              fontWeight: !conversation?.readBy?.includes(subData?.sub)
                ? 'bold'
                : undefined,
            }}
          >
            {user?.id
              ? `${user?.firstName} ${user?.lastName}`
              : t('userDeleted', { ns: 'common' })}
          </WBTypography>
        ))}
      </WBFlex>
    </Link>
  );
};
