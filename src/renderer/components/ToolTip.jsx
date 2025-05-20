import React from "react";

const Tooltip = ({ text, children, position = "bottom" }) => {
  return (
    <div className="flex justify-center items-center ">
      <div className="relative group">
        {children}
        <div className={`absolute left-1/2 transform -translate-x-1/2 ${position === "bottom" ? "bottom-full mb-2" : position === "top" ? "top-full mt-2" : position === "left" ? "left-full ml-2" : "right-full mr-2"} w-max p-2 text-sm text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
          {text}
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
