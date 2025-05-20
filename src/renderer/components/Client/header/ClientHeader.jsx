import React from 'react'
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

const ClientHeader = () => {
    const client = useSelector(state => state.clients.client)
    const information = useSelector(state => state.information)
    const loans = useSelector(state => state.loans.loans)

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
                            formatter: () => loans.length
                        }
                    }
                }
            }
        }
    };

    const chartSeries = loanData.map(item => item.value);

    return (
        <div className='client-header grid grid-cols-12 grid-rows-1 grid-rows-auto gap-5 bg-white p-4 rounded-lg border border-gray-200 rounded-md mt-5'>
            <div className='h-200 xl:col-span-3  xsm:col-span-12 sm:col-span-12 md:col-span-3 row-span-2  flex flex-col gap-2  items-center'>
                <span className='w-full text-sm text-gray-500 flex flex-row items-center justify-start gap-2'>
                    <DeleteClientModal client={client}></DeleteClientModal>
                </span>
                <h1 className=' text-2xl font-bold rounded-full bg-blue-500 text-white p-2 border border-gray-300 p-5'>
                    <UserIcon className='w-10 h-10' />
                </h1>
                <h1 className='text-xl text-gray-600 font-bold'>{client.nickname}</h1>

                <AddLoanModal client={client}
                    button={
                        <button className='mt-4 bg-primary text-white p-2 rounded-xl border border-gray-300 font-bold'>
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
            </div>

            <div className='xl:col-span-4 xl:block md:hidden xsm:col-span-12 sm:col-span-12 md:col-span-12 row-span-2'>
                {loans.length > 0 && (
                    <div className="w-full h-[300px]">
                        <ReactApexChart
                            options={chartOptions}
                            series={chartSeries}
                            type="donut"
                            height="100%"
                        />
                    </div>
                )}
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

export const InformationItem = ({icon,label,value}) => {
  return (
    
    <div className='flex gap-1 p-1'> 
    <span className='flex flex-row items-center gap-2'>
      {icon}
    </span>
    <div className='flex gap-1'>
    <span className='flex flex-row items-center text-sm opacity-90'>{label}: </span>
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