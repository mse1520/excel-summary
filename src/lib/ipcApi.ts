import { contextBridge, ipcMain, ipcRenderer } from 'electron';
import _ from 'underbarjs';

enum Method {
  Get = 'get',
  Post = 'post'
}

enum Status {
  Success = 200,
  Failure = 500
}

interface ApiStore {
  [Method.Get]: Record<string, IpcHandler<any, any>>;
  [Method.Post]: Record<string, IpcHandler<any, any>>;
}

interface IpcHandler<T, R> {
  (data: T): R;
}

export function apiBridge() {
  contextBridge.exposeInMainWorld('api', {
    get: (command: string, data?: any) => ipcRenderer.invoke(Method.Get, command, data),
    post: (command: string, data?: any) => ipcRenderer.invoke(Method.Post, command, data)
  });
}

export function createApi() {
  const store: ApiStore = {
    [Method.Get]: {},
    [Method.Post]: {}
  };

  const callApi = (method: Method, command: string, data: any) => {
    const handler = store[method][command];
    if (!handler) throw new Error(`'${command}' is not set handler!!`);

    const makeResponse = _.curry((code: Status, _data: any) => ({ req: { command, data }, res: { code, data: _data } }));

    const result: Promise<any> = _.go(
      data,
      handler,
      (data: any) => new Promise(resolve => resolve(data)),
      makeResponse(Status.Success)
    );

    return result
      .catch(makeResponse(Status.Failure))
      .then(_.identity);
  };

  const register = (method: Method) => <T = any, R = any>(command: string, handler: IpcHandler<T, R>) => store[method][command] = handler;

  return {
    [Method.Get]: register(Method.Get),
    [Method.Post]: register(Method.Post),
    run() {
      ipcMain.handle(Method.Get, (e, command, data) => callApi(Method.Get, command, data));
      ipcMain.handle(Method.Post, (e, command, data) => callApi(Method.Post, command, data));
    }
  };
}