

import React,{useState,useEffect} from 'react'
import { getClientsWithReputation } from '../Clients/funcs';

function TopClientsChart() {


    const [topClientes, setTopClientes] = useState([]);
    const [show, setShow] = useState(true);


    useEffect(() => {

        const init = async () => {
         
        const top = await getClientsWithReputation(10);
        console.log("-------------------->",top)
        setShow(top.length ? true :false)
        setTopClientes(top);
          
        }
    
        init()
      return () => {
        
      }
    }, [])
    
  
  
    return (<>
    {
        show ? (
            <div className="col-span-5 xl:col-span-5 ">
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-stroke">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">🏆 Top clientes</h3>
                      <ul>
                        {topClientes.length === 0 && <li className="text-gray-500">Sin datos</li>}
                        {topClientes.map((c, i) => (
                          <li key={c.id} className="flex justify-between items-center py-1 border-b last:border-b-0">
                            <span className="font-medium text-gray-700">{i+1}. {c.nickname}</span>
                            <span className="text-primary font-semibold">${Number(c.total_paid).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
                            <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${c.reputation >= 80 ? 'bg-green-100 text-green-700' : c.reputation >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>Rep: {c.reputation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>): (<></>)
    }
    </>
  )
}

export default TopClientsChart


