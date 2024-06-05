import {
  WBAlert,
  WBBox,
  WBButton,
  WBChip,
  WBFlex,
  WBIcon,
  WBIconButton,
  WBNoResults,
  WBTypography,
} from '@admiin-com/ds-web';
import { isEmpty } from 'lodash';
import React, { useMemo } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Option } from '@admiin-com/ds-graphql';
import { PageContainer } from '../../components';
import { deleteOption as DELETE_OPTION } from '@admiin-com/ds-graphql';
import { optionsByGroup as OPTIONS_BY_GROUP } from '@admiin-com/ds-graphql';
import { PATHS } from '../../navigation/paths';

const Options = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const group = searchParams.get('group');
  const {
    data: tagsData,
    error: tagsError,
    refetch: refetchGroupOptions,
  } = useQuery(gql(OPTIONS_BY_GROUP), {
    notifyOnNetworkStatusChange: true,
    variables: {
      group,
    },
    skip: !group,
  });

  const { data: interestsData, refetch: refetchInterests } = useQuery(
    gql(OPTIONS_BY_GROUP),
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        group: 'Interests',
      },
      skip: !!group,
    }
  );

  const { data: categoriesData, refetch: refetchCategories } = useQuery(
    gql(OPTIONS_BY_GROUP),
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        group: 'Categories',
      },
      skip: !!group,
    }
  );

  const [deleteOption, { data: deleteData, reset: resetDelete }] = useMutation(
    gql(DELETE_OPTION)
  );

  const options = useMemo(
    () => tagsData?.optionsByGroup?.items || [],
    [tagsData]
  );

  const interests = useMemo(
    () => interestsData?.optionsByGroup?.items || [],
    [interestsData]
  );

  const categories = useMemo(
    () => categoriesData?.optionsByGroup?.items || [],
    [categoriesData]
  );

  const onDeleteTag = async (option: Option) => {
    const confirm = window.confirm('Are you sure you want to delete this tag?');
    if (confirm) {
      if (option) {
        try {
          await deleteOption({
            variables: {
              input: { id: option.id },
            },
          });
          await refetchGroupOptions();
        } catch (err) {
          console.log('ERROR delete option', err);
        }
      }
    }
  };

  const onRefetch = () => {
    if (group) {
      refetchGroupOptions();
    } else {
      refetchInterests();
      refetchCategories();
    }
  };

  const renderOptions = (
    options: Option[],
    optionsGroup: string,
    showNoResults = false
  ) => {
    return (
      <WBBox p={2} mb={3}>
        {optionsGroup && (
          <WBTypography variant="h3">{optionsGroup}</WBTypography>
        )}
        <WBFlex>
          {options?.map((option: Option) => (
            <WBChip
              key={`option-${option.id}`}
              label={option.label}
              onDelete={() => onDeleteTag(option)}
              sx={{ m: 1 }}
            />
          ))}
        </WBFlex>

        <WBButton
          sx={{ mt: 2 }}
          startIcon={<WBIcon name="Add" size="small" color="primary" />}
          onClick={() => navigate(`${PATHS.tagCreate}/${optionsGroup}`)}
          size="small"
          type="button"
          variant="outlined"
        >
          {t('optionTitle', { ns: 'backoffice' })}
        </WBButton>

        {showNoResults && options?.length === 0 && (
          <WBNoResults title={t('noResultsTitle', { ns: 'common' })} />
        )}
      </WBBox>
    );
  };

  return (
    <PageContainer>
      <WBFlex p={2}>
        <WBBox flex={1}>
          <WBIconButton icon="Refresh" size="small" onClick={onRefetch} />
        </WBBox>
        {/*<WBBox flex={1} textAlign="right">*/}
        {/*  <WBButton*/}
        {/*    startIcon={<WBIcon name="Add" size="small"/>}*/}
        {/*    onClick={() => navigate(`${PATHS.tagCreate}/${group}`)}*/}
        {/*    size="small"*/}
        {/*    type="button"*/}
        {/*  >*/}
        {/*    {t('optionTitle', { ns: 'backoffice' })}*/}
        {/*  </WBButton>*/}
        {/*</WBBox>*/}
      </WBFlex>

      {!group && (
        <>
          {renderOptions(interests, 'Interests', false)}
          {renderOptions(categories, 'Categories', false)}
        </>
      )}

      {group && renderOptions(options, group, true)}

      {tagsError?.message && (
        <WBAlert title={tagsError?.message} severity="error" sx={{ my: 2 }} />
      )}

      {!isEmpty(deleteData) && (
        <WBAlert
          title={t('deletedSuccessfully', { ns: 'common' })}
          severity="success"
          onClose={resetDelete}
          sx={{ mt: 2 }}
        />
      )}
    </PageContainer>
  );
};

export default Options;
