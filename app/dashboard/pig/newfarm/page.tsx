"use client"

import React from "react";
import { Card } from "@/components/ui/card";

export default function NewFarmPage() { 
return (
  <div className="container mx-auto px-4 py-8">
  <h1 className="text-3xl font-bold mb-8">
    agri benchmark Pig
  </h1>
  
  <Card className="p-6">
    <h2 className="text-xl font-semibold mb-2">
      Create a new farm
    </h2>

    <Card className="p-7">
    <h2 className="text-0,5xl font-medium mb-2">
      Wie sieht ihr Betrieb aus? </h2>
  </Card>
  <div className="min-h-32"></div>
  </Card>
</div>
);
}