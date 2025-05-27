import React from 'react';
import { Route, Routes, Outlet } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import DefaultLayout from './layouts/DefaultLayout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Users';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Error404 from './pages/error/404';
import Clients from './pages/Clients';
import Client from './pages/Client';
import Loan from './pages/Loan';
import Settings from './pages/Settings';
import Calendar from './pages/Calendar';
import Payments from './pages/Payments';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import store from './redux/store'
import { SocketProvider } from './context/socketContext';
import ChatRoom from './pages/chat';

function App() {
  const navigate = useNavigate();
  

  useEffect(()=>{
    
    navigate('/dashboard')
    
  },[])

  
 
  async function createUser(){
   // const user = await window.database.models.Users.createUser({username: "Juan", email: "juan@gmail.com", password: "123456"});
  }

 
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/auth" >
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
        </Route>
        {/*  */}
        <Route path="/" element={
          <SocketProvider>
          <PrivateRoute><DefaultLayout/></PrivateRoute></SocketProvider> } >
          <Route index path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Profile />} />
          <Route path="profile" element={<Profile />} />

          <Route path="clients" element={<Clients />} />
          <Route path="clients/:id" element={<Client />} />
          <Route path="loans/:id" element={<Loan />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="settings" element={<Settings />} />
          <Route path="payments" element={<Payments />} />
          <Route path="chat" element={<ChatRoom></ChatRoom>} />

          {/*  <Route path="loans" element={<Loans />} /> */}
        </Route>

        <Route path="*" element={<Error404 />} />
       
      </Routes>
    </Provider>
  );
}

export default App;


