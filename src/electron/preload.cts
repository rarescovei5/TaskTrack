const electron = require('electron');

electron.contextBridge.exposeInMainWorld('api', {
  close: () => {
    electron.ipcRenderer.send('close-app');
  },
  minimize: () => {
    electron.ipcRenderer.send('minimize-app');
  },
});
