import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';

const IS_DEV = process.env.NODE_ENV === 'development';

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  IS_DEV ? win.loadURL('http://localhost:4005') : win.loadFile(path.join(__dirname, 'index.html'));
}

function initApi() {
  ipcMain.handle('get', (e, command, data) => getApi(command, data));
}

function getApi(command: string, data: { [key: string]: any }) {
  switch (command) {
    case 'ping':
      return { req: { command, data }, res: 'pong' };
    default:
      throw new Error('Not found!!');
  }
}

app.whenReady().then(() => {
  initApi();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});