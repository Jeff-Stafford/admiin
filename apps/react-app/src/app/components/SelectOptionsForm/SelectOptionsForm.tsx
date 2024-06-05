import { gql, useQuery } from '@apollo/client';
import {
  useTheme,
  WBBox,
  WBButton,
  WBCheckbox,
  WBChip,
  WBFlex,
  WBSkeleton,
} from '@admiin-com/ds-web';
import { isEmpty } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Option } from '@admiin-com/ds-graphql';
import { optionsByGroup } from '@admiin-com/ds-graphql';

export interface SelectOption extends Option {
  isActive?: boolean;
}

interface SelectOptionsFormProps {
  selectedOptions: string[];
  category: string | null;
  onSubmit: (options: Option[]) => void;
  loading?: boolean;
  hideSelectAll?: boolean;
}

export const SelectOptionsForm = ({
  selectedOptions,
  onSubmit,
  loading,
  hideSelectAll,
}: SelectOptionsFormProps) => {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const [interests, setInterests] = useState<SelectOption[]>([]);

  const { data: tagsData, loading: tagsLoading } = useQuery(
    gql(optionsByGroup),
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        group: 'Interests',
      },
    }
  );

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
    if (!isEmpty(tags)) {
      const selectedTags: any = [...tags].map((tag: Option) => ({
        ...tag,
        isActive:
          selectedOptions?.find(
            (selectedOption) => selectedOption === tag.value
          ) || false,
      }));

      setInterests(selectedTags);
    }
  }, [selectedOptions, tags]);

  const onSave = async () => {
    const selectedInterests = [...interests]
      .filter((interest) => interest.isActive)
      .map((interest) => {
        const { isActive, ...other } = interest;
        return other;
      });

    onSubmit(selectedInterests);
  };

  const onInterestClick = (clickedInterest: SelectOption) => {
    const newInterests: SelectOption[] = [...interests];
    const index = newInterests.findIndex(
      (interest: SelectOption) => interest.id === clickedInterest.id
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
          {interests?.map((interest: SelectOption) => (
            <WBChip
              key={interest.id}
              label={interest.label}
              variant={interest.isActive ? 'filled' : 'outlined'}
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
      </WBFlex>

      {tagsLoading && (
        <WBFlex columnGap="20px" justifyContent="center">
          <WBSkeleton width={70} height={50} sx={{ borderRadius: '16px' }} />
          <WBSkeleton width={100} height={50} sx={{ borderRadius: '16px' }} />
          <WBSkeleton width={100} height={50} sx={{ borderRadius: '16px' }} />
        </WBFlex>
      )}

      {!hideSelectAll && (
        <WBFlex justifyContent="center" mt={1}>
          <WBCheckbox
            label={t('selectAll', { ns: 'common' })}
            checked={isAllChecked}
            onChange={onSelectAll}
          />
        </WBFlex>
      )}

      <WBButton
        onClick={onSave}
        disabled={tagsLoading}
        loading={loading}
        sx={{
          mt: 3,
          alignSelf: 'center',
        }}
      >
        {t('saveTitle', { ns: 'common' })}
      </WBButton>
    </>
  );
};
