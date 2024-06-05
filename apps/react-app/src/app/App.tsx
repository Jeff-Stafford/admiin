import {
  ThemeOptions,
  WBDesignSystemProvider,
  WBSnackbarProvider,
} from '@admiin-com/ds-web';
import { MIXPANEL_TOKEN_DEV, SENTRY_DSN } from '@admiin-com/ds-common';
import { darkTheme, theme } from '@admiin-com/ds-design-token';
import mixpanel from 'mixpanel-browser';
import { deepmerge } from 'deepmerge-ts';
import { LinkBehavior } from './components';
import HubListener from './components/HubListener/HubListener';
import { NavRoutes } from './navigation/NavRoutes';
import * as Sentry from '@sentry/react';
import './i18n';

const commonTheme = {
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      },
    },
  },
};

// TODO:  (EDIT: I think fixed?) throwing ts error although behaviour working for component: LinkBehaviour for MuiLink
const appTheme: ThemeOptions = deepmerge(theme, commonTheme);
//
const appDarkTheme: ThemeOptions = deepmerge(darkTheme, commonTheme);

Sentry.init({
  dsn: SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing()],
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
  enabled: false, //TODO: enable for production
});

export function App() {
  mixpanel.init(MIXPANEL_TOKEN_DEV, { debug: true, ignore_dnt: true });

  return (
    <>
      <HubListener />
      <WBDesignSystemProvider theme={appTheme} darkTheme={appDarkTheme}>
        <WBSnackbarProvider>
          <NavRoutes />
        </WBSnackbarProvider>
      </WBDesignSystemProvider>
    </>
  );
}

export default App;
