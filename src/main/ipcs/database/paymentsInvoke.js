const { ipcRenderer } = require('electron');
module.exports = {
    createPayment: (payment) => ipcRenderer.invoke('database', {model: 'payments', method: 'insert', params: payment}),
    getPayments: (filter) => ipcRenderer.invoke('database', {model: 'payments', method: 'getAll', params: filter}),
    getPaymentById: (id) => ipcRenderer.invoke('database', {model: 'payments', method: 'getById', params: id}),
    updatePayment: (payment) => ipcRenderer.invoke('database', {model: 'payments', method: 'update', params: payment}),
    deletePayment: (id) => ipcRenderer.invoke('database', {model: 'payments', method: 'delete', params: id}),
    getPayment: (filter) => ipcRenderer.invoke('database', {model: 'payments', method: 'getOne', params:filter}),
    deleteMany: (filter) => ipcRenderer.invoke('database', {model: 'payments', method: 'deleteQuery', params:filter}),
    updateFilter: (filter) => ipcRenderer.invoke('database', {model: 'payments', method: 'updateFilter', params:filter})
}