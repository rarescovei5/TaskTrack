import { app, BrowserWindow, ipcMain, screen } from 'electron';
import path from 'path';
import { isDev } from './utils.js';
import { getPreloadPath } from './pathResolver.js';

app.on('ready', () => {
  const { width: screenWidth } = screen.getPrimaryDisplay().workAreaSize;

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

    x: (screenWidth - 800) / 2,
    y: 8,
  });

  if (isDev()) {
    mainWindow.loadURL('http://localhost:5123');
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
  }

  ipcMain.on('close-app', () => app.quit());
  ipcMain.on('minimize-app', () => mainWindow.minimize());
  ipcMain.on('resize-content', (_, newHeight) => {
    const window = BrowserWindow.getFocusedWindow(); // Get the current window
    if (window) {
      const [winWidth] = window.getSize(); // Get current width
      window.setSize(winWidth, newHeight); // Set new height
    }
  });
});
