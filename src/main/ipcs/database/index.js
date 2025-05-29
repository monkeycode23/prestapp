
const usersIpcs = require('./usersInvoke');
const clientsIpcs = require('./clientsInvoke');
const loansIpcs = require('./loansInvoke');
const paymentsIpcs = require('./paymentsInvoke');
const notesIpcs = require('./notesInvoke');
const informationIpcs = require('./information');
const ActivityIpcs = require('./activityInvoke')
/* const settingsIpcs = require('./settingsInvoke');
const reportsIpcs = require('./reportsInvoke'); */

module.exports = {
    Users: {...usersIpcs},
    Clients:{...clientsIpcs},
    Information:{...informationIpcs},
    Loans:{...loansIpcs},
    Payments:{...paymentsIpcs},
    Notes:{...notesIpcs},
    ActivityLog:{...ActivityIpcs}
    /* ,
    Wallets:{...walletsIpcs}, */
    /*
    ,
     */
    /*     Settings:{...settingsIpcs},
        Reports:{...reportsIpcs}, */
}
