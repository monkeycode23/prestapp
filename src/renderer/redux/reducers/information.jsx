import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    basicInformation: {
        name: '',
        lastname: '',
        gender: '',
        dni: '',
        address: '',
        city: '',
        state: '',
        zip: '',
    },
    contactInformation: {
        email: '',
        phonenumber: '',
    },
    financialInformation: {
        cbu: '',
        alias: '',
       
    },
    additionalInformation: {
        created_at: '',
        updated_at: '',
    },

    notes: [],
    

}


const informationSlice = createSlice({
    name: 'information',
    initialState,
    reducers: {
        setBasicInformation: (state, action) => {
            state.basicInformation = action.payload;
        },
        setContactInformation: (state, action) => {
            state.contactInformation = action.payload;
        },
        setFinancialInformation: (state, action) => {
            state.financialInformation = action.payload;
        },
        setAdditionalInformation: (state, action) => {
            state.additionalInformation = action.payload;
        },
            setNotes: (state, action) => {
                state.notes = action.payload;
            },
        setInformation: (state, action) => {
            state.information = action.payload;
        },
        
    },
})

export const { setBasicInformation, setContactInformation, setFinancialInformation, setAdditionalInformation, setNotes } = informationSlice.actions;
export default informationSlice.reducer;
