import fs from 'fs';
import { dialog } from 'electron';
import _ from 'underbarjs';
import XLSX from 'xlsx';
import { createApi } from '@lib/ipcApi';

XLSX.set_fs(fs);

const api = createApi();

api.get('summary-excel', (bufs: ArrayBuffer[]) => _.go(
  bufs,
  _.mapL((buf: ArrayBuffer) => XLSX.read(buf).Sheets),
  _.mapL(_.entries),
  _.mapC(_.map((sheet: XLSX.WorkSheet) => XLSX.utils.sheet_to_json(sheet[1]))),
  _.deepFlat
));

api.post('export-excel', (bufs: Record<string, any>[]) => {
  const worksheet = XLSX.utils.json_to_sheet(bufs);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet);

  const options: Electron.SaveDialogOptions = {
    filters: [{
      name: 'Spreadsheets',
      extensions: ['xlsx']
    }]
  };

  return _.go(
    options,
    dialog.showSaveDialog,
    (res: Electron.SaveDialogReturnValue) => res.filePath,
    (path: string) => path ? path : Promise.reject('filePath is not found!!!'),
    _.tap((path: string) => XLSX.writeFile(workbook, path, { compression: true }))
  );
});

export default api;