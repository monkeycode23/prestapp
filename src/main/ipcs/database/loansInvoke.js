const { ipcRenderer } = require('electron');
module.exports = {
    createLoan: (loan) => ipcRenderer.invoke('database', {model: 'loans', method: 'insert', params: loan}),
    getLoans: (filter) => ipcRenderer.invoke('database', {model: 'loans', method: 'getAll', params:filter}),
    getTotalLoans: () => ipcRenderer.invoke('database', {model: 'loans', method: 'getTotal'}),
    getLoanById: (id) => ipcRenderer.invoke('database', {model: 'loans', method: 'getById', params: id}),
    updateLoan: (loan) => ipcRenderer.invoke('database', {model: 'loans', method: 'update', params: loan}),
    deleteLoan: (id) => ipcRenderer.invoke('database', {model: 'loans', method: 'delete', params: id}),
    deleteQuery: (data) => ipcRenderer.invoke('database', {model: 'loans', method: 'deleteQuery', params: data}),
    getLoan: (filter) => ipcRenderer.invoke('database', {model: 'loans', method: 'getOne', params:filter})
}