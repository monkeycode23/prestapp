import apiService from "../../services/api";

const {authService} = apiService;

export const initFields2 = {
  username: {
    value: "",
    isValid: true,
    error: "",
  },
  email: {
    value: "",
    isValid: true,
    error: "",
  },
  password: {
    value: "",
    isValid: true,
    error: "",
  },
  rpassword: {
    value: "",
    isValid: true,
    error: "",
  },
};

export const validateRules2 = {
  username: {
    required: {
      param: true,
      message: "Este campo es requerido",
    },
    minLength: {
      param: 3,
      message: "No puede ser menor a 3",
    },
    maxLength: {
      param: 15,
      message: "No puede ser mayor a 15",
    },
  },
  email: {
    required: {
      param: true,
      message: "Este campo es requerido",
    },
    minLength: {
      param: 3,
      message: "No puede ser menor a 3",
    },
    maxLength: {
      param: 40,
      message: "No puede ser mayor a 40",
    },
    email: {
      param: true,
      message: "No es un formato de email valido",
    },
  },
  password: {
    required: {
      param: true,
      message: "Este campo es requerido",
    },
    minLength: {
      param: 8,
      message: "No puede ser menor a 8",
    },
    maxLength: {
      param: 20,
      message: "No puede ser mayor a 20",
    },
  },
  rpassword: {
    required: {
      param: true,
      message: "Este campo es requerido",
    },
    minLength: {
      param: 8,
      message: "No puede ser menor a 8",
    },
    maxLength: {
      param: 20,
      message: "No puede ser mayor a 20",
    }
    
  },
};

export const initFields = {
  username: {
    value: "",
    isValid: true,
    error: "",
  },
 
  password: {
    value: "",
    isValid: true,
    error: "",
  },
};

export const validateRules = {
  username: {
    required: {
      param: true,
      message: "Este campo es requerido",
    },
    minLength: {
      param: 3,
      message: "No puede ser menor a 3",
    },
    maxLength: {
      param: 15,
      message: "No puede ser mayor a 15",
    },
  },
  password: {
    required: {
      param: true,
      message: "Este campo es requerido",
    },
    minLength: {
      param: 6,
      message: "No puede ser menor a 6",
    },
    maxLength: {
      param: 20,
      message: "No puede ser mayor a 20",
    },  
  },
};

export async function validateUserName(username) {
  //const user= await window.sqlite.query("SELECT * FROM users WHERE username=?",fields.username.value)
  
  const user = await window.database.models.Users.getUser({username:username});

  console.log(user)
  return   user  ? user[0] : false;

 
}

export async function validateUserEmail(email) {
  console.log(user)

  const user = await window.database.models.Users.getUser({email: email});
  return   user ? user[0] : false;
}



export async function comparePassword(password, hash) {
  const compare = await compareHash(password, hash)
  return compare
}


export async function generateToken(obj, expirationDate) {

  if(!expirationDate){
    expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días a partir de ahora
  }

  
const  tokenObject ={
    ...obj,
    expirationDate:expirationDate.getTime()
  }
  /*   const jsonString = JSON.stringify(tokenObject);
  

  const base64Encoded = btoa(jsonString); */

    const token  =await window.jwt.generate(tokenObject)
  console.log(token)
  return token;
}


export function decodeToken(token) {
  // Decodificar el token de Base64
 /*  const decodedData = atob(token);

  // Convertir la cadena JSON de nuevo a un objeto
  const obj = JSON.parse(decodedData); */

  const decoded  = window.jwt.decode({token})

 
  return decoded;
}

async function generateHash(message) {
/*   const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
 */
  return await window.hash.hashPassword(message)
}

async function compareHash(message, hashToCompare) {
  /* const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
   */
  
  return await window.hash.comparePassword(message,hashToCompare);
}

export async function insertUser(data){
    
    const hash =await generateHash(data.password.value)
   // console.log("hash",hash)
   // console.log("compareHash",await compareHash("asdasdasd",hash))
  const user = await window.database.models.Users.createUser({
    username:data.username.value,
    email:data.email.value,
    password:hash,
   // rol:"admin"
  }); 

  if(user)return user;
  return false;
}


export async function webAppRegister(username,email,password){

    const response = await authService.register(username,password,email);

    if(response){
      if(response.includes("Usuario creado correctamente")){
        return true;
      }

      if(response.message.includes("password")){
        return {
          type:"error",
          field:"password",
          message:"La contraseña debe tener al menos 6 caracteres"
        }
      }
      if(response.message.includes("usuario")){
        return {
          type:"error",
          field:"username",
          message:"El usuario ya existe"
        }
      }
      if(response.message.includes("email")){
        return {
          type:"error",
          field:"email",
          message:"El email ya existe"
        }
      }

      if(response.user && response.token){
        return {
          type:"success",
          message:"Usuario creado correctamente",
          user:response.user,
          token:response.token
        }
    }

    return false;
}

}


export async function webAppLogin(username,password){
  const response = await authService.login(username,password);

  if(response.type === "success"){
    return response;
  }

  if(response.type === "error"){
    if(response.message.includes("password")){
      return {
        type:"error",
        field:"password",
        message:"credenciales incorrectas"
      }
    }
    if(response.message.includes("usuario")){
      return {
        type:"error",
        field:"username",
        message:"credenciales incorrectas"
      }
    }

  }

  return false;

}




