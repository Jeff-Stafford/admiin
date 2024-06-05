import * as React from 'react';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
import { debounce } from '@mui/material/utils';
import {
  WBAutocomplete,
  WBGrid,
  WBIcon,
  WBTextField,
  WBTypography,
} from '@admiin-com/ds-web';
import { getLocationById, getLocationSuggestion } from '@admiin-com/ds-amplify';
import { TextFieldProps } from 'libs/design-system-web/src/lib/components/composites/TextField/TextField';
import { CircularProgress, Popper } from '@mui/material';

interface PlaceType {
  label: string; // Updated to match the AWS response format
  placeId?: string;
}

interface LocationAutoCompletionProps extends Omit<TextFieldProps, 'variant'> {
  isManual?: boolean;
  onChange: (address: any) => void;
  onLocationLookupStart?: () => void;
  onLocationLookupEnd?: () => void;
}

export type AddressResponse = {
  label: string;
  addressNumber: string;
  country: string;
  postalCode: string;
  region: string;
  municipality: string;
  neighborhood: string;
  subRegion: string;
  street: string;
  unitNumber: string;
};

export const LocationAutoCompletion = React.forwardRef<
  HTMLDivElement,
  LocationAutoCompletionProps
>(
  (
    { isManual = false, onChange, ...props }: LocationAutoCompletionProps,
    ref
  ) => {
    const [value, setValue] = React.useState<PlaceType | null>(null);
    const [inputValue, setInputValue] = React.useState('');
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [options, setOptions] = React.useState<readonly PlaceType[]>([]);

    React.useEffect(() => {
      if (props.value) {
        setInputValue(props.value as string);
        setValue(props.value as PlaceType);
      }
    }, [props.value]);
    React.useEffect(() => {
      // Define an async function inside the useEffect
      const fetchLocation = async () => {
        if (value && value.placeId) {
          if (props.onLocationLookupStart) {
            props.onLocationLookupStart();
          }
          try {
            const newAddress = await getLocationById(value.placeId);
            onChange && newAddress && onChange(newAddress);
            // Perform any additional operations with newAddress here
            if (props.onLocationLookupEnd) {
              props.onLocationLookupEnd();
            }
          } catch (error) {
            console.error('Error fetching location:', error);
            // Handle errors if necessary
          }
        }
      };

      // Call the async function
      fetchLocation();
    }, [value]); // Dependency array

    const fetch = React.useMemo(
      () =>
        debounce(async (input: string) => {
          if (input) {
            try {
              const results = await getLocationSuggestion(input);
              setOptions(
                results.map((result: any) => ({
                  label: result.text,
                  ...result,
                }))
              );
            } catch (error) {
              console.error('Error fetching suggestions:', error);
              setOptions([]);
            } finally {
              setIsLoading(false);
            }
          }
        }, 400),
      []
    );

    React.useEffect(() => {
      let active = true;

      if (inputValue === '') {
        setOptions(value ? [value] : []);
        return undefined;
      }
      if (!isManual && inputValue !== '') {
        setIsLoading(true);
        fetch(inputValue);
      }

      return () => {
        active = false;
      };
    }, [value, inputValue, fetch]);
    if (isManual) {
      // Render as a normal text field
      return (
        <WBTextField
          ref={ref}
          fullWidth
          value={inputValue}
          onChange={(event) => {
            const newValue = event.target.value;
            setInputValue(newValue);
          }}
          {...props}
        />
      );
    }

    return (
      <WBAutocomplete
        getOptionLabel={(option) =>
          typeof option === 'string' ? option : option.label
        }
        filterOptions={(x) => x}
        options={options}
        autoComplete
        includeInputInList
        filterSelectedOptions
        freeSolo
        value={value}
        noOptionsText="No locations"
        fullWidth
        inputValue={inputValue}
        onChange={(event: React.ChangeEvent<object>, newValue: any) => {
          setOptions(newValue ? [newValue, ...options] : options);
          setValue(newValue);
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={(params) => (
          <WBTextField
            ref={ref}
            {...params}
            {...props}
            fullWidth
            rightIcon={
              isLoading ? <CircularProgress color="inherit" size={20} /> : null
            }
          />
        )}
        isOptionEqualToValue={(option, value) =>
          option.label.includes(value.label)
        }
        PopperComponent={({ children, ...props }) =>
          options.length > 0 ? <Popper {...props}>{children}</Popper> : null
        }
        renderOption={(props, option) => (
          <li {...props} key={option.label}>
            <WBGrid container alignItems="center">
              <WBGrid sx={{ display: 'flex', width: 44 }}>
                <WBIcon name="Location" />
                {/* <LocationOnIcon sx={{ color: 'text.secondary' }} /> */}
              </WBGrid>
              <WBGrid
                sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}
              >
                {/* Here we assume that 'label' is the full string to be displayed */}
                <WBTypography variant="body1">{option.label}</WBTypography>
              </WBGrid>
            </WBGrid>
          </li>
        )}
      />
    );
  }
);
