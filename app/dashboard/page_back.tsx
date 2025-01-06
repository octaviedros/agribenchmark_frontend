'use client';

import { useRouter } from 'next/navigation';


const NetworkSelection = () => {
  const router = useRouter();

  const handleSectorClick = (sector: string) => {
    router.push(`dashboard/${sector.toLowerCase().replace(/ /g, '-')}`);
  };

  const sectors = [
    ['Pig', 'Beef and Sheep', 'Cash Crop'],
    ['Poultry', 'Horticulture', 'Fish']
  ];


  return (
    <div className="p-14 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          agri benchmark App
        </h1>
        <h2 className="text-2xl text-gray-700">
          Network Selection
        </h2>
      </div>

      {/* Grid Section */}
      <div className="grid gap-6">
        {sectors.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-3 gap-6">
            {row.map((sector) => (
              <button
                key={sector}
                onClick={() => handleSectorClick(sector)}
                className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="text-xl font-medium text-gray-800">
                  {sector}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkSelection;