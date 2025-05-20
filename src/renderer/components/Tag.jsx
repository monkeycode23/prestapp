import React from "react"

  function Tag({label="test",type="primary",title="",icon=""}) {

    return (<span title={title} className={`h-7  flex items-center justify-center
      ${type=="primary" ?"bg-primary  ":""}
          ${type=="warning" ?"bg-warning ":""}
          ${type=="danger" ? "bg-danger ":""}
          ${type=="danger2" ? "bg-red-500 ":""}
          ${type=="success" ? "bg-success ":""}
           ${type=="success2" ? "bg-green-500 ":""}
            ${type=="success3" ? "bg-green-700 ":""}
          text-white rounded-md p-1 text-sm mr-1 
      `}> {label}</span>)
  }


  export  default Tag