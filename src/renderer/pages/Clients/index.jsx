import React, { createContext, useContext, useEffect, useState } from "react";

//componets
import CardDataStats from "../../components/CardDataStats.jsx";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb.jsx";
import ClientList from "./ClientsList.jsx";
import Pagination from "../../components/Pagination";
import { AddClientModal } from "./AddClientModal/AddClientModal.jsx";
import Select from "../../components/Forms/SelectGroup/Select.jsx";
import { DebtorIcon, Payment10, PaymentIcon2, PersonMinus } from "../../components/Icons.jsx";
import ClientsFilter from "../../components/Cients/Filter.jsx";
import PaginationModal from "../../components/PaginationModal.jsx";

//redux
import { useDispatch, useSelector } from "react-redux";

//redux actions
import { setClients, setTotalClients } from "../../redux/reducers/clients";
import { setLoans } from "../../redux/reducers/loans";
import {
  setLabel,
  setTotalPages,
  setLimit,
  setPage,
  setSearch,
  setFilter,
  setTotalResults
} from "../../redux/reducers/_pagination";
import {
  setSelectAll,
  resetItems,
  setItems,
  deleteItem
} from "../../redux/reducers/selected";
//functions
import {
  getClients,
  getTotalClientsDebtors,
  getTotalClientsIncompletePayments,
} from "./funcs";

import { deleteClient } from "../../redux/reducers/clients";
//hooks
import useLocalStorage from "../../hooks/useLocalStorage";

