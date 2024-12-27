import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FarmResultPage = () => {
  const sections = [
    {
      title: "Results",
      description: "Calculate results for existing farm or apply a benchnark",
      options: [
        "Individual Farm",
        "Change according to template"
      ]
    },
    
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        agri benchmark Pig
      </h1>
      
      <div className="space-y-8">
        {sections.map((section, index) => (
          <Card key={index} className="p-6">
            <h2 className="text-xl font-semibold mb-2">
              {section.title}
            </h2>
            <p className="text-gray-600 mb-6">
              {section.description}
            </p>
            
            <Card className="p-4">
              <div className="space-y-4">
                {section.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex justify-between items-center">
                    <span className="text-lg">{option}</span>
                    <Button>Select</Button>
                  </div>
                ))}
              </div>
            </Card>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FarmResultPage;