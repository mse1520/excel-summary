
import path from 'path';
import { Configuration as WebpackConfiguration, EnvironmentPlugin } from 'webpack';
import { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const IS_DEV = process.env.NODE_ENV === 'development';

interface WebpackConfig extends WebpackConfiguration {
  devServer: DevServerConfiguration
}

const config: WebpackConfig = {
  name: 'webpack-renderer',
  target: 'web',
  // mode, // 실서비스는 production
  // devtool, // 실서비스는 hidden-source-map
  mode: IS_DEV ? 'development' : 'production',
  devtool: IS_DEV ? 'eval-cheap-module-source-map' : 'hidden-source-map',
  resolve: {
    // import 구문에서 합쳐질 파일의 확장자를 붙여준다
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    // 경로 alias
    alias: {
      '@pages': path.resolve('src', 'renderer', 'pages')
    },
  },
  // 합쳐질 파일의 시작점
  // 파일이 서로 연결된경우 알아서 찾아준다
  entry: {
    renderer: path.resolve('src', 'renderer', 'index.tsx')
  },
  // 하나로 합쳐실 출력 파일의 설정입니다
  output: {
    path: path.resolve('dist'),
    filename: '[name].js'
  },
  // loader 설정
  module: {
    rules: [{
      // test는 어떤 파일이 함쳐지는지에 대한 내용입니다
      test: /\.tsx?$/, //정규 표현식
      exclude: /node_modules/,
      // 다수의 loader를 사용할 시 use 배열로 객체를 정의할 수 있다
      // use: [{}, {}],
      loader: 'ts-loader',
    }]
  },
  // plugin은 번들링 된 파일에 작업이 필요할 때
  plugins: [
    // html 파일을 번들링 파일과 연결하여 ouput 해준다
    new HtmlWebpackPlugin({
      cache: false, // 변경된 경우에만 파일을 내보냅니다
      template: path.resolve('src', 'renderer', 'index.html'), // 번들링 파일과 연결할 파일의 경로
      meta: {
        'Content-Security-Policy': {
          'http-equiv': 'Content-Security-Policy',
          content: IS_DEV ? `default-src * 'unsafe-eval' 'unsafe-inline';` : `default-src 'self' 'unsafe-inline';`
        }
      }
    })
  ],
  // devServer 관련 설정
  devServer: {
    // 코드 변화 감지 변경 옵션
    hot: true,
    port: 4005
  }
};

export default config;