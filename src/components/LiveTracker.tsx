
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Truck, Plane, Ship, Clock, Package } from 'lucide-react';

interface LiveTrackerProps {
  shipmentData: any;
}

const LiveTracker: React.FC<LiveTrackerProps> = ({ shipmentData }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [animationProgress, setAnimationProgress] = useState(0);

  const steps = [
    { 
      id: 'dispatched', 
      title: 'Package Dispatched', 
      icon: Package, 
      location: shipmentData.senderAddress,
      description: 'Your package has been picked up and is being prepared for transit'
    },
    { 
      id: 'in-transit', 
      title: 'In Transit', 
      icon: shipmentData.serviceType === 'air' ? Plane : shipmentData.serviceType === 'ocean' ? Ship : Truck,
      location: 'En Route',
      description: 'Package is on its way to the destination'
    },
    { 
      id: 'sorting', 
      title: 'At Sorting Center', 
      icon: MapPin, 
      location: 'Distribution Hub',
      description: 'Package is being sorted at our distribution center'
    },
    { 
      id: 'out-delivery', 
      title: 'Out for Delivery', 
      icon: Truck, 
      location: 'Near Destination',
      description: 'Package is out for final delivery'
    },
    { 
      id: 'delivered', 
      title: 'Delivered', 
      icon: Package, 
      location: shipmentData.receiverAddress,
      description: 'Package has been successfully delivered'
    }
  ];

  useEffect(() => {
    // Simulate shipment progress based on creation date and delivery days
    const createdDate = new Date(shipmentData.createdAt);
    const now = new Date();
    const daysPassed = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalDays = shipmentData.deliveryDays;
    
    let progressStep = Math.min(Math.floor((daysPassed / totalDays) * steps.length), steps.length - 1);
    
    // If it's a new shipment (less than 1 day), show at least dispatched
    if (daysPassed === 0) progressStep = 0;
    
    setCurrentStep(progressStep);
    
    // Calculate animation progress within current step
    const stepProgress = Math.min(((daysPassed / totalDays) * steps.length) % 1, 1);
    setAnimationProgress(stepProgress);
  }, [shipmentData]);

  const getEstimatedDelivery = () => {
    const createdDate = new Date(shipmentData.createdAt);
    const deliveryDate = new Date(createdDate.getTime() + (shipmentData.deliveryDays * 24 * 60 * 60 * 1000));
    return deliveryDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardTitle className="flex items-center text-2xl">
          <MapPin className="w-6 h-6 mr-3" />
          Live Tracking - {shipmentData.trackingNumber}
        </CardTitle>
        <p className="text-blue-100">
          Estimated Delivery: {getEstimatedDelivery()}
        </p>
      </CardHeader>
      
      <CardContent className="p-8">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="relative">
            <div className="absolute top-6 left-0 w-full h-1 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${((currentStep + animationProgress) / (steps.length - 1)) * 100}%` }}
              />
            </div>
            
            <div className="relative flex justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
                const isUpcoming = index > currentStep;
                
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                        isCompleted 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : isCurrent 
                            ? 'bg-blue-500 border-blue-500 text-white animate-pulse' 
                            : 'bg-gray-200 border-gray-200 text-gray-400'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="mt-3 text-center max-w-24">
                      <p className={`text-sm font-medium ${
                        isCompleted || isCurrent ? 'text-gray-800' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </p>
                      {isCurrent && (
                        <p className="text-xs text-blue-600 mt-1 font-semibold">
                          Current Status
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Current Status Details */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-start">
            <div className="bg-blue-600 p-3 rounded-full mr-4">
              {React.createElement(steps[currentStep].icon, { className: "w-6 h-6 text-white" })}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {steps[currentStep].title}
              </h3>
              <p className="text-gray-600 mb-2">
                {steps[currentStep].description}
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{steps[currentStep].location}</span>
                <Clock className="w-4 h-4 ml-4 mr-1" />
                <span>Updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Route Animation */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold mb-4">Shipment Route</h4>
          <div className="relative bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                <p className="text-sm font-medium">Origin</p>
                <p className="text-xs text-gray-500">{shipmentData.senderCity}</p>
              </div>
              
              <div className="flex-1 relative mx-8">
                <div className="h-1 bg-gray-300 rounded-full relative overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-2000 ease-out"
                    style={{ width: `${((currentStep + animationProgress) / (steps.length - 1)) * 100}%` }}
                  />
                </div>
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center transition-all duration-2000 ease-out"
                  style={{ left: `${((currentStep + animationProgress) / (steps.length - 1)) * 100}%`, transform: 'translate(-50%, -50%)' }}
                >
                  {React.createElement(steps[currentStep].icon, { className: "w-3 h-3 text-white" })}
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2"></div>
                <p className="text-sm font-medium">Destination</p>
                <p className="text-xs text-gray-500">{shipmentData.receiverCity}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveTracker;
