import React,{ useEffect, useRef, useState } from "react";

const DropdownDefault = ({children ,right=false,left=false,className}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className={"relative flex "}>
      <button
        className={className ? className : 'text-[#3a3b3b] hover:text-body'}
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <svg
          className="fill-current"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.25 11.25C3.49264 11.25 4.5 10.2426 4.5 9C4.5 7.75736 3.49264 6.75 2.25 6.75C1.00736 6.75 0 7.75736 0 9C0 10.2426 1.00736 11.25 2.25 11.25Z"
            fill=""
          />
          <path
            d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z"
            fill=""
          />
          <path
            d="M15.75 11.25C16.9926 11.25 18 10.2426 18 9C18 7.75736 16.9926 6.75 15.75 6.75C14.5074 6.75 13.5 7.75736 13.5 9C13.5 10.2426 14.5074 11.25 15.75 11.25Z"
            fill=""
          />
        </svg>
      </button>
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
      /*   onBlur={() => setDropdownOpen(false)} */
        className={`absolute  bottom-4 ${left ? "left-5": ""}${right ? "right-5": ""}  z-40 w-40 space-y-1 rounded-sm border border-stroke bg-white p-1.5 shadow-default dark:border-strokedark dark:bg-boxdark ${
          dropdownOpen === true ? 'block' : 'hidden'
        }`}
      >
       {children}
      </div>
    </div>
  );
};

export default DropdownDefault;
