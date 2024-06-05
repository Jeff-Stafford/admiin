import {
  WBBox,
  WBButton,
  WBDialog,
  WBDialogContent,
  WBFlex,
  WBForm,
  WBIcon,
  WBLink,
  WBMenuItem,
  WBSelect,
  WBTable,
  WBTableBody,
  WBTableCell,
  WBTableContainer,
  WBTableHead,
  WBTableRow,
  WBTypography,
} from '@admiin-com/ds-web';
import {
  ButtonGroup,
  DialogTitle,
  FormControl,
  Paper,
  useTheme,
} from '@mui/material';
import React from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import { gql, useMutation, useQuery } from '@apollo/client';
import { createContactBulkUpload as CREATE_CONTACT_BULK_UPLOAD } from '@admiin-com/ds-graphql';
import { CSGetSelectedEntityId as GET_SELECTED_ENTITY_ID } from '@admiin-com/ds-graphql';
import { useCsvContactValidation } from './useCsvContactValidation';

export interface MapCSVFieldsProps {
  file?: File;
  fileKey: string;
  onSubmitted?: () => void;
}

export interface CSVMapFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  companyName: string;
}

export function CsvMapFields({
  file,
  onSubmitted,
  fileKey,
}: MapCSVFieldsProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CSVMapFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const formValues = useWatch({ control });

  const [loading, setLoading] = React.useState(false);

  const { successedRow, failedRowDetails, failedCount, fieldNames } =
    useCsvContactValidation({ file, fields: formValues });

  const [submitted, setSubmitted] = React.useState<boolean>(false);

  function validateField(
    value: string | null | undefined,
    requiredMessage: string
  ) {
    return (
      (value !== null &&
        value !== undefined &&
        value !== '' &&
        value !== 'Ignore column') ||
      requiredMessage
    );
  }

  const inputs = React.useMemo(
    () => ({
      firstName: {
        label: t('firstName', { ns: 'contacts' }),
        name: 'firstName' as const,
        type: 'text',
        placeholder: t('firstNamePlaceholder', { ns: 'contacts' }),
        defaultValue: '',
        rules: {
          validate: (value: string | null | undefined) =>
            validateField(value, t('firstNameRequired', { ns: 'contacts' })),
        },
      },
      lastName: {
        label: t('lastName', { ns: 'contacts' }),
        name: 'lastName' as const,
        type: 'text',
        placeholder: t('lastNamePlaceholder', { ns: 'contacts' }),
        defaultValue: '',
        rules: {
          validate: (value: string | null | undefined) =>
            validateField(value, t('lastNameRequired', { ns: 'contacts' })),
        },
      },
      companyName: {
        label: t('companyName', { ns: 'contacts' }),
        name: 'companyName' as const,
        type: 'text',
        placeholder: t('companyNamePlaceholder', { ns: 'contacts' }),
        defaultValue: '',
        rules: {
          validate: (value: string | null | undefined) =>
            validateField(value, t('companyNameRequired', { ns: 'contacts' })),
        },
      },
      email: {
        label: t('email', { ns: 'contacts' }),
        name: 'email' as const,
        type: 'email',
        defaultValue: '',
        placeholder: t('emailPlaceholder', { ns: 'contacts' }),
        rules: {
          validate: (value: string | null | undefined) =>
            validateField(value, t('emailRequired', { ns: 'common' })),
        },
      },
      phone: {
        label: t('phone', { ns: 'contacts' }),
        name: 'phone' as const,
        type: 'text',
        placeholder: t('phonePlaceholder', { ns: 'contacts' }),
        defaultValue: '',
        rules: {},
      },
    }),
    [t]
  );

  const [createContactBulkUpload, { error: createError }] = useMutation(
    gql`
      ${CREATE_CONTACT_BULK_UPLOAD}
    `
  );

  const { data: selectedEntityIdData } = useQuery(gql(GET_SELECTED_ENTITY_ID));
  const entityId = selectedEntityIdData?.selectedEntityId;

  const onSubmit = async (data: CSVMapFormData) => {
    if (successedRow === 0) return;
    setLoading(true);
    try {
      const bulkImportInput = {
        entityId,
        fileKey,
        fields: {
          firstName:
            data.firstName && data.firstName !== 'Ignore column'
              ? data.firstName
              : '',
          lastName:
            data.lastName && data.lastName !== 'Ignore column'
              ? data.lastName
              : '',
          phone: data.phone && data.phone !== 'Ignore column' ? data.phone : '',
          email: data.email && data.email !== 'Ignore column' ? data.email : '',
          companyName:
            data.companyName && data.companyName !== 'Ignore column'
              ? data.companyName
              : '',
        },
      };

      await createContactBulkUpload({
        variables: {
          input: { ...bulkImportInput },
        },
      });

      setLoading(false);
      setSubmitted(true);
      onSubmitted && onSubmitted();
    } catch (err) {
      console.log('error updating entity: ', err);
      setLoading(false);
    }
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <WBFlex width={'100%'} justifyContent={'center'}>
      <WBFlex
        flexDirection="column"
        alignItems="center"
        width={{
          xs: '100%',
          sm: '80%',
          md: '70%',
          lg: '60%',
        }}
      >
        <WBForm
          onSubmit={handleSubmit(onSubmit)}
          flexDirection={'column'}
          alignItems={'center'}
          justifyContent={'center'}
          alignSelf="stretch"
          mt={[1, 6, 8]}
        >
          <WBTypography
            component={'div'}
            align="center"
            fontWeight={'regular'}
            textAlign={'center'}
            justifyContent={'center'}
          >
            {t('mapCSVFileDesciption', { ns: 'contacts' })}
          </WBTypography>
          <WBTableContainer sx={{ mt: 5 }}>
            <WBTable>
              <WBTableHead
                sx={{ color: 'white', bgcolor: 'black', border: 'none' }}
              >
                <WBTableRow>
                  <WBTableCell sx={{ width: '40%' }}>
                    {t('contactField', { ns: 'contacts' })}
                  </WBTableCell>
                  <WBTableCell sx={{ width: '10%' }}></WBTableCell>
                  <WBTableCell sx={{ width: '50%' }}>
                    {t('yourCSVFileField', { ns: 'contacts' })}
                  </WBTableCell>
                </WBTableRow>
              </WBTableHead>
              <WBTableBody>
                {Object.entries(inputs).map(([key, input]) => (
                  <WBTableRow key={key}>
                    <WBTableCell>{input.label}</WBTableCell>
                    <WBTableCell>
                      <WBIcon name="ArrowForward" size={'medium'}></WBIcon>
                    </WBTableCell>
                    <WBTableCell sx={{ display: 'flex', direction: 'row' }}>
                      <Controller
                        control={control}
                        name={key as any}
                        rules={input.rules}
                        defaultValue={input.defaultValue}
                        render={({ field }) => (
                          <FormControl
                            sx={{
                              backgroundColor: theme.palette.common.white,
                              height: '70%',
                              width: '90%',
                              fontSize: theme.typography.body1,
                              fontWeight: 'bold',
                            }}
                          >
                            <WBSelect
                              value={field.value}
                              SelectProps={{
                                SelectDisplayProps: {
                                  style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    color:
                                      field.value === 'Ignore column'
                                        ? 'grey'
                                        : 'initial',
                                    fontWeight: 'medium',
                                  },
                                },
                              }}
                              InputProps={{
                                disableUnderline: true,
                                sx: {
                                  borderStyle: 'dotted',
                                  borderWidth: '2px',
                                  paddingX: '12px',
                                  fontWeight: 'medium',
                                  color: 'grey',
                                },
                              }}
                              helperText={
                                errors[field.name as keyof CSVMapFormData]
                                  ?.message ?? ''
                              }
                              error={
                                !!errors[field.name as keyof CSVMapFormData]
                              }
                            >
                              {['Ignore column', ...fieldNames].map(
                                (fieldName, index) => (
                                  <WBMenuItem
                                    key={index}
                                    value={fieldName}
                                    onClick={() => field.onChange(fieldName)}
                                  >
                                    <WBTypography
                                      noWrap
                                      fontWeight="medium"
                                      color={index !== 0 ? 'inherit' : 'grey'}
                                    >
                                      {`${fieldName}`}
                                    </WBTypography>
                                  </WBMenuItem>
                                )
                              )}
                            </WBSelect>
                          </FormControl>
                        )}
                      />
                    </WBTableCell>
                  </WBTableRow>
                ))}
              </WBTableBody>
            </WBTable>
          </WBTableContainer>
          <WBBox mt={[5, 6, 7]}>
            {!submitted ? (
              <ButtonGroup
                variant="outlined"
                aria-label="split button"
                disableRipple
                disableFocusRipple
                disableElevation
              >
                <WBButton
                  type="submit"
                  sx={{ paddingX: loading ? 9 : 6, marginRight: 2 }}
                  loading={loading}
                  disabled={!isValid}
                >
                  {`${t('importContacts', {
                    ns: 'contacts',
                  })} (${successedRow})`}
                </WBButton>
                {!loading ? (
                  <WBButton disabled={!isValid}>
                    <WBIcon
                      name="ChevronDown"
                      size={1.5}
                      color="inhreit"
                    ></WBIcon>
                  </WBButton>
                ) : null}
              </ButtonGroup>
            ) : (
              <WBBox
                sx={{
                  borderRadius: 20,
                  padding: 2,
                  paddingX: 6,
                  bgcolor: theme.palette.success.main,
                  fontWeight: 'bold',
                }}
              >
                {t('importingContacts', { ns: 'contacts' })}
              </WBBox>
            )}
          </WBBox>
        </WBForm>
        {isValid && failedCount > 0 ? (
          <WBTypography color={'error'} mt={3}>
            <WBTypography
              component={'span'}
              color={'inherit'}
              fontWeight={'bold'}
              variant="inherit"
            >
              {`${t('importFailed', { ns: 'contacts' })}:`}
            </WBTypography>{' '}
            {`${failedCount} ${t('notImported', { ns: 'contacts' })}.`}{' '}
            <WBLink
              fontWeight={'bold'}
              color={'inherit'}
              underline="always"
              onClick={handleClickOpen}
            >
              {`${t('viewReport', { ns: 'contacts' })}:`}
            </WBLink>
          </WBTypography>
        ) : null}{' '}
        <ErrorHandler errorMessage={createError?.message} />
      </WBFlex>
      <WBDialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        PaperComponent={Paper}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth={'sm'}
        fullWidth
        PaperProps={{
          sx: { p: 6 },
        }}
      >
        <DialogTitle variant="h3" id="scroll-dialog-title">
          {t('report', { ns: 'contacts' })}
        </DialogTitle>
        <WBDialogContent dividers>
          <WBTableContainer component={WBBox}>
            <WBTable aria-label="simple table">
              <WBTableBody>
                {failedRowDetails.map((row, index) => (
                  <WBTableRow
                    key={index}
                    sx={{
                      borderBottom: 1,
                      borderColor: theme.palette.grey[400],
                      fontWeight: 'regular',
                    }}
                  >
                    <WBTableCell
                      component="th"
                      scope="row"
                      sx={{ fontWeight: 'inherit', px: 0, py: 3 }}
                    >
                      {`Row ${row.no + 1}`}
                    </WBTableCell>
                    <WBTableCell align="right" sx={{ fontWeight: 'inherit' }}>
                      {row.value}
                    </WBTableCell>
                    <WBTableCell
                      align="right"
                      sx={{ color: 'red', fontWeight: 'inherit', px: 0 }}
                    >
                      {row.message}
                    </WBTableCell>
                  </WBTableRow>
                ))}
              </WBTableBody>
            </WBTable>
          </WBTableContainer>
        </WBDialogContent>
      </WBDialog>
    </WBFlex>
  );
}
