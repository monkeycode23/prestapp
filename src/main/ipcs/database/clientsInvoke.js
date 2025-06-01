const { ipcRenderer } = require('electron');
module.exports = {
    createClient: (client) => ipcRenderer.invoke('database', {model: 'clients', method: 'insert', params: client}),
    getClients: (filter) => ipcRenderer.invoke('database', {model: 'clients', method: 'getAll', params:filter}),
    getClientById: (id) => ipcRenderer.invoke('database', {model: 'clients', method: 'getById', params: id}),
    updateClient: (client) => ipcRenderer.invoke('database', {model: 'clients', method: 'update', params: client}),
    deleteClient: (id) => ipcRenderer.invoke('database', {model: 'clients', method: 'delete', params: id}),
    getClient: (filter) => ipcRenderer.invoke('database', {model: 'clients', method: 'getOne', params:filter}),
    getTotalClients: () => ipcRenderer.invoke('database', {model: 'clients', method: 'getTotal'}),
    getClientLastId: () => ipcRenderer.invoke('database', {model: 'clients', method: 'getLastId'})
}    