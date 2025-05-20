import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './global.css';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import  Notification  from './components/Notifications';
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <Provider store={store}>
        <HashRouter>
            <Notification>
                <App />
            </Notification>
        </HashRouter>
    </Provider>
    
);