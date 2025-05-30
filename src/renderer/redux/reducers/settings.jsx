import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    apiUrl:process.env.REACT_APP_API_URL || "http://localhost:4000/api",
    isElectron:process.env.REACT_APP_IS_ELECTRON || false,
    isWeb:process.env.REACT_APP_IS_WEB || true,
    isMobile:process.env.REACT_APP_IS_MOBILE || false,
    isDesktop:process.env.REACT_APP_IS_DESKTOP || false,
    isTablet:process.env.REACT_APP_IS_TABLET || false,
    socketUrl:process.env.REACT_APP_SOCKET_URL || "http://localhost:4000",



}

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        updateSettings: (state, action) => {
            for (const key in action.payload) {
                if (Object.prototype.hasOwnProperty.call(state, key)) {
                  const val = action.payload[key];
        
                  state[key] = val;
                }
              }
              //
        }
    },
})  

export const {  updateSettings   } = settingsSlice.actions;
export default settingsSlice.reducer;
