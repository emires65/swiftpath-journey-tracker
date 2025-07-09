
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
import { supabase } from '@/integrations/supabase/client';

interface Shipment {
  id: string;
  tracking_number: string;
  customer_name: string;
  customer_email: string;
  origin: string;
  destination: string;
  service: string;
  status: string;
  weight?: string;
  value?: string;
  current_location?: string;
  shipping_fee?: number;
  delivery_days?: number;
  estimated_delivery?: string;
  created_at: string;
  updated_at: string;
}

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [statusUpdateData, setStatusUpdateData] = useState({ status: '', location: '' });
  const [loading, setLoading] = useState(false);

  const [newShipment, setNewShipment] = useState({
    customer_name: '',
    customer_email: '',
    origin: '',
    destination: '',
    service: 'standard',
    weight: '',
    value: '',
    shipping_fee: 0,
    delivery_days: 3,
  });

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuthenticated') === 'true';
    setIsAuthenticated(isAuth);
    
    if (isAuth) {
      loadShipments();
    }
  }, []);

  const loadShipments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading shipments:', error);
        toast({
          title: "Error loading shipments",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setShipments(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
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

  const createShipment = async () => {
    if (!newShipment.customer_name || !newShipment.destination || !newShipment.shipping_fee) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including shipping fee.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const trackingNumber = generateTrackingNumber();
      
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + newShipment.delivery_days);

      const { data, error } = await supabase
        .from('shipments')
        .insert([{
          tracking_number: trackingNumber,
          customer_name: newShipment.customer_name,
          customer_email: newShipment.customer_email,
          origin: newShipment.origin,
          destination: newShipment.destination,
          service: newShipment.service,
          status: 'Order Placed',
          weight: newShipment.weight,
          value: newShipment.value,
          current_location: 'Processing Center',
          shipping_fee: newShipment.shipping_fee,
          delivery_days: newShipment.delivery_days,
          estimated_delivery: estimatedDelivery.toISOString().split('T')[0],
        }])
        .select()
        .single();

      if (error) {
        toast({
          title: "Error creating shipment",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Add initial tracking history
      await supabase
        .from('tracking_history')
        .insert([{
          shipment_id: data.id,
          status: 'Order Placed',
          location: 'Processing Center',
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().split(' ')[0],
        }]);

      setIsCreateDialogOpen(false);
      loadShipments();
      
      setNewShipment({
        customer_name: '',
        customer_email: '',
        origin: '',
        destination: '',
        service: 'standard',
        weight: '',
        value: '',
        shipping_fee: 0,
        delivery_days: 3,
      });

      toast({
        title: "Shipment Created",
        description: `Tracking number: ${trackingNumber}`,
      });
    } catch (error) {
      console.error('Error creating shipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateShipmentStatus = async () => {
    if (!selectedShipment || !statusUpdateData.status || !statusUpdateData.location) {
      toast({
        title: "Missing Information",
        description: "Please select a status and enter a location.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      // Update shipment status
      const { error: shipmentError } = await supabase
        .from('shipments')
        .update({
          status: statusUpdateData.status,
          current_location: statusUpdateData.location,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedShipment.id);

      if (shipmentError) {
        toast({
          title: "Error updating shipment",
          description: shipmentError.message,
          variant: "destructive"
        });
        return;
      }

      // Add tracking history
      const { error: historyError } = await supabase
        .from('tracking_history')
        .insert([{
          shipment_id: selectedShipment.id,
          status: statusUpdateData.status,
          location: statusUpdateData.location,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().split(' ')[0],
        }]);

      if (historyError) {
        console.error('Error adding tracking history:', historyError);
      }

      setIsEditDialogOpen(false);
      setStatusUpdateData({ status: '', location: '' });
      loadShipments();
      
      toast({
        title: "Status Updated",
        description: `Shipment ${selectedShipment.tracking_number} updated to ${statusUpdateData.status}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteShipment = async (shipmentId: string) => {
    try {
      setLoading(true);
      
      // Delete tracking history first
      await supabase
        .from('tracking_history')
        .delete()
        .eq('shipment_id', shipmentId);

      // Delete shipment
      const { error } = await supabase
        .from('shipments')
        .delete()
        .eq('id', shipmentId);

      if (error) {
        toast({
          title: "Error deleting shipment",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      loadShipments();
      toast({
        title: "Shipment Deleted",
        description: "Shipment has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting shipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredShipments = shipments.filter(shipment =>
    shipment.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.destination.toLowerCase().includes(searchTerm.toLowerCase())
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
                <Button disabled={loading}>
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
                    <Label htmlFor="customer_name">Customer Name *</Label>
                    <Input
                      id="customer_name"
                      value={newShipment.customer_name}
                      onChange={(e) => setNewShipment({...newShipment, customer_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_email">Customer Email</Label>
                    <Input
                      id="customer_email"
                      type="email"
                      value={newShipment.customer_email}
                      onChange={(e) => setNewShipment({...newShipment, customer_email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="origin">Origin *</Label>
                    <Input
                      id="origin"
                      value={newShipment.origin}
                      onChange={(e) => setNewShipment({...newShipment, origin: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="destination">Destination *</Label>
                    <Input
                      id="destination"
                      value={newShipment.destination}
                      onChange={(e) => setNewShipment({...newShipment, destination: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="service">Service Type</Label>
                    <Select value={newShipment.service} onValueChange={(value) => setNewShipment({...newShipment, service: value})}>
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
                    <Label htmlFor="weight">Weight</Label>
                    <Input
                      id="weight"
                      value={newShipment.weight}
                      onChange={(e) => setNewShipment({...newShipment, weight: e.target.value})}
                      placeholder="e.g., 2.5kg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="value">Package Value</Label>
                    <Input
                      id="value"
                      value={newShipment.value}
                      onChange={(e) => setNewShipment({...newShipment, value: e.target.value})}
                      placeholder="e.g., $500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="shipping_fee">Shipping Fee ($) *</Label>
                    <Input
                      id="shipping_fee"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newShipment.shipping_fee}
                      onChange={(e) => setNewShipment({...newShipment, shipping_fee: parseFloat(e.target.value) || 0})}
                      placeholder="Enter custom shipping fee"
                    />
                  </div>
                  <div>
                    <Label htmlFor="delivery_days">Delivery Days</Label>
                    <Input
                      id="delivery_days"
                      type="number"
                      min="1"
                      max="30"
                      value={newShipment.delivery_days}
                      onChange={(e) => setNewShipment({...newShipment, delivery_days: parseInt(e.target.value) || 3})}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={loading}>
                    Cancel
                  </Button>
                  <Button onClick={createShipment} disabled={loading}>
                    {loading ? 'Creating...' : 'Create Shipment'}
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
                placeholder="Search by tracking number, customer, or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading shipments...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking Number</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShipments.map((shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell className="font-medium">{shipment.tracking_number}</TableCell>
                      <TableCell>{shipment.customer_name}</TableCell>
                      <TableCell>{shipment.destination}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(shipment.status)}>
                          {shipment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{shipment.current_location}</TableCell>
                      <TableCell>${shipment.shipping_fee}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedShipment(shipment);
                              setIsEditDialogOpen(true);
                            }}
                            disabled={loading}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteShipment(shipment.id)}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Update Shipment Status</DialogTitle>
            </DialogHeader>
            {selectedShipment && (
              <div className="space-y-4">
                <div>
                  <Label>Tracking Number</Label>
                  <Input value={selectedShipment.tracking_number} disabled />
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
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={loading}>
                    Cancel
                  </Button>
                  <Button onClick={updateShipmentStatus} disabled={loading}>
                    {loading ? 'Updating...' : 'Update Status'}
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
