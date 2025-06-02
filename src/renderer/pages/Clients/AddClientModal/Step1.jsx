import React, { useState, useEffect } from "react";
import { useGuide } from "../../../components/GuidedForm/GuidedForm";
import { useDispatch } from "react-redux";
import { addClient } from "../../../redux/reducers/clients";
import {useNotification} from "../../../components/Notifications";
import {useModal} from "../../../components/Modal";
import clientsService from "../../../services/clientsService";
function Step1() {
  const {
    formData,
    disableNext,
    nextStep,
    handleChange,
    enableNext,
    registerOnNext,
    validate,
    setField,
  } = useGuide();
  const dispatch = useDispatch();
  const [isValid, setIsValid] = useState(true);
  const { setNotification,showNotification } = useNotification();
  const {toggleModal} = useModal();

  useEffect(() => {
    const init = async () => {
      enableNext();
      // Registra el callback para este paso
      registerOnNext(async () => {
        console.log("Callback ejecutado desde Step1");

        const errors = await validate({
          nickname: {
            required: {
              param: true,
              message: "Este campo es requerido para avanzar",
            },
            minLength: {
              param: 3,
              message: "No puede ser menor a 3",
            },
            maxLength: {
              param: 30,
              message: "No puede ser mayor a 30",
            },
          },
        });

        if (!errors) {
          console.log(errors,"Asdasd")
          const client = await window.database.models.Clients.getClient({
            where: "nickname=?",
            params: [formData.nickname.value],
          });
          if (client.length > 0) {
            setField({
              type: "error",
              field: "nickname",
              error: "Ya existe un cliente con ese nombre",
            });
          }
        } else {
          console.log("acta")
          let codigoAcceso;
          let isUnique = false;
          while (!isUnique) {
            codigoAcceso = String(Math.floor(10000 + Math.random() * 90000));
            const existingClient =
              await window.database.models.Clients.getClient({
                where: `access_code='${codigoAcceso}'`,
              });
            console.log(existingClient);
            //Cliente.findOne({ codigoAcceso });
            if (!existingClient.length) {
              isUnique = true;
            }
          }
          const clientMap = {
            nickname: formData.nickname.value,
            //user_id:1,
            codigoAcceso,
            name: formData.name.value,
            lastname: formData.lastname.value,
            email: formData.email.value,
            address: formData.address.value,
            phone: formData.phone.value,
            status: "activo",
            gender: "masculino",
            birthdate: formData.birthdate.value,
            document_id: formData.document_id.value,
            cbu: formData.cbu.value,
            alias: formData.alias.value,
          };
          await window.database.models.Clients.createClient({
            nickname: formData.nickname.value,
            user_id: 1,
            access_code: codigoAcceso,
          });

          const client = await window.database.models.Clients.getClientLastId();

         // console.log("client-------------->", client);
          const information = {
            id: client[0].id,
            name: formData.name.value,
            lastname: formData.lastname.value,
            email: formData.email.value,
            address: formData.address.value,
            phone: formData.phone.value,
            status: "activo",
            gender: "masculino",
            birthdate: formData.birthdate.value,
            document_id: formData.document_id.value,
            cbu: formData.cbu.value,
            alias: formData.alias.value,
          };
          await window.database.models.Information.createInformation(
            information
          );

          dispatch(
            addClient({
              ...information,
              nickname: formData.nickname.value,
            })
          );

          /* if(navigator.onLine){
            const mongoClient= await window.mongo.create("Cliente",{...clientMap,sqlite_id:client[0].id})
            console.log(mongoClient)
            
           } */

          /**
           *TODO: agregar llamada api para agregar un cliente
           */
          try{
            const response = await clientsService.createClient({...clientMap,sqlite_id:client[0].id});
            console.log(response,"response")
          }catch(error){
            console.log(error,"error")
          }

          await window.database.models.ActivityLog.createActivity({
            action_type: "CREATE",
            entity: "clients",
            entity_id: client[0].id,
            payload: JSON.stringify(clientMap),
            synced: navigator.onLine ? 1 : 0,
          });

          setNotification({
            message: "Cliente creado correctamente",
            type: "success",
          });

          showNotification();
          toggleModal();
        }
      });
    };

    init();
  }, [registerOnNext]);

  useEffect(() => {
    //disableNext()
    return () => {};
  }, []);

  return (
    <div className="">
      <div className="mb-6">
        <label className="mb-2.5 block bold text-center mb-3 text-lg text-black dark:text-white">
          Coloca el nickname del cliente
        </label>
        <div className="relative">
          <input
            value={formData.nickname.value}
            onChange={(e) => {
              setField({
                type: "set",
                field: "nickname",
                value: e.target.value,
              });
            }}
            //onChange={(e)=>setField({type:"set",field:"password",value:e.target.value})}
            name="nickname"
            type="text"
            placeholder="ingrese el nombre del cliente"
            // defaultValue={fields.password.value}
            // value={fields.password.value}
            className={`w-full rounded-lg border border-stroke ${
              formData.nickname.error ? "border-red" : ""
            }  focus:text-black bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
          />
          <p className="text-center text-red ">
            {formData.nickname.error ? formData.nickname.error : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Step1;
