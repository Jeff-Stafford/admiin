import { Contact, Entity, TaskDirection } from '@admiin-com/ds-graphql';
import {
  WBAutocomplete,
  WBBox,
  WBDivider,
  WBIcon,
  WBLink,
  WBListItemIcon,
  WBTextField,
  WBTypography,
} from '@admiin-com/ds-web';
import {
  AutocompleteRenderGroupParams,
  CircularProgress,
  MenuItem,
  Paper,
  debounce,
  styled,
  useTheme,
} from '@mui/material';
import React from 'react';
import { useLookupService } from './useLookupService';
import { useTranslation } from 'react-i18next';
import { ContactCreateModal } from '../../pages/ContactCreateModal/ContactCreateModal';
import { EntityCreateModal } from '../../pages/EntityCreateModal/EntityCreateModal';
import { v4 as uuidv4 } from 'uuid';
import { WBS3Avatar } from '@admiin-com/ds-amplify-web';
import { TextFieldProps } from 'libs/design-system-web/src/lib/components/composites/TextField/TextField';
import { useTaskCreationContext } from '../../pages/TaskCreation/TaskCreation';
import { getContactName, getName } from '../../helpers/contacts';
import { useFormContext, useWatch } from 'react-hook-form';

export type AutoCompleteDataType =
  | 'Contact'
  | 'Entity'
  | 'EntityUser'
  | 'AutocompleteResults'
  | 'ContactsAndVerifiedEntity';

export interface AutoCompleteLookupProps extends TextFieldProps {
  value?: any;
  label: string;
  placeholder: string;
  disabled?: boolean;
  onChange: (option: any) => void;
  defaultValue?: any;
  getOptionLabel?: (option: any) => string;
  type: AutoCompleteDataType;
  entityId?: string;
  noPopupIcon?: boolean;
}

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  // top: '-8px',
  margin: '8px 16px',
  fontWeight: 'bold',
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
  paddingBottom: theme.spacing(2),
}));

const GroupItems = styled('ul')(({ theme }) => ({
  padding: 0,
  marginBottom: theme.spacing(3.5),
}));

