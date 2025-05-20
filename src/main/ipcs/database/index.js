
const usersIpcs = require('./usersInvoke');
const clientsIpcs = require('./clientsInvoke');
const loansIpcs = require('./loansInvoke');
const paymentsIpcs = require('./paymentsInvoke');
const notesIpcs = require('./notesInvoke');
const informationIpcs = require('./information');
/* const settingsIpcs = require('./settingsInvoke');
const reportsIpcs = require('./reportsInvoke'); */

module.exports = {
    Users: {...usersIpcs},
    Clients:{...clientsIpcs},
    Information:{...informationIpcs},
    Loans:{...loansIpcs},
    Payments:{...paymentsIpcs},
    Notes:{...notesIpcs},
    /* ,
    Wallets:{...walletsIpcs}, */
    /*
    ,
     */
    /*     Settings:{...settingsIpcs},
        Reports:{...reportsIpcs}, */
}
