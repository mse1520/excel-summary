import fs from 'fs';

const rootDirs = fs.readdirSync('.');
const include = ['node_modules', 'dist', 'package.json'];
const ignore = rootDirs.filter(dir => !include.includes(dir));

export const packagerConfig = {
  ignore: [...ignore, 'forge.config.js', /\.map$/],
  asar: true
};
export const makers = [
  {
    name: '@electron-forge/maker-squirrel',
    config: {
      name: 'electron_react_guide'
    }
  },
  {
    name: '@electron-forge/maker-zip',
    platforms: ['darwin']
  },
  {
    name: '@electron-forge/maker-deb',
    config: {}
  },
  {
    name: '@electron-forge/maker-rpm',
    config: {}
  }
];