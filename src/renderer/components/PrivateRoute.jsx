import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate,useNavigate,Outlet } from 'react-router-dom';

const  PrivateRoute = ({ children }) => {
    const user = useSelector(state => state.auth.user);
    const token = useSelector(state => state.auth.token);
    const sessionExpired = useSelector(state => state.auth.sessionExpired);
    const navigate = useNavigate();
    /* if(sessionExpired){
        return <Navigate to="/auth/signin" />;
    }
 */
    //console.log(token)

    useEffect(()=>{
      // navigate("/dashboard")
      console.log("chango")
    },[])
    
    return token!=null ? (
    <>
    
     {children}
     
   
    </>
   ) : <Navigate to="/auth/signin" />;
};

export default PrivateRoute;

