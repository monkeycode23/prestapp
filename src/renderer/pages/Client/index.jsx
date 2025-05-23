import React, { useState, useEffect } from "react";

//componets
import CardDataStats from "../../components/CardDataStats";
import ReactApexChart from "react-apexcharts";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import LoansList from "./LoansList";
import { AddLoanModal } from "./AddLoanModal";
import ClientCard from "./ClientCard";
import Pagination from "../../components/Pagination";
import Select from "../../components/Forms/SelectGroup/Select";
import {
  UserIcon,
  StarIcon,
  PaymentIcon,
  WalletIcon,
  MoneyBag,
} from "../../components/Icons";
import ClientHeader from "../../components/Client/header/ClientHeader";
import LoanCardsList from "../../components/Loan/LoanCards/LoanCardsList";
import { Filter } from "../../components/Loan/LoanCards/Filter";
import PaginationModal from "../../components/PaginationModal";

//hooks
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useNotification } from "../../components/Notifications";
import useLocalStorage from "../../hooks/useLocalStorage";

//funcs
import { formatAmount } from "../../common/funcs";

//redux
import { useDispatch, useSelector } from "react-redux";
import { setLoans, setTotalLoans } from "../../redux/reducers/loans";
import {
  setClient,
  setNetGains,
  setBruteGains,
} from "../../redux/reducers/clients";
import { setPaymentsCount } from "../../redux/reducers/payments";
import {
  getClient,
  getClientGains,
  getClientLoans,
  getClientPaymentsCount,
  getClientNotes,
  getClientInformation,
} from "./funcs";
import {
  setInformation,
  setContactInformation,
  setFinancialInformation,
  setBasicInformation,
} from "../../redux/reducers/information";
import {
  setLimit,
  setPage,
  setSearch,
  setFilter,
  setTotalPages,
  setTotalResults,
  setLabel,
} from "../../redux/reducers/_pagination";
const Client = () => {
  //hooks
  const dispatch = useDispatch();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const { id } = useParams();
  const [storedValue, setStoredValue] = useLocalStorage("pagination", null);

  //redux states
  //client
  const client = useSelector((state) => state.clients.client);
  //loan
  const loans = useSelector((state) => state.loans.loans);
  const totalLoans = useSelector((state) => state.loans.totalLoans);
  //gains
  const netGains = useSelector((state) => state.clients.netGains);
  const bruteGains = useSelector((state) => state.clients.bruteGains);

  //Information
  const information = useSelector((state) => state.information);
  //payments
  const paymentsCount = useSelector((state) => state.payments.paymentsCount);

  //Pagination
  const pagination = useSelector((state) => state.pagination);
  /*   const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('')


 */

  useEffect(() => {
    const init = async () => {
      if(pagination.label!="loans") dispatch(setPage(1));
  
      dispatch(setLabel("loans"));
      
      
      // Resetear el filtro si viene de la página de pagos
      if (pagination.label === "payments") {
        dispatch(setFilter({
          status: {
            active: true,
            completed: false,
            canceled: false
          }
        }));
      }
      
      //Get Client
      const data = await getClient(id);
      dispatch(setClient(data));

      const limit = pagination.limit.loans.limit;

      console.log(pagination.page)
      const fetchLoans = await getClientLoans(
        id,
        pagination.filter,
        pagination.page,
        limit
      );

      dispatch(setTotalResults(fetchLoans.total));
      dispatch(setTotalPages(Math.ceil(fetchLoans.total / limit)));
      dispatch(setLoans(fetchLoans.loans));
      dispatch(setTotalLoans(fetchLoans.total));

      //Get Information
      const _information = await getClientInformation(id);
      if (_information !== undefined) {
        dispatch(
          setContactInformation({
            email: _information.email ? _information.email : "",
            phonenumber: _information.phone ? _information.phone : "",
          })
        );

        dispatch(
          setFinancialInformation({
            cbu: _information.cbu ? _information.cbu : "",
            alias: _information.alias ? _information.alias : "",
          })
        );

        dispatch(
          setBasicInformation({
            name: _information.name ? _information.name : "",
            lastname: _information.lastname ? _information.lastname : "",
          })
        );
      }

      //Get Notes
      const notes = await getClientNotes(id);

      //Get Payments Count
      const paymentsCount = await getClientPaymentsCount(id);
      dispatch(setPaymentsCount(paymentsCount));

      //Get Gains
      const gains = await getClientGains(id);
      dispatch(setNetGains(gains.net_amount));
      dispatch(setBruteGains(gains.brute_gain));
    };
    init();

    return () => {
      // Limpiar el estado al desmontar
      dispatch(setLoans([]));
      dispatch(setTotalLoans(0));
    };
  }, [id, pagination.page, pagination.limit.loans.limit, pagination.label]);

  // Efecto separado para resetear el filtro solo cuando cambia el ID del cliente
/*   useEffect(() => {
    dispatch(setFilter({
      status: {
        active: true,
        completed: false,
        canceled: false
      }
    }));
  }, [id]); */

  function changePage(page) {
    dispatch(setPage(page));
  }

  return (
    <>
      <Breadcrumb pageName="Cliente" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title="Prestamos del Cliente"
          total={totalLoans}
          rate="0.0"
          levelUp
        >
          <MoneyBag className="fill-primary dark:fill-white" width="22" height="22" />
        </CardDataStats>

        <CardDataStats
          title="Ganancias brutas del cliente"
          total={"$ " + formatAmount(bruteGains)}
          rate="0.0"
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
          title="Dinero recaudado del cliente"
          total={"$ " + formatAmount(netGains)}
          rate="0.0"
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
            <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" fill="currentColor"/>
          </svg>
        </CardDataStats>
      </div>

      {client && <ClientHeader client={client} />}

      <div className="grid grid-cols-12 gap-4 mt-4">
        <div className="col-span-3">
          <Filter />
        </div>
        <div className="col-span-9">
          <div className="flex flex-row justify-between mb-2">
            <h1 className="text-2xl font-bold">Prestamos del cliente </h1>
            <div className="flex flex-row gap-2 items-center">
              <span className="text-sm text-gray-500 ml-2">
                Resultados:
                <span className="text-md font-bold">
                  {pagination.totalResults}
                </span>
              </span>
              <span className="text-sm text-gray-500">
                Res/pag:
                <span className="text-md font-bold">{pagination.limit.loans.limit}</span>
              </span>
              <PaginationModal />
            </div>
          </div>
          <div className="flex flex-row  justify-end mb-2">
            {loans.length > 0 ? (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                changePage={changePage}
              ></Pagination>
            ) : (
              ""
            )}
          </div>

          <LoanCardsList />
        </div>
      </div>

      {/* <div className="flex justify-between col-span-12 xl:col-span-12 bg-white p-1">
            <Select className=""
              onChange={async (e) => setFilter(e.target.value)}
              options={[{
                label: "filtro Prestamos",
                value: "",
                selected: true
              },


              {

                label: "activos",
                value: "active",
                selected: false
              },

              {

                label: "completados",
                value: "completed",
                selected: false
              },

              {

                label: "cancelados",
                value: "canceled",
                selected: false
              },




              ]}>

            </Select>

          </div> */}

      {/* <div className="col-span-6 xl:col-span-8">

             <LoansList  /> 
          </div> */}
      {/* <ChatCard /> */}
    </>
  );
};

export default Client;