const AutoCompleteLookup = (
  {
    onChange,
    label,
    placeholder,
    disabled = false,
    type,
    defaultValue,
    noPopupIcon = false,
    value,
    entityId,
    ...props
  }: AutoCompleteLookupProps,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const { t } = useTranslation();
  const theme = useTheme();

  // const [value, setValue] = React.useState<any>(props.value || '');

  const [inputValue, setInputValue] = React.useState('');

  const [options, setOptions] = React.useState<readonly any[]>(
    value ? [value] : []
  );

  const { lookup, loading } = useLookupService({ type, entityId });

  const [modalOpen, setModalOpen] = React.useState<AutoCompleteDataType | null>(
    null
  );
  const handleCloseModal = () => {
    setModalOpen(null);
  };

  const { isClient, taskDirection, page } = useTaskCreationContext();
  const { control } = useFormContext();
  const to = useWatch({ control: control, name: 'to' });

  const addContact = React.useCallback(
    (options: Array<any>) => {
      if (
        taskDirection === TaskDirection.SENDING &&
        page === 'Sign' &&
        type === 'EntityUser'
      ) {
        options.unshift(to);
      }
      return options;
    },
    [to, taskDirection]
  );
  //TODO: refactor code a bit?
  const fetch = React.useMemo(() => {
    return debounce(async (inputValue) => {
      if (!lookup) return;
      const results = await lookup(inputValue);
      // TODO: remove generate label to useLookupservice

      if (isClient && type === 'Entity' && value) {
        setOptions([value]);
      } else
        setOptions(
          addContact([
            ...(results && Array.isArray(results)
              ? results
                  ?.filter((result) => result)
                  .map((result: any) => ({
                    ...result,
                  })) ?? []
              : []),
          ])
        );
    }, 150);
  }, [lookup]);

  const [open, setOpen] = React.useState(false);
  const initalLoading = !value && open;

  React.useEffect(() => {
    let active = true;

    if (!initalLoading) {
      return undefined;
    }

    (async () => {
      if (active) {
        fetch('');
      }
    })();

    return () => {
      active = false;
    };
  }, [fetch, initalLoading, entityId]);

  React.useEffect(() => {
    if (inputValue === value?.label || (value && value?.label === undefined)) {
      fetch('');
    } else fetch(inputValue);
  }, [inputValue, fetch, entityId]);

  const handleNewClick = React.useCallback(() => {
    setModalOpen(type);
  }, [type]);

  // React.useEffect(() => {
  //   if (!open) {
  //     setOptions([]);
  //   }
  // }, [open]);

  const addNewBox = React.useMemo(
    () =>
      type !== 'AutocompleteResults' ? (
        <WBBox>
          <WBDivider
            sx={{
              bgcolor: theme.palette.grey[300],
            }}
            light
            variant="middle"
          />
          <WBBox p={2}>
            <WBLink
              variant="body2"
              component={'button'}
              // sx={{ marginTop: 3 }}
              underline="always"
              color={'text.primary'}
              fontWeight={'bold'}
              onClick={handleNewClick}
            >
              {`${t('addNew', { ns: 'taskbox' })} ${t(type, {
                ns: 'taskbox',
              })}`}
            </WBLink>
          </WBBox>
        </WBBox>
      ) : (
        <WBBox />
      ),
    [theme.palette.grey, theme.palette.common.black, handleNewClick, t, type]
  );

  const groupCounts: any = {};

  options.forEach((option) => {
    const groupKey = option?.searchType; // Assuming `searchType` defines the group
    groupCounts[groupKey] = (groupCounts[groupKey] || 0) + 1;
  });

  const renderCounter: any = {};

  const renderGroup = (params: AutocompleteRenderGroupParams) => {
    const groupKey = params.key;
    renderCounter[groupKey] = (renderCounter[groupKey] || 0) + 1;

    const isLastGroupItem =
      Object.values(renderCounter).length === Object.values(groupCounts).length;
    return (
      <li key={params.key}>
        <GroupHeader>{params.group}</GroupHeader>
        <GroupItems>{params.children}</GroupItems>

        {isLastGroupItem ? addNewBox : null}
      </li>
    );
  };

  const getGroupLabel = (option: any) => {
    switch (option.searchType) {
      case 'Contacts':
        return t('yourContacts', { ns: 'taskbox' });
      case 'AutoCompleteResults':
        return t('admiinBusinesses', { ns: 'taskbox' });
      default:
        return option.searchType;
    }
  };

  return (
    <>
      <WBAutocomplete
        fullWidth
        groupBy={
          type === 'ContactsAndVerifiedEntity' ? getGroupLabel : undefined
        }
        renderGroup={renderGroup}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        getOptionLabel={(option) =>
          props.getOptionLabel
            ? props.getOptionLabel(option)
            : typeof option === 'string'
            ? option
            : getName(option) ??
              option.name ??
              option.searchName ??
              `${option.firstName} ${option.lastName}` ??
              ''
        }
        filterOptions={(x) => x}
        options={options}
        clearOnEscape
        autoComplete
        includeInputInList
        filterSelectedOptions
        value={value ?? null}
        noOptionsText={
          <>
            <WBTypography color={'inherit'} mb={1} ml={2}>
              {t(`no${type}`, { ns: 'taskbox' })}
            </WBTypography>
            {addNewBox}
          </>
        }
        popupIcon={
          noPopupIcon ? null : (
            <WBIcon name="ChevronDown" size={1.3} color={'black'} />
          )
        }
        inputValue={inputValue}
        onChange={(event: React.ChangeEvent<object>, newValue: any) => {
          setOptions(newValue ? [newValue, ...options] : options);
          onChange(newValue);
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        isOptionEqualToValue={(option: any, value: any) => {
          return option?.id === value?.id;
        }}
        clearIcon={<WBIcon name="Close" color={'black'} size={'small'} />}
        loading={loading}
        loadingText={'Loading...'}
        renderInput={(params) => (
          <WBTextField
            label={label}
            ref={ref}
            {...params}
            error={props.error}
            helperText={props.helperText}
            placeholder={placeholder}
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
        PaperComponent={({ children, ...props }) => (
          <Paper {...props} sx={{ px: 2, py: 2.3 }}>
            {React.Children.map(children, (child) => child)}
          </Paper>
        )}
        renderOption={(props, option, state, ownerState) => {
          return (
            <React.Fragment key={option.id ?? uuidv4()}>
              <MenuItem {...props} value={option?.value}>
                <WBListItemIcon>
                  <WBS3Avatar
                    sx={{
                      borderRadius: '3px',
                      width: '20px',
                      height: '20px',
                    }}
                    fontSize="body2.fontSize"
                    imgKey={option?.logo?.key}
                    identityId={option?.logo?.identityId}
                    level={option?.logo?.level}
                    companyName={getName(option) ?? ''}
                  />
                </WBListItemIcon>
                {getName(option)}
              </MenuItem>
              {state.index + 1 + (value ? 1 : 0) ===
                ownerState.options.length &&
              type !== 'ContactsAndVerifiedEntity' ? (
                <WBBox mt={4}>{addNewBox}</WBBox>
              ) : null}
            </React.Fragment>
          );
        }}
        disabled={disabled}
      />
      {
        <>
          <ContactCreateModal
            onSuccess={(contact) => {
              onChange(contact);
            }}
            entityId={entityId}
            handleCloseModal={handleCloseModal}
            open={
              modalOpen === 'Contact' ||
              modalOpen === 'ContactsAndVerifiedEntity'
            }
          />
          <EntityCreateModal
            onSuccess={(entity) => onChange(entity)}
            handleCloseModal={handleCloseModal}
            open={modalOpen === 'Entity'}
          />
        </>
      }
    </>
  );
};

export default React.forwardRef(AutoCompleteLookup) as <
  T extends Entity | Contact | null
>(
  props: AutoCompleteLookupProps & React.RefAttributes<HTMLDivElement>
) => React.ReactElement;
