import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './reducers/users';
import authReducer from './reducers/auth';
import clientsReducer from './reducers/clients';
import loansReducer from './reducers/loans';
import paymentsReducer from './reducers/payments';
import paginationReducer from './reducers/_pagination';
import gainsReducer from './reducers/gains';
import dashboardReducer from './reducers/dashboard';
import informationReducer from './reducers/information';
import notesReducer from './reducers/notes';
import selectedReducer from './reducers/selected';

const rootReducer = {
    users: usersReducer,
    auth: authReducer,  
    clients: clientsReducer,
    loans: loansReducer,
    payments: paymentsReducer,
    pagination: paginationReducer,
    gains: gainsReducer,
    dashboard: dashboardReducer,
    information: informationReducer,
    notes: notesReducer,
    selected: selectedReducer,
};

export const store = configureStore({   
    reducer: rootReducer,
});

export default store;