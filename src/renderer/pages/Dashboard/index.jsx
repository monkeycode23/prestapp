import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CardDataStats from "../../components/CardDataStats";
import { Payment10, WalletIcon } from "../../components/Icons";
import { MoneyBag, PeopleMoney20Regular } from "../../components/Icons";
import { DollarSign, MoneyWavy } from "../../components/Icons";
import ChartThree from "../../components/Charts/ChartThree";
import { formatAmount } from "../../common/funcs";
import ChartTwo from "../../components/Charts/ChartTwo";
import ChartOne from "../../components/Charts/ChartOne";
import {
  getTotalLoans,
  getLoansTotalAmounts,
  getTotalPaidPaymentsMoney,
  checkAndUpdateActiveLoans,
  getLoansByStatus,
} from "./funcs";
import { useDispatch } from "react-redux";
import {
  setTotalLoans,
  setTotalClients,
  setTotalPayments,
  setTotalLoansMoney,
  setTotalPaidPaymentsMoney,
  setTotalLoansGains,
  setTotalPaidPaymentsGains,
  setTotalPaidPaymentsNetGains,
  setTotalLoansCompleted,
  setTotalUnpaidPayments,
} from "../../redux/reducers/dashboard";
import { toLocaleDate } from "../Payments/funcs";
import ReactApexChart from "react-apexcharts";
import { ExpiredDate } from "../../components/Icons";
import { CalendarDays } from "../../components/Icons";
import { getUnpaidPayments } from "./funcs";
import { getTopClients, getClientsWithReputation } from "../Clients/funcs";
import TopClientsChart from "./TopClientsChart";

import LoansChart from "./LoansChart";

/**
 * component
 */
const Dashboard = () => {
  const dispatch = useDispatch();
  //const loans = useSelector(state => state.loans.loans)
  const [loansByStatus, setLoansByStatus] = useState({
    active: 0,
    completed: 0,
    cancelled: 0,
  });
  const [morosidad, setMorosidad] = useState(0);
  const [pagosProximos, setPagosProximos] = useState(0);
  const [promedioPrestamo, setPromedioPrestamo] = useState(0);
  const [topClientes, setTopClientes] = useState([]);

  const {
    totalLoans,
    totalLoansCompleted,
    totalLoansMoney,
    totalPaidPaymentsMoney,
    totalPaidPaymentsGains,
    totalPaidPaymentsNetGains,
    totalUnpaidPayments,
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    const init = async () => {
      try {
        // Verificar y actualizar préstamos completados
        // checkAndUpdateActiveLoans();

        const today = toLocaleDate(new Date());
        //console.log("today:----------------------------->",today)

        await window.database.models.Payments.updateFilter({
          where: `status = 'pending' AND payment_date < '${today}'`,
          data: {
            status: "expired",
          },
        });

        ///////////////////////////////////////////////////

        const fetchTotalLoans = await getTotalLoans();
        //console.log("totalLoans:----------------------------->",fetchTotalLoans)
        dispatch(setTotalLoans(fetchTotalLoans.active));
        dispatch(setTotalLoansCompleted(fetchTotalLoans.completed));

        const fetchLoansTotalAmounts = await getLoansTotalAmounts();
        // console.log("loansTotalAmounts:----------------------------->",fetchLoansTotalAmounts)

        dispatch(setTotalLoansMoney(fetchLoansTotalAmounts.loans));

        const fetchTotalPaidPaymentsMoney = await getTotalPaidPaymentsMoney();
        //console.log("totalPaidPaymentsMoney:----------------------------->",fetchTotalPaidPaymentsMoney)
        dispatch(setTotalPaidPaymentsMoney(fetchTotalPaidPaymentsMoney));

        const fetchTotalUnpaidPayments = await getUnpaidPayments();
        //console.log("totalUnpaidPayments:----------------------------->",fetchTotalUnpaidPayments)
        dispatch(setTotalUnpaidPayments(fetchTotalUnpaidPayments));

        dispatch(setTotalLoansGains(fetchLoansTotalAmounts.gains));

        dispatch(setTotalPaidPaymentsGains(fetchTotalPaidPaymentsMoney.gains));

        dispatch(
          setTotalPaidPaymentsNetGains(fetchTotalPaidPaymentsMoney.net_gains)
        );
        /*  const fetchTotalClients = await getTotalClients()
          console.log("totalClients:----------------------------->",fetchTotalClients)
          dispatch(setTotalClients(fetchTotalClients))
           */
        // Calcular morosidad
        const totalActivos = fetchTotalLoans.active || 0;
        // Obtener cantidad de pagos vencidos (expired)
        const expiredPayments =
          await window.database.models.Payments.getPayments({
            select: `COUNT(*) as total_expired`,
            where: `status = 'expired'`,
          });
        const totalExpired = expiredPayments[0]?.total_expired || 0;
        // Morosidad: pagos vencidos sobre préstamos activos (puedes ajustar la fórmula si prefieres otra base)
        const porcentajeMorosidad =
          totalActivos > 0 ? (totalExpired / totalActivos) * 100 : 0;
        setMorosidad(porcentajeMorosidad);

        // Pagos próximos a vencer (próximos 7 días)
        const hoy = new Date();
        const hoyStr = toLocaleDate(hoy);
        const sieteDiasDespues = new Date(hoy);
        sieteDiasDespues.setDate(hoy.getDate() + 7);
        const sieteDiasStr = toLocaleDate(sieteDiasDespues);
        const pagosProximosRes =
          await window.database.models.Payments.getPayments({
            select: `COUNT(*) as total_proximos`,
            where: `status = 'pending' AND payment_date > '${hoyStr}' AND payment_date <= '${sieteDiasStr}'`,
          });
        setPagosProximos(pagosProximosRes[0]?.total_proximos || 0);

        // Promedio de monto por préstamo activo
        const totalMonto = fetchLoansTotalAmounts.loans || 0;
        const promedio = totalActivos > 0 ? totalMonto / totalActivos : 0;
        setPromedioPrestamo(promedio);

        // Top clientes con reputación
      } catch (error) {
        console.error("Error al inicializar el dashboard:", error);
      }
    };
    init();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title="Total de Prestamos Activos"
          total={totalLoans}
          rate="0.0"
          levelUp
        >
          <MoneyBag
            className="fill-primary dark:fill-white"
            width="22"
            height="22"
          ></MoneyBag>
        </CardDataStats>
        {/* <CardDataStats title="Prestamos completados" total={totalLoansCompleted}  levelUp>
           <MoneyBag  className="fill-success dark:fill-white"
           color="success"
              width="22"
              height="22"></MoneyBag>
          </CardDataStats> */}
        <CardDataStats
          title="Ganancia Total"
          total={"$" + formatAmount(totalPaidPaymentsGains)}
          levelUp
        >
          <MoneyWavy
            className="fill-primary dark:fill-white"
            width="22"
            height="22"
          ></MoneyWavy>
        </CardDataStats>
        <CardDataStats
          title="Total Dinero cirulando"
          total={"$" + formatAmount(totalUnpaidPayments)}
          levelUp
        >
          <PeopleMoney20Regular width={"22"} height={"22"} />
        </CardDataStats>
      </div>
      {/* end   */}

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartThree />

        <LoansChart></LoansChart>

        <TopClientsChart></TopClientsChart>
        <ChartTwo></ChartTwo>


        <ChartOne></ChartOne>
      </div>
    </>
  );
};

export default Dashboard;
