import React, { createContext, useContext, useEffect, useState } from "react";

//componets
import CardDataStats from "../../components/CardDataStats.jsx";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb.jsx";
import ClientList from "./ClientsList.jsx";
import Pagination from "../../components/Pagination";
import { AddClientModal } from "./AddClientModal/AddClientModal.jsx";
import Select from "../../components/Forms/SelectGroup/Select.jsx";
import {
  DebtorIcon,
  Payment10,
  PaymentIcon2,
  PersonMinus,
} from "../../components/Icons.jsx";
import ClientsFilter from "../../components/Cients/Filter.jsx";
import PaginationModal from "../../components/PaginationModal.jsx";

//redux
import { useDispatch, useSelector } from "react-redux";

//redux actions
import { setClients, setTotalClients,setStatics } from "../../redux/reducers/clients";
import { setLoans } from "../../redux/reducers/loans";
import {
  setLabel,
  setTotalPages,
  setLimit,
  setPage,
  setSearch,
  setFilter,
  setTotalResults,
} from "../../redux/reducers/_pagination";
import {
  setSelectAll,
  resetItems,
  setItems,
  deleteItem,
} from "../../redux/reducers/selected";
//functions
import {
  getClients,
  getTotalClientsDebtors,
  getTotalClientsIncompletePayments,
} from "./funcs";

import { deleteClient as deleteClientReduxAction } from "../../redux/reducers/clients"; // Renombrado para evitar conflicto
//hooks
import useLocalStorage from "../../hooks/useLocalStorage";

// Services
import clientsService from "../../services/clientsService.js";

// Activity Log Function (Nueva versión)
const addActivityLog = async (actionType, entityType, entityId, payloadObject, explicitSyncStatus = null) => {
  const isOnline = navigator.onLine;
  const currentSyncStatus = explicitSyncStatus !== null ? explicitSyncStatus : (isOnline ? 1 : 0);

  try {
    const logEntry = {
      action_type: actionType, // "CREATE", "UPDATE", "DELETE"
      entity: entityType,      // "clients", "loans", "payments"
      entity_id: entityId ? entityId.toString() : null,
      payload: JSON.stringify(payloadObject), // El objeto completo o los cambios
      synced: currentSyncStatus, // 0 si está offline o falló la sincro, 1 si está online y (asumimos) sincro exitosa
      // created_at: new Date().toISOString(), // La DB puede generar esto
    };
    await window.database.models.ActivityLog.createActivity(logEntry); // Usando createActivity
    console.log("Activity logged (new format):", logEntry);
  } catch (error) {
    console.error("Failed to add activity log (new format):", error);
  }
};

