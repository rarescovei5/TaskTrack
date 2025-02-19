import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { isDev } from './utils.js';
import { getPreloadPath } from './pathResolver.js';

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    icon: './appIco.png',
    webPreferences: {
      preload: getPreloadPath(),
    },
    frame: false,
    autoHideMenuBar: true,
    transparent: true,
    alwaysOnTop: true,
    minWidth: 800,
  });

  if (isDev()) {
    mainWindow.loadURL('http://localhost:5123');
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
  }

  ipcMain.on('close-app', () => app.quit());
  ipcMain.on('minimize-app', () => mainWindow.minimize());
});
