const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI',{
    initializeVersion: function(data) {
        const res = ipcRenderer.sendSync('dialog:redmineVersion', data);
        ipcRenderer.send('sendMessage', res);
    },
    saveConfig: function(data) {
        const res = ipcRenderer.sendSync('dialog:saveConfig', data);
        ipcRenderer.send('sendMessage', res);
    },
    saveRedmineConfig: function(data) {
        const res = ipcRenderer.sendSync('dialog:saveRedmineConfig', data);
        ipcRenderer.send('sendMessage', res);
    },
    loadConfig: function(data) {
        return ipcRenderer.sendSync('dialog:loadConfig', data);
    },
    getRedmineTrackerList:function(data) {
        return ipcRenderer.sendSync('dialog:getRedmineTrackerConfigList', data);
    },
    sendMessage: (callback) => ipcRenderer.on('sendMessage', callback),
})