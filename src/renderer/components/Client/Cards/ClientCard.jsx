import React from "react";
import { Link } from "react-router-dom";
import {
  PaymentIcon,
  UserIcon,
  SackDollar,
  StarIcon,
} from "../../Icons";

const getReputationInfo = (score) => {
  if (score >= 90) return { color: "bg-green-600", label: "Buena" };
  if (score >= 70) return { color: "bg-yellow-400", label: "Aceptable" };
  if (score >= 50) return { color: "bg-orange-400", label: "Regular" };
  if (score >= 30) return { color: "bg-red-500", label: "Mala" };
  console.log(score)
  if(score==0) return 'sin reputacion'
  return { color: "bg-red-900", label: "Basura" };
};

const ClientCard = ({ client }) => {
  const reputation = getReputationInfo(client.reputation || 0);

  const renderPaymentStat = (count, bgColor, tooltip) => (
    <div className="flex flex-col items-center text-white" title={tooltip}>
      <PaymentIcon
        className={`${bgColor} rounded-full p-1 mb-1 cursor-help`} // cursor para indicar tooltip
        width={20}
        height={20}
      />
      <span className="font-semibold text-sm">{count}</span>
    </div>
  );

  return (
    <div className="flex justify-between items-start bg-primary p-4 rounded-2xl shadow-xl relative">
      {/* Izquierda: avatar, nombre, reputación */}
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center">
          <div
            className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center"
            title={`Reputación del cliente: ${client.reputation || 0}`}
          >
            <UserIcon />
          </div>

          {/* Reputación */}
          <div className="mt-2 flex flex-col items-center cursor-help" title={`Reputación del cliente: ${client.reputation || 0}`}>
            <div className="flex items-center gap-1 text-white text-sm">
              <StarIcon className="text-yellow-300" width={14} height={14} />
              <span>{reputation.label}</span>
            </div>
            <span className="text-white/70 text-xs font-mono mt-1">
              {client.reputation || 0}
            </span>
            <div className="w-20 h-2 rounded-full bg-white/30 mt-1 overflow-hidden">
              <div
                className={`${reputation.color} h-full`}
                style={{ width: `${client.reputation || 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Nombre y pagos */}
        <div className="flex flex-col justify-between">
          <Link
            to={`/clients/${client.id}`}
            className="text-md font-bold text-white "
          >
            {client.nickname}
          </Link>

          <div className="mt-3 flex gap-3">
            {renderPaymentStat(client.total_expired_payments ?? 0, "bg-danger", "Pagos vencidos")}
            {renderPaymentStat(client.total_paid_payments ?? 0, "bg-success", "Pagos pagados")}
            {renderPaymentStat(client.total_pending_payments ?? 0, "bg-primary border border-white", "Pagos pendientes")}
            {renderPaymentStat(client.total_incomplete_payments ?? 0, "bg-warning", "Pagos incompletos")}
          </div>

          <div className="mt-4 flex items-center gap-2 text-white text-sm">
            <span className="font-semibold">Próximo pago:</span>
            <span className="opacity-90">
              {client.next_payment_date || "Sin fecha"}
            </span>
          </div>
        </div>
      </div>

      {/* Derecha: préstamos compactos */}
      <div
        className="flex flex-col items-center bg-white text-black rounded-lg p-1 shadow-md cursor-help"
        title="Préstamos"
      >
        <SackDollar className="text-primary" width={24} height={24} />
        <div className="mt-1 text-sm font-semibold">
          {client.total_completed_loans ?? 0} / {client.total_loans}
        </div>
        <div className="flex flex-col justify-center items-center text-xs text-gray-700">
          {client.total_active_loans ?? 0} 
          <span>activos</span>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;
