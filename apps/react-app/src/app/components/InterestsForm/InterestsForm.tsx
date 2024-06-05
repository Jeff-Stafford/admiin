import { useEffect, useMemo, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  useTheme,
  WBAlert,
  WBBox,
  WBButton,
  WBCheckbox,
  WBChip,
  WBFlex,
  WBSkeleton,
} from '@admiin-com/ds-web';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Option } from '@admiin-com/ds-graphql';
import { CSGetSub as GET_SUB } from '@admiin-com/ds-graphql';
import { updateUser as UPDATE_USER } from '@admiin-com/ds-graphql';
import { getUser, optionsByGroup } from '@admiin-com/ds-graphql';

interface InterestOption extends Option {
  isActive: boolean;
}

export const InterestsForm = () => {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const [interests, setInterests] = useState<InterestOption[]>([]);
  const { data: subData } = useQuery(gql(GET_SUB));
  const { data: userData } = useQuery(gql(getUser), {
    variables: {
      id: subData?.sub,
    },
  });

  const user = useMemo(() => userData?.getUser || {}, [userData]);

  const { data: tagsData, loading: tagsLoading } = useQuery(
    gql(optionsByGroup),
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        group: 'Interests',
      },
    }
  );

  const [
    updateUser,
    {
      loading: updateLoading,
      data: updateData,
      error: updateError,
      reset: resetUpdate,
    },
  ] = useMutation(gql(UPDATE_USER));

  const tags = useMemo(
    () =>
      tagsData?.optionsByGroup?.items?.map((option: Option) => ({
        ...option,
        label: t(option.value, { ns: 'options' }),
      })) || [],
    [tagsData, t]
  );
  const isAllChecked = useMemo(
    () => interests.every((interest) => interest.isActive),
    [interests]
  );

  useEffect(() => {
    if (!isEmpty(user) && !isEmpty(tags)) {
      const selectedTags = tags.map((tag: Option) => ({
        ...tag,
        isActive: user.interests.includes(tag.value),
      }));
      setInterests(selectedTags);
    }
  }, [user, tags]);

  const onSave = async () => {
    try {
      await updateUser({
        variables: {
          input: {
            id: subData?.sub,
            interests: interests
              .filter((interest) => interest.isActive)
              .map((interest) => interest.label),
          },
        },
      });
    } catch (err) {
      console.log('ERROR update user: ', err);
    }
  };

  const onInterestClick = (clickedInterest: InterestOption) => {
    const newInterests: InterestOption[] = [...interests];
    const index = newInterests.findIndex(
      (interest: InterestOption) => interest.id === clickedInterest.id
    );
    newInterests[index] = {
      ...newInterests[index],
      isActive: !clickedInterest.isActive,
    };

    setInterests(newInterests);
  };

  const onSelectAll = () => {
    if (tags?.length > 0) {
      const selectedTags = tags.map((tag: Option) => ({
        ...tag,
        isActive: !isAllChecked,
      }));

      setInterests(selectedTags);
    }
  };

  return (
    <>
      <WBFlex flexDirection="column" textAlign="center" flexWrap="wrap">
        <WBBox>
          {interests?.map((interest: InterestOption) => (
            <WBChip
              key={interest.id}
              variant={interest.isActive ? 'filled' : 'outlined'}
              label={interest.label}
              sx={{
                m: 1,
                color: interest.isActive ? '#2C4052' : undefined,
                background: interest.isActive
                  ? `linear-gradient(135deg, ${palette.primary.main}, ${palette.secondary.main})`
                  : undefined,
              }}
              onClick={() => onInterestClick(interest)}
            />
          ))}
        </WBBox>

        {tagsLoading && (
          <WBFlex columnGap="20px" justifyContent="center">
            <WBSkeleton width={70} height={50} sx={{ borderRadius: '16px' }} />
            <WBSkeleton width={100} height={50} sx={{ borderRadius: '16px' }} />
            <WBSkeleton width={100} height={50} sx={{ borderRadius: '16px' }} />
          </WBFlex>
        )}

        <WBFlex justifyContent="center" mt={1}>
          <WBCheckbox
            label={t('selectAll', { ns: 'common' })}
            checked={isAllChecked}
            onChange={onSelectAll}
          />
        </WBFlex>

        <WBFlex justifyContent="center">
          <WBButton
            type="button"
            onClick={onSave}
            loading={updateLoading}
            sx={{ mt: 2 }}
          >
            {t('saveTitle', { ns: 'common' })}
          </WBButton>
        </WBFlex>
      </WBFlex>

      {updateError?.message && (
        <WBAlert title={updateError.message} severity="error" sx={{ my: 2 }} />
      )}

      {!isEmpty(updateData) && (
        <WBAlert
          title={t('interestsUpdated', { ns: 'interests' })}
          severity="success"
          onClose={resetUpdate}
          sx={{ mt: 2 }}
        />
      )}
    </>
  );
};
