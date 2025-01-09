import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FarmListPage = () => {
  const farms = [
    "DE23_200_6300",
    "DE23_500_15k",
    "DE24_200_6300",
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        agri benchmark Pig
      </h1>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-2">
          List of existing farms
        </h2>
        <p className="text-gray-600 mb-6">
          Select an existing farm to perform an update or to carry out a scenario
        </p>
        
        <Card className="p-4">
          <div className="space-y-4">
            {farms.map((farm, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-lg">{farm}</span>
                <Button>Select</Button>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Space for additional content */}
        <div className="min-h-32"></div>
      </Card>
    </div>
  );
};

export default FarmListPage;