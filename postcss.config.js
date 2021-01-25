const path = require('path');
const cssCustomProperties = require('postcss-custom-properties');
const cssImport = require('postcss-import');
const autoprefixer = require('autoprefixer');
const csso = require('postcss-csso');

let plugins = [
  cssImport(),
  cssCustomProperties({
    importFrom: [
      path.join(__dirname, 'src/styles/bright_light.css'),
      path.join(__dirname, 'src/styles/constants.css'),
    ],
    preserve: true
  }),
  autoprefixer(),
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(csso({ restructure: false }));
}

module.exports = { plugins };
