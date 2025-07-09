
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Package, User, MapPin, Truck, DollarSign, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CreateShipmentPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    senderName: '',
    senderAddress: '',
    senderCity: '',
    senderPhone: '',
    receiverName: '',
    receiverAddress: '',
    receiverCity: '',
    receiverPhone: '',
    weight: '',
    description: '',
    serviceType: '',
    deliveryDays: '',
    fee: ''
  });

  const serviceTypes = [
    { value: 'ground', label: 'Ground Transport', days: '5-7', baseFee: 25 },
    { value: 'air', label: 'Air Freight', days: '2-3', baseFee: 75 },
    { value: 'ocean', label: 'Ocean Freight', days: '14-21', baseFee: 45 }
  ];

  const deliveryOptions = [
    { value: '1', label: '1 Day Express', multiplier: 3 },
    { value: '2', label: '2 Days', multiplier: 2 },
    { value: '3', label: '3 Days', multiplier: 1.5 },
    { value: '5', label: '5 Days Standard', multiplier: 1 },
    { value: '7', label: '7 Days Economy', multiplier: 0.8 },
    { value: '14', label: '14 Days Budget', multiplier: 0.6 }
  ];

  const calculateFee = () => {
    if (!formData.serviceType || !formData.deliveryDays || !formData.weight) return 0;
    
    const service = serviceTypes.find(s => s.value === formData.serviceType);
    const delivery = deliveryOptions.find(d => d.value === formData.deliveryDays);
    const weight = parseFloat(formData.weight) || 0;
    
    if (!service || !delivery) return 0;
    
    const baseFee = service.baseFee;
    const weightFee = weight * 2; // $2 per kg
    const deliveryMultiplier = delivery.multiplier;
    
    return Math.round(((baseFee + weightFee) * deliveryMultiplier) * 100) / 100;
  };

  const handleInputChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value };
    
    // Auto-calculate fee when relevant fields change
    if (['serviceType', 'deliveryDays', 'weight'].includes(field)) {
      setFormData({ ...newFormData, fee: calculateFee().toString() });
    } else {
      setFormData(newFormData);
    }
  };

  const generateTrackingNumber = () => {
    const prefix = 'SP';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const requiredFields = ['senderName', 'senderAddress', 'senderCity', 'receiverName', 'receiverAddress', 'receiverCity', 'weight', 'serviceType', 'deliveryDays'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Create shipment
    const trackingNumber = generateTrackingNumber();
    const shipment = {
      ...formData,
      trackingNumber,
      createdAt: new Date().toISOString(),
      status: 'dispatched',
      fee: calculateFee()
    };

    // Save to localStorage
    const savedShipments = JSON.parse(localStorage.getItem('shipments') || '[]');
    savedShipments.push(shipment);
    localStorage.setItem('shipments', JSON.stringify(savedShipments));

    toast({
      title: "Shipment Created Successfully!",
      description: `Tracking number: ${trackingNumber}`,
    });

    // Navigate to tracking page
    navigate(`/tracking?number=${trackingNumber}`);
  };

  const currentFee = calculateFee();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Create Shipment
            </h1>
            <p className="text-xl text-gray-600">
              Fill out the details below to create your shipment
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Sender Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-6 h-6 mr-2 text-green-600" />
                  Sender Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="senderName">Full Name *</Label>
                  <Input
                    id="senderName"
                    value={formData.senderName}
                    onChange={(e) => handleInputChange('senderName', e.target.value)}
                    placeholder="Enter sender's full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="senderPhone">Phone Number</Label>
                  <Input
                    id="senderPhone"
                    value={formData.senderPhone}
                    onChange={(e) => handleInputChange('senderPhone', e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="senderAddress">Address *</Label>
                  <Input
                    id="senderAddress"
                    value={formData.senderAddress}
                    onChange={(e) => handleInputChange('senderAddress', e.target.value)}
                    placeholder="Enter complete address"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="senderCity">City *</Label>
                  <Input
                    id="senderCity"
                    value={formData.senderCity}
                    onChange={(e) => handleInputChange('senderCity', e.target.value)}
                    placeholder="Enter city"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Receiver Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-6 h-6 mr-2 text-blue-600" />
                  Receiver Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="receiverName">Full Name *</Label>
                  <Input
                    id="receiverName"
                    value={formData.receiverName}
                    onChange={(e) => handleInputChange('receiverName', e.target.value)}
                    placeholder="Enter receiver's full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="receiverPhone">Phone Number</Label>
                  <Input
                    id="receiverPhone"
                    value={formData.receiverPhone}
                    onChange={(e) => handleInputChange('receiverPhone', e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="receiverAddress">Address *</Label>
                  <Input
                    id="receiverAddress"
                    value={formData.receiverAddress}
                    onChange={(e) => handleInputChange('receiverAddress', e.target.value)}
                    placeholder="Enter complete address"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="receiverCity">City *</Label>
                  <Input
                    id="receiverCity"
                    value={formData.receiverCity}
                    onChange={(e) => handleInputChange('receiverCity', e.target.value)}
                    placeholder="Enter city"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Package Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-6 h-6 mr-2 text-purple-600" />
                  Package Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg) *</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      placeholder="Enter package weight"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="serviceType">Service Type *</Label>
                    <Select value={formData.serviceType} onValueChange={(value) => handleInputChange('serviceType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((service) => (
                          <SelectItem key={service.value} value={service.value}>
                            <div className="flex items-center">
                              <Truck className="w-4 h-4 mr-2" />
                              {service.label} ({service.days} days)
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deliveryDays">Delivery Speed *</Label>
                    <Select value={formData.deliveryDays} onValueChange={(value) => handleInputChange('deliveryDays', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select delivery speed" />
                      </SelectTrigger>
                      <SelectContent>
                        {deliveryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fee">Shipping Fee</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="fee"
                        type="number"
                        step="0.01"
                        value={currentFee}
                        readOnly
                        className="pl-8 bg-gray-50"
                        placeholder="Auto-calculated"
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      Fee is automatically calculated based on weight, service, and delivery speed
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Package Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the contents of your package"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-center md:text-left">
                    <p className="text-2xl font-bold text-green-600">
                      Total: ${currentFee}
                    </p>
                    <p className="text-sm text-gray-600">
                      Estimated delivery: {formData.deliveryDays} {parseInt(formData.deliveryDays) === 1 ? 'day' : 'days'}
                    </p>
                  </div>
                  
                  <Button type="submit" size="lg" className="w-full md:w-auto">
                    <Package className="w-5 h-5 mr-2" />
                    Create Shipment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CreateShipmentPage;
