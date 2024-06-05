module.exports = {
  '{apps,libs,tools}/**/*.{ts,tsx,js,json,md,html,css,scss}': [
    'nx affected -t lint --uncommitted --fix true',
    'nx affected -t test --uncommitted',
    'nx format:write --uncommitted',
  ],
};
