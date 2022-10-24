
import path from 'path';
import { Configuration as WebpackConfiguration, EnvironmentPlugin } from 'webpack';

const IS_DEV = process.env.NODE_ENV === 'development';

function createConfig(predicate: (config: WebpackConfiguration) => WebpackConfiguration): WebpackConfiguration {
  const config: WebpackConfiguration = {
    // mode, // 실서비스는 production
    // devtool, // 실서비스는 hidden-source-map
    mode: IS_DEV ? 'development' : 'production',
    devtool: IS_DEV ? 'eval-cheap-module-source-map' : 'hidden-source-map',
    resolve: {
      // import 구문에서 합쳐질 파일의 확장자를 붙여준다
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      // 경로 alias
      alias: {
        '@lib': path.resolve('src', 'lib')
      },
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
    }
  };

  return predicate(config);
}

export default [
  createConfig(config => ({
    ...config,
    name: 'webpack-preload',
    target: 'electron-preload',
    entry: {
      preload: path.resolve('src', 'preload.ts')
    },
    output: {
      ...config.output,
      clean: IS_DEV ? true : false,
    }
  })),
  createConfig(config => ({
    ...config,
    name: 'webpack-main',
    target: 'electron-main',
    // 웹팩 멀티 설정시 먼저 실행되어야할 종속성을 설정합니다
    dependencies: ['webpack-preload'],
    // 합쳐질 파일의 시작점
    // 파일이 서로 연결된경우 알아서 찾아준다
    entry: {
      main: path.resolve('src', 'main', 'index.ts')
    }
  })),
];