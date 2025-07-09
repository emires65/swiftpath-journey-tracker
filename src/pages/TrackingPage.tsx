
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LiveTracker from '../components/LiveTracker';
import ShipmentDetails from '../components/ShipmentDetails';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Package } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const TrackingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState(searchParams.get('number') || '');
  const [currentTracking, setCurrentTracking] = useState<string | null>(null);
  const [shipmentData, setShipmentData] = useState<any>(null);

  useEffect(() => {
    const number = searchParams.get('number');
    if (number) {
      setTrackingNumber(number);
      handleTrackShipment(number);
    }
  }, [searchParams]);

  const handleTrackShipment = (number: string) => {
    // Get shipment data from localStorage
    const savedShipments = JSON.parse(localStorage.getItem('shipments') || '[]');
    const shipment = savedShipments.find((s: any) => s.trackingNumber === number);
    
    if (shipment) {
      // Normalize the shipment data to ensure consistent field names
      const normalizedShipment = {
        ...shipment,
        weight: shipment.weight || shipment.packageWeight,
        description: shipment.description || shipment.packageDescription,
        fee: shipment.fee || shipment.shippingFee,
      };
      
      setShipmentData(normalizedShipment);
      setCurrentTracking(number);
      console.log('Found shipment:', normalizedShipment);
    } else {
      setShipmentData(null);
      setCurrentTracking(null);
      toast({
        title: "Shipment not found",
        description: "Please check your tracking number and try again.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      toast({
        title: "Please enter a tracking number",
        variant: "destructive"
      });
      return;
    }
    
    setSearchParams({ number: trackingNumber.trim() });
    handleTrackShipment(trackingNumber.trim());
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Track Your Shipment
            </h1>
            <p className="text-xl text-gray-600">
              Enter your tracking number to see real-time updates
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-6 h-6 mr-2" />
                Enter Tracking Number
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex gap-4">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="Enter tracking number (e.g., SP123456789)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <Button type="submit">Track</Button>
              </form>
            </CardContent>
          </Card>

          {currentTracking && shipmentData && (
            <div className="space-y-8">
              <LiveTracker shipmentData={shipmentData} />
              <ShipmentDetails shipmentData={shipmentData} />
            </div>
          )}

          {currentTracking && !shipmentData && (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Shipment Not Found
                </h3>
                <p className="text-gray-600">
                  We couldn't find a shipment with tracking number: <strong>{currentTracking}</strong>
                </p>
                <p className="text-gray-500 mt-2">
                  Please check the number and try again, or contact our support team.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TrackingPage;
