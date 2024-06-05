//import { colors } from './colors';
//import { ICustomTheme } from 'native-base';
//import { ITheme } from 'native-base';

import { colors } from './colors';

export const nativeBaseTheme = {
  fonts: {
    //body: "OpenSans-Regular",
    //heading: "OpenSans-SemiBold"
    body: undefined,
    heading: undefined,
  },
  colors: {
    ...colors,
    //contrastThreshold: 7,
    lightText: '#FFFFFF',
    darkText: '#000000',
  },
  components: {
    Button: {
      baseStyle: {
        rounded: 'xl',
        _text: {
          fontWeight: 600,
        },
      },
    },
    Link: {
      baseStyle: {
        _text: {
          textDecorationLine: 'none',
          fontWeight: 600,
          color: 'primary.500',
        },
      },
    },
    Select: {
      baseStyle: {
        p: '15px',
        borderRadius: 'xl',
        borderWidth: 1,
        fontSize: 'md',
        fontFamily: 'body',
        borderColor: 'muted.500',
      },
    },
    Badge: {
      baseStyle: {
        //borderRadius: "xl",
      },
    },
    //SelectItem: {
    //  baseStyle: {
    //p: string;
    //px: string;
    //borderRadius: string;
    //minH: string;
    //  };
    //};
  },
};
