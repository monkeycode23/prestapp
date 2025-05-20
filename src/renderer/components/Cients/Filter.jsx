import React, { useEffect, useState } from "react";

import { useDispatch,useSelector } from "react-redux";
import { setFilter } from "../../redux/reducers/_pagination";

export default function ClientsFilter() {
  const dispatch = useDispatch();
  const pagination = useSelector((state) => state.pagination);
  
  useEffect(() => {
    // dispatch(setFilter(filter));
    const f = pagination.filter.nickname ?? undefined
    if(!f){
      dispatch(setFilter({
        nickname: "",
        cuotas: {
        expired: false,
        incomplete: false,
        pending: false,
        paid: false,
      },
      prestamos: {
        none:false,
        completed: false,
        canceled: false,
        active: false,
      },
      }));
    }
  }, []);

  return (
    <> 
      <div className="flex flex-col shadow-xl p-2 rounded-lg border border-stroke ">
        <h1 className="text-xl font-bold mb-3">Filtros</h1>

        <div className="flex flex-col mb-3">
          <h2 className="text-sm font-bold ">Nickname</h2>
          <div className="flex flex-col p-2">
            <input
              name="nickname"
              type="text"
              placeholder="ingrese el nickname"
              className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent p-1 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
              onChange={(e) => {
                dispatch(setFilter({
                  ...pagination.filter,
                  nickname: e.target.value,
                }));
              }}
              defaultValue={pagination.filter?.nickname}
              value={pagination.filter?.nickname}
            />
          </div>
        </div>

        <StateFilter />
      </div>
    </>
  );
}

export function StateFilter() {

  const pagination = useSelector((state) => state.pagination);
  const dispatch = useDispatch();

  const [filterState, setFilterState] = useState({
    expired: false,
    incomplete: false,
    pending: false,
    paid: false,
  });

  function toggle(state) {
    setFilterState({ ...filterState, [state]: !filterState[state] });
    dispatch(setFilter({
      ...pagination.filter,
      cuotas: {
        ...pagination.filter.cuotas,
        [state]: !pagination.filter.cuotas[state],
      },
    }));
  }

  return (
    <div className="flex flex-col mb-3">
      <h2 className="text-sm font-bold">Cuotas</h2>
      <div className="flex flex-col justify-start items-start p-2">
        <button
          onClick={() => toggle("expired")}
          className={`p-1 w-full text-left text-danger rounded-lg
            ${pagination.filter.cuotas?.expired ? "bg-danger text-white" : " text-gray-500"}
            `}
        >
          Vencidas
        </button>
        <button
          onClick={() => toggle("incomplete")}
          className={`p-1 w-full text-left text-warning rounded-lg
            ${pagination.filter.cuotas?.incomplete ? "bg-warning text-white" : " text-gray-500"}
            `}
        >
          Incompletas
        </button>
        <button
          onClick={() => toggle("pending")}
          className={`p-1 w-full text-left text-primary rounded-lg
                ${
                  pagination.filter.cuotas?.pending
                    ? "bg-primary text-white"
                    : " text-gray-500"
                }
            `}
        >
          Pendientes
        </button>
        <button
          onClick={() => toggle("paid")}
          className={`p-1 w-full text-left text-success rounded-lg
                ${
                  pagination.filter.cuotas?.paid
                    ? "bg-success text-white"
                    : " text-gray-500"
                }
            `}
        >
          Pagadas
        </button>
      </div>
    </div>
  );
}
