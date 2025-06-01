
const User = require('../../storage/mongo_models/users')
const Pago = require('../../storage/mongo_models/pago')
const Cliente = require('../../storage/mongo_models/cliente')
const Prestamo = require('../../storage/mongo_models/prestamo')

const MongoIpcMain =(event, data) => {
    
    let result; 
    switch(data.model){
      case 'users': 
       // console.log("method:----------------------------->",data.model,data.method,data.params);
        result = User
        break;
      case 'clients':
       // console.log("method:----------------------------->",data.model,data.method,data.params);
        result = Cliente
        //console.log("result:----------------------------->",result)
        break;
      case 'loans': 
//console.log("method:----------------------------->",data.model,data.method,data.params);
        result = Prestamo
        break;  
      case 'payments':
       // console.log("method:----------------------------->",data.model,data.method,data.params);
        result = Pago
        break;
      /* case 'information':
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
        break; */
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





module.exports = MongoIpcMain