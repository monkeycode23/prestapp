import React, { useState } from "react";

//components
import Modal from "../../../components/Modal";




//hooks
import { useModal } from "../../../components/Modal";
import { useNotification } from "../../../components/Notifications";
import { DeleteIcon } from "../../../components/Icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


//redux
import { deleteLoan } from "../../../redux/reducers/loans";

//funcs




function DeleteLoanModal({ loan }) {
  const { setNotification, showNotification } = useNotification();
  const dispatch = useDispatch();
  return (
    <Modal
      title={"Pagar cuota"}
      button={
        <button className="text-red-500 font-bold hover:text-red-300">
          <DeleteIcon className="w-6 h-6 p-1 rounded-full bg-red-500 text-white"></DeleteIcon>
        </button>
      }
    >
      <FormModal></FormModal>
    </Modal>
  );
}

function FormModal() {
  //console.log(payment)
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const {setNotification,showNotification} = useNotification();
  const loan = useSelector((state) => state.loans.loan);
  const client = useSelector((state) => state.clients.client);

  const {toggleModal} = useModal();
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col gap-2 ">
      <h1 className="text-center text-xl font-bold">Estas Seguro que deseas borrrar este prestamo?</h1>

      <div className="flex flex-row gap-2 justify-center">
        <button
        onClick={() => {

            window.database.models.Loans.deleteLoan(loan.id)
            
            dispatch(deleteLoan({id:loan.id}))

            setNotification({
              message: "Cliente borrado correctamente",
              type: "success",
            });

            showNotification()

            navigate("/clients/"+client.id)
            
        }}

        
        className="bg-red-500 text-white p-2 rounded-md border border-gray-300 ">
          Borrar
        </button>
        <button className="bg-green-500 text-white p-2 rounded-md border border-gray-300 ">
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default DeleteLoanModal;

//console.log(`Pagando ${payment.nickname}`);
//console.log(payment)
//console.log(payment.paymentId)
