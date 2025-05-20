import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    users: [],
    loading: false,
    error: null
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {

        getUsers: (state) => {
            state.loading = true;
        },
       
        addUser: (state, action) => {
            state.users.push(action.payload);
        },
        updateUser: (state, action) => {
            state.users = state.users.map(user => user.id === action.payload.id ? action.payload : user);
        },
        deleteUser: (state, action) => {
            state.users = state.users.filter(user => user.id !== action.payload);
        }
    }
});

export const { getUsers, addUser, updateUser, deleteUser } = usersSlice.actions;

export default usersSlice.reducer;
    