import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  get: (command: string, data?: { [key: string]: any }) => ipcRenderer.invoke('get', command, data),
  post: (command: string, data?: { [key: string]: any }) => ipcRenderer.invoke('post', command, data)
});