const Clients = () => {
  const dispatch = useDispatch();

  const [storedValue, setStoredValue, getValues] =
    useLocalStorage("pagination");
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
    if(pagination.label!="clients") dispatch(setPage(1));

    dispatch(setLabel("clients"));

    const init = async () => {
      //console.log()
      const limit = pagination.limit.clients.limit;

      const result = await getClients(
        pagination.filter,
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
        setTotalPages(totalRows > limit ? Math.ceil(totalRows / limit) : 1)
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

  async function handleAddClient(clientDataFromModal) {
    let newClient = null;
    let syncStatus = 0; // 0 for offline/failed, 1 for online/success

    try {
      // Intenta crear el cliente a través de la API
      const createdClient = await clientsService.createClient(clientDataFromModal);
      newClient = createdClient; // Asume que la API devuelve el cliente creado, idealmente con su ID asignado por el backend
      syncStatus = 1;
      console.log("Client created via API:", newClient);

      // Actualizar estado de Redux o local si la llamada a la API fue exitosa
      // Es importante que el cliente tenga el ID del backend aquí
      dispatch(setClients([newClient, ...clients])); // Agrega al inicio de la lista actual
      dispatch(setTotalClients(totalClients + 1));
      // Podrías necesitar recargar la lista de clientes para asegurar consistencia con el backend
      // o actualizar la UI de forma optimista y luego reconciliar.

    } catch (apiError) {
      console.error("Failed to create client via API:", apiError);
      syncStatus = 0;
      // Si la API falla (ej. offline), crea el cliente localmente con un ID temporal si es necesario
      // o simplemente registra el intento fallido.
      // Por ahora, vamos a asumir que el modal nos da toda la info necesaria y la guardamos.
      newClient = { 
        ...clientDataFromModal, 
        id: `local-${Date.now()}`, // ID temporal local
        // Asegúrate de que la estructura coincida con la que espera tu UI
      };
      // Aquí podrías optar por agregar el cliente a la UI con un indicador de "no sincronizado"
      // o manejarlo de otra forma. Por simplicidad, lo agregaremos visualmente.
      dispatch(setClients([newClient, ...clients])); 
      dispatch(setTotalClients(totalClients + 1));
      alert("Error al crear cliente en el servidor. Se guardó localmente (simulado).");
    }

    // Registrar actividad independientemente del resultado de la API
    const entityIdForLog = newClient && newClient.id ? newClient.id : null;
    // La data completa del cliente (clientDataFromModal) es el payload para CREATE
    await addActivityLog("CREATE", "clients", entityIdForLog, clientDataFromModal, syncStatus);

    // La función original se llamaba `addClient`, pero la lógica del modal pasaba `addClient` como prop.
    // Vamos a mantener la lógica de actualización de UI aquí si es necesario, 
    // o asegurar que el modal reciba el cliente actualizado (con ID del backend si es posible).
  }

  return (
    <>
      <Breadcrumb pageName="Clientes" />
      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
        <CardDataStats
          title="Total de Clientes"
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
            <path
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              fill="currentColor"
            />
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
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
              fill="currentColor"
            />
          </svg>
        </CardDataStats>
        
      </div>

      <div className="mt-4 grid grid-cols-12 gap-1 bg-white p-5">
        
        <div className="col-span-3">
          <ClientsFilter />
        </div>
        <div className="col-span-9 p-3">
          <div className="flex justify-between mb-4 mt-2">
            <h1 className="text-lg font-bold">Lista de Clientes</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 ml-2">
                Resultados:
                <span className="text-md font-bold">
                  {pagination.totalResults}
                </span>
              </span>
              <span className="text-sm text-gray-500">
                Res/pag:
                <span className="text-md font-bold">
                  {pagination.limit.clients.limit}
                </span>
              </span>

              <PaginationModal />
            </div>
          </div>
          <div className="flex justify-between mb-4 mt-2">
            <AddClientModal
              addClientFunction={handleAddClient}
              button={
                <button className="bg-primary text-white px-3 py-1 rounded-lg hover:bg-blue-500/80">
                  nuevo cliente +
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
                    onClick={async () => {
                      console.log(
                        "delete selected.items:----------------------------->",
                        selected.items
                      );
                      const itemsToDelete = [...selected.items];
                      dispatch(resetItems());

                      for (let i = 0; i < itemsToDelete.length; i++) {
                        const clientToDelete = itemsToDelete[i];
                        let syncStatus = 0;
                        try {
                          await clientsService.deleteClient(clientToDelete.id);
                          syncStatus = 1;
                          console.log("Client deleted via API:", clientToDelete.id);
                          
                          dispatch(deleteClientReduxAction({ id: clientToDelete.id }));

                        } catch (apiError) {
                          console.error(
                            `Failed to delete client ${clientToDelete.id} via API:`,
                            apiError
                          );
                          syncStatus = 0;
                          alert(`Error al eliminar cliente ${clientToDelete.nombre} del servidor. Inténtalo más tarde.`);
                        }
                        // Registrar actividad (formato nuevo)
                        await addActivityLog(
                          "DELETE", // actionType
                          "clients", // entityType
                          clientToDelete.id, // entityId
                          { id: clientToDelete.id, nombre: clientToDelete.nombre }, // payload: info del cliente eliminado
                          syncStatus // explicitSyncStatus
                        );
                      }
                    }}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-500/80"
                  >
                    <PersonMinus />
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
