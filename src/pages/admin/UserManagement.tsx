import { useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  Search, 
  Filter, 
  UserCheck, 
  UserX, 
  Eye, 
  MessageSquare,
  Shield,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: "farmer" | "consumer";
  status: "active" | "suspended" | "pending";
  joinDate: string;
  location: string;
  totalOrders: number;
  revenue?: number;
  verificationStatus: "verified" | "pending" | "rejected";
}

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john@greenvalley.com",
      role: "farmer",
      status: "active",
      joinDate: "2024-01-15",
      location: "California, USA",
      totalOrders: 45,
      revenue: 2340.50,
      verificationStatus: "verified"
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@email.com",
      role: "consumer",
      status: "active",
      joinDate: "2024-02-20",
      location: "New York, USA",
      totalOrders: 12,
      verificationStatus: "verified"
    },
    {
      id: "3",
      name: "Mike Chen",
      email: "mike@sunnyacres.com",
      role: "farmer",
      status: "pending",
      joinDate: "2024-03-10",
      location: "Oregon, USA",
      totalOrders: 0,
      revenue: 0,
      verificationStatus: "pending"
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily@email.com",
      role: "consumer",
      status: "suspended",
      joinDate: "2024-01-30",
      location: "Texas, USA",
      totalOrders: 8,
      verificationStatus: "verified"
    },
    {
      id: "5",
      name: "Robert Wilson",
      email: "robert@riverside.com",
      role: "farmer",
      status: "active",
      joinDate: "2024-02-05",
      location: "Iowa, USA",
      totalOrders: 32,
      revenue: 1890.25,
      verificationStatus: "verified"
    }
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUserAction = (userId: string, action: string) => {
    setUsers(prev => {
      let updatedUsers = prev.map(user => {
        if (user.id === userId) {
          switch (action) {
            case "approve":
              return { ...user, status: "active" as const };
            case "suspend":
              return { ...user, status: "suspended" as const };
            case "activate":
              return { ...user, status: "active" as const };
            case "verify":
              return { ...user, verificationStatus: "verified" as const };
            default:
              return user;
          }
        }
        return user;
      });

      if (action === "suspend") {
        updatedUsers = updatedUsers.filter(user => user.id !== userId);
      }

      return updatedUsers;
    });

    const user = users.find(u => u.id === userId);
    switch (action) {
      case "approve":
        toast.success(`${user?.name} has been approved`);
        break;
      case "suspend":
        toast.success(`${user?.name} has been suspended and removed`);
        break;
      case "activate":
        toast.success(`${user?.name} has been activated`);
        break;
      case "verify":
        toast.success(`${user?.name} has been verified`);
        break;
      default:
        break;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-primary text-primary-foreground">Active</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-primary text-primary-foreground">Verified</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout currentPage="User Management">
      <div className="min-h-screen bg-muted/30 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">User Management 👥</h1>
            <p className="text-muted-foreground">
              Manage farmer and consumer accounts, verify users, and handle account status
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">{users.length}</p>
                  </div>
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Farmers</p>
                    <p className="text-2xl font-bold">
                      {users.filter(u => u.role === "farmer" && u.status === "active").length}
                    </p>
                  </div>
                  <UserCheck className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Consumers</p>
                    <p className="text-2xl font-bold">
                      {users.filter(u => u.role === "consumer" && u.status === "active").length}
                    </p>
                  </div>
                  <UserCheck className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Verification</p>
                    <p className="text-2xl font-bold">
                      {users.filter(u => u.verificationStatus === "pending").length}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="shadow-card mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="farmer">Farmers</SelectItem>
                    <SelectItem value="consumer">Consumers</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>All Users</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">{user.location}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === "farmer" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{getVerificationBadge(user.verificationStatus)}</TableCell>
                      <TableCell>{user.joinDate}</TableCell>
                      <TableCell>
                        <div>
                          <p>{user.totalOrders}</p>
                          {user.revenue && (
                            <p className="text-sm text-muted-foreground">
                              ${user.revenue.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedUser(user)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>User Details</DialogTitle>
                              </DialogHeader>
                              {selectedUser && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-muted-foreground">Name</p>
                                      <p className="font-medium">{selectedUser.name}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Email</p>
                                      <p className="font-medium">{selectedUser.email}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Role</p>
                                      <p className="font-medium">{selectedUser.role}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Status</p>
                                      {getStatusBadge(selectedUser.status)}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          {user.status === "pending" && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleUserAction(user.id, "approve")}
                            >
                              <UserCheck className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {user.status === "active" && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleUserAction(user.id, "suspend")}
                            >
                              <UserX className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {user.status === "suspended" && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleUserAction(user.id, "activate")}
                            >
                              <UserCheck className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No users found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}