import React,{useEffect,useState} from 'react'
import ReactApexChart from 'react-apexcharts'

//components
import ApexChart from './ApexChart'
import { UserIcon,RoundPhoneAndroid,EmailIcon,LocationIcon,Wallet03,Tags,EditIcon,DeleteIcon } from '../../../components/Icons'
import EditModalClient from '../../../pages/Client/EditClientModal'
//redux
import { useSelector } from 'react-redux'
import Tag from '../../Tag'
import AddLoanModal from '../../../pages/Client/AddLoanModal'
import DeleteClientModal from './DeleteClientModal'
import Chart from './Chart'
import { getClientReputation } from '../../../pages/Clients/funcs'

const ClientHeader = () => {
    const client = useSelector(state => state.clients.client)
    const information = useSelector(state => state.information)
    const loans = useSelector(state => state.loans.loans)
    const [reputation, setReputation] = useState(0)
    // Preparar datos para el gráfico
    const loanData = [
        { name: "Activos", value: loans.filter(l => l.status === "active").length, color: "#3B82F6" },
        { name: "Completados", value: loans.filter(l => l.status === "completed").length, color: "#10B981" },
        { name: "Cancelados", value: loans.filter(l => l.status === "canceled").length, color: "#EF4444" }
    ];

    const chartOptions = {
        chart: {
            type: "donut",
        },
        labels: loanData.map(item => item.name),
        colors: loanData.map(item => item.color),
        legend: {
            position: "bottom",
        },
        tooltip: {
            y: {
                formatter: (value) => `${value} préstamos`,
            },
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '70%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total',
                            formatter: () => loans.totalLoans
                        }
                    }
                }
            }
        }
    };

    const chartSeries = loanData.map(item => item.value);


    useEffect(()=>{
      
      const init =async () => {
        
        if (client?.id) {
          const fetchReputation = await getClientReputation(client.id)
          setReputation(fetchReputation)
        }
      }

      init()
    },[client?.id])

    return (
        <div className='client-header grid grid-cols-12 grid-rows-1 grid-rows-auto gap-5 bg-white p-4 rounded-lg border border-gray-200 rounded-md mt-5'>
            <div className='h-200 xl:col-span-3  xsm:col-span-12 sm:col-span-12 md:col-span-3 row-span-2  flex flex-col gap-2  items-center'>
                <span className='w-full text-sm text-gray-500 flex flex-row items-center justify-start gap-2'>
                    <DeleteClientModal client={client}></DeleteClientModal>
                </span>
                <h1 className=' text-2xl font-bold rounded-full bg-blue-500 text-white p-2 border border-gray-300 p-5'>
                    <UserIcon className='w-10 h-10' />
                </h1>
                <h1 className='text-xl text-center text-gray-600 font-bold'>{client.nickname}</h1>

                <AddLoanModal client={client}
                    button={
                        <button className='mt-18 bg-primary text-white p-2 rounded-xl border border-gray-300 font-bold'>
                            Prestar Dinero
                            <span className='text-xl font-bold ml-2'>
                                +
                            </span>
                        </button>
                    }
                ></AddLoanModal>
            </div>

            <div className='xl:col-span-5 xsm:col-span-12 sm:col-span-12 md:col-span-6 flex flex-col gap-2'>
                <div className='flex flex-row items-center justify-between gap-2 text-md font-bold text-gray-500'>
                    <h1 className='flex flex-row items-center justify-between gap-2 text-md font-bold text-gray-500'>Información del cliente</h1>
                    <button>
                        <EditModalClient
                            button={<button
                                className="flex w-full items-center gap-2 rounded-sm px-4 py-1.5 text-left text-sm hover:bg-gray/80 dark:hover:bg-meta-4">
                                <EditIcon></EditIcon>
                            </button>}
                        ></EditModalClient>
                    </button>
                </div>
                <InformationClientHeader />
                <ReputationBar reputation={reputation} />

            </div>

            <div className='xl:col-span-4 xl:block  xsm:col-span-12 sm:col-span-12 md:col-span-12 row-span-2'>
                {/*  */}
                <Chart></Chart> 
            </div>
        </div>
    )
}

export const InformationClientHeader = () => {
  const information = useSelector((state) => state.information);

  return (
    <>
      <div className="w-full flex flex-col justify-between items-center gap-2">
        <div id="information-client" className="w-full flex justify-between   gap-2">
          <div>
            <div className="w-full flex flex-col gap-2">
              <InformationItem
                icon={
                  <EmailIcon className="w-6 h-6 p-1 rounded-full bg-blue-500 text-white"></EmailIcon>
                }
                label="Email"
                value={information.contactInformation.email}
              />
            </div>
            <div className="w-full">
              <InformationItem
                icon={
                  <RoundPhoneAndroid className="w-6 h-6 p-1 rounded-full bg-blue-500 text-white"></RoundPhoneAndroid>
                }
                label="Telefono"
                value={information.contactInformation.phonenumber}
              />
            </div>

            <div className="w-full flex flex-row gap-2">
              <InformationItem
                icon={
                  <LocationIcon className="w-6 h-6 p-1 rounded-full bg-blue-500 text-white"></LocationIcon>
                }
                label="Dirección"
                value={information.basicInformation.address}
              />
            </div>

            <div className="w-full">
              <InformationItem
                icon={
                  <Wallet03 className="w-6 h-6 p-1 rounded-full bg-blue-500 text-white"></Wallet03>
                }
                label="CBU"
                value={information.financialInformation.cbu}
              />
            </div>

            <div className="w-full flex flex-row gap-2">
              <InformationItem
                icon={
                  <Wallet03 className="w-6 h-6 p-1 rounded-full bg-blue-500 text-white"></Wallet03>
                }
                label="Alias"
                value={information.financialInformation.alias}
              />
            </div>
          </div>
         
        </div>

       
      </div>
    </>
  );
};


const ReputationBar = ({ reputation }) => {
  if (reputation == null) return null;

  const getReputationInfo = (score) => {
    if (score >= 90) return { color: "bg-green-600", label: "Buena", icon: "🌟" };
    if (score >= 70) return { color: "bg-yellow-400", label: "Aceptable", icon: "👍" };
    if (score >= 50) return { color: "bg-orange-400", label: "Regular", icon: "😐" };
    if (score >= 30) return { color: "bg-red-500", label: "Mala", icon: "⚠️" };
    if (score === 0) return { color: "bg-gray-400", label: "Sin reputación", icon: "❔" };
    return { color: "bg-red-900", label: "Basura", icon: "💩" };
  };
  const percentage = Math.max(0, Math.min(100, reputation));
  const { color, label, icon } = getReputationInfo(percentage);

 
  
  return (
    <div className="mt-13 w-full">
      <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
        <span className="flex items-center gap-2">
          <span>Reputacion </span>
          <span>{icon}</span>
          <strong>{label}</strong>
          
        </span>
        <span className="font-semibold">{reputation}</span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};


export const InformationItem = ({icon,label,value}) => {
  return (
    
    <div className='flex gap-1 p-1'> 
    <span className='flex flex-row items-center gap-2'>
      {icon}
    </span>
    <div className='flex gap-1'>
    <span className='flex flex-row items-center text-sm opacity-90'> {label}: </span>
    {
        value ? 
        <span className='flex flex-row items-center text-md font-bold opacity-70'>{value}</span> 
        : 
        <span className='flex flex-row items-center text-sm opacity-80'>No tiene {label}</span>
    }
    </div>
  </div>
  )
}

export default ClientHeader