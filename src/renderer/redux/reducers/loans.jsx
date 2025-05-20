import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loans: [],
    
    totalLoans: 0,
    //payments: [],
    monthly: 0,
    loansTotalAmount: 0,
    paymentsTotalAmount: 0,
    loading: false,
    error: null,
    loan: null,
}

const loansSlice = createSlice({
    name: 'loans',
    initialState,
    reducers: {
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
        console.log("action.payload---a>>",action.payload)
        state.loans = state.loans.map(loan => loan.id === action.payload.id ? action.payload.loan : loan);
      },
      deleteLoan: (state, action) => {
        console.log("action.payload---a>>",action.payload)
        state.loans = state.loans.filter(loan => loan.id !== action.payload.id);
      },
        setMonthly: (state, action) => {
            state.monthly = action.payload;
        },  
        setLoansTotalAmount: (state, action) => {   
            state.loansTotalAmount = action.payload;
        },
        setLoan: (state, action) => {

           // console.log("action.payload---a>>",action.payload)
            //console.log("state.loan---a>>",state.loan)
            state.loan = action.payload

           // console.log("state.loan---a>>",state.loan)
        },
     

        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
})

export const {  setLoans, setTotalLoans, addLoan, updateLoan, deleteLoan, setMonthly, setLoansTotalAmount, setLoan, setLoading, setError } = loansSlice.actions;
export default loansSlice.reducer;      


