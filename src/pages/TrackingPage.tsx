
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
import { supabase } from '@/integrations/supabase/client';

const TrackingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState(searchParams.get('number') || '');
  const [currentTracking, setCurrentTracking] = useState<string | null>(null);
  const [shipmentData, setShipmentData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const number = searchParams.get('number');
    if (number) {
      setTrackingNumber(number);
      handleTrackShipment(number);
    }
  }, [searchParams]);

  // Set up real-time subscription for shipment updates
  useEffect(() => {
    if (!currentTracking) return;

    const channel = supabase
      .channel('shipment-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shipments',
          filter: `tracking_number=eq.${currentTracking}`
        },
        () => {
          // Reload shipment data when it changes
          handleTrackShipment(currentTracking);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'tracking_history'
        },
        () => {
          // Reload shipment data when tracking history is updated
          handleTrackShipment(currentTracking);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentTracking]);

  const handleTrackShipment = async (number: string) => {
    try {
      setLoading(true);
      
      // Get shipment data from Supabase
      const { data: shipment, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('tracking_number', number)
        .single();

      if (error) {
        console.error('Error fetching shipment:', error);
        setShipmentData(null);
        setCurrentTracking(null);
        toast({
          title: "Shipment not found",
          description: "Please check your tracking number and try again.",
          variant: "destructive"
        });
        return;
      }

      // Get tracking history
      const { data: history, error: historyError } = await supabase
        .from('tracking_history')
        .select('*')
        .eq('shipment_id', shipment.id)
        .order('created_at', { ascending: true });

      if (historyError) {
        console.error('Error fetching tracking history:', historyError);
      }

      // Normalize the shipment data to match the existing component expectations
      const normalizedShipment = {
        id: shipment.id,
        trackingNumber: shipment.tracking_number,
        senderName: 'SkyNet Express',
        senderAddress: shipment.origin,
        senderCity: shipment.origin,
        senderPhone: '+1 (565) 310-4849',
        senderEmail: 'skyexness099@gmail.com',
        receiverName: shipment.customer_name,
        receiverAddress: shipment.destination,
        receiverCity: shipment.destination,
        receiverPhone: '',
        receiverEmail: shipment.customer_email,
        packageWeight: shipment.weight || 'N/A',
        weight: shipment.weight || 'N/A',
        packageDescription: shipment.value || 'Package',
        description: shipment.value || 'Package',
        serviceType: shipment.service,
        deliveryDays: shipment.delivery_days || 3,
        shippingFee: shipment.shipping_fee || 0,
        fee: shipment.shipping_fee || 0,
        status: shipment.status,
        currentLocation: shipment.current_location || 'Processing Center',
        estimatedDelivery: shipment.estimated_delivery,
        createdAt: shipment.created_at,
        statusHistory: history?.map(h => ({
          status: h.status,
          location: h.location,
          date: new Date(h.date).toLocaleDateString(),
          time: h.time,
        })) || [],
      };
      
      setShipmentData(normalizedShipment);
      setCurrentTracking(number);
      console.log('Found shipment:', normalizedShipment);
    } catch (error) {
      console.error('Error:', error);
      setShipmentData(null);
      setCurrentTracking(null);
      toast({
        title: "Error",
        description: "An error occurred while tracking the shipment.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
                    placeholder="Enter tracking number (e.g., SN123456789)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Tracking...' : 'Track'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {loading && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Tracking your shipment...</p>
              </CardContent>
            </Card>
          )}

          {currentTracking && shipmentData && !loading && (
            <div className="space-y-8">
              <LiveTracker shipmentData={shipmentData} />
              <ShipmentDetails shipmentData={shipmentData} />
            </div>
          )}

          {currentTracking && !shipmentData && !loading && (
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
