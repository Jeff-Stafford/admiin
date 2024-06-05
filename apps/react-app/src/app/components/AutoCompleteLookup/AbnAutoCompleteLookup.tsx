import {
  AbrNameSearchInformation,
  Contact,
  Entity,
} from '@admiin-com/ds-graphql';
import {
  WBAutocomplete,
  WBIcon,
  WBTextField,
  WBTypography,
} from '@admiin-com/ds-web';
import { CircularProgress, MenuItem, Paper, debounce } from '@mui/material';
import {
  abrLookup as ABR_LOOKUP,
  abrLookupByName as ABR_LOOKUP_BY_NAME,
} from '@admiin-com/ds-graphql';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { gql, useLazyQuery } from '@apollo/client';
import { TextFieldProps } from 'libs/design-system-web/src/lib/components/composites/TextField/TextField';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

type ABNResult = {
  name: string | null | undefined;
  abn: string;
  state: string | null | undefined;
  address: string | null | undefined;
};

export interface AutoCompleteLookupProps {
  value?: any;
  label: string;
  placeholder: string;
  disabled?: boolean;
  onChange: (option: any) => void;
  defaultValue?: any;
  getOptionLabel?: (option: any) => string;
  noPopupIcon?: boolean;
  onLoading?: (value: boolean) => void;
  onFound?: (result: ABNResult) => void;
  renderProps: TextFieldProps;
  nameOnly?: boolean;
}

const AutoCompleteLookup = (
  {
    onChange,
    label,
    placeholder,
    disabled = false,
    defaultValue,
    noPopupIcon = false,
    onFound,
    value,
    renderProps,
    nameOnly,
    onLoading,
    ...props
  }: AutoCompleteLookupProps,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const { t } = useTranslation();

  // const [value, setValue] = React.useState<any>(props.value || '');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState(value || '');
  const [found, setFound] = React.useState<string>('');

  React.useEffect(() => {
    if (onLoading) onLoading(loading);
  }, [loading]);

  const [options, setOptions] = React.useState<readonly any[]>([]);

  const [abrLookupByName] = useLazyQuery(
    gql`
      ${ABR_LOOKUP_BY_NAME}
    `
  );

  const [abrLookup] = useLazyQuery(
    gql`
      ${ABR_LOOKUP}
    `
  );
  //TODO: refactor code a bit?
  const isABN = (abn: string) => {
    return /^\d{11}$/.test(abn);
  };
  const isACN = (abn: string) => {
    return /^\d{9}$/.test(abn);
  };
  const fetch = React.useMemo(() => {
    return debounce(async (inputValue) => {
      try {
        setLoading(true);
        if (
          !nameOnly &&
          (isABN(inputValue) || isACN(inputValue)) &&
          inputValue !== found
        ) {
          console.log(inputValue, found);
          const abnInfoData: any = await abrLookup({
            variables: { abn: inputValue },
          });
          const abnInfo = abnInfoData?.data?.abrLookup;
          if (abnInfo && abnInfo.message === null && abnInfo.entityName) {
            // Set the business name in the form
            setOptions([abnInfo]);
            if (onFound)
              onFound({
                name: abnInfo.entityName ?? '',
                abn: abnInfo.abn,
                address: abnInfo.addressState,
                state: abnInfo.addressState,
              });
          }
        } else if (inputValue) {
          const result: any = await abrLookupByName({
            variables: { name: inputValue },
          });
          const items = result?.data?.abrLookupByName?.items || [];
          setOptions(
            items.slice(0, 5).map((item: AbrNameSearchInformation) => ({
              ...item,
              label: `${item.name} - ${item.abn}`,
              value: nameOnly ? item.name : item.abn,
            }))
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }, 500);
  }, []);

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    fetch(inputValue);
  }, [inputValue, fetch]);

  return (
    <WBAutocomplete
      fullWidth
      open={
        inputValue && !isABN(inputValue) && !isACN(inputValue) ? open : false
      }
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
          : option.label ??
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
      // filterSelectedOptions
      value={value || null}
      noOptionsText={
        inputValue ? (
          <WBTypography color={'inherit'}>
            {t(`noResultsTitle`, { ns: 'common' })}
          </WBTypography>
        ) : null
      }
      popupIcon={
        noPopupIcon ? undefined : (
          <WBIcon name="ChevronDown" size={1.3} color={'black'} />
        )
      }
      inputValue={inputValue}
      onChange={(event: React.ChangeEvent<object>, newValue: any) => {
        if (!nameOnly && newValue?.abn) {
          setFound(newValue?.abn);
        }
        if (nameOnly) {
          onChange(newValue?.name || '');
        }
        if (onFound)
          onFound({
            abn: newValue.abn,
            name: undefined,
            state: undefined,
            address: undefined,
          });
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      freeSolo
      isOptionEqualToValue={(option: any, value: any) => {
        if (isABN(value) || isACN(value)) return true;
        return option?.value === value;
      }}
      disableClearable
      clearIcon={undefined} //<WBIcon name="Close" color={'black'} size={'small'} />}
      loading={loading}
      loadingText={'Loading...'}
      renderInput={(params) => {
        return (
          <WBTextField
            label={label}
            ref={ref}
            {...params}
            placeholder={placeholder}
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <LoadingSpinner /> : null}
                  {/* {params.InputProps.endAdornment} */}
                </React.Fragment>
              ),
            }}
            {...renderProps}
          />
        );
      }}
      PaperComponent={({ children, ...props }) => (
        <Paper {...props} sx={{ px: 2, py: 2.3 }}>
          {React.Children.map(children, (child) => child)}
        </Paper>
      )}
      renderOption={(props, option, state, ownerState) => {
        return (
          <React.Fragment key={option.id ?? uuidv4()}>
            <MenuItem
              {...props}
              value={option.value}
              sx={{ bgcolor: 'background.paper' }}
            >
              {option.label}
            </MenuItem>
          </React.Fragment>
        );
      }}
      disabled={disabled}
    />
  );
};

export default React.forwardRef(AutoCompleteLookup) as <
  T extends Entity | Contact | null
>(
  props: AutoCompleteLookupProps & React.RefAttributes<HTMLDivElement>
) => React.ReactElement;
