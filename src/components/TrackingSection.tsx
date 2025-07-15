
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Package, Truck, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const TrackingSection = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const navigate = useNavigate();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      toast({
        title: "Please enter a tracking number",
        variant: "destructive"
      });
      return;
    }
    navigate(`/tracking?number=${encodeURIComponent(trackingNumber.trim())}`);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Track Your Shipment
            </h2>
            <p className="text-xl text-gray-600">
              Enter your tracking number below to get real-time updates on your package
            </p>
          </div>

          <Card className="mb-12 shadow-xl">
            <CardHeader className="bg-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-2xl">
                <Package className="w-6 h-6 mr-3" />
                Quick Track
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleTrack} className="space-y-6">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter your tracking number (e.g., SP123456789)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="text-lg py-6 pl-12 pr-4"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                
                <Button type="submit" size="lg" className="w-full text-lg py-6">
                  <Truck className="w-5 h-5 mr-2" />
                  Track Package
                </Button>
              </form>
              
              <div className="mt-6 text-center text-sm text-gray-600">
                <p>Need help? Contact us at <strong>skyexpressdelivery@gmail.com</strong></p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Real-Time Updates</h3>
              <p className="text-gray-600 text-sm">Get instant notifications about your package status</p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Live Location</h3>
              <p className="text-gray-600 text-sm">See exactly where your package is on the map</p>
            </div>
            
            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <div className="bg-orange-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Delivery Estimates</h3>
              <p className="text-gray-600 text-sm">Know exactly when to expect your delivery</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrackingSection;
