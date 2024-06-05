import './init';
import { WBFlex } from '@admiin-com/ds-web';
import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import ApolloClientProvider from './app/components/ApolloClientProvider/ApolloClientProvider';
//import Gleap from 'gleap';

//Gleap.initialize("Wt50203KFyERbYiQFWDKxcXAkFbZ49GE"); //TODO: move key somewhere

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  //@ts-ignore https://github.com/DefinitelyTyped/DefinitelyTyped/issues/66841
  //<StrictMode>
  <ApolloClientProvider>
    <BrowserRouter>
      <Suspense fallback={<WBFlex />}>
        <App />
      </Suspense>
    </BrowserRouter>
  </ApolloClientProvider>
  //</StrictMode>
);
