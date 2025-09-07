import { useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Lock, 
  Key, 
  Activity,
  Users,
  FileText,
  Wifi,
  Database,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { toast } from "sonner";

interface SecurityEvent {
  id: string;
  type: "login" | "data_access" | "configuration_change" | "suspicious_activity" | "failed_login";
  severity: "low" | "medium" | "high" | "critical";
  user: string;
  description: string;
  timestamp: string;
  ipAddress: string;
  location: string;
  status: "resolved" | "investigating" | "open";
}

interface SecuritySetting {
  id: string;
  category: string;
  name: string;
  description: string;
  enabled: boolean;
  critical: boolean;
}

export default function Security() {
  const [securityEvents] = useState<SecurityEvent[]>([
    {
      id: "SEC-001",
      type: "failed_login",
      severity: "medium",
      user: "unknown",
      description: "Multiple failed login attempts from suspicious IP",
      timestamp: "2024-08-30T14:30:00Z",
      ipAddress: "192.168.1.100",
      location: "Unknown Location",
      status: "investigating"
    },
    {
      id: "SEC-002",
      type: "configuration_change",
      severity: "high",
      user: "admin@farm2city.com",
      description: "Security settings modified",
      timestamp: "2024-08-30T10:15:00Z",
      ipAddress: "10.0.0.50",
      location: "San Francisco, CA",
      status: "resolved"
    },
    {
      id: "SEC-003",
      type: "data_access",
      severity: "low",
      user: "support@farm2city.com",
      description: "Bulk user data export",
      timestamp: "2024-08-29T16:45:00Z",
      ipAddress: "10.0.0.25",
      location: "San Francisco, CA",
      status: "resolved"
    }
  ]);

  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([
    {
      id: "set-001",
      category: "Authentication",
      name: "Two-Factor Authentication",
      description: "Require 2FA for all admin accounts",
      enabled: true,
      critical: true
    },
    {
      id: "set-002",
      category: "Authentication",
      name: "Password Complexity",
      description: "Enforce strong password requirements",
      enabled: true,
      critical: true
    },
    {
      id: "set-003",
      category: "Authentication",
      name: "Session Timeout",
      description: "Auto-logout after 30 minutes of inactivity",
      enabled: true,
      critical: false
    },
    {
      id: "set-004",
      category: "Access Control",
      name: "IP Whitelisting",
      description: "Restrict admin access to specific IP ranges",
      enabled: false,
      critical: false
    },
    {
      id: "set-005",
      category: "Access Control",
      name: "Role-Based Permissions",
      description: "Strict role-based access control",
      enabled: true,
      critical: true
    },
    {
      id: "set-006",
      category: "Monitoring",
      name: "Real-time Alerts",
      description: "Instant notifications for security events",
      enabled: true,
      critical: false
    },
    {
      id: "set-007",
      category: "Monitoring",
      name: "Audit Logging",
      description: "Comprehensive activity logging",
      enabled: true,
      critical: true
    },
    {
      id: "set-008",
      category: "Data Protection",
      name: "Encryption at Rest",
      description: "Encrypt sensitive data in database",
      enabled: true,
      critical: true
    },
    {
      id: "set-009",
      category: "Data Protection",
      name: "Data Backup Encryption",
      description: "Encrypt all backup files",
      enabled: true,
      critical: true
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "default";
      case "investigating": return "outline";
      case "open": return "destructive";
      default: return "secondary";
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "login": return <Users className="h-4 w-4" />;
      case "data_access": return <Database className="h-4 w-4" />;
      case "configuration_change": return <Lock className="h-4 w-4" />;
      case "suspicious_activity": return <AlertTriangle className="h-4 w-4" />;
      case "failed_login": return <XCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const toggleSetting = (settingId: string) => {
    setSecuritySettings(prev => 
      prev.map(setting => 
        setting.id === settingId 
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
    toast.success("Security setting updated");
  };

  const [securityEventsState, setSecurityEventsState] = useState(securityEvents);

  const resolveEvent = (eventId: string) => {
    setSecurityEventsState(prev => {
      const updated = prev.map(event => 
        event.id === eventId 
          ? { ...event, status: "resolved" as const }
          : event
      );
      
      // Save to localStorage
      localStorage.setItem("securityEvents", JSON.stringify(updated));
      return updated;
    });
    
    toast.success("Security event marked as resolved");
  };

  const systemHealth = {
    overallScore: 87,
    components: [
      { name: "Authentication System", status: "healthy", uptime: "99.9%" },
      { name: "Data Encryption", status: "healthy", uptime: "100%" },
      { name: "Firewall", status: "healthy", uptime: "99.8%" },
      { name: "Intrusion Detection", status: "warning", uptime: "98.5%" },
      { name: "Backup Systems", status: "healthy", uptime: "99.9%" }
    ]
  };

  const securityMetrics = {
    eventsToday: 12,
    threatsBlocked: 45,
    failedLogins: 8,
    activeUsers: 156,
    dataBreaches: 0,
    compliance: 94
  };

  return (
    <AdminLayout currentPage="Security">
      <div className="min-h-screen bg-muted/30 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Security & Monitoring 🔒</h1>
            <p className="text-muted-foreground">
              Monitor system security and manage security configurations
            </p>
          </div>

          {/* Security Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{systemHealth.overallScore}%</p>
                    <p className="text-sm text-muted-foreground">Security Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-red-600">{securityMetrics.threatsBlocked}</p>
                    <p className="text-sm text-muted-foreground">Threats Blocked Today</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-green-600">{securityMetrics.dataBreaches}</p>
                    <p className="text-sm text-muted-foreground">Data Breaches</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="events">Security Events</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="monitoring">System Health</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="shadow-card">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{securityMetrics.eventsToday}</div>
                      <div className="text-sm text-muted-foreground">Events Today</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-card">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{securityMetrics.failedLogins}</div>
                      <div className="text-sm text-muted-foreground">Failed Logins</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-card">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{securityMetrics.activeUsers}</div>
                      <div className="text-sm text-muted-foreground">Active Users</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-card">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{securityMetrics.compliance}%</div>
                      <div className="text-sm text-muted-foreground">Compliance</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Recent Security Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                       {securityEventsState.slice(0, 3).map((event) => (
                        <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="p-2 bg-muted rounded-lg">
                            {getEventIcon(event.type)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{event.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(event.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <Badge className={getSeverityColor(event.severity)}>
                            {event.severity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Key className="h-4 w-4 mr-2" />
                      Force Password Reset for All Users
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Lock className="h-4 w-4 mr-2" />
                      Enable Emergency Lockdown
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Security Report
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Database className="h-4 w-4 mr-2" />
                      Backup Security Logs
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-6 mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Security Events</h3>
                <div className="flex gap-2">
                  <Input placeholder="Search events..." className="w-64" />
                  <Button variant="outline">Filter</Button>
                </div>
              </div>

               <div className="space-y-4">
                 {securityEventsState.map((event) => (
                  <Card key={event.id} className="shadow-card">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-muted rounded-lg">
                            {getEventIcon(event.type)}
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{event.description}</h4>
                              <Badge className={getSeverityColor(event.severity)}>
                                {event.severity}
                              </Badge>
                              <Badge variant={getStatusColor(event.status)}>
                                {event.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div className="flex items-center gap-4">
                                <span>User: {event.user}</span>
                                <span>IP: {event.ipAddress}</span>
                                <span>Location: {event.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(event.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                        {event.status !== "resolved" && (
                          <Button 
                            size="sm" 
                            onClick={() => resolveEvent(event.id)}
                          >
                            Mark Resolved
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6 mt-6">
              <div className="space-y-6">
                {["Authentication", "Access Control", "Monitoring", "Data Protection"].map((category) => (
                  <Card key={category} className="shadow-card">
                    <CardHeader>
                      <CardTitle>{category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {securitySettings
                          .filter(setting => setting.category === category)
                          .map((setting) => (
                            <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Label htmlFor={setting.id} className="font-medium">
                                    {setting.name}
                                  </Label>
                                  {setting.critical && (
                                    <Badge variant="destructive" className="text-xs">
                                      Critical
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {setting.description}
                                </p>
                              </div>
                              <Switch
                                id={setting.id}
                                checked={setting.enabled}
                                onCheckedChange={() => toggleSetting(setting.id)}
                              />
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-6 mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    System Health Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemHealth.components.map((component, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            component.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}></div>
                          <div>
                            <p className="font-medium">{component.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Status: {component.status}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{component.uptime}</p>
                          <p className="text-sm text-muted-foreground">Uptime</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Network Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Firewall Status</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>VPN Connections</span>
                        <span>12 Active</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>DDoS Protection</span>
                        <Badge variant="default">Enabled</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>SSL Certificate</span>
                        <Badge variant="default">Valid</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Database Security</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Encryption</span>
                        <Badge variant="default">AES-256</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Backup Status</span>
                        <Badge variant="default">Current</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Access Monitoring</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Last Backup</span>
                        <span>2 hours ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>GDPR Compliance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">98%</div>
                      <div className="text-sm text-muted-foreground">Compliance Score</div>
                      <Badge variant="default" className="mt-2">Compliant</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>SOC 2 Type II</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
                      <div className="text-sm text-muted-foreground">Compliance Score</div>
                      <Badge variant="default" className="mt-2">Certified</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>ISO 27001</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-yellow-600 mb-2">89%</div>
                      <div className="text-sm text-muted-foreground">Compliance Score</div>
                      <Badge variant="outline" className="mt-2">In Progress</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Compliance Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { task: "Update privacy policy", status: "completed", due: "2024-08-30" },
                      { task: "Conduct security audit", status: "in_progress", due: "2024-09-15" },
                      { task: "Review access controls", status: "pending", due: "2024-09-30" },
                      { task: "Update incident response plan", status: "pending", due: "2024-10-15" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{item.task}</p>
                          <p className="text-sm text-muted-foreground">Due: {item.due}</p>
                        </div>
                        <Badge variant={
                          item.status === 'completed' ? 'default' : 
                          item.status === 'in_progress' ? 'outline' : 'secondary'
                        }>
                          {item.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
}