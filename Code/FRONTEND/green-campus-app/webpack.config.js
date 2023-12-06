import { join } from 'path'
import { createExpoWebpackConfigAsync } from '@expo/webpack-config'

export default async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv)

  config.module.rules.push({
    test: /\.js$/,
    loader: 'babel-loader',
    include: [join(__dirname, 'node_modules/react-native-elements')]
  })

  return config
}
