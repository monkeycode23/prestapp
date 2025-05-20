import React,{useState,useEffect} from "react";
import { PaymentIcon, UserIcon } from "../../components/Icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setItem,deleteItem } from "../../redux/reducers/selected";
import  Tooltip  from "../../components/Tooltip";
import DropdownDefault from "../../components/Dropdowns/DropdownDefault";
import { DeleteIcon } from "../../components/Icons";

export const ClientCard = ({ client }) => {
  const { nickname, id } = client;
  const dispatch = useDispatch();
  const selected = useSelector((state) => state.selected.selectAll);
  const items = useSelector((state) => state.selected.items);
  const [isSelected, setIsSelected] = useState(selected);

  useEffect(() => {
    setIsSelected(selected);
  }, [selected]);

  return (
    <div 
      onClick={(e) => {
        const isCtrlPressed = e.ctrlKey || e.metaKey;
        if(isCtrlPressed) {
          setIsSelected(!isSelected);
          if(!isSelected) {
            dispatch(setItem({item:client}));
          } else {
            dispatch(deleteItem({id:client.id}));
          }
        }
      }}
      className={`max-w-sm bg-primary shadow-lg text-white rounded-lg p-4 border transition-all duration-300
        ${isSelected ? 'border-4 border-success' : 'border border-gray-200'}`}
    >
      {/* Header con indicadores */}
      <div className="flex justify-end items-center mb-4">
        <div className="flex gap-1">
        { (
             <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary">
             <PaymentIcon className="w-3 h-3" />
           </div>
          )}
          {client.total_expired_payments > 0 && (
            <Tooltip text={`Pagos vencidos: ${client.total_expired_payments}`} position="left">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-danger text-white">
                <PaymentIcon className="w-3 h-3" />
              </div>
            </Tooltip>
          )}
          {client.total_incomplete_payments > 0 && (
            <Tooltip text={`Pagos incompletos: ${client.total_incomplete_payments}`} position="left">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-warning text-white">
                <span className="text-xs font-bold">{client.total_incomplete_payments}</span>
              </div>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col items-center">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-3">
          <UserIcon className="w-8 h-8 text-primary" />
        </div>

        {/* Nombre del cliente */}
        <Link to={`/clients/${id}`}>
          <h3 className="text-lg font-semibold text-white text-center mb-4">
            {nickname}
          </h3>
        </Link>

        {/* Divider */}
        <div className="w-full border-t border-gray-200/30 my-3"></div>

        {/* Botón de acción */}
        <Link 
          to={`/clients/${id}`}
          className="text-center text-sm text-white/80 hover:text-white transition-colors"
        >
          Ver cliente
        </Link>
      </div>
    </div>
  );
};

export default ClientCard