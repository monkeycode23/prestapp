import React, { useState, useEffect } from 'react';



const CardsLayout = () => {



  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('')


   useEffect(()=>{

   },[page,search,filter])

  function changePage(page) {
    setPage(page)
  }

  return (
    <>
      
        
        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">

          <div className="col-span-12 xl:col-span-12">
  
          </div>
          <div className="flex justify-between col-span-12 xl:col-span-12 bg-white p-5">
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
            <Pagination currentPage={page} totalPages={totalPages} changePage={changePage}></Pagination>

          </div>
          <div className="col-span-6 xl:col-span-4">

            { <ClientCard /> }
            

          </div>
          <div className="col-span-6 xl:col-span-8">

             <LoansList  /> 
          </div>
          {/* <ChatCard /> */}
        </div>
    

    </>
  );
};







export default Client;