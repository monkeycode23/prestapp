const { ipcRenderer } = require('electron');
module.exports = {
    createNote: (note) => ipcRenderer.invoke('database', {model: 'notes', method: 'insert', params: note}),
    getNotes: (filter) => ipcRenderer.invoke('database', {model: 'notes', method: 'getAll', params:filter}),
    getNoteById: (id) => ipcRenderer.invoke('database', {model: 'notes', method: 'getById', params: id}),
    updateNote: (note) => ipcRenderer.invoke('database', {model: 'notes', method: 'update', params: note}),
    deleteNote: (id) => ipcRenderer.invoke('database', {model: 'notes', method: 'delete', params: id}),
    getNote: (filter) => ipcRenderer.invoke('database', {model: 'notes', method: 'getOne', params:filter}),
    deleteQuery: (filter) => ipcRenderer.invoke('database', {model: 'notes', method: 'deleteQuery', params:filter})
}