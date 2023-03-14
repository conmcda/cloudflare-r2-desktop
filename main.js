const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const shell    = electron.shell; 
const electronIpcMain = require('electron').ipcMain;

let mainWindow
var path = require("path");

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 700, backgroundColor: '#1f2428',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: true,
      preload: path.join(app.getAppPath(), 'preload.js')  
    }
  })

  //mainWindow.webContents.openDevTools();
  mainWindow.setMenu(null);
  mainWindow.loadURL('http://localhost:8000/index.html');
  mainWindow.on('closed', function () {
    mainWindow = null
  })

}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  app.quit()
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

electronIpcMain.on('setclipboard', (event, message) => {
  const {clipboard} = require('electron');
  clipboard.writeText(message); // seems to be a simple way of setting clipboard across different OSes - called from javascript via IPC
})
