import { alpha, createTheme, ThemeOptions } from '@mui/material';
import deepmerge from 'deepmerge';
export type { ThemeOptions } from '@mui/material';
export function getTheme(theme: ThemeOptions = {}) {
  const tempTheme = createTheme({ ...theme });
  const componentsOverride: ThemeOptions = {
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: tempTheme.palette.primary.main,
            boxShadow: 'none',
          },
        },
      },
      MuiSlider: {
        styleOverrides: {
          root: {
            '& .MuiSlider-track': {
              border: 'none',
            },
            height: '6px',
            '& .MuiSlider-thumb': {
              height: 24,
              width: 24,
              backgroundColor: '#fff',
              border: '5px solid currentColor',
              '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                boxShadow: 'inherit',
              },
              '&::before': {
                display: 'none',
              },
            },
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            borderRadius: 0,
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: tempTheme.spacing(3.5),
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            '::before': { borderTop: 'thin solid rgba(0, 0, 0, 0.12)' },
            '::after': { borderTop: 'thin solid rgba(0, 0, 0, 0.12)' },
          },
        },
      },
      MuiTabs: {
        defaultProps: {
          scrollButtons: false,
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            // Correct hover state

            '&:hover': {
              // Access theme colors correctly
              backgroundColor: 'transparent', // Assuming you want it transparent on hover
              color: tempTheme.palette.common.black,
            },
            // Correct selected state
            '&.Mui-selected': {
              backgroundColor: tempTheme.palette.common.black,
              color: tempTheme.palette.common.white,
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            // Styles for table cells
            padding: tempTheme.spacing(2),
            fontSize: tempTheme.typography.body1.fontSize,
            backgroundColor: 'inherit',
            color: 'inherit',
          },
          head: {
            // Styles specifically for header cells
            boxShadow: '0 6.5px 7px -4.5px rgba(0, 0, 0, 0.08)',
            borderBottom: 'solid 2px #e5e5e5',
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: 'body2.fontSize',
          },
        },
      },
      MuiBadge: {
        styleOverrides: {
          badge: {
            border: '2px solid white',
            minWidth: '12px', // add extra width here
            borderRadius: '12px',
            minHeight: '12px', // and extra height here
            boxSizing: 'border-box',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {},
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            borderBottom: `${tempTheme.spacing(0.06)} solid ${
              tempTheme.palette.primary.dark
            }`,
            paddingTop: tempTheme.spacing(1.5),
            paddingBottom: tempTheme.spacing(1.5),
            '&.Mui-expanded': {
              margin: 0,
              backgroundColor: alpha(tempTheme.palette.primary.dark, 0.5),
            },
          },
        },
      },
      MuiAccordionSummary: {
        styleOverrides: {
          root: {
            paddingLeft: tempTheme.spacing(1),
            paddingRight: tempTheme.spacing(1),
            height: '100%',
            minHeight: '100%',
            '&.Mui-expanded': {
              minHeight: '100%',
            },
          },
          content: {
            margin: 0,
            '&.Mui-expanded': {
              margin: 0,
            },
          },
        },
      },
      MuiAccordionDetails: {
        styleOverrides: {
          root: {
            paddingLeft: tempTheme.spacing(1),
            paddingRight: tempTheme.spacing(1),
            paddingBottom: tempTheme.spacing(2.5),
            paddingTop: tempTheme.spacing(1),
            '&.ApptractiveAccordionDetails-mobile': {
              paddingTop: tempTheme.spacing(0.25),
              paddingBottom: 0,
            },
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            borderRadius: 'inherit',
          },
        },
      },
      MuiFab: {
        defaultProps: {
          disableRipple: true,
        },
        styleOverrides: {
          root: {
            backgroundColor: 'transparent',
            boxShadow: 'none', // Removes the default shadow
            '&:hover': {
              boxShadow: 'none', // Removes the hover shadow
            },
            '&:active': {
              boxShadow: 'none', // Removes the shadow when the button is clicked
            },
            // If you want to remove the ripple effect
            '& .MuiTouchRipple-root': {
              display: 'none',
            },
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderWidth: 1,
            lineHeight: '2.4rem',
            '&:hover': {
              borderWidth: 2,
            },
            borderRadius: 0,
          },
        },
      },
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiRadio: {
        styleOverrides: {
          colorPrimary: {
            color: tempTheme.palette.text.primary,
          },
          colorSecondary: {
            color: tempTheme.palette.text.primary,
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          colorPrimary: {
            color: tempTheme.palette.text.primary,
          },
          colorSecondary: {
            color: tempTheme.palette.text.primary,
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: { fontWeight: 'bold', overflow: 'visible' },
        },
      },
      MuiFormControlLabel: {
        styleOverrides: {
          root: {
            marginLeft: '-5px',
            marginRight: '2px',
          },
          label: {
            fontSize: tempTheme.typography.body2.fontSize,
          },
        },
      },
      // MuiSelect: {
      //   // focus input have no background color
      //   styleOverrides: {
      //     select: {
      //       '&:focus': {
      //         backgroundColor: 'transparent',
      //       },
      //     },
      //   },
      // },
      MuiSwitch: {
        styleOverrides: {
          track: {
            backgroundColor: tempTheme.palette.primary.light,
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            '&.Mui-disabled:before': {
              borderBottomStyle: 'solid !important',
            },
            '&:-webkit-autofill': {
              WebkitBoxShadow: '0 0 0 100px #000 inset',
              WebkitTextFillColor: 'transparent',
              transitionDelay: '9999s',
              transitionProperty: 'background-color, color',
            },
            '&.Mui-disabled': {
              color: '#000',
            },
          },
          input: {
            '&:-webkit-autofill': {
              transitionDelay: '9999s',
              transitionProperty: 'background-color, color',
            },
            // '::placeholder': {
            //   color: '#000',
            //   opacity: 1,
            // },
          },
        },
      },
      MuiInputLabel: {
        defaultProps: {
          variant: 'standard',
          shrink: false,
        },
        styleOverrides: {
          root: {
            overflow: 'visible',
            fontSize: '1rem',
            position: 'inherit',
            fontWeight: 700,
            '&.Mui-focused': {
              color: tempTheme.palette.text.primary,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 16px 27px -15px rgba(5, 8, 11, 0.27)',
            borderRadius: 0,
          },
        },
      },
      //MuiCalendarPicker: {
      //  styleOverrides: {
      //    root: {
      //      //color: tempTheme.palette.text.primary
      //    }
      //  }
      //},
      MuiMenuItem: {
        styleOverrides: {
          root: {
            //color: tempTheme.palette.text.primary
          },
        },
      },
      //MuiPickersDay: {
      //  styleOverrides: {
      //    root: {
      //      //color: tempTheme.palette.text.primary
      //    }
      //  }
      //},
      MuiAlert: {
        defaultProps: {
          variant: 'filled',
          icon: false,
        },
        styleOverrides: {
          root: ({ ownerState }) => ({
            fontWeight: 'bold',
            color: 'black',
            ...(ownerState.severity === 'success' && {
              backgroundColor: tempTheme.palette.success.main,
            }),
            ...(ownerState.severity === 'error' && {
              backgroundColor: tempTheme.palette.error.main, // Use red color for error severity
            }),
            // Apply other general styles here
          }),
        },
      },

      MuiFilledInput: {
        styleOverrides: {
          input: {
            '&:-webkit-autofill': {
              WebkitBoxShadow: 'inherit',
              WebkitTextFillColor: 'inherit',
              caretColor: 'inherit',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            marginTop: 0,
            '& .MuiOutlinedInput-root': {
              border: 'none',
              borderRadius: '999px',
              backgroundColor: tempTheme.palette.primary.dark,

              '& fieldset': {
                border: 'none', // Removes border
              },
              '&:hover fieldset': {
                border: 'none', // Removes border on hover
              },
              '&.Mui-focused fieldset': {
                border: 'none', // Removes border when focused
              },
            },
          },
        },
      },
      // MuiOutlinedInput: {
      //   styleOverrides: {
      //     root: {
      //       backgroundColor: tempTheme.palette.primary.dark,
      //       color: tempTheme.palette.text.primary,
      //       fontWeight: 400,
      //       fontSize: '1rem',
      //       '&:hover $notchedOutline': {
      //         borderColor: 'transparent', // remove border on hover
      //       },
      //       '&$focused $notchedOutline': {
      //         borderColor: 'transparent', // remove border when focused
      //       },
      //     },
      //     notchedOutline: {
      //       borderColor: 'transparent', // remove border
      //     },
      //     input: {
      //       border: 'none',
      //       //   paddingTop: tempTheme.spacing(1.25),
      //       //   paddingBottom: tempTheme.spacing(0.4),
      //     },
      //     //multiline: {
      //     //  paddingTop: 0,
      //     //  paddingBottom: 0,
      //     //},
      //   },
      // },
      MuiPaper: {
        styleOverrides: {
          root: {
            // boxShadow: '0 41px 45px -35.5px #636363',
          },
        },
      },

      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: 0,
            width: tempTheme.spacing(19),
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: ({ ownerState }) => ({
            ...(!ownerState.multiline && {
              maxHeight: tempTheme.spacing(6),
            }),
            height: (ownerState.height as string) || tempTheme.spacing(6),
            '&.MuiOutlinedInput-root, &.MuiFilledInput-root': {
              // remove underline for outlined and filled variants
              '&:before': {
                content: 'none',
              },
            },
          }),
          underline: ({ ownerState }) => ({
            '&:before': {
              borderBottom: `2px ${'solid'} ${
                ownerState.underlineColor || 'rgba(0, 0, 0, 1)'
              }`,
            },
          }),
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: tempTheme.palette.text.secondary,
          },
        },
      },
    },
  };
  return createTheme(deepmerge(deepmerge(theme, componentsOverride), theme));
}
