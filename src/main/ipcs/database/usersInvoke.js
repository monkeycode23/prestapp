const { ipcRenderer } = require('electron');

module.exports = {
    createUser: (user) => ipcRenderer.invoke('database', {model: 'users', method: 'insert', params: user}),
    getUserByEmail: (email) => ipcRenderer.invoke('database', {model: 'users', method: 'getUserByEmail', params: email}),
    getUserById: (id) => ipcRenderer.invoke('database', {model: 'users', method: 'getUserById', params: id}),
    updateUser: (user) => ipcRenderer.invoke('database', {model: 'users', method: 'update', params: user}),
    deleteUser: (id) => ipcRenderer.invoke('database', {model: 'users', method: 'delete', params: id}),
    getUser: (filter) => ipcRenderer.invoke('database', {model: 'users', method: 'getOne', params:filter})
}