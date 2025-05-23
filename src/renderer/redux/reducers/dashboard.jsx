import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    totalLoans:0,
    totalClients:0,
    totalPayments:0, 
    totalLoansMoney:0,
    totalPaidPaymentsMoney:0,
    totalLoansGains:0,
    totalPaidPaymentsNetGains:0,
    totalLoansCompleted:0,
    totalUnpaidPayments:0,
}



const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setTotalUnpaidPayments: (state, action) => {
            state.totalUnpaidPayments = action.payload;
        },
        setTotalLoansCompleted: (state, action) => {
            state.totalLoansCompleted = action.payload;
        },
        setTotalPaidPaymentsNetGains: (state, action) => {
            state.totalPaidPaymentsNetGains = action.payload;
        },
        setTotalLoansGains: (state, action) => {
            state.totalLoansGains = action.payload;
        },
        setTotalPaidPaymentsGains: (state, action) => {
            state.totalPaidPaymentsGains = action.payload;
        },
        setTotalLoans: (state, action) => {
            state.totalLoans = action.payload;
        },
        setTotalClients: (state, action) => {
            state.totalClients = action.payload;
        },
        setTotalPayments: (state, action) => {
            state.totalPayments = action.payload;
        },
        setTotalLoansMoney: (state, action) => {
            state.totalLoansMoney = action.payload;
        },
        setTotalPaidPaymentsMoney: (state, action) => {
            state.totalPaidPaymentsMoney = action.payload;
        },
        
       
       
       
        
       
       


       
       
       
       
       
       
       
       
        
       
       
        
        
    },
})

export const { setTotalLoans,setTotalClients,setTotalPayments,setTotalLoansMoney,
    setTotalPaidPaymentsMoney,setTotalLoansGains,setTotalPaidPaymentsGains,
    setTotalPaidPaymentsNetGains,setTotalLoansCompleted,setTotalUnpaidPayments  } = dashboardSlice.actions;
export default dashboardSlice.reducer;
