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
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  Calendar,
  FileText,
  User,
  Phone,
  Mail,
  Landmark
} from "lucide-react";
import { toast } from "sonner";

interface FarmerApplication {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
  };
  farmInfo: {
    farmName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    farmSize: string;
    farmType: string;
    certifications: string[];
  };
  businessInfo: {
    businessLicense: string;
    taxId: string;
    insuranceProvider: string;
    bankAccount: string;
  };
  status: "pending" | "approved" | "rejected" | "under_review";
  submissionDate: string;
  reviewNotes?: string;
  documents: {
    businessLicense: boolean;
    farmCertification: boolean;
    identityVerification: boolean;
    insuranceProof: boolean;
  };
}

export default function FarmerApplications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const [applications, setApplications] = useState<FarmerApplication[]>([
    {
      id: "APP-001",
      personalInfo: {
        firstName: "John",
        lastName: "Anderson",
        email: "john.anderson@email.com",
        phone: "+1 (555) 123-4567",
        dateOfBirth: "1985-06-15"
      },
      farmInfo: {
        farmName: "Anderson Organic Farm",
        address: "1234 Farm Road",
        city: "Sacramento",
        state: "CA",
        zipCode: "95814",
        farmSize: "25 acres",
        farmType: "Organic Vegetables",
        certifications: ["USDA Organic", "Fair Trade"]
      },
      businessInfo: {
        businessLicense: "BL-12345",
        taxId: "12-3456789",
        insuranceProvider: "Farm Insurance Co.",
        bankAccount: "****-1234"
      },
      status: "pending",
      submissionDate: "2024-08-28",
      documents: {
        businessLicense: true,
        farmCertification: true,
        identityVerification: true,
        insuranceProof: false
      }
    },
    {
      id: "APP-002",
      personalInfo: {
        firstName: "Maria",
        lastName: "Rodriguez",
        email: "maria.rodriguez@email.com",
        phone: "+1 (555) 987-6543",
        dateOfBirth: "1978-03-22"
      },
      farmInfo: {
        farmName: "Golden Valley Produce",
        address: "5678 Valley Avenue",
        city: "Fresno",
        state: "CA",
        zipCode: "93650",
        farmSize: "40 acres",
        farmType: "Mixed Vegetables & Fruits",
        certifications: ["GAP Certified", "Sustainable Agriculture"]
      },
      businessInfo: {
        businessLicense: "BL-67890",
        taxId: "98-7654321",
        insuranceProvider: "AgriSecure Insurance",
        bankAccount: "****-5678"
      },
      status: "under_review",
      submissionDate: "2024-08-25",
      reviewNotes: "Pending final insurance verification",
      documents: {
        businessLicense: true,
        farmCertification: true,
        identityVerification: true,
        insuranceProof: true
      }
    },
    {
      id: "APP-003",
      personalInfo: {
        firstName: "David",
        lastName: "Chen",
        email: "david.chen@email.com",
        phone: "+1 (555) 456-7890",
        dateOfBirth: "1990-11-08"
      },
      farmInfo: {
        farmName: "TechFarm Solutions",
        address: "9012 Innovation Drive",
        city: "San Jose",
        state: "CA",
        zipCode: "95134",
        farmSize: "15 acres",
        farmType: "Hydroponic Vegetables",
        certifications: ["Certified Naturally Grown"]
      },
      businessInfo: {
        businessLicense: "BL-24680",
        taxId: "24-6802468",
        insuranceProvider: "Modern Agri Insurance",
        bankAccount: "****-9012"
      },
      status: "approved",
      submissionDate: "2024-08-20",
      reviewNotes: "All requirements met. Approved for platform.",
      documents: {
        businessLicense: true,
        farmCertification: true,
        identityVerification: true,
        insuranceProof: true
      }
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "secondary";
      case "under_review": return "outline";
      case "approved": return "default";
      case "rejected": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "under_review": return <FileText className="h-4 w-4" />;
      case "approved": return <CheckCircle className="h-4 w-4" />;
      case "rejected": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const approveApplication = (applicationId: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: "approved" as const, reviewNotes: "Application approved" }
          : app
      )
    );
    toast.success("Application approved successfully!");
  };

  const rejectApplication = (applicationId: string, reason: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: "rejected" as const, reviewNotes: reason }
          : app
      )
    );
    toast.success("Application rejected");
  };

  const requestMoreInfo = (applicationId: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: "under_review" as const, reviewNotes: "Additional information requested" }
          : app
      )
    );
    toast.success("Information request sent to farmer");
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.personalInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.personalInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.farmInfo.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === "pending").length,
    underReview: applications.filter(app => app.status === "under_review").length,
    approved: applications.filter(app => app.status === "approved").length,
    rejected: applications.filter(app => app.status === "rejected").length,
  };

  return (
    <AdminLayout currentPage="Farmer Applications">
      <div className="min-h-screen bg-muted/30 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Farmer Applications 📋</h1>
            <p className="text-muted-foreground">
              Review and manage farmer registration applications
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Total Applications</div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.underReview}</div>
                  <div className="text-sm text-muted-foreground">Under Review</div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                  <div className="text-sm text-muted-foreground">Approved</div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                  <div className="text-sm text-muted-foreground">Rejected</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search applications..."
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
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Applications List */}
          <div className="space-y-6">
            {filteredApplications.map((application) => (
              <Card key={application.id} className="shadow-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Application {application.id}
                        <Badge variant={getStatusColor(application.status)} className="flex items-center gap-1">
                          {getStatusIcon(application.status)}
                          {application.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Submitted on {new Date(application.submissionDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <Tabs defaultValue="personal" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="personal">Personal Info</TabsTrigger>
                      <TabsTrigger value="farm">Farm Details</TabsTrigger>
                      <TabsTrigger value="business">Business Info</TabsTrigger>
                      <TabsTrigger value="documents">Documents</TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal" className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">
                                {application.personalInfo.firstName} {application.personalInfo.lastName}
                              </p>
                              <p className="text-sm text-muted-foreground">Full Name</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{application.personalInfo.email}</p>
                              <p className="text-sm text-muted-foreground">Email Address</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{application.personalInfo.phone}</p>
                              <p className="text-sm text-muted-foreground">Phone Number</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">
                                {new Date(application.personalInfo.dateOfBirth).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-muted-foreground">Date of Birth</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="farm" className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <p className="font-medium text-lg">{application.farmInfo.farmName}</p>
                            <p className="text-sm text-muted-foreground">Farm Name</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                            <div>
                              <p className="font-medium">
                                {application.farmInfo.address}<br />
                                {application.farmInfo.city}, {application.farmInfo.state} {application.farmInfo.zipCode}
                              </p>
                              <p className="text-sm text-muted-foreground">Farm Address</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="font-medium">{application.farmInfo.farmSize}</p>
                            <p className="text-sm text-muted-foreground">Farm Size</p>
                          </div>
                          <div>
                            <p className="font-medium">{application.farmInfo.farmType}</p>
                            <p className="text-sm text-muted-foreground">Farm Type</p>
                          </div>
                          <div>
                            <div className="flex flex-wrap gap-1">
                              {application.farmInfo.certifications.map((cert, index) => (
                                <Badge key={index} variant="outline">{cert}</Badge>
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">Certifications</p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="business" className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{application.businessInfo.businessLicense}</p>
                              <p className="text-sm text-muted-foreground">Business License</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Landmark className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{application.businessInfo.taxId}</p>
                              <p className="text-sm text-muted-foreground">Tax ID</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="font-medium">{application.businessInfo.insuranceProvider}</p>
                            <p className="text-sm text-muted-foreground">Insurance Provider</p>
                          </div>
                          <div>
                            <p className="font-medium">{application.businessInfo.bankAccount}</p>
                            <p className="text-sm text-muted-foreground">Bank Account</p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="documents" className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(application.documents).map(([doc, submitted]) => (
                          <div key={doc} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium capitalize">
                                {doc.replace(/([A-Z])/g, ' $1').trim()}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {submitted ? 'Document uploaded' : 'Document missing'}
                              </p>
                            </div>
                            <Badge variant={submitted ? "default" : "destructive"}>
                              {submitted ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                              {submitted ? 'Submitted' : 'Missing'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Review Notes */}
                  {application.reviewNotes && (
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Review Notes</h4>
                      <p className="text-sm text-muted-foreground">{application.reviewNotes}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {application.status === "pending" || application.status === "under_review" ? (
                    <div className="mt-6 flex flex-wrap gap-2">
                      <Button 
                        onClick={() => approveApplication(application.id)}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => rejectApplication(application.id, "Application rejected after review")}
                        className="flex items-center gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => requestMoreInfo(application.id)}
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Request More Info
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-6">
                      <Badge variant={getStatusColor(application.status)} className="flex items-center gap-1 w-fit">
                        {getStatusIcon(application.status)}
                        Application {application.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No applications found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}