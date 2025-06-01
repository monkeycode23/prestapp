import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clients: [],
  client: null,

  totalClients: 0,

  loading: false,
  error: null,
  totalLoans: 0,
  totalLendMoney: 0,
  totalToPay: 0,
  netGains: 0,
  bruteGains: 0,
  debt: 0,
  notes: "",
  rate: 0,
  paymentsState: null,

  basicInformation: {
    name: "",
    lastname: "",
    gender: "",
    dni: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  },
  contactInformation: {
    email: "",
    phonenumber: "",
  },
  financialInformation: {
    cbu: "",
    alias: "",
  },
  additionalInformation: {
    created_at: "",
    updated_at: "",
  },
};

const clientsSlice = createSlice({
  name: "clients",
  initialState,

  reducers: {
    setInformation(state, action) {
      for (const key in action.payload) {
        if (Object.prototype.hasOwnProperty.call(state, key)) {
          const val = action.payload[key];

          state[key] = val;
        }
      }
    },

    setStatics(state, action) {
      for (const key in action.payload) {
        if (Object.prototype.hasOwnProperty.call(state, key)) {
          const val = action.payload[key];

          state[key] = val;
        }
      }
      //state['totalLoans'] = action.payload['totalLoans']
    },
    setTotalToPay: (state, action) => {
      state.totalToPay = action.payload;
    },
    setTotalLendMoney: (state, action) => {
      state.totalLendMoney = action.payload;
    },
    setNetGains: (state, action) => {
      state.netGains = action.payload;
    },
    setBruteGains: (state, action) => {
      state.bruteGains = action.payload;
    },
    setDebt: (state, action) => {
      state.debt = action.payload;
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
      state.clients = [action.payload, ...state.clients];

      state.totalClients++;
    },
    updateClient: (state, action) => {
      state.clients = state.clients.map((client) =>
        client.id === action.payload.id ? action.payload : client
      );
    },
    deleteClient: (state, action) => {
      state.clients = state.clients.filter(
        (client) => client.id !== action.payload.id
      );
    },
  },
});

export const {
  setNetGains,
  setStatics,
  setBruteGains,
  setTotalLendMoney,
  setTotalToPay,
  setDebt,
  setClient,
  setClients,
  setTotalClients,
  setLoading,
  setError,
  addClient,
  updateClient,
  deleteClient,
} = clientsSlice.actions;
export default clientsSlice.reducer;
