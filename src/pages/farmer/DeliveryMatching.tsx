import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Truck, MapPin, Clock, Star, Phone, MessageCircle, Navigation, CheckCircle, Send, Package } from 'lucide-react';
import { FarmerLayout } from '@/components/layouts/FarmerLayout';
import { updateOrderDriver, getFromLocalStorage } from '@/lib/localStorageUtils';

const DeliveryMatching = () => {
  const { toast } = useToast();
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [activeDeliveries, setActiveDeliveries] = useState([]);

  // Simulate real-time progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDeliveries(prev => 
        prev.map(delivery => {
          if (delivery.progress < 100) {
            const newProgress = Math.min(delivery.progress + Math.random() * 2, 100);
            return { ...delivery, progress: newProgress };
          }
          return delivery;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const orders = getFromLocalStorage('orders') || [];
  // Orders needing delivery: dynamically load from localStorage
  const ordersNeedingDelivery = orders.filter((o: any) => o.status === 'confirmed' || o.status === 'needs_delivery');

  // Add pendingOrders state to fix setPendingOrders error
  const [pendingOrders, setPendingOrders] = useState<any[]>(ordersNeedingDelivery);

  const availableDrivers = [
    {
      id: 'DRV-001',
      name: 'Sipho Transport',
      rating: 4.8,
      reviews: 127,
      vehicle: 'Refrigerated Truck',
      capacity: '500kg',
      pricePerKm: 8.50,
      estimatedCost: 383,
      availability: 'Available Now',
      specialties: ['Organic Produce', 'Cold Chain'],
      phone: '+27 82 123 4567'
    },
    {
      id: 'DRV-002',
      name: 'QuickFresh Logistics',
      rating: 4.6,
      reviews: 89,
      vehicle: 'Bakkie',
      capacity: '200kg',
      pricePerKm: 6.75,
      estimatedCost: 304,
      availability: 'Tomorrow 8AM',
      specialties: ['Same Day Delivery'],
      phone: '+27 83 456 7890'
    },
    {
      id: 'DRV-003',
      name: 'GreenMile Couriers',
      rating: 4.9,
      reviews: 156,
      vehicle: 'Electric Van',
      capacity: '300kg',
      pricePerKm: 7.25,
      estimatedCost: 326,
      availability: 'Available Now',
      specialties: ['Eco-Friendly', 'Urban Delivery'],
      phone: '+27 84 789 0123'
    }
  ];

  // Booking state management
  const [bookingStep, setBookingStep] = useState<'idle' | 'address' | 'driver' | 'confirm' | 'completed'>('idle');
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<string>('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [finalPrice, setFinalPrice] = useState(0);

  const bookDriver = (driverId: string, orderId: string) => {
    const driver = availableDrivers.find(d => d.id === driverId);
    setSelectedDriver(driver);
    setSelectedOrder(orderId);
    setFinalPrice(driver?.estimatedCost || 0);
    setBookingStep('address');
  };

  const handleAddressConfirm = () => {
    if (deliveryAddress.trim()) {
      setBookingStep('driver');
    } else {
      toast({
        title: "Address Required",
        description: "Please enter a delivery address to continue.",
        variant: "destructive"
      });
    }
  };

  const handleFinalBooking = () => {
    // Update order status to shipped
    setPendingOrders(prev => 
      prev.map(order => 
        order.id === selectedOrder 
          ? { ...order, status: 'shipped' }
          : order
      )
    );
    // Update order in local storage: assign driver, address, set status to shipped
    let updatedDelivery = null;
    if (selectedOrder && selectedDriver) {
      // Update order in localStorage
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      let selectedOrderObj = orders.find((order) => order.id === selectedOrder);
      if (selectedOrderObj) {
        updatedDelivery = {
          id: `DEL-${Date.now()}`,
          orderId: selectedOrderObj.id,
          driver: selectedDriver.name,
          driverPhone: selectedDriver.phone,
          status: 'out_for_delivery',
          progress: 0,
          estimatedArrival: '',
          customer: selectedOrderObj.customer || selectedOrderObj.consumer,
          destination: deliveryAddress,
          items: selectedOrderObj.items.map((item: any) => item.name || item),
          stages: [
            { name: 'Order Confirmed', completed: true, time: new Date().toLocaleTimeString() },
            { name: 'Picked Up', completed: true, time: new Date().toLocaleTimeString() },
            { name: 'In Transit', completed: true, time: new Date().toLocaleTimeString() },
            { name: 'Out for Delivery', completed: false, time: '' },
            { name: 'Delivered', completed: false, time: '' }
          ]
        };
      }
      const updatedOrders = orders.map((order) =>
        order.id === selectedOrder
          ? { ...order, status: 'shipped', driver: selectedDriver, address: deliveryAddress }
          : order
      );
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      // Store active deliveries in localStorage
      let activeDeliveriesArr = [];
      try {
        activeDeliveriesArr = JSON.parse(localStorage.getItem('activeDeliveries') || '[]');
        if (!Array.isArray(activeDeliveriesArr)) activeDeliveriesArr = [];
      } catch {
        activeDeliveriesArr = [];
      }
      if (updatedDelivery) {
        activeDeliveriesArr.push(updatedDelivery);
        localStorage.setItem('activeDeliveries', JSON.stringify(activeDeliveriesArr));
        setActiveDeliveries([...activeDeliveriesArr]);
      }
    }
    setBookingStep('completed');
    toast({
      title: "Driver Booked Successfully",
      description: `${selectedDriver?.name} has been booked for order ${selectedOrder}. Delivery to: ${deliveryAddress}`,
    });
    setTimeout(() => {
      setBookingStep('idle');
      setDeliveryAddress('');
      setSelectedDriver(null);
      setSelectedOrder('');
    }, 3000);
  };

  const resetBooking = () => {
    setBookingStep('idle');
    setDeliveryAddress('');
    setSelectedDriver(null);
    setSelectedOrder('');
  };

  const callDriver = (phone: string, driverName: string) => {
    // Simulate opening phone app
    window.open(`tel:${phone}`, '_self');
    toast({
      title: "Calling Driver",
      description: `Calling ${driverName} at ${phone}`,
    });
  };

  const sendMessage = (driverName: string) => {
    if (!chatMessage.trim()) return;
    
    toast({
      title: "Message Sent",
      description: `Message sent to ${driverName}: "${chatMessage}"`,
    });
    setChatMessage('');
  };

  // Delivery stats from real data
  const pendingCount = orders.filter((o: any) => o.status === 'confirmed' || o.status === 'needs_delivery').length;
  const inTransitCount = orders.filter((o: any) => o.status === 'shipped').length;
  const completedCount = orders.filter((o: any) => o.status === 'delivered').length;
  // Average driver rating from assigned drivers
  const driverRatings = orders.filter((o: any) => o.driver && o.driver.rating).map((o: any) => o.driver.rating);
  const avgRating = driverRatings.length ? (driverRatings.reduce((a: number, b: number) => a + b, 0) / driverRatings.length).toFixed(2) : 'N/A';

  // Fetch active deliveries from localStorage only on mount
  useEffect(() => {
    let storedActiveDeliveries = [];
    if (!localStorage.getItem('activeDeliveries')) {
      localStorage.setItem('activeDeliveries', JSON.stringify([]));
    } else {
      storedActiveDeliveries = JSON.parse(localStorage.getItem('activeDeliveries') || '[]');
    }
    setActiveDeliveries(storedActiveDeliveries);
  }, []);

  return (
    <FarmerLayout currentPage="Delivery Matching">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Delivery Matching</h1>
          <p className="text-muted-foreground">Match your orders with reliable delivery partners</p>
        </div>

        {/* Delivery Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Truck className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{pendingCount}</div>
                  <p className="text-sm text-muted-foreground">Pending Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Navigation className="w-8 h-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{inTransitCount}</div>
                  <p className="text-sm text-muted-foreground">In Transit</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{completedCount}</div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">{avgRating}</div>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Orders */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Orders Needing Delivery</CardTitle>
                <CardDescription>Match these orders with available drivers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {ordersNeedingDelivery.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">No orders needing delivery.</div>
                ) : (
                  ordersNeedingDelivery.map((order) => (
                    <div key={order.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{order.customer || order.consumer}</h4>
                          <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={order.urgency === 'urgent' ? 'destructive' : 'secondary'}>
                            {order.urgency || 'standard'}
                          </Badge>
                          <Badge variant={order.status === 'booked' ? 'default' : 'outline'}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2 mb-3">
                        <p className="text-sm font-medium">Items:</p>
                        {order.items.map((item: any, index: number) => (
                          <p key={index} className="text-sm text-muted-foreground">• {item.name || item}</p>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{order.pickup || 'Farm Gate'} → {order.destination || order.address}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{order.distance || ''}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>Due: {order.deadline ? order.deadline : (order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : '')}</span>
                        </div>
                        <span className="font-bold text-farm-green">{order.total ? `R${order.total}` : ''}</span>
                      </div>
                      <Button 
                        className="w-full mt-3" 
                        variant="outline"
                        onClick={() => {
                          setSelectedOrder(order.id);
                          setSelectedOrderDetails(order);
                          setBookingStep('address');
                        }}
                        disabled={order.status === 'booked'}
                      >
                        {order.status === 'booked' ? 'Booked' : 'Find Drivers'}
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Available Drivers */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Drivers</CardTitle>
                <CardDescription>Choose from vetted delivery partners</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {availableDrivers.map((driver) => (
                  <div key={driver.id} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold">{driver.name}</h4>
                          <div className="text-right">
                            <p className="font-bold text-farm-green">R{driver.estimatedCost}</p>
                            <p className="text-xs text-muted-foreground">Est. cost</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{driver.rating}</span>
                          <span className="text-xs text-muted-foreground">({driver.reviews} reviews)</span>
                        </div>
                        
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>Vehicle: {driver.vehicle} • Capacity: {driver.capacity}</p>
                          <p>Rate: R{driver.pricePerKm}/km • {driver.availability}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          {driver.specialties.map((specialty) => (
                            <Badge key={specialty} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => callDriver(driver.phone, driver.name)}
                      >
                        <Phone className="w-3 h-3" />
                      </Button>
                      
                      {/* Chat Dialog */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="w-3 h-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Chat with {driver.name}</DialogTitle>
                            <DialogDescription>
                              Send a message to discuss delivery details
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="bg-muted p-3 rounded-lg">
                              <p className="text-sm text-muted-foreground mb-2">Previous Messages:</p>
                              <div className="space-y-2">
                                <div className="bg-white p-2 rounded text-sm">
                                  <strong>You:</strong> What time can you pick up the order?
                                </div>
                                <div className="bg-primary/10 p-2 rounded text-sm">
                                  <strong>{driver.name}:</strong> I can pick up anytime after 2 PM today.
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Textarea
                                placeholder="Type your message..."
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                rows={3}
                              />
                              <Button 
                                onClick={() => sendMessage(driver.name)}
                                className="w-full"
                                disabled={!chatMessage.trim()}
                              >
                                <Send className="w-4 h-4 mr-2" />
                                Send Message
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Active Deliveries */}
        <Card>
          <CardHeader>
            <CardTitle>Active Deliveries</CardTitle>
            <CardDescription>Track your current shipments in real-time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeDeliveries.map((delivery) => (
                <div key={delivery.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{delivery.customer}</h4>
                      <p className="text-sm text-muted-foreground">
                        Order #{delivery.orderId} • {delivery.driver}
                      </p>
                    </div>
                    <Badge variant={delivery.status === 'picked_up' ? 'default' : 'secondary'}>
                      {delivery.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    {delivery.items.map((item, index) => (
                      <p key={index} className="text-sm text-muted-foreground">• {item}</p>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to {delivery.destination}</span>
                      <span>{delivery.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${delivery.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>ETA: {delivery.estimatedArrival}</span>
                      </div>
                      {/* Takealot-style Tracking Dialog */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Navigation className="w-3 h-3 mr-1" />
                            Track
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Package className="w-5 h-5" />
                              Order Tracking - #{delivery.orderId}
                            </DialogTitle>
                            <DialogDescription>
                              Real-time tracking for {delivery.customer}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-6">
                            {/* Progress Overview */}
                            <div className="bg-muted p-4 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">Delivery Progress</span>
                                <Badge variant={delivery.progress >= 100 ? 'default' : 'secondary'}>
                                  {delivery.progress >= 100 ? 'Delivered' : 'In Transit'}
                                </Badge>
                              </div>
                              <div className="w-full bg-background rounded-full h-3 mb-2">
                                <div 
                                  className="bg-farm-green h-3 rounded-full transition-all duration-300" 
                                  style={{ width: `${delivery.progress}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-sm text-muted-foreground">
                                <span>0%</span>
                                <span>{Math.round(delivery.progress)}% Complete</span>
                                <span>100%</span>
                              </div>
                            </div>

                            {/* Delivery Stages - Takealot Style */}
                            <div className="space-y-4">
                              <h4 className="font-semibold">Delivery Timeline</h4>
                              {delivery.stages.map((stage, index) => (
                                <div key={index} className="flex items-start gap-4">
                                  <div className="flex flex-col items-center">
                                    <div 
                                      className={`w-4 h-4 rounded-full border-2 ${
                                        stage.completed 
                                          ? 'bg-farm-green border-farm-green' 
                                          : 'border-muted-foreground bg-background'
                                      }`}
                                    />
                                    {index < delivery.stages.length - 1 && (
                                      <div 
                                        className={`w-0.5 h-8 ${
                                          stage.completed ? 'bg-farm-green' : 'bg-muted'
                                        }`}
                                      />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                      <p className={`font-medium ${
                                        stage.completed ? 'text-foreground' : 'text-muted-foreground'
                                      }`}>
                                        {stage.name}
                                      </p>
                                      <span className="text-sm text-muted-foreground">
                                        {stage.completed ? stage.time : `Est. ${stage.time}`}
                                      </span>
                                    </div>
                                    {stage.completed && (
                                      <p className="text-sm text-muted-foreground">Completed</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Driver & Contact Info */}
                            <div className="border-t pt-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">Driver: {delivery.driver}</p>
                                  <p className="text-sm text-muted-foreground">
                                    ETA: {delivery.estimatedArrival}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => callDriver(delivery.driverPhone, delivery.driver)}
                                  >
                                    <Phone className="w-3 h-3 mr-1" />
                                    Call
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <MessageCircle className="w-3 h-3 mr-1" />
                                    Message
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Booking Flow Dialog */}
        <Dialog open={bookingStep !== 'idle'} onOpenChange={(open) => !open && resetBooking()}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {bookingStep === 'address' && 'Enter Delivery Address'}
                {bookingStep === 'driver' && 'Select Driver'}
                {bookingStep === 'confirm' && 'Confirm Booking'}
                {bookingStep === 'completed' && 'Booking Confirmed!'}
              </DialogTitle>
              <DialogDescription>
                {bookingStep === 'address' && 'Please provide the exact delivery address for this order'}
                {bookingStep === 'driver' && 'Choose a driver for this delivery'}
                {bookingStep === 'confirm' && 'Review the booking details before confirming'}
                {bookingStep === 'completed' && 'Your driver has been successfully booked'}
              </DialogDescription>
            </DialogHeader>
            {/* Address Step */}
            {bookingStep === 'address' && selectedOrderDetails && (
              <div className="space-y-4">
                <div className="bg-muted p-3 rounded mb-2">
                  <p className="font-medium">Order: {selectedOrderDetails.id}</p>
                  <p className="text-sm text-muted-foreground">Customer: {selectedOrderDetails.customer || selectedOrderDetails.consumer}</p>
                  <p className="text-sm text-muted-foreground">Items: {selectedOrderDetails.items.map((item: any) => item.name || item).join(', ')}</p>
                  <p className="text-sm text-muted-foreground">Destination: {deliveryAddress || selectedOrderDetails.destination || selectedOrderDetails.address}</p>
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-2">
                    Delivery Address
                  </label>
                  <Textarea
                    id="address"
                    placeholder="Enter full delivery address..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={resetBooking} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={() => setBookingStep('driver')} className="flex-1">
                    Continue
                  </Button>
                </div>
              </div>
            )}
            {/* Driver Selection Step */}
            {bookingStep === 'driver' && (
              <div className="space-y-4">
                <div className="bg-muted p-3 rounded mb-2">
                  <p className="font-medium">Select a driver for this delivery:</p>
                </div>
                {availableDrivers.map((driver) => (
                  <Button key={driver.id} className="w-full mb-2" variant={selectedDriver?.id === driver.id ? 'default' : 'outline'} onClick={() => { setSelectedDriver(driver); setFinalPrice(driver.estimatedCost); }}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{driver.name}</span>
                      <span className="text-xs text-muted-foreground">{driver.vehicle} • {driver.capacity} • R{driver.estimatedCost}</span>
                    </div>
                  </Button>
                ))}
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setBookingStep('address')} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={() => selectedDriver ? setBookingStep('confirm') : null} className="flex-1" disabled={!selectedDriver}>
                    Continue
                  </Button>
                </div>
              </div>
            )}
            {/* Confirm Step */}
            {bookingStep === 'confirm' && (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <div>
                    <p className="font-medium">Driver: {selectedDriver?.name || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">{selectedDriver?.vehicle || 'N/A'} • {selectedDriver?.capacity || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="font-medium">Order: {selectedOrder || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">Customer: {selectedOrderDetails?.customer || selectedOrderDetails?.consumer || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">Items: {selectedOrderDetails?.items ? selectedOrderDetails.items.map((item: any) => item.name || item).join(', ') : 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">Destination: {deliveryAddress || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="font-medium">Delivery Address:</p>
                    <p className="text-sm text-muted-foreground">{deliveryAddress || 'N/A'}</p>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Cost:</span>
                      <span className="text-lg font-bold text-farm-green">R{finalPrice || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setBookingStep('driver')} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleFinalBooking} className="flex-1">
                    Confirm Booking
                  </Button>
                </div>
              </div>
            )}
            {/* Completed Step */}
            {bookingStep === 'completed' && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-farm-green/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-farm-green" />
                </div>
                <div>
                  <p className="font-medium mb-1">Booking Successful!</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedDriver?.name} will contact you shortly to arrange pickup.
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </FarmerLayout>
  );
};

export default DeliveryMatching;