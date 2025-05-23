import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const AgriPigNetwork = () => {
  const cards = [
    {
      title: "Result",
      description: "Calculate results for existing farm or apply a benchmark.",
      imageUrl: "/images/results-icon.png",
      imageAlt: "Results illustration"
    },
    {
      title: "List of existing farms",
      description: "Select an existing farm to perform an update or to carry out a scenario.",
      imageUrl: "/images/farms-icon.png",
      imageAlt: "Farm list illustration"
    },
    {
      title: "New Farm",
      description: "Create a new farm.",
      imageUrl: "/images/new-farm-icon.png",
      imageAlt: "New farm illustration"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-left mb-12">
        Welcome to the agri benchmark Pig Network
      </h1>
      
      <div className="flex flex-col gap-8">
        {cards.map((card, index) => (
          <Card key={index} className="p-6">
            <div className="flex gap-6">
              <div className="flex-shrink-0 relative">
                <Image
                  src={card.imageUrl}
                  alt={card.imageAlt}
                  width={160}
                  height={160}
                  className="rounded object-cover"
                />
              </div>
              
              <div className="flex flex-col justify-center">
                <h2 className="text-xl font-semibold mb-4">{card.title}</h2>
                <p className="text-gray-600 mb-6">{card.description}</p>
                <Button className="w-fit">
                  Proceed
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AgriPigNetwork;