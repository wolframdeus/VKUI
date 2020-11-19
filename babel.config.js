const isProduction = process.env.NODE_ENV === 'production'
module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
  plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-object-rest-spread', '@babel/plugin-transform-runtime'],
  ignore: ['./src/vkui.js'].concat(
    isProduction ? ['./src/**/*.test.ts', './src/**/*.test.tsx', './src/**/*.spec.ts', './src/**/*.spec.tsx'] : []),
};
