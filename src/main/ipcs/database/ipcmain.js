const Users = require('../../storage/database/Models/Users');
const users = new Users();
const Clients = require('../../storage/database/Models/Clients');
const clients = new Clients();
const Loans = require('../../storage/database/Models/Loans');
const loans = new Loans();
const Payments = require('../../storage/database/Models/Payments');
const payments = new Payments();
const Information = require('../../storage/database/Models/Infomation');
const information = new Information();
const Wallets = require('../../storage/database/Models/Wallet');
const wallets = new Wallets();
const Notes = require('../../storage/database/Models/Notes');
const notes = new Notes();


const DatabaseIpcMain =(event, data) => {
    const method = data.method;
    const params = data.params;
    let result; 
    switch(data.model){
      case 'users': 
       // console.log("method:----------------------------->",data.model,data.method,data.params);
        result = users[method](params);
        break;
      case 'clients':
       // console.log("method:----------------------------->",data.model,data.method,data.params);
        result = clients[method](params);
        //console.log("result:----------------------------->",result)
        break;
      case 'loans': 
//console.log("method:----------------------------->",data.model,data.method,data.params);
        result = loans[method](params);
        break;  
      case 'payments':
       // console.log("method:----------------------------->",data.model,data.method,data.params);
        result = payments[method](params);
        break;
      case 'information':
//console.log("method:----------------------------->",data.model,data.method,data.params);
        result = information[method](params);
        break;
      case 'wallets':
       // console.log("method:----------------------------->",data.model,data.method,data.params);
        result = wallets[method](params);
        break;
      case 'notes':
        //console.log("method:----------------------------->",data.model,data.method,data.params);
        result = notes[method](params);
        break;
   /*    case 'settings':
        result = settings[method](params);
        break;
      case 'reports':
        result = reports[method](params);
        break; */
      default:
        break;
    }
    return result
  }





module.exports = DatabaseIpcMain