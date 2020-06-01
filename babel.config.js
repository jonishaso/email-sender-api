module.exports = {
  plugins: [
    [
      'babel-plugin-module-resolver',
      {
        alias: {
          '#root': './src',
        },
      },
    ],
    '@babel/plugin-proposal-class-properties',
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
}
