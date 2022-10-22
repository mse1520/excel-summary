import fs from 'fs';
import path from 'path';
import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import XLSX from 'xlsx';

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
  ipcMain.handle('post', (e, command, data) => postApi(command, data));
}

function getApi(command: string, data: { [key: string]: any }) {
  switch (command) {
    case 'import-excel':
      return importExcel(command, data.buf);
    default:
      throw new Error('Not found!!');
  }
}

function postApi(command: string, data: { [key: string]: any }) {
  switch (command) {
    case 'export-excel':
      return exportExcel(command, data.excel);
    default:
      throw new Error('Not found!!');
  }
}

function importExcel(command: string, data: ArrayBuffer) {
  const initData: { [key: string]: any } = {};
  const res = Object
    .entries(XLSX.read(data).Sheets)
    .reduce((acc, cur) => (acc[cur[0]] = XLSX.utils.sheet_to_json(cur[1]), acc), initData);

  return { req: { command, data }, res };
}

function exportExcel(command: string, data: { [key: string]: any }[]) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet);

  return dialog.showSaveDialog({
    title: 'Save file as',
    filters: [{
      name: 'Spreadsheets',
      extensions: ['xlsx']
    }]
  })
    .then(res => res.filePath ?? Promise.reject({ req: { command, data }, res: 'filePath is not found!!!' }))
    .then(path => (XLSX.writeFile(workbook, path), path))
    .then(path => ({ req: { command, data }, res: path }))
    .catch(console.error);
}

app.whenReady().then(() => {
  XLSX.set_fs(fs);
  initApi();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});