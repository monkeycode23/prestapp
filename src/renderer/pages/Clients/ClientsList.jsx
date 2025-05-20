import React, { useEffect } from "react";
import Modal from "../../components/Modal";
//import ClientCard from "./ClientCard";
import { Link } from "react-router-dom";
import { UserIcon } from "../../components/Icons";
import { useDispatch, useSelector } from 'react-redux';
import { addClient } from '../../redux/reducers/clients';
import { setClient } from "../../redux/reducers/clients";
import Tag from "../../components/Tag";
import ClientCard from "./ClientCard";

const ClientList = () => {


    const clients = useSelector((state) => state.clients.clients);
    const totalClients = useSelector((state) => state.clients.totalClients);

  
    const dispatch = useDispatch();
  
  useEffect(()=>{
    
  
 
  },[])
  //console.log(clients)
  return (
    <>
    
      {clients.length>0 ?
       (<div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-1  ">

        {
          clients.map((client) =>{
            
            
               return  (
       
                 <ClientCard
                   key={client.id}
                  
                   client={client}
                   //profileImage={user.profileImage}
                 />
               )
        })}  
        
      </div>)
      :(
        <div className="p-10 ">
          <h1 className="w-full flex justify-center items-center text-gray-400 text-2xl font-bold">No hay clientes</h1>
        </div>
      )}
   
    </>
  );
};





export default ClientList