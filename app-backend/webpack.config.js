const path = require('path')
// eslint-disable-next-line import/no-extraneous-dependencies
const nodeExternals = require('webpack-node-externals')
// eslint-disable-next-line import/no-extraneous-dependencies
const slsw = require('serverless-webpack')

console.log(nodeExternals())

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  externals: [
    nodeExternals(),
    {
      sqlite3: 'sqlite3',
      mariasql: 'mariasql',
      mssql: 'mssql',
      mysql: 'mysql',
      oracle: 'oracle',
      'strong-oracle': 'strong-oracle',
      oracledb: 'oracledb',
      mysql2: 'mysql2',
      'pg-query-stream': 'pg-query-stream'
    }
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'imports-loader?graphql',
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js'
  }
}
