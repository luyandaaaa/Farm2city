import { useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare,
  Scale,
  User,
  Truck,
  DollarSign,
  Calendar
} from "lucide-react";
import { toast } from "sonner";

interface Dispute {
  id: string;
  type: "order" | "quality" | "delivery" | "payment" | "other";
  status: "open" | "investigating" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  consumer: {
    id: string;
    name: string;
    email: string;
  };
  farmer: {
    id: string;
    name: string;
    farmName: string;
    email: string;
  };
  orderDetails: {
    orderId: string;
    amount: number;
    date: string;
    products: string[];
  };
  complaint: {
    subject: string;
    description: string;
    evidence: string[];
    submissionDate: string;
  };
  resolution?: {
    decision: string;
    compensation?: number;
    notes: string;
    resolvedBy: string;
    resolvedDate: string;
  };
  messages: Array<{
    id: string;
    sender: "admin" | "consumer" | "farmer";
    senderName: string;
    message: string;
    timestamp: string;
  }>;
}

export default function DisputeResolution() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  
  const [disputes, setDisputes] = useState<Dispute[]>([
    {
      id: "DISP-001",
      type: "quality",
      status: "investigating",
      priority: "high",
      consumer: {
        id: "CONS-001",
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com"
      },
      farmer: {
        id: "FARM-001",
        name: "John Martinez",
        farmName: "Green Valley Farm",
        email: "john@greenvalley.com"
      },
      orderDetails: {
        orderId: "ORD-12345",
        amount: 45.80,
        date: "2024-08-25",
        products: ["Organic Tomatoes", "Fresh Lettuce", "Bell Peppers"]
      },
      complaint: {
        subject: "Received spoiled vegetables",
        description: "The tomatoes and lettuce arrived in poor condition, showing signs of spoilage. This is unacceptable for organic produce.",
        evidence: ["photo1.jpg", "photo2.jpg"],
        submissionDate: "2024-08-26"
      },
      messages: [
        {
          id: "MSG-001",
          sender: "consumer",
          senderName: "Sarah Johnson",
          message: "The vegetables I received were not fresh. I'm very disappointed.",
          timestamp: "2024-08-26T10:30:00Z"
        },
        {
          id: "MSG-002",
          sender: "admin",
          senderName: "Admin Support",
          message: "We've received your complaint and are investigating this matter. We'll contact the farmer for their response.",
          timestamp: "2024-08-26T11:15:00Z"
        }
      ]
    },
    {
      id: "DISP-002",
      type: "delivery",
      status: "open",
      priority: "medium",
      consumer: {
        id: "CONS-002",
        name: "Michael Chen",
        email: "michael.chen@email.com"
      },
      farmer: {
        id: "FARM-002",
        name: "Maria Rodriguez",
        farmName: "Sunny Acres",
        email: "maria@sunnyacres.com"
      },
      orderDetails: {
        orderId: "ORD-67890",
        amount: 32.50,
        date: "2024-08-28",
        products: ["Organic Carrots", "Sweet Corn"]
      },
      complaint: {
        subject: "Order never delivered",
        description: "My order was supposed to be delivered yesterday but I never received it. No one was available when I called customer service.",
        evidence: [],
        submissionDate: "2024-08-29"
      },
      messages: [
        {
          id: "MSG-003",
          sender: "consumer",
          senderName: "Michael Chen",
          message: "Where is my order? It was supposed to arrive yesterday.",
          timestamp: "2024-08-29T09:00:00Z"
        }
      ]
    },
    {
      id: "DISP-003",
      type: "payment",
      status: "resolved",
      priority: "low",
      consumer: {
        id: "CONS-003",
        name: "Emily Davis",
        email: "emily.davis@email.com"
      },
      farmer: {
        id: "FARM-003",
        name: "Robert Kim",
        farmName: "Riverside Gardens",
        email: "robert@riverside.com"
      },
      orderDetails: {
        orderId: "ORD-11111",
        amount: 28.90,
        date: "2024-08-20",
        products: ["Fresh Herbs", "Cherry Tomatoes"]
      },
      complaint: {
        subject: "Charged twice for the same order",
        description: "I was charged twice for order ORD-11111. Please refund the duplicate charge.",
        evidence: ["receipt1.pdf", "receipt2.pdf"],
        submissionDate: "2024-08-21"
      },
      resolution: {
        decision: "Refund approved for duplicate charge",
        compensation: 28.90,
        notes: "Confirmed duplicate charge due to system error. Full refund processed.",
        resolvedBy: "Admin Team",
        resolvedDate: "2024-08-22"
      },
      messages: [
        {
          id: "MSG-004",
          sender: "consumer",
          senderName: "Emily Davis",
          message: "I've been charged twice for the same order. Can you help?",
          timestamp: "2024-08-21T14:20:00Z"
        },
        {
          id: "MSG-005",
          sender: "admin",
          senderName: "Admin Support",
          message: "We've reviewed your case and confirmed the duplicate charge. A refund has been processed.",
          timestamp: "2024-08-22T10:00:00Z"
        }
      ]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "destructive";
      case "investigating": return "outline";
      case "resolved": return "default";
      case "closed": return "secondary";
      default: return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "order": return <Truck className="h-4 w-4" />;
      case "quality": return <AlertTriangle className="h-4 w-4" />;
      case "delivery": return <Truck className="h-4 w-4" />;
      case "payment": return <DollarSign className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const resolveDispute = (disputeId: string, decision: string, compensation?: number) => {
    setDisputes(prev => 
      prev.map(dispute => 
        dispute.id === disputeId 
          ? {
              ...dispute,
              status: "resolved" as const,
              resolution: {
                decision,
                compensation,
                notes: "Dispute resolved by admin team",
                resolvedBy: "Admin Team",
                resolvedDate: new Date().toISOString().split('T')[0]
              }
            }
          : dispute
      )
    );
    toast.success("Dispute resolved successfully!");
  };

  const addMessage = (disputeId: string) => {
    if (!newMessage.trim()) return;

    const newMsg = {
      id: `MSG-${Date.now()}`,
      sender: "admin" as const,
      senderName: "Admin Support",
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    setDisputes(prev => 
      prev.map(dispute => 
        dispute.id === disputeId 
          ? { ...dispute, messages: [...dispute.messages, newMsg] }
          : dispute
      )
    );
    
    setNewMessage("");
    toast.success("Message sent");
  };

  const filteredDisputes = disputes.filter(dispute => {
    const matchesSearch = 
      dispute.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.consumer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.complaint.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || dispute.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: disputes.length,
    open: disputes.filter(d => d.status === "open").length,
    investigating: disputes.filter(d => d.status === "investigating").length,
    resolved: disputes.filter(d => d.status === "resolved").length,
    urgent: disputes.filter(d => d.priority === "urgent").length,
  };

  return (
    <AdminLayout currentPage="Dispute Resolution">
      <div className="min-h-screen bg-muted/30 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dispute Resolution ⚖️</h1>
            <p className="text-muted-foreground">
              Manage and resolve disputes between farmers and consumers
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Total Disputes</div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.open}</div>
                  <div className="text-sm text-muted-foreground">Open</div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.investigating}</div>
                  <div className="text-sm text-muted-foreground">Investigating</div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
                  <div className="text-sm text-muted-foreground">Resolved</div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
                  <div className="text-sm text-muted-foreground">Urgent</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search disputes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Disputes List */}
          <div className="space-y-6">
            {filteredDisputes.map((dispute) => (
              <Card key={dispute.id} className="shadow-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getTypeIcon(dispute.type)}
                        {dispute.complaint.subject}
                        <Badge variant={getStatusColor(dispute.status)}>
                          {dispute.status.toUpperCase()}
                        </Badge>
                        <Badge className={getPriorityColor(dispute.priority)}>
                          {dispute.priority.toUpperCase()}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Dispute ID: {dispute.id} • Submitted on {new Date(dispute.complaint.submissionDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="order">Order Info</TabsTrigger>
                      <TabsTrigger value="communication">Messages</TabsTrigger>
                      <TabsTrigger value="resolution">Resolution</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Consumer Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p><strong>Name:</strong> {dispute.consumer.name}</p>
                            <p><strong>Email:</strong> {dispute.consumer.email}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Farmer Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p><strong>Name:</strong> {dispute.farmer.name}</p>
                            <p><strong>Farm:</strong> {dispute.farmer.farmName}</p>
                            <p><strong>Email:</strong> {dispute.farmer.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">Complaint Description</h4>
                        <p className="text-sm text-muted-foreground">{dispute.complaint.description}</p>
                      </div>

                      {dispute.complaint.evidence.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-3">Evidence</h4>
                          <div className="flex flex-wrap gap-2">
                            {dispute.complaint.evidence.map((file, index) => (
                              <Badge key={index} variant="outline">{file}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="order" className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">Order Information</h4>
                          <div className="space-y-2 text-sm">
                            <p><strong>Order ID:</strong> {dispute.orderDetails.orderId}</p>
                            <p><strong>Order Date:</strong> {new Date(dispute.orderDetails.date).toLocaleDateString()}</p>
                            <p><strong>Total Amount:</strong> R{dispute.orderDetails.amount.toFixed(2)}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-3">Products Ordered</h4>
                          <div className="space-y-1">
                            {dispute.orderDetails.products.map((product, index) => (
                              <div key={index} className="text-sm">• {product}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="communication" className="space-y-4 mt-4">
                      <div className="space-y-4 max-h-64 overflow-y-auto">
                        {dispute.messages.map((message) => (
                          <div 
                            key={message.id} 
                            className={`p-3 rounded-lg ${
                              message.sender === 'admin' 
                                ? 'bg-primary/10 ml-8' 
                                : 'bg-muted mr-8'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium text-sm">{message.senderName}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(message.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm">{message.message}</p>
                          </div>
                        ))}
                      </div>
                      
                      {dispute.status !== "resolved" && dispute.status !== "closed" && (
                        <div className="mt-4">
                          <div className="flex gap-2">
                            <Textarea
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              placeholder="Type your message..."
                              className="flex-1"
                              rows={2}
                            />
                            <Button onClick={() => addMessage(dispute.id)}>
                              Send
                            </Button>
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="resolution" className="space-y-4 mt-4">
                      {dispute.resolution ? (
                        <div className="space-y-4">
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              Dispute Resolved
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p><strong>Decision:</strong> {dispute.resolution.decision}</p>
                              {dispute.resolution.compensation && (
                                <p><strong>Compensation:</strong> R{dispute.resolution.compensation.toFixed(2)}</p>
                              )}
                              <p><strong>Notes:</strong> {dispute.resolution.notes}</p>
                              <p><strong>Resolved by:</strong> {dispute.resolution.resolvedBy}</p>
                              <p><strong>Date:</strong> {new Date(dispute.resolution.resolvedDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <h4 className="font-medium">Resolve Dispute</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <Button 
                              onClick={() => resolveDispute(dispute.id, "Consumer refund approved")}
                              className="flex items-center gap-2"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Refund Consumer
                            </Button>
                            <Button 
                              onClick={() => resolveDispute(dispute.id, "No refund - dispute invalid")}
                              variant="outline"
                              className="flex items-center gap-2"
                            >
                              <XCircle className="h-4 w-4" />
                              Reject Claim
                            </Button>
                            <Button 
                              onClick={() => resolveDispute(dispute.id, "Partial refund - compromise reached", dispute.orderDetails.amount * 0.5)}
                              variant="secondary"
                              className="flex items-center gap-2"
                            >
                              <Scale className="h-4 w-4" />
                              Partial Refund
                            </Button>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDisputes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No disputes found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}