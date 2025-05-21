import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    clients: [],
    client:null,
    totalClients: 0,
    loading: false,
    error: null,
    netGains: 0,
    bruteGains: 0,
}



const clientsSlice = createSlice({
    name: 'clients',
    initialState,
    reducers: {
        setNetGains: (state, action) => {
            state.netGains = action.payload;
        },
        setBruteGains: (state, action) => {
            state.bruteGains = action.payload;
        },
        setClient: (state, action) => {
            state.client = action.payload;
        },
       
        setClients: (state, action) => {
            state.clients = action.payload;
        },
        setTotalClients: (state, action) => {
            state.totalClients = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },  
        setError: (state, action) => {  
            state.error = action.payload;
        },
        addClient: (state, action) => {
            state.clients=[
                action.payload,
                ...state.clients
            ]

            state.totalClients++;
        },
        updateClient: (state, action) => {
            state.clients = state.clients.map(client => client.id === action.payload.id ? action.payload : client);
        },
        deleteClient: (state, action) => {
            state.clients = state.clients.filter(client => client.id !== action.payload.id);
        },
        
        
    },
})

export const { setNetGains, setBruteGains, setClient, setClients, setTotalClients, setLoading, setError, addClient, updateClient, deleteClient } = clientsSlice.actions;
export default clientsSlice.reducer;
