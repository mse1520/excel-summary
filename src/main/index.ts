import path from 'path';
import { app, BrowserWindow, nativeTheme } from 'electron';
import api from './api';

const IS_DEV = process.env.NODE_ENV === 'development';

function createWindow() {
  nativeTheme.themeSource = 'dark';

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  IS_DEV ? win.loadURL('http://localhost:4005') : win.loadFile(path.join(__dirname, 'index.html'));
  IS_DEV ? win.webContents.openDevTools() : win.removeMenu();
}

app.whenReady().then(() => {
  api.run();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});