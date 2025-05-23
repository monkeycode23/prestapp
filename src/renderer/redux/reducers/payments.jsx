import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    payments: [],
    payment: null,
    progress: 0,
    paidPayments: 0,
    progressbar:0,
    totalPayments: 0,
    loading: false,
    error: null,
    bruteGains: 0,
    expiredPayments: 0,
    netGains: 0,
    paymentsCount: {
        pending: 0,
        paid: 0,
        incomplete: 0,
        expired: 0,
    },
    notes:''
}

const paymentsSlice = createSlice({
    name: 'payments',
    initialState,
    reducers: {
        setNotes:(state, action) => {
            state.notes = action.payload;
        },

        setPaidPayments : (state, action) => {
            state.paidPayments = action.payload;
        },

        setProgress : (state, action) => {
            state.progressbar = action.payload;
        },
        setPayments: (state, action) => {
            
                state.payments =[

                    ...action.payload,
                ]
            
        },
        setPaymentsCount: (state, action) => {
            state.paymentsCount = action.payload;
        },
        setPayment: (state, action) => {
            state.payment = action.payload;
        },
        setTotalPayments: (state, action) => {
            state.totalPayments = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },  
        setError: (state, action) => {
            state.error = action.payload;
        },
        updatePayment   : (state, action) => {
            state.payments = state.payments.map(payment => payment.id === action.payload.id ? action.payload.payment : payment);
        },
        deletePayment: (state, action) => {
            state.payments = state.payments.filter(payment => payment.id !== action.payload);
        },
        setBruteGains: (state, action) => {
            state.bruteGains = action.payload;
        },
        setExpiredPayments: (state, action) => {
            state.expiredPayments = action.payload;
        },
        setNetGains: (state, action) => {
            state.netGains = action.payload;
        },
    },
})  

export const {setPaidPayments,setProgress,deletePayment, setPayments, setTotalPayments, setLoading, setError, updatePayment, setBruteGains, setExpiredPayments, setNetGains, setPaymentsCount   } = paymentsSlice.actions;
export default paymentsSlice.reducer;
