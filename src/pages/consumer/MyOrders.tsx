import { useState, useEffect } from "react";
import { ConsumerLayout } from "@/components/layouts/ConsumerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Truck, CheckCircle, Clock, MapPin, Star } from "lucide-react";
import { toast } from "sonner";
import tomatoesImg from "@/assets/products/tomatoes.jpg";
import carrotsImg from "@/assets/products/carrotsSunnyAcres.jpeg";
import lettuceImg from "@/assets/products/letticeRiversideGardens.jpeg";
import applesImg from "@/assets/products/apples.jpg";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useCart } from "@/contexts/CartContext";
// @ts-ignore
import { jsPDF, autoTable } from "@/lib/pdfUtils";
import { getOrdersByUser, getUserByUsername } from '@/lib/localStorageUtils';

interface Order {
  id: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
    farmer: string;
  }>;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  total: number;
  orderDate: string;
  estimatedDelivery: string;
  trackingNumber?: string;
  farmer: string;
  address: string;
  consumer?: string;
  farmerProfile?: any;
}

export default function MyOrders() {
  const user = localStorage.getItem('farm2city_user');
  const [orders, setOrders] = useState<Order[]>(() => {
    if (user) {
      // Load all orders for this user from localStorage
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      // Only show orders where consumer matches current user
      return allOrders.filter(order => order.consumer === user);
    }
    return [];
  });
  const [cart, setCart] = useState<any[]>([]); // Add cart state
  const { addToCart } = useCart();

  const [trackingModal, setTrackingModal] = useState<{ open: boolean, order?: Order }>({ open: false });
  const [paymentModal, setPaymentModal] = useState<{ open: boolean, order?: Order }>({ open: false });
  const [disputeModal, setDisputeModal] = useState<{ open: boolean, order?: Order }>({ open: false });
  const [returnModal, setReturnModal] = useState<{ open: boolean, order?: Order }>({ open: false });
  const [disputeText, setDisputeText] = useState('');
  const [returnText, setReturnText] = useState('');
  const [history, setHistory] = useState<Array<{
    type: 'dispute' | 'return',
    orderId: string,
    message: string,
    date: string,
    image?: string
  }>>([]);
  const [historyStatus, setHistoryStatus] = useState<'all' | 'dispute' | 'return'>('all');
  const [disputeForm, setDisputeForm] = useState({
    reason: '',
    description: '',
    contact: '',
    file: undefined as File | undefined,
    preview: ''
  });
  const [returnForm, setReturnForm] = useState({
    reason: '',
    description: '',
    contact: '',
    file: undefined as File | undefined,
    preview: ''
  });

  useEffect(() => {
    if (user) {
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      console.log('Current user:', user);
      console.log('All orders:', allOrders);
      setOrders(allOrders.filter(order => order.consumer === user));
    } else {
      console.log('No user found in localStorage.');
    }
  }, [paymentModal.open, user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "secondary";
      case "confirmed": return "outline";
      case "shipped": return "default";
      case "delivered": return "default";
      case "cancelled": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "confirmed": return <CheckCircle className="h-4 w-4" />;
      case "shipped": return <Truck className="h-4 w-4" />;
      case "delivered": return <Package className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getProgress = (status: string) => {
    switch (status) {
      case "pending": return 25;
      case "confirmed": return 50;
      case "shipped": return 75;
      case "delivered": return 100;
      default: return 0;
    }
  };

  const trackOrder = (order: Order) => {
    setTrackingModal({ open: true, order });
  };

  const handleTransact = (order: Order) => {
    setPaymentModal({ open: true, order });
  };

  function saveOrderToLocalStorage(order) {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([order, ...allOrders]));
  }

  const handlePayment = () => {
    if (paymentModal.order) {
      const user = localStorage.getItem('farm2city_user');
      const orderToSave: Order = {
        ...paymentModal.order,
        consumer: user,
        orderDate: new Date().toISOString(),
        status: "pending",
        farmerProfile: paymentModal.order.farmerProfile || { name: paymentModal.order.farmer },
      };
      saveOrderToLocalStorage(orderToSave);
      toast.success("Payment successful! Your order will be processed.");
      setPaymentModal({ open: false });
      setOrders(prev => [orderToSave, ...prev]);
    }
  };

  const reorderItems = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.items.forEach(item => {
        addToCart({ ...item, unit: 'each' });
      });
      toast.success(`${order.items.length} items added to cart for reorder!`);
    }
  };

  const viewInvoice = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Get real farmer info from local storage
    const farmerUser = getUserByUsername(order.farmer);
    const seller = farmerUser ? {
      farmName: order.farmer,
      fullName: farmerUser.fullName || farmerUser.username,
      contact: farmerUser.contact || '',
      email: farmerUser.email || '',
      address: farmerUser.address || '',
      paymentInfo: farmerUser.paymentInfo || '',
      vat: farmerUser.vat || ''
    } : {
      farmName: order.farmer,
      fullName: order.farmer,
      contact: '',
      email: '',
      address: '',
      paymentInfo: '',
      vat: ''
    };
    const buyer = {
      fullName: "Jane Customer",
      contact: "082 987 6543",
      email: "customer@example.com",
      address: order.address
    };
    const invoiceNumber = `INV-${order.id}`;
    const invoiceDate = new Date().toLocaleDateString();
    const paymentDate = invoiceDate;
    const deliveryFee = 35.00;
    const discounts = 0.00;
    const vat = 0.00;
    const total = order.total + deliveryFee - discounts + vat;
    const paymentStatus = "PAID";
    const paymentMethod = "Card";
    const transactionRef = order.id + "-TXN";
    const deliveryDetails = {
      estimated: new Date(order.estimatedDelivery).toLocaleDateString(),
      courier: "Farm2City Delivery",
      notes: "Leave at front door."
    };
    const terms = "Fresh produce is non-returnable unless damaged upon delivery. Store in a cool, dry place. For support, contact farmer@example.com.";
    const signature = "Digitally signed by " + seller.fullName;

    const doc = new jsPDF();
    let y = 10;
    doc.setFontSize(18);
    doc.text("INVOICE", 105, y, { align: "center" });
    y += 10;
    doc.setFontSize(11);
    doc.text(`Invoice #: ${invoiceNumber}`, 14, y);
    doc.text(`Invoice Date: ${invoiceDate}`, 105, y, { align: "center" });
    doc.text(`Payment Date: ${paymentDate}`, 200-14, y, { align: "right" });
    y += 8;
    doc.text(`Order #: ${order.id}`, 14, y);
    y += 8;
    // Seller/Buyer Table
    autoTable(doc, {
      startY: y,
      head: [["Seller (Farmer)", "Buyer (Customer)"]],
      body: [
        [
          `${seller.farmName} (${seller.fullName})\nContact: ${seller.contact} | ${seller.email}\nAddress: ${seller.address}\nPayment Info: ${seller.paymentInfo}\nVAT/Tax: ${seller.vat}`,
          `${buyer.fullName}\nContact: ${buyer.contact} | ${buyer.email}\nDelivery Address: ${buyer.address}`
        ]
      ],
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: { 0: { cellWidth: 90 }, 1: { cellWidth: 90 } },
      theme: 'grid',
    });
    y = (doc as any).lastAutoTable.finalY + 6;
    // Order Items Table
    autoTable(doc, {
      startY: y,
      head: [["Qty", "Product", "Unit Price", "Subtotal"]],
      body: order.items.map(item => [
        item.quantity,
        item.name,
        `R${item.price.toFixed(2)}`,
        `R${(item.price * item.quantity).toFixed(2)}`
      ]),
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: { 0: { cellWidth: 20 }, 1: { cellWidth: 70 }, 2: { cellWidth: 30 }, 3: { cellWidth: 30 } },
      theme: 'striped',
      foot: [
        [
          { content: '', colSpan: 2 },
          'Subtotal',
          `R${order.total.toFixed(2)}`
        ],
        [
          { content: '', colSpan: 2 },
          'Delivery Fee',
          `R${deliveryFee.toFixed(2)}`
        ],
        [
          { content: '', colSpan: 2 },
          'Discounts',
          `R${discounts.toFixed(2)}`
        ],
        [
          { content: '', colSpan: 2 },
          'VAT/Tax',
          `R${vat.toFixed(2)}`
        ],
        [
          { content: '', colSpan: 2 },
          { content: 'Total Amount Due', styles: { fontStyle: 'bold' } },
          { content: `R${total.toFixed(2)}`, styles: { fontStyle: 'bold' } }
        ]
      ],
    });
    y = (doc as any).lastAutoTable.finalY + 8;
    // Payment & Delivery Table
    autoTable(doc, {
      startY: y,
      head: [["Payment Status", "Payment Method", "Transaction Ref", "Estimated Delivery", "Courier", "Notes"]],
      body: [[
        paymentStatus,
        paymentMethod,
        transactionRef,
        deliveryDetails.estimated,
        deliveryDetails.courier,
        deliveryDetails.notes
      ]],
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: { 0: { cellWidth: 25 }, 1: { cellWidth: 25 }, 2: { cellWidth: 35 }, 3: { cellWidth: 30 }, 4: { cellWidth: 30 }, 5: { cellWidth: 35 } },
      theme: 'grid',
    });
    y = (doc as any).lastAutoTable.finalY + 8;
    // Terms & Signature
    doc.setFontSize(12);
    doc.text("Terms & Notes", 14, y);
    y += 6;
    doc.setFontSize(10);
    doc.text(terms, 14, y, { maxWidth: 180 });
    y += 14;
    doc.setFontSize(12);
    doc.text("Signature", 14, y);
    y += 6;
    doc.setFontSize(10);
    doc.text(signature, 14, y);
    doc.save(`invoice-${order.id}.pdf`);
  };

  const filterOrders = (status?: string) => {
    if (!status) return orders;
    return orders.filter(order => order.status === status);
  };

  const openMap = (address: string) => {
    const query = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  // Add new order to pending orders (simulate marketplace order)
  const addOrder = (newOrder: Omit<Order, 'status'>) => {
    setOrders([
      {
        ...newOrder,
        status: 'pending',
      },
      ...orders,
    ]);
    toast.success('Order placed! You can track it under Pending Orders.');
  };

  const handleDisputeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDisputeForm(f => ({ ...f, file, preview: URL.createObjectURL(file) }));
    }
  };
  const handleReturnFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReturnForm(f => ({ ...f, file, preview: URL.createObjectURL(file) }));
    }
  };

  const handleDisputeSubmit = () => {
    if (!disputeForm.reason || !disputeForm.description || !disputeForm.contact) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setHistory(prev => [
      {
        type: 'dispute',
        orderId: disputeModal.order!.id,
        message: `Reason: ${disputeForm.reason}\n${disputeForm.description}\nContact: ${disputeForm.contact}`,
        date: new Date().toLocaleString(),
        image: disputeForm.preview
      },
      ...prev
    ]);
    toast.success('Your dispute has been logged. Our team will contact you soon.');
    setDisputeModal({ open: false });
    setDisputeForm({ reason: '', description: '', contact: '', file: undefined, preview: '' });
  };

  const handleReturnSubmit = () => {
    if (!returnForm.reason || !returnForm.description || !returnForm.contact) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setHistory(prev => [
      {
        type: 'return',
        orderId: returnModal.order!.id,
        message: `Reason: ${returnForm.reason}\n${returnForm.description}\nContact: ${returnForm.contact}`,
        date: new Date().toLocaleString(),
        image: returnForm.preview
      },
      ...prev
    ]);
    toast.success('Your return request has been submitted. Our team will contact you soon.');
    setReturnModal({ open: false });
    setReturnForm({ reason: '', description: '', contact: '', file: undefined, preview: '' });
  };

  function clearAppLocalStorage() {
    localStorage.removeItem('orders');
    localStorage.removeItem('farm2city_user');
    // Add any other app-specific keys here
    toast.success('App localStorage cleared. Please reload and try again.');
  }

  return (
    <ConsumerLayout currentPage="My Orders">
      <div className="min-h-screen bg-muted/30 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Orders 📦</h1>
            <p className="text-muted-foreground">
              Track your orders and view purchase history
            </p>
          </div>

          {/* Example usage: addOrder({ id: 'ORD-004', items: [...], total: 10, orderDate: '2025-09-04', estimatedDelivery: '2025-09-06', farmer: 'New Farmer', address: 'Johannesburg, South Africa', trackingNumber: 'TRK000000' }) */}

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="history">Disputes & Returns</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6 mt-6">
              {orders.map((order) => (
                <Card key={order.id} className="shadow-card">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Order {order.id}
                          <Badge variant={getStatusColor(order.status)} className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            {order.status.toUpperCase()}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Placed on {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">R{order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">Total</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Order Progress */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Order Progress</span>
                          <span className="text-sm text-muted-foreground">{getProgress(order.status)}%</span>
                        </div>
                        <Progress value={getProgress(order.status)} className="h-2" />
                      </div>

                      {/* Order Items */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.farmer}</p>
                              <p className="text-sm">
                                {item.quantity}x R{item.price.toFixed(2)} = R{(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <h4 className="font-medium mb-2">Delivery Information</h4>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {order.address}
                            </div>
                            <p>Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                            {order.trackingNumber && (
                              <p>Tracking: {order.trackingNumber}</p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Farmer</h4>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              4.8
                            </div>
                            <span className="text-muted-foreground">{order.farmer}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4 border-t">
                        {order.trackingNumber && (
                          <Button
                            variant="outline"
                            onClick={() => trackOrder(order)}
                            className="flex items-center gap-2"
                          >
                            <Truck className="h-4 w-4" />
                            Track Order
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          onClick={() => reorderItems(order.id)}
                          className="flex items-center gap-2"
                        >
                          <Package className="h-4 w-4" />
                          Reorder
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => viewInvoice(order.id)}
                          className="flex items-center gap-2"
                        >
                          📄 Invoice
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setDisputeModal({ open: true, order })}
                          className="flex items-center gap-2"
                        >
                          📝 Log Dispute
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setReturnModal({ open: true, order })}
                          className="flex items-center gap-2"
                        >
                          ↩️ Log Return
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {/* Tracking Modal */}
              <Dialog open={trackingModal.open} onOpenChange={open => setTrackingModal({ open, order: trackingModal.order })}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Order Tracking</DialogTitle>
                    <DialogDescription>
                      {trackingModal.order && (
                        <div>
                          <p><strong>Order:</strong> {trackingModal.order.id}</p>
                          <p><strong>Status:</strong> {trackingModal.order.status.toUpperCase()}</p>
                          <p><strong>Tracking Number:</strong> {trackingModal.order.trackingNumber}</p>
                          <p><strong>Estimated Delivery:</strong> {new Date(trackingModal.order.estimatedDelivery).toLocaleDateString()}</p>
                          <div className="mt-4">
                            <span className="block mb-2">Live Map:</span>
                            <div className="w-full h-64 bg-muted rounded flex flex-col items-center justify-center text-muted-foreground overflow-hidden">
                              <iframe
                                title="Delivery Map"
                                width="100%"
                                height="100%"
                                style={{ border: 0, minHeight: '200px', borderRadius: '8px' }}
                                src={`https://www.google.com/maps?q=${encodeURIComponent('Johannesburg, South Africa')}&output=embed`}
                                allowFullScreen
                                loading="lazy"
                              />
                              <div className="mt-2">🚚 Your order is on the way!</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              {/* Payment Modal */}
              <Dialog open={paymentModal.open} onOpenChange={open => setPaymentModal({ open, order: paymentModal.order })}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Transact Order</DialogTitle>
                    <DialogDescription>
                      {paymentModal.order && (
                        <div>
                          <p><strong>Order:</strong> {paymentModal.order.id}</p>
                          <p><strong>Total:</strong> R{paymentModal.order.total.toFixed(2)}</p>
                          <Button className="mt-4 w-full" onClick={handlePayment}>
                            Pay Now
                          </Button>
                        </div>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              {/* Dispute Modal */}
              <Dialog open={disputeModal.open} onOpenChange={open => setDisputeModal({ open, order: disputeModal.order })}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Log a Dispute</DialogTitle>
                    <DialogDescription>
                      {disputeModal.order && (
                        <form onSubmit={e => { e.preventDefault(); handleDisputeSubmit(); }}>
                          <p><strong>Order:</strong> {disputeModal.order.id}</p>
                          <div className="mt-2">
                            <label className="block text-sm font-medium">Reason<span className="text-red-500">*</span></label>
                            <input className="w-full mt-1 p-2 border rounded" required value={disputeForm.reason} onChange={e => setDisputeForm(f => ({ ...f, reason: e.target.value }))} placeholder="e.g. Damaged item, Wrong product, etc." />
                          </div>
                          <div className="mt-2">
                            <label className="block text-sm font-medium">Description<span className="text-red-500">*</span></label>
                            <textarea className="w-full mt-1 p-2 border rounded" required rows={3} value={disputeForm.description} onChange={e => setDisputeForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe your complaint or refund request..." />
                          </div>
                          <div className="mt-2">
                            <label className="block text-sm font-medium">Contact Info<span className="text-red-500">*</span></label>
                            <input className="w-full mt-1 p-2 border rounded" required value={disputeForm.contact} onChange={e => setDisputeForm(f => ({ ...f, contact: e.target.value }))} placeholder="Your email or phone number" />
                          </div>
                          <div className="mt-2">
                            <label className="block text-sm font-medium">Attach Picture (optional)</label>
                            <input type="file" accept="image/*" onChange={handleDisputeFile} />
                            {disputeForm.preview && <img src={disputeForm.preview} alt="evidence" className="mt-2 w-32 h-32 object-cover rounded border" />}
                          </div>
                          <Button className="mt-4 w-full" type="submit">Submit Dispute</Button>
                        </form>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              {/* Return Modal */}
              <Dialog open={returnModal.open} onOpenChange={open => setReturnModal({ open, order: returnModal.order })}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Log a Return</DialogTitle>
                    <DialogDescription>
                      {returnModal.order && (
                        <form onSubmit={e => { e.preventDefault(); handleReturnSubmit(); }}>
                          <p><strong>Order:</strong> {returnModal.order.id}</p>
                          <div className="mt-2">
                            <label className="block text-sm font-medium">Reason<span className="text-red-500">*</span></label>
                            <input className="w-full mt-1 p-2 border rounded" required value={returnForm.reason} onChange={e => setReturnForm(f => ({ ...f, reason: e.target.value }))} placeholder="e.g. Not as described, Quality issue, etc." />
                          </div>
                          <div className="mt-2">
                            <label className="block text-sm font-medium">Description<span className="text-red-500">*</span></label>
                            <textarea className="w-full mt-1 p-2 border rounded" required rows={3} value={returnForm.description} onChange={e => setReturnForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe your reason for return..." />
                          </div>
                          <div className="mt-2">
                            <label className="block text-sm font-medium">Contact Info<span className="text-red-500">*</span></label>
                            <input className="w-full mt-1 p-2 border rounded" required value={returnForm.contact} onChange={e => setReturnForm(f => ({ ...f, contact: e.target.value }))} placeholder="Your email or phone number" />
                          </div>
                          <div className="mt-2">
                            <label className="block text-sm font-medium">Attach Picture (optional)</label>
                            <input type="file" accept="image/*" onChange={handleReturnFile} />
                            {returnForm.preview && <img src={returnForm.preview} alt="evidence" className="mt-2 w-32 h-32 object-cover rounded border" />}
                          </div>
                          <Button className="mt-4 w-full" type="submit">Submit Return Request</Button>
                        </form>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {['pending', 'confirmed', 'shipped', 'delivered'].map((status) => (
              <TabsContent key={status} value={status} className="space-y-6 mt-6">
                {filterOrders(status).map((order) => (
                  <Card key={order.id} className="shadow-card">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            Order {order.id}
                            <Badge variant={getStatusColor(order.status)} className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {order.status.toUpperCase()}
                            </Badge>
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Placed on {new Date(order.orderDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">R{order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">Total</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Order Progress</span>
                            <span className="text-sm text-muted-foreground">{getProgress(order.status)}%</span>
                          </div>
                          <Progress value={getProgress(order.status)} className="h-2" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-sm">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.farmer}</p>
                                <p className="text-sm">
                                  {item.quantity}x R{item.price.toFixed(2)} = R{(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Order Details for status tabs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                          <div>
                            <h4 className="font-medium mb-2">Delivery Information</h4>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {order.address}
                              </div>
                              <p>Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                              {order.trackingNumber && (
                                <p>Tracking: {order.trackingNumber}</p>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Farmer</h4>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                4.8
                              </div>
                              <span className="text-muted-foreground">{order.farmer}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-4 border-t">
                          {order.trackingNumber && (
                            <Button
                              variant="outline"
                              onClick={() => trackOrder(order)}
                              className="flex items-center gap-2"
                            >
                              <Truck className="h-4 w-4" />
                              Track Order
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            onClick={() => reorderItems(order.id)}
                            className="flex items-center gap-2"
                          >
                            <Package className="h-4 w-4" />
                            Reorder
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => viewInvoice(order.id)}
                            className="flex items-center gap-2"
                          >
                            📄 Invoice
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setDisputeModal({ open: true, order })}
                            className="flex items-center gap-2"
                          >
                            📝 Log Dispute
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setReturnModal({ open: true, order })}
                            className="flex items-center gap-2"
                          >
                            ↩️ Log Return
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filterOrders(status).length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No {status} orders found.
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
            <TabsContent value="history" className="space-y-6 mt-6">
              <div className="bg-white rounded shadow p-4">
                <h2 className="text-xl font-bold mb-4">Disputes & Returns History</h2>
                <div className="mb-4 flex flex-wrap gap-2 items-center">
                  <label className="font-medium">Filter:</label>
                  <Button size="sm" variant={historyStatus === 'all' ? 'default' : 'outline'} onClick={() => setHistoryStatus('all')}>All</Button>
                  <Button size="sm" variant={historyStatus === 'dispute' ? 'default' : 'outline'} onClick={() => setHistoryStatus('dispute')}>Disputes</Button>
                  <Button size="sm" variant={historyStatus === 'return' ? 'default' : 'outline'} onClick={() => setHistoryStatus('return')}>Returns</Button>
                </div>
                {history.filter(h => historyStatus === 'all' || h.type === historyStatus).length === 0 ? (
                  <div className="text-muted-foreground">No disputes or returns logged yet.</div>
                ) : (
                  <div className="space-y-4">
                    {history.filter(h => historyStatus === 'all' || h.type === historyStatus).map((entry, idx) => (
                      <div key={idx} className="border rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mr-2 ${entry.type === 'dispute' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{entry.type === 'dispute' ? 'Dispute' : 'Return'}</span>
                          <span className="font-medium">Order {entry.orderId}</span>
                          <div className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{entry.message}</div>
                          {entry.image && <img src={entry.image} alt="evidence" className="mt-2 w-32 h-32 object-cover rounded border" />}
                        </div>
                        <div className="text-xs text-muted-foreground text-right min-w-[120px]">{entry.date}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ConsumerLayout>
  );
}