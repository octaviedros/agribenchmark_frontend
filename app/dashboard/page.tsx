'use client'
import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

const NetworkSelection = () => {
  const networks = [
    { name: 'Pig', path: '/dashboard/pig' },
    { name: 'Beef and Sheep', path: '/dashboard/beef-sheep' },
    { name: 'Cash Crop', path: '/dashboard/cash-crop' },
    { name: 'Poultry', path: '/dashboard/poultry' },
    { name: 'Horticulture', path: '/dashboard/horticulture' },
    { name: 'Fish', path: '/dashboard/fish' }
  ];

  return (
    <div className="p-8">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">agri benchmark App</h1>
        <h2 className="text-xl mt-2">Network Selection</h2>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-6 mt-12">
          {networks.map((network) => (
            <Link key={network.name} href={network.path}>
              <Card className="p-6 hover:bg-gray-100 cursor-pointer transition-colors">
                <span className="text-lg font-medium block text-center">{network.name}</span>
              </Card>
           </Link>
          ))}
         </div>
      </div>
    </div>
  );
};

export default NetworkSelection;