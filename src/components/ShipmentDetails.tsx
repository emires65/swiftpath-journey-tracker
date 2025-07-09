
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, Package, Weight, Calendar, DollarSign, Clock, Truck } from 'lucide-react';

interface ShipmentDetailsProps {
  shipmentData: any;
}

const ShipmentDetails: React.FC<ShipmentDetailsProps> = ({ shipmentData }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'dispatched': return 'bg-yellow-500';
      case 'in transit': return 'bg-blue-500';
      case 'at sorting center': return 'bg-orange-500';
      case 'out for delivery': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'air': return '✈️';
      case 'ocean': return '🚢';
      case 'ground': return '🚛';
      default: return '📦';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Shipment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-6 h-6 mr-2" />
            Shipment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-700">Tracking Number:</span>
            <Badge variant="outline" className="text-lg font-mono">
              {shipmentData.trackingNumber}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <Weight className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Weight</p>
                <p className="font-semibold">{shipmentData.weight || shipmentData.packageWeight} kg</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <Truck className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Service Type</p>
                <p className="font-semibold capitalize">
                  {getServiceIcon(shipmentData.serviceType)} {shipmentData.serviceType}
                </p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-purple-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-purple-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Shipping Fee</p>
                <p className="font-semibold">${shipmentData.fee || shipmentData.shippingFee}</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-orange-50 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Delivery Time</p>
                <p className="font-semibold">{shipmentData.deliveryDays} days</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-gray-600 mr-2" />
              <span className="font-medium text-gray-700">Created:</span>
            </div>
            <p className="text-gray-600">
              {new Date(shipmentData.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-6 h-6 mr-2" />
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sender Information */}
          <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
            <div className="flex items-center mb-3">
              <User className="w-5 h-5 text-green-600 mr-2" />
              <h4 className="font-semibold text-green-800">Sender</h4>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-gray-800">{shipmentData.senderName}</p>
              <p className="text-gray-600">{shipmentData.senderAddress}</p>
              <p className="text-gray-600">{shipmentData.senderCity}</p>
              {shipmentData.senderPhone && (
                <p className="text-gray-600">📞 {shipmentData.senderPhone}</p>
              )}
            </div>
          </div>

          {/* Receiver Information */}
          <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-3">
              <User className="w-5 h-5 text-blue-600 mr-2" />
              <h4 className="font-semibold text-blue-800">Receiver</h4>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-gray-800">{shipmentData.receiverName}</p>
              <p className="text-gray-600">{shipmentData.receiverAddress}</p>
              <p className="text-gray-600">{shipmentData.receiverCity}</p>
              {shipmentData.receiverPhone && (
                <p className="text-gray-600">📞 {shipmentData.receiverPhone}</p>
              )}
            </div>
          </div>

          {/* Package Description */}
          {shipmentData.description && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Package Description</h4>
              <p className="text-gray-600">{shipmentData.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipmentDetails;
