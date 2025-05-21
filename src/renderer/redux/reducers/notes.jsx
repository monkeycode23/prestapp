import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   notes:"Notas del pago...",
}

const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        setNotes: (state, action) => {
            state.notes = action.payload;
        },
        setTotalNotes: (state, action) => {
            state.totalNotes = action.payload;
        },  
      addNote: (state, action) => {
        state.notes = action.payload;
      },
      updateNote: (state, action) => {
        state.notes = state.notes.map(note => note.id === action.payload.id ? action.payload.note : note);
      },
      deleteNote: (state,   action) => {
        state.notes = state.notes.filter(note => note.id !== action.payload.id);
      },
      
    },
})

export const {  setNotes, setTotalNotes, addNote, updateNote, deleteNote } = notesSlice.actions;
export default notesSlice.reducer;      


