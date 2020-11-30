const isProduction = process.env.NODE_ENV === 'production';
const testFiles = [
  './src/**/*.test.ts', './src/**/*.test.tsx',
  './src/**/*.spec.ts', './src/**/*.spec.tsx',
  './src/**/*.e2e.ts', './src/**/*.e2e.tsx',
  './e2e/**/*',
];
module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
  plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-object-rest-spread', '@babel/plugin-transform-runtime'],
  ignore: ['./src/vkui.js'].concat(isProduction ? testFiles : []),
};
