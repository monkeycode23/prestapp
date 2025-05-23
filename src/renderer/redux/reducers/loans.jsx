import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loans: [],
    
    totalLoans: 0,
    //payments: [],
    statics: {
        total: 0,
        completed: 0,
        active: 0,
        canceled: 0,
        redunded: 0,
    },
    monthly: 0,
    unbalancePayments:false,
    loansTotalAmount: 0,
    paymentsTotalAmount: 0,
    leftToPaid:0,
    loading: false,
    error: null,
    loan: null,
}

const loansSlice = createSlice({
    name: 'loans',
    initialState,
    
    
    reducers: {

        setUnbalancePayments: (state, action) => {
            state.unbalancePayments = action.payload;
     },
        setLeftToPaid: (state, action) => {
               state.leftToPaid = action.payload;
        },
        setStatics: (state, action) => {
            state.statics = action.payload;
        },
        setLoans: (state, action) => {
            state.loans = action.payload;
        },
        setTotalLoans: (state, action) => {
            state.totalLoans = action.payload;
        },  
      addLoan: (state, action) => {
        state.loans = [ action.payload,...state.loans];
      },
      updateLoan: (state, action) => {
        state.loans = state.loans.map(loan => loan.id === action.payload.id ? action.payload.loan : loan);
      },
      deleteLoan: (state, action) => {
        state.loans = state.loans.filter(loan => loan.id !== action.payload.id);
      },
        setMonthly: (state, action) => {
            state.monthly = action.payload;
        },  
        setLoansTotalAmount: (state, action) => {   
            state.loansTotalAmount = action.payload;
        },
        setLoan: (state, action) => {
            state.loan = action.payload
        },
     

        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
})

export const {setStatics,setUnbalancePayments,  setLoans,setLeftToPaid, setTotalLoans, addLoan, updateLoan, deleteLoan, setMonthly, setLoansTotalAmount, setLoan, setLoading, setError } = loansSlice.actions;
export default loansSlice.reducer;      


