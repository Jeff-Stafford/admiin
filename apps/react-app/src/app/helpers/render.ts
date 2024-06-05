import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { initialMocks } from './apollo-mocks';
import { render } from '@admiin-com/ds-web-testing-utils';
import { InMemoryCacheConfig, Resolvers } from '@apollo/client';

const resolvers: Resolvers = {
  Query: {
    getSub: () => ({ sub: 'fc996c28-bbf9-4654-9e9a-7ce69a959adf' }),
  },
};
const cache: InMemoryCacheConfig = {
  typePolicies: {
    Query: {
      fields: {
        isLoggedIn: {
          read() {
            return '';
          },
        },
        sub: {
          read() {
            return 'fc996c28-bbf9-4654-9e9a-7ce69a959adf';
          },
        },
      },
    },
    User: {
      fields: {
        profileImg: {
          merge: true,
        },
      },
    },
  },
};

const customRender = (
  ui: ReactElement,
  { mocks, ...renderOptions } = { mocks: initialMocks }
) => {
  return render(ui, { mocks, ...renderOptions, resolvers, cache });
};

export { customRender as render };
