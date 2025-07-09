import React, { useState, useEffect } from 'react';
import AdminLogin from '../components/AdminLogin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Plus, Edit, Trash2, Search, LogOut } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Shipment {
  id: string;
  trackingNumber: string;
  senderName: string;
  senderAddress: string;
  senderCity: string;
  senderPhone: string;
  senderEmail: string;
  receiverName: string;
  receiverAddress: string;
  receiverCity: string;
  receiverPhone: string;
  receiverEmail: string;
  packageWeight: number;
  packageDescription: string;
  serviceType: string;
  deliveryDays: number;
  shippingFee: number;
  status: string;
  currentLocation: string;
  estimatedDelivery: string;
  createdAt: string;
  statusHistory: Array<{
    status: string;
    location: string;
    date: string;
    time: string;
  }>;
}

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [statusUpdateData, setStatusUpdateData] = useState({ status: '', location: '' });

  const [newShipment, setNewShipment] = useState({
    senderName: '',
    senderAddress: '',
    senderCity: '',
    senderPhone: '',
    senderEmail: '',
    receiverName: '',
    receiverAddress: '',
    receiverCity: '',
    receiverPhone: '',
    receiverEmail: '',
    packageWeight: 0,
    packageDescription: '',
    serviceType: 'standard',
    deliveryDays: 3,
    shippingFee: 0,
  });

  useEffect(() => {
    // Check if admin is already authenticated
    const isAuth = localStorage.getItem('adminAuthenticated') === 'true';
    setIsAuthenticated(isAuth);
    
    if (isAuth) {
      loadShipments();
    }
  }, []);

  const loadShipments = () => {
    const savedShipments = localStorage.getItem('shipments');
    if (savedShipments) {
      setShipments(JSON.parse(savedShipments));
    }
  };

  const saveShipments = (updatedShipments: Shipment[]) => {
    localStorage.setItem('shipments', JSON.stringify(updatedShipments));
    setShipments(updatedShipments);
    
    // Trigger a storage event to notify other components
    window.dispatchEvent(new Event('storage'));
  };

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      loadShipments();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const generateTrackingNumber = () => {
    return 'SN' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const createShipment = () => {
    if (!newShipment.senderName || !newShipment.receiverName || !newShipment.packageWeight || !newShipment.shippingFee) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including shipping fee.",
        variant: "destructive"
      });
      return;
    }

    const trackingNumber = generateTrackingNumber();
    
    const shipment: Shipment = {
      id: Date.now().toString(),
      trackingNumber,
      senderName: newShipment.senderName,
      senderAddress: newShipment.senderAddress,
      senderCity: newShipment.senderCity,
      senderPhone: newShipment.senderPhone,
      senderEmail: newShipment.senderEmail,
      receiverName: newShipment.receiverName,
      receiverAddress: newShipment.receiverAddress,
      receiverCity: newShipment.receiverCity,
      receiverPhone: newShipment.receiverPhone,
      receiverEmail: newShipment.receiverEmail,
      packageWeight: newShipment.packageWeight,
      packageDescription: newShipment.packageDescription,
      serviceType: newShipment.serviceType,
      deliveryDays: newShipment.deliveryDays,
      shippingFee: newShipment.shippingFee,
      status: 'Order Placed',
      currentLocation: 'Processing Center',
      estimatedDelivery: new Date(Date.now() + newShipment.deliveryDays * 24 * 60 * 60 * 1000).toLocaleDateString(),
      createdAt: new Date().toISOString(),
      statusHistory: [{
        status: 'Order Placed',
        location: 'Processing Center',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      }],
    };

    const updatedShipments = [...shipments, shipment];
    saveShipments(updatedShipments);
    setIsCreateDialogOpen(false);
    
    // Reset form
    setNewShipment({
      senderName: '',
      senderAddress: '',
      senderCity: '',
      senderPhone: '',
      senderEmail: '',
      receiverName: '',
      receiverAddress: '',
      receiverCity: '',
      receiverPhone: '',
      receiverEmail: '',
      packageWeight: 0,
      packageDescription: '',
      serviceType: 'standard',
      deliveryDays: 3,
      shippingFee: 0,
    });

    toast({
      title: "Shipment Created",
      description: `Tracking number: ${trackingNumber}`,
    });
  };

  const updateShipmentStatus = () => {
    if (!selectedShipment || !statusUpdateData.status || !statusUpdateData.location) {
      toast({
        title: "Missing Information",
        description: "Please select a status and enter a location.",
        variant: "destructive"
      });
      return;
    }

    const updatedShipments = shipments.map(shipment => {
      if (shipment.id === selectedShipment.id) {
        const updatedHistory = [...shipment.statusHistory, {
          status: statusUpdateData.status,
          location: statusUpdateData.location,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
        }];
        
        return {
          ...shipment,
          status: statusUpdateData.status,
          currentLocation: statusUpdateData.location,
          statusHistory: updatedHistory,
        };
      }
      return shipment;
    });
    
    saveShipments(updatedShipments);
    setIsEditDialogOpen(false);
    setStatusUpdateData({ status: '', location: '' });
    
    toast({
      title: "Status Updated",
      description: `Shipment ${selectedShipment.trackingNumber} updated to ${statusUpdateData.status}`,
    });
  };

  const deleteShipment = (shipmentId: string) => {
    const updatedShipments = shipments.filter(shipment => shipment.id !== shipmentId);
    saveShipments(updatedShipments);
    
    toast({
      title: "Shipment Deleted",
      description: "Shipment has been successfully deleted.",
    });
  };

  const filteredShipments = shipments.filter(shipment =>
    shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.receiverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Order Placed': return 'bg-blue-500';
      case 'Dispatched': return 'bg-yellow-500';
      case 'In Transit': return 'bg-orange-500';
      case 'At Sorting Center': return 'bg-purple-500';
      case 'Out for Delivery': return 'bg-green-500';
      case 'Delivered': return 'bg-green-600';
      default: return 'bg-gray-500';
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">SkyNet Express Admin Panel</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Shipment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Shipment</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="senderName">Sender Name *</Label>
                    <Input
                      id="senderName"
                      value={newShipment.senderName}
                      onChange={(e) => setNewShipment({...newShipment, senderName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="senderPhone">Sender Phone</Label>
                    <Input
                      id="senderPhone"
                      value={newShipment.senderPhone}
                      onChange={(e) => setNewShipment({...newShipment, senderPhone: e.target.value})}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="senderAddress">Sender Address *</Label>
                    <Textarea
                      id="senderAddress"
                      value={newShipment.senderAddress}
                      onChange={(e) => setNewShipment({...newShipment, senderAddress: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="senderCity">Sender City *</Label>
                    <Input
                      id="senderCity"
                      value={newShipment.senderCity}
                      onChange={(e) => setNewShipment({...newShipment, senderCity: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="senderEmail">Sender Email</Label>
                    <Input
                      id="senderEmail"
                      type="email"
                      value={newShipment.senderEmail}
                      onChange={(e) => setNewShipment({...newShipment, senderEmail: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="receiverName">Receiver Name *</Label>
                    <Input
                      id="receiverName"
                      value={newShipment.receiverName}
                      onChange={(e) => setNewShipment({...newShipment, receiverName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="receiverPhone">Receiver Phone</Label>
                    <Input
                      id="receiverPhone"
                      value={newShipment.receiverPhone}
                      onChange={(e) => setNewShipment({...newShipment, receiverPhone: e.target.value})}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="receiverAddress">Receiver Address *</Label>
                    <Textarea
                      id="receiverAddress"
                      value={newShipment.receiverAddress}
                      onChange={(e) => setNewShipment({...newShipment, receiverAddress: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="receiverCity">Receiver City *</Label>
                    <Input
                      id="receiverCity"
                      value={newShipment.receiverCity}
                      onChange={(e) => setNewShipment({...newShipment, receiverCity: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="receiverEmail">Receiver Email</Label>
                    <Input
                      id="receiverEmail"
                      type="email"
                      value={newShipment.receiverEmail}
                      onChange={(e) => setNewShipment({...newShipment, receiverEmail: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="packageWeight">Package Weight (kg) *</Label>
                    <Input
                      id="packageWeight"
                      type="number"
                      value={newShipment.packageWeight}
                      onChange={(e) => setNewShipment({...newShipment, packageWeight: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="serviceType">Service Type</Label>
                    <Select value={newShipment.serviceType} onValueChange={(value) => setNewShipment({...newShipment, serviceType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="express">Express</SelectItem>
                        <SelectItem value="overnight">Overnight</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="deliveryDays">Delivery Days</Label>
                    <Input
                      id="deliveryDays"
                      type="number"
                      min="1"
                      max="30"
                      value={newShipment.deliveryDays}
                      onChange={(e) => setNewShipment({...newShipment, deliveryDays: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="shippingFee">Shipping Fee ($) *</Label>
                    <Input
                      id="shippingFee"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newShipment.shippingFee}
                      onChange={(e) => setNewShipment({...newShipment, shippingFee: parseFloat(e.target.value)})}
                      placeholder="Enter custom shipping fee"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="packageDescription">Package Description</Label>
                    <Textarea
                      id="packageDescription"
                      value={newShipment.packageDescription}
                      onChange={(e) => setNewShipment({...newShipment, packageDescription: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createShipment}>
                    Create Shipment
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Shipment Management</CardTitle>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Search by tracking number, sender, or receiver..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking Number</TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>Receiver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShipments.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell className="font-medium">{shipment.trackingNumber}</TableCell>
                    <TableCell>{shipment.senderName}</TableCell>
                    <TableCell>{shipment.receiverName}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(shipment.status)}>
                        {shipment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{shipment.currentLocation}</TableCell>
                    <TableCell>${shipment.shippingFee}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedShipment(shipment);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteShipment(shipment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Shipment Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Update Shipment Status</DialogTitle>
            </DialogHeader>
            {selectedShipment && (
              <div className="space-y-4">
                <div>
                  <Label>Tracking Number</Label>
                  <Input value={selectedShipment.trackingNumber} disabled />
                </div>
                <div>
                  <Label>Current Status</Label>
                  <Input value={selectedShipment.status} disabled />
                </div>
                <div>
                  <Label>New Status</Label>
                  <Select value={statusUpdateData.status} onValueChange={(value) => setStatusUpdateData({...statusUpdateData, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Order Placed">Order Placed</SelectItem>
                      <SelectItem value="Dispatched">Dispatched</SelectItem>
                      <SelectItem value="In Transit">In Transit</SelectItem>
                      <SelectItem value="At Sorting Center">At Sorting Center</SelectItem>
                      <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Current Location</Label>
                  <Input
                    value={statusUpdateData.location}
                    onChange={(e) => setStatusUpdateData({...statusUpdateData, location: e.target.value})}
                    placeholder="Enter current location"
                  />
                </div>
                <div>
                  <Label>Status History</Label>
                  <div className="max-h-32 overflow-y-auto border rounded p-2">
                    {selectedShipment.statusHistory.map((history, index) => (
                      <div key={index} className="text-sm border-b py-1">
                        <div className="font-medium">{history.status}</div>
                        <div className="text-gray-600">{history.location} - {history.date} {history.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={updateShipmentStatus}>
                    Update Status
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminPage;
