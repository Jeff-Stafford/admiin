const { mergeConfig } = require('vite');

module.exports = {
  stories: ['../**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  async viteFinal(config, { configType }) {
    return mergeConfig(config, {});
  },
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: 'libs/design-system-web/vite.config.ts',
      },
    },
  },
  docs: {
    autodocs: true,
  },
};

// To customize your Vite configuration you can use the viteFinal field.
// Check https://storybook.js.org/docs/react/builders/vite#configuration
// and https://nx.dev/packages/storybook/documents/custom-builder-configs
