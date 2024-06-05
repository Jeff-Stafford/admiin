import './init';
import { ApolloProvider } from '@apollo/client';
import { WBFlex } from '@admiin-com/ds-web';
import { StrictMode, Suspense } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import { configureAppSyncClient } from './app/helpers/appsync';

const client = configureAppSyncClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  //@ts-ignore https://github.com/DefinitelyTyped/DefinitelyTyped/issues/66841
  <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Suspense fallback={<WBFlex />}>
          <App />
        </Suspense>
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>
);
