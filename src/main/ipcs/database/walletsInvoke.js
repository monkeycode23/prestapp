const { ipcRenderer } = require('electron');
module.exports = {
    createWallet: ( wallet) => ipcRenderer.invoke('database', {model: 'wallets', method: 'insert', params: wallet}),
    getWallets: (filter) => ipcRenderer.invoke('database', {model: 'wallets', method: 'getAll', params:filter}),
    getWalletById: (id) => ipcRenderer.invoke('database', {model: 'wallets', method: 'getById', params: id}),
    updateWallet: (wallet) => ipcRenderer.invoke('database', {model: 'wallets', method: 'update', params: wallet}),
    deleteWallet: (id) => ipcRenderer.invoke('database', {model: 'wallets', method: 'delete', params: id}),
    getWallet: (filter) => ipcRenderer.invoke('database', {model: 'wallets', method: 'getOne', params:filter}),
    getTotalWallets: () => ipcRenderer.invoke('database', {model: 'wallets', method: 'getTotal'}),
    getWalletLastId: () => ipcRenderer.invoke('database', {model: 'wallets', method: 'getLastId'})
}