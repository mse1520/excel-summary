import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  get: (command: string, data?: { [key: string]: any }) => ipcRenderer.invoke('get', command, data)
});