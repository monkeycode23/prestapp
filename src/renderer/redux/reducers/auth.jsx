import { createSlice } from '@reduxjs/toolkit';
import { decodeToken } from '../../common/funcs';



const setToken = ()=>{
    const token  = localStorage.getItem("auth_token")
    //console.log(token)
    if(token){
        const decodedToken = decodeToken(token)
        if(decodedToken.expirationDate < Date.now()){
            localStorage.removeItem("auth_token")
            
            return null
        }

        
        return token
    }
    return null
}

const initialState = {
    user: null,
    sessionExpired:false,
    isAuthenticated:true,
    token:setToken(),
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = state.user ? {...state.user, ...action.payload} : action.payload;
        },
       
        login: (state, action) => {

            console.log(action.payload)
            state.user = action.payload.user;
            if(typeof action.payload.token == "string") state.token = action.payload.token;
            //console.log(action.payload)
           localStorage.setItem("auth_token", action.payload.token);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("auth_token")
        },
        register: (state, action) => {

            //console.log(action)
            state.user = action.payload.user;
            state.token = action.payload.token;

            localStorage.setItem("auth_token", action.payload.token);
        },
        setSessionExpired: (state, action) => {
            state.sessionExpired = action.payload;
        }
    }
}); 
 
export const { login, logout, register, setSessionExpired, setUser } = authSlice.actions;

export default authSlice.reducer; 
