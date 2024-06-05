import React from 'react';
import { Preview } from '../src/storybook/Preview';

export const parameters = {
  docs: {
    story: {
      //TODO: make fit components more nicely?
    },
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  //backgrounds: {
  //  default: "initial",
  //  values: [
  //    {
  //      name: "Initial",
  //      value: "initial",
  //    },
  //  ],
  //},
};

export const decorators = [(Story) => <Preview story={Story()} />];
