import React,{ useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClickOutside from '../ClickOutside.jsx';
import { useSocket } from '../../context/socketContext';
import notificationService from '../../services/notificationService'
import { UserIcon } from 'lucide-react';
const DropDownConnectedClients = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);
  const {socket,onlineUsers,setOnlineUsers,onlineClients} = useSocket()

  useEffect(()=>{

  /*   const fetchNotifications = async()=>{
      const notifications = await notificationService.getNotifications()
      setNotifications(notifications)
    } */

   /*  fetchNotifications() */
   console.log(onlineUsers)

  },[])
  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li>
        <Link
          onClick={() => {
            //setNotifying(false);
            setDropdownOpen(!dropdownOpen);
          }}
          to="#"
          className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
        >
          <span
            className={`absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-green-500 ${
              onlineUsers.length > 0 || onlineClients.length > 0 ? 'inline' : 'hidden'
            }`}
          >
            <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
          </span>

            <UserIcon className="w-5 h-5" />
        </Link>

        {dropdownOpen && (
          <div
            className={`absolute -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80`}
          >
            <div className="px-4.5 py-3">
              <h5 className="text-sm font-medium text-bodydark2">
                Clientes Conectados a la web app
              </h5>
            </div>

            <ul className="flex h-auto flex-col overflow-y-auto">
              {
                onlineUsers.length ? onlineUsers.map((user)=>(
                  <li key={user._id}>
                    <Link
                      className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                      to="#"
                    >

                      
                        <span className="text-black dark:text-white">
                        <p className="text-sm">
                          <span className={` z-1 h-2 w-2 mr-2 rounded-full bg-green-500`}/> 
                          {user.nickname}
                        </p>
                        </span>{' '}
                        {/* {user.email} */}

                     
                    </Link>
                  </li>
                )) : <></>
              }
              {
                onlineClients.length ? onlineClients.map((user)=>(
                  <li key={user._id}>
                    <Link
                      className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                      to="#"
                    >

                      <p className="text-sm">
                        
                        <span className="text-black dark:text-white">
                        <span
             className={`  h-2 w-2 rounded-full mr-2 bg-green-500`}
                /> {user.nickname}
                        </span>{' '}
                        {/* {user.email} */}
                      </p>

                 
                    </Link>
                  </li>
                )) : <></>
              }
            </ul>
          </div>

        )}
      </li>
    </ClickOutside>
  );
};

export default DropDownConnectedClients;
