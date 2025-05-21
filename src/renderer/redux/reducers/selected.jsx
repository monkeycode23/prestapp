import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items:[],
    selectAll:false

}

const selectedSlice = createSlice({
    name: 'selected',
    initialState,
    reducers: {
        setItems: (state, action) => {
            
                state.items = action.payload
            
        },

        setItem: (state, action) => {
           // console.log("action.payload.item:----------------------------->",action.payload.item)
            state.items = [
                ...state.items,
                action.payload.item
            ]
        
           // console.log("state.items:----------------------------->",state.items)
        },
        setTotalItems: (state, action) => {
            state.totalItems = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },  
        
        updateItem   : (state, action) => {
            state.items = state.items.map(item => item.id === action.payload.id ? action.payload.item : item);
        },
        deleteItem: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload.id);
        },
        setSelectAll: (state, action) => {
            state.selectAll = action.payload;
        },
        resetItems: (state, action) => {
            state.items = [];
        },
       
    },
})  

export const { deleteItem, setItems, setItem, setTotalItems, setLoading, updateItem, setSelectAll, resetItems    } = selectedSlice.actions;
export default selectedSlice.reducer;
