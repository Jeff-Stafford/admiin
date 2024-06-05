import {
  WBBox,
  WBFlex,
  WBIconButton,
  WBLink,
  WBSelect,
  WBSvgIcon,
  WBTooltip,
  WBTypography,
} from '@admiin-com/ds-web';
import {
  FormControl,
  MenuItem,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { SelectProps } from 'libs/design-system-web/src/lib/components/primatives/Select/Select';

import CheckIconRaw from '../../../assets/icons/checkicon.svg';
import React from 'react';
import PayIcon from '../../../assets/icons/pay.svg';
import PenIcon from '../../../assets/icons/pen.svg';
import CreditCardIcon from '../CreditCardIcon/CreditCardIcon';
import { PaymentMethod } from '@admiin-com/ds-graphql';
import { useTranslation } from 'react-i18next';

// TypeScript interface for the Select option
export interface ISelectOption {
  value: any;
  label?: string;
  icon?: React.ReactNode;

  [key: string]: any; // This line allows any number of additional properties of any type
}

export type PaymentDetailType = 'Signature' | 'Method' | 'Type' | 'Custom';

export interface PaymentDetailSelectorProps
  extends Omit<SelectProps, 'options'> {
  type?: PaymentDetailType;
  bgcolor?: string;
  fontWeight?: string;
  fontColor?: string;
  icon?: React.ReactNode;
  options?: ISelectOption[];
}

// Custom Select component to reduce repetition
export const PaymentDetailSelector: React.FC<PaymentDetailSelectorProps> = ({
  type,
  fontColor,
  fontWeight,
  onChange,
  options,
  icon: propsIcon,
  value,
  ...props
}) => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const { t } = useTranslation();

  let icon: React.ReactNode = null;
  let iconWidth = '';
  const CheckIcon = (
    <WBSvgIcon
      sx={{
        ml: 1,
        fontSize: '20px',
        '& path': { fill: theme.palette.success.main },
      }}
    >
      <CheckIconRaw />
    </WBSvgIcon>
  );

  const isDownXL = useMediaQuery(theme.breakpoints.down('xl'));

  switch (type) {
    case 'Signature':
      iconWidth = '18px';
      icon = <PenIcon />;
      break;
    case 'Type':
      iconWidth = '18px';
      icon = <PayIcon />;
      break;
    case 'Method':
      iconWidth = '40px';
      icon = (
        <WBSvgIcon
          sx={{
            width: iconWidth,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          fontSize={
            value === 'newBank' ||
            (value as PaymentMethod)?.paymentMethodType === 'BANK'
              ? 'small'
              : 'large'
          }
          viewBox={
            value === 'newBank' ||
            (value as PaymentMethod)?.paymentMethodType === 'BANK'
              ? '0 0 40'
              : `0 0 40 ${
                  (value as PaymentMethod)?.paymentMethodType === 'PAYTO' ||
                  (value as PaymentMethod)?.paymentMethodType === 'PAYID'
                    ? '35'
                    : '30'
                }`
          }
          color={fontColor || theme.palette.text.primary}
        >
          <CreditCardIcon
            type={
              (value as PaymentMethod)?.type ||
              (value as PaymentMethod)?.paymentMethodType ||
              (value as string)
            }
            theme="dark"
          />
        </WBSvgIcon>
      );
      break;
    case 'Custom':
      icon = propsIcon;
      iconWidth = '18px';
      break;
  }
  const [open, setOpen] = React.useState(false);

  const handleMenuItemClick = (value: any) => {
    if (onChange) {
      const event = {
        target: {
          value,
        },
      } as React.ChangeEvent<{ name?: string; value: unknown }>;
      onChange(event as any);
    }
  };

  let label: PaymentDetailType = 'Custom';
  switch (type) {
    case 'Method':
      label = t('paymentMethod', { ns: 'taskbox' });
      break;
    case 'Signature':
      label = t('signature', { ns: 'taskbox' });
      break;
    case 'Type':
      label = t('type', { ns: 'taskbox' });
      break;
  }

  return (
    <FormControl sx={{ m: 1 }}>
      <WBSelect
        label={isDownXL ? '' : label}
        size="small"
        InputProps={{
          disableUnderline: true,
          margin: 'dense',
          sx: {
            fontWeight: fontWeight ?? 'bold',
            borderRadius: '10px',
            bgcolor: `${alpha(props.bgcolor ?? '#FFFFFF', 0.2)} !important`,
            fontSize: 'body2.fontSize',
            color: fontColor ?? 'text.primary',
            height: '40px',
            mt: 1,
          },
          size: 'small',
          fullWidth: true,
        }}
        SelectProps={{
          open,
          onOpen: () => setOpen(true),
          onClose: () => setOpen(false),
          IconComponent: (iconProps) => (
            <WBBox position="absolute" sx={{ right: '0px' }}>
              <WBIconButton
                icon="ChevronDown"
                {...iconProps}
                size="small"
                iconSize={1.6}
                color={fontColor || theme.palette.text.primary}
              />
            </WBBox>
          ),
          renderValue: (selected: any) => {
            if (selected === '' || selected?.length === 0) {
              return (
                <>
                  <WBBox sx={{ width: iconWidth, mx: 1, ml: 2 }}>{icon}</WBBox>
                  <WBTypography sx={{ opacity: 0.3 }} fontSize={'inherit'}>
                    {props.placeholder}
                  </WBTypography>
                </>
              ); // Render placeholder when value is empty
            }
            // Display the selected option(s)
            return (
              <>
                <WBBox
                  sx={{
                    width: { xs: undefined, sm: iconWidth },
                    mx: { xs: 1, sm: 1 },
                    ml: { xs: 1, sm: 2 },
                    mb: type === 'Method' ? 1 : 0,
                  }}
                >
                  <WBBox
                    sx={{
                      display: { xs: 'none', sm: 'block' },
                    }}
                  >
                    {icon}
                  </WBBox>
                </WBBox>

                {options?.find(
                  (option) =>
                    (type === 'Method' && option.value.id === selected) ||
                    (type !== 'Method' && option.value === selected)
                )?.label ??
                  (typeof selected === 'string'
                    ? t(selected, { ns: 'payment' })
                    : '')}
              </>
            );
          },
          MenuProps: {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            sx: {
              top: '-12px',
              ...(options && {
                '& .MuiList-root': {
                  bgcolor: 'background.paper',
                  borderRadius: '13px',
                },
                '& .MuiPaper-root': {
                  borderRadius: '15px',
                  bgcolor: 'background.paper',
                  overflow: 'visible', // Make sure the triangle is not cut off.
                  boxShadow: '0 2px 12px 0 rgba(5, 8, 11, 0.09)',
                  fontSize: 'body2.fontSize',
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    bottom: '-19px', // This should be the negative value of the triangle's height
                    left: 'calc(50% - 8px)',
                    width: 0,
                    height: 0,
                    borderWidth: '10px', // Adjust the size of the triangle
                    borderStyle: 'solid',
                    borderColor: `${theme.palette.background.paper} transparent transparent  transparent `, // The third value is the color of the triangle
                  },
                },
              }),
            },
          },
          SelectDisplayProps: {
            style: {
              width: 'auto',
              borderRadius: theme.spacing(1),
              height: '40px',
              fontSize: 'body2.fontSize',
              padding: 0,
              paddingRight: '40px',
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'center',
            },
          },
        }}
        variant="filled"
        value={
          type === 'Method' ? (value as PaymentMethod)?.id ?? value : value
        }
        {...props}
      >
        {options?.map((option, index) => (
          <MenuItem
            sx={{
              bgcolor: 'background.paper',
              py: 1.3,
              fontSize: 'body2.fontSize',
              fontWeight: 'bold',
              color: option.disabled ? 'action.disabled' : 'inherit',
            }}
            key={option.id ?? index}
            value={type === 'Method' ? option.id : option.value}
            onClick={(event) => {
              if (option.disabled) {
                event.stopPropagation();
                event.preventDefault();
              } else {
                handleMenuItemClick(option.value);
              }
            }}
            // disabled={option.disabled}
          >
            <WBTooltip
              title={
                option.disabled
                  ? t('paymentTypeDisabled', { ns: 'taskbox' })
                  : ''
              }
            >
              <WBFlex alignItems="center">
                {(option?.type || option?.paymentMethodType) && (
                  <WBSvgIcon
                    fontSize={'large'}
                    viewBox="0 0 50 50"
                    sx={{
                      mr: 1,
                      display: 'flex',
                      alignItems: 'center',
                      mb: -2,
                      justifyContent: 'center',
                      '& path':
                        option?.type === 'visa'
                          ? { fill: theme.palette.common.black }
                          : {},
                    }}
                  >
                    <CreditCardIcon
                      type={option?.type || option?.paymentMethodType || option}
                    />
                  </WBSvgIcon>
                )}
                {option?.icon || option.label || ''}
                {/* {option?.paymentMethodType} */}
                {/* {option?.paymentMethodType !== 'CARD'
                  ? t(option?.paymentMethodType, { ns: 'payment' })
                  : null} */}
                {(type === 'Method' &&
                  (value as PaymentMethod).id === option.id) ||
                (type !== 'Method' && value === option.value)
                  ? CheckIcon
                  : null}
              </WBFlex>
            </WBTooltip>
          </MenuItem>
        ))}
        {type === 'Method' && (
          <MenuItem
            value={'newCard'}
            onClick={(event) => {
              handleMenuItemClick('newCard');
            }}
            sx={{
              bgcolor: 'background.paper',
              py: 1.3,
              fontSize: 'body2.fontSize',
              fontWeight: 'bold',
            }}
          >
            <WBLink
              component={'button'}
              variant="body2"
              mt={5}
              underline="none"
              color={'text.primary'}
              fontWeight={'bold'}
            >
              <WBFlex alignItems="center">
                <WBBox mr={1}>
                  <WBSvgIcon
                    fontSize={'large'}
                    viewBox="0 0 50 50"
                    sx={{
                      mr: 1,
                      display: 'flex',
                      alignItems: 'center',
                      mb: -2,
                      justifyContent: 'center',
                      '& path':
                        mode === 'dark'
                          ? { fill: theme.palette.common.white }
                          : {},
                    }}
                  >
                    <CreditCardIcon type="newCard" theme="dark" />
                  </WBSvgIcon>
                </WBBox>
                {`${t('newCard', { ns: 'taskbox' })}`}
              </WBFlex>
            </WBLink>
          </MenuItem>
        )}
        {type === 'Method' && (
          <MenuItem
            value={'newBank'}
            onClick={(event) => {
              handleMenuItemClick('newBank');
            }}
            sx={{
              bgcolor: 'background.paper',
              py: 1.3,
              fontSize: 'body2.fontSize',
              fontWeight: 'bold',
            }}
          >
            <WBLink
              component={'button'}
              variant="body2"
              mt={5}
              underline="none"
              color={'text.primary'}
              fontWeight={'bold'}
            >
              <WBFlex alignItems="center">
                <WBBox mr={1}>
                  <WBSvgIcon
                    fontSize={'large'}
                    viewBox="0 0 50 50"
                    sx={{
                      mr: 1,
                      display: 'flex',
                      alignItems: 'center',
                      mb: -2,
                      justifyContent: 'center',
                      //'& path':
                      //  option?.type === 'visa'
                      //    ? { fill: theme.palette.common.black }
                      //    : {},
                    }}
                  >
                    <CreditCardIcon type={'newBank'} theme={mode} />
                  </WBSvgIcon>
                </WBBox>
                {`${t('newBank', { ns: 'taskbox' })}`}
              </WBFlex>
            </WBLink>
            {value === 'newBank' && CheckIcon}
          </MenuItem>
        )}
        {/*{type === 'Method' && (*/}
        {/*  <MenuItem*/}
        {/*    value={'PAYTO'}*/}
        {/*    sx={{*/}
        {/*      bgcolor: 'background.paper',*/}
        {/*      py: 1.3,*/}
        {/*      fontSize: 'body2.fontSize',*/}
        {/*      fontWeight: 'bold'*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    <WBLink*/}
        {/*      component={'button'}*/}
        {/*      variant="body2"*/}
        {/*      mt={5}*/}
        {/*      underline="always"*/}
        {/*      color={'text.primary'}*/}
        {/*      fontWeight={'bold'}*/}
        {/*    >*/}
        {/*      {`${t('PAYTO', { ns: 'payment' })}`}*/}
        {/*    </WBLink>*/}
        {/*    {value === 'PAYTO' && CheckIcon}*/}
        {/*  </MenuItem>*/}
        {/*)}*/}
      </WBSelect>
    </FormControl>
  );
};
