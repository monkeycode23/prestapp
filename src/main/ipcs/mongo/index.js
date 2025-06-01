

const { ipcRenderer } = require('electron');


/* const settingsIpcs = require('./settingsInvoke');
const reportsIpcs = require('./reportsInvoke'); */

module.exports = {
    User: {getModel:()=> ipcRenderer.invoke('mongo', {model: 'user'})},
    Client:{getModel:()=> ipcRenderer.invoke('mongo', {model: 'clients'})},
    Loan:{getModel:()=> ipcRenderer.invoke('mongo', {model: 'loans'})},
    Payment:{getModel:()=>  ipcRenderer.invoke('mongo', {model: 'payments'})},
    
    /* ,
    Wallets:{...walletsIpcs}, */
    /*
    ,
     */
    /*     Settings:{...settingsIpcs},
        Reports:{...reportsIpcs}, */
}