const Clients = () => {

  const dispatch = useDispatch();

  const [storedValue, setStoredValue,getValues] = useLocalStorage("pagination");
  const selected = useSelector((state) => state.selected);
  //clients
  // const clients = useSelector((state) => state.clients.clients);
  const totalClients = useSelector((state) => state.clients.totalClients);

  const pagination = useSelector((state) => state.pagination);

  const clients = useSelector((state) => state.clients.clients);


  const [debtors, setDebtors] = useState(0);
  const [incomplete, setIncomplete] = useState(0);
  //pagination
 

  useEffect(() => {
    dispatch(setLabel("clients"));

    const init = async () => {
     
      //console.log()
      const limit = pagination.limit.clients.limit

      const result = await getClients(
        pagination.filter
        ,
        limit,
        pagination.page
      );

      //cards
      const totalDebtors = await getTotalClientsDebtors();
      setDebtors(totalDebtors);

      const totalIncompletePayments = await getTotalClientsIncompletePayments();
      setIncomplete(totalIncompletePayments);

      //pagination
     // console.log("result:----------------------------->", result);
      dispatch(setClients(result.clients));
      dispatch(setTotalResults(result.total));

      const totalClientsQuery =
        await window.database.models.Clients.getTotalClients();

      //console.log("totalClientsQuery:----------------------------->",totalClientsQuery)

      dispatch(setTotalClients(totalClientsQuery[0].total));

      /**
       *  pagination
       */

      const totalRows = result.total;

      // console.log("totalRows:----------------------------->",totalRows)
      dispatch(
        setTotalPages(
          totalRows >   limit
            ? Math.ceil(totalRows / limit)
            : 1
        )
      );

      console.log(result);
    };

    init();
  }, [
    selected.selectAll,
    pagination.filter,
    pagination.page,
    pagination.limit,
    pagination.totalPages,
   
  ]);

  function changePage(page) {
    dispatch(setPage(page));
  }

  async function addClient(client) {
    setClients((prev) => [client, ...prev]);
    setTotalClients((prev) => totalClients + 1);
  }

  return (
    <>
      <Breadcrumb pageName="Clientes" />
      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
        <CardDataStats
          title="Total Clientes"
          total={totalClients}
          rate={0}
          levelUp
        >
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
          </svg>
        </CardDataStats>
        <CardDataStats
          title="Clientes Deudores"
          total={debtors}
          rate={0}
          levelUp
        >
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
          </svg>
        </CardDataStats>
        <CardDataStats
          title="Pagos Incompletos"
          total={incomplete}
          rate={0}
          levelUp
        >
          <PaymentIcon2 className="fill-primary dark:fill-white" width="22" height="22" />
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-1 bg-white p-5">
        {/*<div className='flex gap-2 sm:flex-col flex-col xl:flex-row  items-center'>
           <div className='w-2/5 sm:w-full xl:w-1/2'>
             

              <input
              value={search}
              onChange={(e)=>{
                console.log("asd")
                setSearch(e.target.value)
                setPage(1)
              }}
              //onChange={(e)=>setField({type:"set",field:"password",value:e.target.value})}
              name="name"
              type="text"
              placeholder="ingrese el nombre del cliente"
              // defaultValue={fields.password.value}
              // value={fields.password.value}
              className={`w-full mb-3 rounded-lg border border-stroke  focus:text-black bg-transparent py-3 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
  
            />
            </div>

           
            <div className='w-1/5 sm:w-full xl:w-1/2'>
              <Select className="w-full"
                onChange={async (e) => setFilter(e.target.value)}
                options={[{
                  label: "filtro cuotas",
                  value: "",
                  selected: true
                },
                {

                  label: "vencidas",
                  value: "expired",
                  selected: false
                },

                {

                  label: "c. incompletas",
                  value: "incomplete",
                  selected: false
                },

                


                ]}>

              </Select>

            </div>

            <div className='w-2/5 sm:w-full xl:w-1/2'>

            </div>
          </div> */}

        <div className="col-span-3">
          <ClientsFilter />
        </div>
        <div className="col-span-9 p-3">
          <div className="flex justify-between mb-4 mt-2">
            <h1 className="text-lg font-bold">Lista de Clientes</h1>
            <div className="flex items-center gap-2">
            <span className='text-sm text-gray-500 ml-2'>Resultados:

<span className='text-md font-bold'>{pagination.totalResults}</span>
</span>
          <span className='text-sm text-gray-500'>Res/pag:

            <span className='text-md font-bold'>{pagination.limit.clients.limit}</span>
          </span>
              
              <PaginationModal />
            </div>
          </div>
          <div className="flex justify-between mb-4 mt-2">
            <AddClientModal
              addClient={addClient}
              button={
                <button className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-500/80">
                  +
                </button>
              }
            ></AddClientModal>
            {selected.items.length > 0 ? (
              <>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      //alert()

                      if (selected.selectAll) {
                        dispatch(resetItems());
                        dispatch(setSelectAll(!selected.selectAll));
                      } else {
                        // dispatch(setSelectAll(true))
                        dispatch(setItems(clients));
                        dispatch(setSelectAll(!selected.selectAll));
                      }

                      //dispatch(setSelectAll(!selected.selectAll))
                    }}
                    className="bg-blue-500 text-sm text-white px-1  rounded-full hover:bg-blue-500/80"
                  >
                    todos
                  </button>
                  <button
                    onClick={() => {
                      console.log(
                        "delete selected.items:----------------------------->",
                        selected.items
                      );
                      for(let i = 0; i < selected.items.length; i++){
                      // dispatch(deleteItems())
                        window.database.models.Clients.deleteClient(selected.items[i].id)
                        dispatch(deleteItem({id:selected.items[i].id}))
                        dispatch(setSelectAll(!selected.selectAll))
                        dispatch(deleteClient({id:selected.items[i].id}))
                      }
                    }}
                    className="bg-red-500 text-sm text-white px-1  rounded-full hover:bg-red-500/80"
                  >
                    eliminar
                  </button>
                </div>
              </>
            ) : (
              ""
            )}

            <Pagination
              currentPage={pagination?.page}
              totalPages={pagination?.totalPages}
              changePage={changePage}
            ></Pagination>
          </div>
          <ClientList />
        </div>
      </div>
    </>
  );
};

export default Clients;
