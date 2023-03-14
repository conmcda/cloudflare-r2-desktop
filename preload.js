const contextBridge = require('electron').contextBridge;
const ipcRenderer = require('electron').ipcRenderer;

contextBridge.exposeInMainWorld(
    'ipcRender', {
        setclip: (message) => {
            ipcRenderer.send('setclipboard', message);
        },
    }); 