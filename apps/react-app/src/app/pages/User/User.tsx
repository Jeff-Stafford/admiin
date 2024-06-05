import { Image, PROFILE_PLACEHOLDER } from '@admiin-com/ds-common';
import { useMemo } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  WBBox,
  WBButton,
  WBFlex,
  WBSkeleton,
  WBTypography,
  WBChipList,
  useTheme,
} from '@admiin-com/ds-web';
import { WBS3AvatarUpload, WBS3Avatar } from '@admiin-com/ds-amplify-web';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { UserType } from '@admiin-com/ds-graphql';
import { Link, PageContainer } from '../../components';
import { getUser as GET_USER } from '@admiin-com/ds-graphql';
import {
  CSGetSub as GET_SUB,
  CSgetUserOther as GET_USER_OTHER,
} from '@admiin-com/ds-graphql';
import { updateUser as UPDATE_USER } from '@admiin-com/ds-graphql';
import { PATHS } from '../../navigation/paths';

const User = () => {
  const { palette } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userId } = useParams();
  const { data: subData } = useQuery(gql(GET_SUB));
  const { data: userData, loading: userLoading } = useQuery(gql(GET_USER), {
    variables: {
      id: userId,
    },
    skip: !subData || subData?.sub !== userId,
  });
  const { data: userOtherData, loading: userOtherLoading } = useQuery(
    gql(GET_USER_OTHER),
    {
      variables: {
        id: userId,
      },
      skip: !subData || subData?.sub === userId,
    }
  );
  const user = useMemo(
    () => userData?.getUser || userOtherData?.getUser || {},
    [userData, userOtherData]
  );
  const isUser = useMemo(() => subData?.sub === userId, [subData?.sub, userId]);

  const [updateUser] = useMutation(gql(UPDATE_USER));

  const onImageUpload = async (image: Image) => {
    try {
      await updateUser({
        variables: { input: { id: userId, profileImg: image } },
      });
    } catch (err) {
      console.log('ERROR updating user image upload: ', err);
    }
  };

  const onPlanClick = () => {
    navigate(PATHS.plans);
  };

  return (
    <PageContainer>
      {isUser && (
        <WBFlex>
          <WBBox flex={1} />
          <WBBox flex={1} textAlign="right">
            <WBButton
              size="small"
              variant="outlined"
              onClick={() => navigate(`${PATHS.userUpdate}/${userId}`)}
            >
              {t('editProfile', { ns: 'user' })}
            </WBButton>
          </WBBox>
        </WBFlex>
      )}
      <WBFlex flexDirection="column" alignItems="center">
        {isUser && (
          <WBS3AvatarUpload
            onImageUpload={onImageUpload}
            imgKey={user?.profileImg?.key}
            src={PROFILE_PLACEHOLDER}
            sx={{
              width: '120px',
              height: '120px',
            }}
          />
        )}

        {!isUser && (
          <WBS3Avatar
            imgKey={user?.profileImg?.key}
            src={PROFILE_PLACEHOLDER}
            sx={{
              width: '120px',
              height: '120px',
            }}
          />
        )}

        <WBTypography variant="h1" textAlign="center">
          {userLoading || userOtherLoading ? (
            <WBSkeleton width={200} />
          ) : (
            `${user?.firstName} ${user?.lastName}`
          )}
        </WBTypography>

        {user?.team?.title && (
          <WBTypography variant="h4">{user?.team?.title}</WBTypography>
        )}

        <WBFlex
          flexWrap="wrap"
          mt={1}
          justifyContent="center"
          alignItems="center"
        >
          <WBChipList
            tags={user?.interests}
            numTags={5}
            color="secondary"
            variant="filled"
            sx={{
              background: `linear-gradient(135deg, ${palette.primary.main}, ${palette.secondary.main})`,
              color: '#2C4052',
            }}
          />
        </WBFlex>

        {isUser &&
          !userLoading &&
          !userOtherLoading &&
          user?.userType === UserType.Buyers && (
            <Link to={PATHS.tags} sx={{ mt: 2 }}>
              {t('addInterests', { ns: 'user' })}
            </Link>
          )}

        {user?.about && (
          <WBTypography mt={2} textAlign="center">
            {user.about}
          </WBTypography>
        )}

        {isUser && !userLoading && !userOtherLoading && !user?.about && (
          <Link to={`${PATHS.userUpdate}/${subData?.sub}`} sx={{ mt: 2 }}>
            {t('addBio', { ns: 'user' })}
          </Link>
        )}

        {isUser && (
          <WBButton sx={{ mt: 3 }} onClick={onPlanClick}>
            {!userLoading
              ? t('viewPlan', { ns: 'purchase' })
              : t('selectAPlan', { ns: 'purchase' })}
          </WBButton>
        )}

        {isUser && user?.teamId && (
          <WBButton
            onClick={() => navigate(`${PATHS.team}/${user?.teamId}`)}
            sx={{ mt: 3 }}
          >
            {t('viewTeamTitle', { ns: 'team' })}
          </WBButton>
        )}
        {isUser && !user?.teamId && user?.userType === UserType.Sellers && (
          <WBButton
            onClick={() => navigate(`${PATHS.teamCreate}`)}
            sx={{ mt: 3 }}
          >
            {t('createTeamTitle', { ns: 'team' })}
          </WBButton>
        )}
      </WBFlex>
    </PageContainer>
  );
};

export default User;
