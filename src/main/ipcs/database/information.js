const { ipcRenderer } = require('electron');
module.exports = {
    createInformation: (information) => ipcRenderer.invoke('database', {model: 'information', method: 'insert', params: information}),
    getInformations: () => ipcRenderer.invoke('database', {model: 'information', method: 'getAll'}),
    getInformationById: (id) => ipcRenderer.invoke('database', {model: 'information', method: 'getById', params: id}),
    updateInformation: (information) => ipcRenderer.invoke('database', {model: 'information', method: 'update', params: information}),
    deleteInformation: (id) => ipcRenderer.invoke('database', {model: 'information', method: 'delete', params: id}),
    getInformation: (filter) => ipcRenderer.invoke('database', {model: 'information', method: 'getOne', params:filter}),
    updateInformationFilter: (filter) => ipcRenderer.invoke('database', {model: 'information', method: 'updateFilter', params:filter})

}