// test-utils.tsx
import { darkTheme, theme } from '@admiin-com/ds-design-token';
import {
  MockedProvider,
  MockedProviderProps,
  MockedResponse,
} from '@apollo/client/testing';
import { WBDesignSystemProvider } from '@admiin-com/ds-web';
import { PropsWithChildren, ReactElement } from 'react';
import { render as rtlRender } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import {
  InMemoryCache,
  InMemoryCacheConfig,
  Resolvers,
} from '@apollo/client/core';

const customRender = (
  ui: ReactElement,
  {
    mocks,
    cache,
    resolvers,
    ...renderOptions
  }: {
    mocks: MockedResponse[];
    cache?: InMemoryCacheConfig;
    resolvers?: Resolvers;
    [key: string]: unknown;
  } = { mocks: [] }
) => {
  const AllTheProviders = ({ children }: PropsWithChildren) => {
    const mockedProviderProps: MockedProviderProps = {};
    if (cache) {
      mockedProviderProps.cache = new InMemoryCache(cache);
    }
    if (mocks) {
      mockedProviderProps.mocks = mocks;
    }
    if (resolvers) {
      mockedProviderProps.resolvers = resolvers;
    }
    return (
      <MockedProvider {...mockedProviderProps} addTypename={false}>
        <BrowserRouter>
          <WBDesignSystemProvider theme={theme} darkTheme={darkTheme}>
            {children}
          </WBDesignSystemProvider>
        </BrowserRouter>
      </MockedProvider>
    );
  };
  return rtlRender(ui, { wrapper: AllTheProviders, ...renderOptions });
};

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
