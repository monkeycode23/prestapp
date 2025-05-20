import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    netGains:0,
    bruteGains:0,
   
}



const gainsSlice = createSlice({
    name: 'gains',
    initialState,
    reducers: {
        setNetGains: (state, action) => {
            state.netGains = action.payload;
        },
        setBruteGains: (state, action) => {
            state.bruteGains = action.payload;
        },
        
       
       
       
        
       
       


       
       
       
       
       
       
       
       
       
       
       
        
        
    },
})

export const { setNetGains, setBruteGains } = gainsSlice.actions;
export default gainsSlice.reducer;
