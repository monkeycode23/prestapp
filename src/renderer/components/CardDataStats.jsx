import React, { ReactNode } from 'react';



const CardDataStats = ({
  title,
  total,
  rate,
  levelUp,
  levelDown,
  children,
}) => {
  return (
    <div className="rounded-lg border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark transition-all duration-300 hover:shadow-lg hover:border-primary">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4 transition-colors duration-300 hover:bg-primary hover:text-white">
        {children}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white mb-1">
            {total}
          </h4>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</span>
        </div>

        <span
          className={`flex items-center gap-1 text-sm font-medium ${
            levelUp && 'text-meta-3'
          } ${levelDown && 'text-meta-5'} `}
        >
        
        </span>
      </div>
    </div>
  );
};

export default CardDataStats;
