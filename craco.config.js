const path = require('path');

module.exports = {
  plugins: [{ plugin: require('@semantic-ui-react/craco-less') }],
  webpack: {
    alias: {
      '@app': path.resolve(__dirname, 'src/@app/'),
      '@admin': path.resolve(__dirname, 'src/admin'),
      '@csyt': path.resolve(__dirname, 'src/csyt'),
      '@smd': path.resolve(__dirname, 'src/smd'),
    },
  },
};
