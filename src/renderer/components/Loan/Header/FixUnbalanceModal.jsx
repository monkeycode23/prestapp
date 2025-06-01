import React, { useState } from 'react';
import Modal from '../../Modal';
import { useDispatch,useSelector } from 'react-redux';
import { updatePayment, deletePayment } from '../../../redux/reducers/payments';
import { adjustLoanAmount, adjustUnpaidInstallments, autoGenerateInstallments, completeRemainingInstallments } from './funcs';

const FixUnbalanceModal = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState('');

  const loans = useSelector(state=>state.loans)
  // Estrategia seleccionada por el usuario
  const [strategy, setStrategy] = useState('');

  const handleUpdate = () => {
   // const totalLoanAmount = 123123;

    // Aquí podrías hacer validaciones según la estrategia seleccionada
    if (!strategy) {
      setError('Seleccioná una estrategia para corregir el desbalance.');
      return;
    }

    if(strategy=="adjustLoanAmount")  adjustLoanAmount(loans.loan)
    if(strategy=="completeRemainingInstallments") completeRemainingInstallments(loans.loan)
    if(strategy=="adjustUnpaidInstallments")  adjustUnpaidInstallments(loans.loan)
    if(strategy=="autoGenerateInstallments") autoGenerateInstallments(loans.loan)
    
    // dispatch(updatePayment({ id: paymentId, strategy }));
    // onClose();
  };

  const handleDelete = () => {
    // dispatch(deletePayment(paymentId));
    // onClose();
  };

  return (
    <Modal
      button={
        <button className="p-1 bg-danger rounded-lg text-white">
          <svg
            className="fill-primary dark:fill-white inline"
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
          ajustar pagos

        </button>
      }
    >
      <h2 className="text-xl font-semibold mb-4">Corregir Incongruencia de pagos</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Estrategia de corrección:</label>
        <select
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Seleccionar estrategia...</option>
          <option value="adjustLoanAmount">Ajustar monto del préstamo a las cuotas existentes</option>
          <option value="completeRemainingInstallments">Completar cuotas restantes</option>
          <option value="adjustUnpaidInstallments">Ajustar monto de cuotas no pagas</option>
          <option value="autoGenerateInstallments">Autogenerar cuotas faltantes</option>
        </select>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Corregir
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Eliminar Pago
        </button>
      </div>
    </Modal>
  );
};

export default FixUnbalanceModal;
