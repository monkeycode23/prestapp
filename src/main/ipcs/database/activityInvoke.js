const { ipcRenderer } = require('electron');
module.exports = {
    createActivity: (client) => ipcRenderer.invoke('database', {model: 'activity_log', method: 'insert', params: client}),
    getActivities: (filter) => ipcRenderer.invoke('database', {model: 'activity_log', method: 'getAll', params:filter}),
    deleteActivity: (id) => ipcRenderer.invoke('database', {model: 'activity_log', method: 'delete', params: id}),
    getActivity: (filter) => ipcRenderer.invoke('database', {model: 'activity_log', method: 'getOne', params:filter}),
    getTotalActivities: () => ipcRenderer.invoke('database', {model: 'activity_log', method: 'getTotal'}),
    getActivityLastId: () => ipcRenderer.invoke('database', {model: 'activity_log', method: 'getLastId'})
}    