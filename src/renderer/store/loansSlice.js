import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  loans: [],
  loan: null,
  isLoading: false,
  isDeleting: false,
  isUpdating: false,
  isCreating: false,
  isSearching: false,
  error: null,
  loanPaymentDetails: {
    loanId: null,
    paidCount: 0,
    pendingCount: 0,
    expiredCount: 0,
    incompleteCount: 0,
    totalCount: 0,
    isLoading: false,
    error: null,
  },
};

const loansSlice = createSlice({
  name: "loans",
  initialState,
  reducers: {
    setLoans: (state, action) => {
      state.loans = action.payload;
      state.isLoading = false;
    },
    setLoanPaymentDetailsLoading: (state) => {
      state.loanPaymentDetails.isLoading = true;
      state.loanPaymentDetails.error = null;
    },
    setLoanPaymentDetails: (state, action) => {
      state.loanPaymentDetails.loanId = action.payload.loanId;
      state.loanPaymentDetails.paidCount = action.payload.paidCount;
      state.loanPaymentDetails.pendingCount = action.payload.pendingCount;
      state.loanPaymentDetails.expiredCount = action.payload.expiredCount;
      state.loanPaymentDetails.incompleteCount = action.payload.incompleteCount;
      state.loanPaymentDetails.totalCount = action.payload.totalCount;
      state.loanPaymentDetails.isLoading = false;
    },
    setLoanPaymentDetailsError: (state, action) => {
      state.loanPaymentDetails.isLoading = false;
      state.loanPaymentDetails.error = action.payload;
    },
    setLoan: (state, action) => {
      state.loan = action.payload;
      state.isLoading = false;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLoans.fulfilled, (state, action) => {
        state.loans = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchLoans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchLoanById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLoanById.fulfilled, (state, action) => {
        state.loan = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchLoanById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchLoanPaymentDetails.pending, (state) => {
        state.loanPaymentDetails.isLoading = true;
        state.loanPaymentDetails.error = null;
      })
      .addCase(fetchLoanPaymentDetails.fulfilled, (state, action) => {
        state.loanPaymentDetails.loanId = action.payload.loanId;
        state.loanPaymentDetails.paidCount = action.payload.paidCount;
        state.loanPaymentDetails.pendingCount = action.payload.pendingCount;
        state.loanPaymentDetails.expiredCount = action.payload.expiredCount;
        state.loanPaymentDetails.incompleteCount = action.payload.incompleteCount;
        state.loanPaymentDetails.totalCount = action.payload.totalCount;
        state.loanPaymentDetails.isLoading = false;
      })
      .addCase(fetchLoanPaymentDetails.rejected, (state, action) => {
        state.loanPaymentDetails.isLoading = false;
        state.loanPaymentDetails.error = action.error.message;
      })
      .addCase(deleteLoan.pending, (state) => {
        state.isDeleting = true;
      });
  },
});

export const {
  setLoans,
  setLoan,
  setLoanPaymentDetailsLoading,
  setLoanPaymentDetails,
  setLoanPaymentDetailsError,
  setLoading,
  setError,
} = loansSlice.actions;

export const fetchLoans = createAsyncThunk("loans/fetchLoans", async (filters) => {
  const loans = await window.database.getLoans(filters);
  return loans;
});

export const fetchLoanPaymentDetails = createAsyncThunk(
  'loans/fetchLoanPaymentDetails',
  async (loanId, { dispatch }) => {
    try {
      const details = await window.database.getLoanPaymentDetails(loanId);
      return { ...details, loanId };
    } catch (error) {
      console.error("Error fetching loan payment details:", error);
      throw error;
    }
  }
);

export const fetchLoanById = createAsyncThunk("loans/fetchLoanById", async (id) => {
  const loan = await window.database.getLoanById(id);
  return loan;
}); 