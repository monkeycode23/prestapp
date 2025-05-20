import React, { useState } from 'react';

const Tabs = ({tabs}) => {
  // Estado para controlar qué tab está activa
  const [activeTab, setActiveTab] = useState(0);

  // Definición de las tabs y el contenido
  /* const tabs = [
    { name: 'Tab 1', content: 'Contenido de la Tab 1' },
    { name: 'Tab 2', content: 'Contenido de la Tab 2' },
    { name: 'Tab 3', content: 'Contenido de la Tab 3' },
  ]; */

  return (
    <div className="w-full max-w-md mx-auto mt-5">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 text-sm font-medium text-gray-600 rounded-t-lg ${
              activeTab === index
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-200'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 mt-2 bg-white rounded-b-lg shadow-md">
        {tabs[activeTab].content}
        
      </div>
    </div>
  );
};

export default Tabs;
