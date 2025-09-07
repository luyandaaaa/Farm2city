import { useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings as SettingsIcon, 
  Mail, 
  Bell, 
  Shield, 
  Palette,
  Database,
  Zap,
  Globe,
  CreditCard,
  Users,
  FileText,
  Download
} from "lucide-react";
import { toast } from "sonner";

interface PlatformSettings {
  general: {
    platformName: string;
    platformDescription: string;
    supportEmail: string;
    supportPhone: string;
    maintenanceMode: boolean;
    allowNewRegistrations: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    adminAlerts: boolean;
    systemUpdates: boolean;
  };
  payment: {
    stripeEnabled: boolean;
    paypalEnabled: boolean;
    commissionRate: number;
    minimumPayout: number;
    payoutSchedule: string;
  };
  features: {
    cropAnalysis: boolean;
    weatherIntegration: boolean;
    aiRecommendations: boolean;
    biometricAuth: boolean;
    offlineMode: boolean;
  };
  limits: {
    maxUsersPerPlan: number;
    maxProductsPerFarmer: number;
    maxImageUploadSize: number;
    apiRateLimit: number;
  };
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<PlatformSettings>({
    general: {
      platformName: "Farm2City",
      platformDescription: "Connecting farmers directly with consumers for fresh, local produce",
      supportEmail: "support@farm2city.com",
      supportPhone: "+1 (555) 123-4567",
      maintenanceMode: false,
      allowNewRegistrations: true,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      adminAlerts: true,
      systemUpdates: true,
    },
    payment: {
      stripeEnabled: true,
      paypalEnabled: false,
      commissionRate: 5.0,
      minimumPayout: 50.0,
      payoutSchedule: "weekly",
    },
    features: {
      cropAnalysis: true,
      weatherIntegration: true,
      aiRecommendations: true,
      biometricAuth: true,
      offlineMode: true,
    },
    limits: {
      maxUsersPerPlan: 10000,
      maxProductsPerFarmer: 100,
      maxImageUploadSize: 5,
      apiRateLimit: 1000,
    },
  });

  const [apiKeys] = useState({
    openWeather: "3f3ddd58048f265f0b5ec4c455279f3b",
    stripe: "sk_test_...",
    twilio: "AC...",
    googleMaps: "AIza...",
  });

  const updateGeneralSettings = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      general: {
        ...prev.general,
        [field]: value
      }
    }));
  };

  const updateNotificationSettings = (field: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }));
  };

  const updatePaymentSettings = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        [field]: value
      }
    }));
  };

  const updateFeatureSettings = (field: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [field]: value
      }
    }));
  };

  const updateLimitSettings = (field: string, value: number) => {
    setSettings(prev => ({
      ...prev,
      limits: {
        ...prev.limits,
        [field]: value
      }
    }));
  };

  const saveSettings = () => {
    toast.success("Settings saved successfully!");
  };

  const exportData = () => {
    toast.success("Data export initiated. You'll receive an email when ready.");
  };

  const clearCache = () => {
    toast.success("Cache cleared successfully!");
  };

  const systemStats = {
    totalUsers: 1547,
    totalFarmers: 234,
    totalOrders: 5689,
    revenue: 45720.50,
    systemUptime: "99.8%",
    lastBackup: "2 hours ago",
  };

  return (
    <AdminLayout currentPage="Settings">
      <div className="min-h-screen bg-muted/30 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Settings ⚙️</h1>
            <p className="text-muted-foreground">
              Configure platform settings and system preferences
            </p>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6 mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SettingsIcon className="h-5 w-5" />
                    Platform Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="platformName">Platform Name</Label>
                      <Input
                        id="platformName"
                        value={settings.general.platformName}
                        onChange={(e) => updateGeneralSettings('platformName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supportEmail">Support Email</Label>
                      <Input
                        id="supportEmail"
                        type="email"
                        value={settings.general.supportEmail}
                        onChange={(e) => updateGeneralSettings('supportEmail', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="platformDescription">Platform Description</Label>
                    <Textarea
                      id="platformDescription"
                      value={settings.general.platformDescription}
                      onChange={(e) => updateGeneralSettings('platformDescription', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="supportPhone">Support Phone</Label>
                      <Input
                        id="supportPhone"
                        value={settings.general.supportPhone}
                        onChange={(e) => updateGeneralSettings('supportPhone', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Platform Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Temporarily disable access to the platform
                      </p>
                    </div>
                    <Switch
                      id="maintenanceMode"
                      checked={settings.general.maintenanceMode}
                      onCheckedChange={(checked) => updateGeneralSettings('maintenanceMode', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allowNewRegistrations">Allow New Registrations</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow new users to register on the platform
                      </p>
                    </div>
                    <Switch
                      id="allowNewRegistrations"
                      checked={settings.general.allowNewRegistrations}
                      onCheckedChange={(checked) => updateGeneralSettings('allowNewRegistrations', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={saveSettings}>Save General Settings</Button>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6 mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send notifications via email
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={settings.notifications.emailNotifications}
                      onCheckedChange={(checked) => updateNotificationSettings('emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="smsNotifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send notifications via SMS
                      </p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={settings.notifications.smsNotifications}
                      onCheckedChange={(checked) => updateNotificationSettings('smsNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="pushNotifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send browser push notifications
                      </p>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={settings.notifications.pushNotifications}
                      onCheckedChange={(checked) => updateNotificationSettings('pushNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="adminAlerts">Admin Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts for critical system events
                      </p>
                    </div>
                    <Switch
                      id="adminAlerts"
                      checked={settings.notifications.adminAlerts}
                      onCheckedChange={(checked) => updateNotificationSettings('adminAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="systemUpdates">System Update Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify about system updates and maintenance
                      </p>
                    </div>
                    <Switch
                      id="systemUpdates"
                      checked={settings.notifications.systemUpdates}
                      onCheckedChange={(checked) => updateNotificationSettings('systemUpdates', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={saveSettings}>Save Notification Settings</Button>
              </div>
            </TabsContent>

            <TabsContent value="payment" className="space-y-6 mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Gateway Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="stripeEnabled">Stripe Integration</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable Stripe payment processing
                      </p>
                    </div>
                    <Switch
                      id="stripeEnabled"
                      checked={settings.payment.stripeEnabled}
                      onCheckedChange={(checked) => updatePaymentSettings('stripeEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="paypalEnabled">PayPal Integration</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable PayPal payment processing
                      </p>
                    </div>
                    <Switch
                      id="paypalEnabled"
                      checked={settings.payment.paypalEnabled}
                      onCheckedChange={(checked) => updatePaymentSettings('paypalEnabled', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Fee Structure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                      <Input
                        id="commissionRate"
                        type="number"
                        step="0.1"
                        value={settings.payment.commissionRate}
                        onChange={(e) => updatePaymentSettings('commissionRate', parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minimumPayout">Minimum Payout ($)</Label>
                      <Input
                        id="minimumPayout"
                        type="number"
                        value={settings.payment.minimumPayout}
                        onChange={(e) => updatePaymentSettings('minimumPayout', parseFloat(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payoutSchedule">Payout Schedule</Label>
                    <select
                      id="payoutSchedule"
                      value={settings.payment.payoutSchedule}
                      onChange={(e) => updatePaymentSettings('payoutSchedule', e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={saveSettings}>Save Payment Settings</Button>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-6 mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Platform Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="cropAnalysis">Crop Analysis</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable AI-powered crop health analysis
                      </p>
                    </div>
                    <Switch
                      id="cropAnalysis"
                      checked={settings.features.cropAnalysis}
                      onCheckedChange={(checked) => updateFeatureSettings('cropAnalysis', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weatherIntegration">Weather Integration</Label>
                      <p className="text-sm text-muted-foreground">
                        Integrate real-time weather data
                      </p>
                    </div>
                    <Switch
                      id="weatherIntegration"
                      checked={settings.features.weatherIntegration}
                      onCheckedChange={(checked) => updateFeatureSettings('weatherIntegration', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="aiRecommendations">AI Recommendations</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable personalized AI recommendations
                      </p>
                    </div>
                    <Switch
                      id="aiRecommendations"
                      checked={settings.features.aiRecommendations}
                      onCheckedChange={(checked) => updateFeatureSettings('aiRecommendations', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="biometricAuth">Biometric Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow biometric login methods
                      </p>
                    </div>
                    <Switch
                      id="biometricAuth"
                      checked={settings.features.biometricAuth}
                      onCheckedChange={(checked) => updateFeatureSettings('biometricAuth', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="offlineMode">Offline Mode (USSD)</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable USSD access for offline users
                      </p>
                    </div>
                    <Switch
                      id="offlineMode"
                      checked={settings.features.offlineMode}
                      onCheckedChange={(checked) => updateFeatureSettings('offlineMode', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>System Limits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxUsersPerPlan">Max Users Per Plan</Label>
                      <Input
                        id="maxUsersPerPlan"
                        type="number"
                        value={settings.limits.maxUsersPerPlan}
                        onChange={(e) => updateLimitSettings('maxUsersPerPlan', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxProductsPerFarmer">Max Products Per Farmer</Label>
                      <Input
                        id="maxProductsPerFarmer"
                        type="number"
                        value={settings.limits.maxProductsPerFarmer}
                        onChange={(e) => updateLimitSettings('maxProductsPerFarmer', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxImageUploadSize">Max Image Upload Size (MB)</Label>
                      <Input
                        id="maxImageUploadSize"
                        type="number"
                        value={settings.limits.maxImageUploadSize}
                        onChange={(e) => updateLimitSettings('maxImageUploadSize', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apiRateLimit">API Rate Limit (requests/hour)</Label>
                      <Input
                        id="apiRateLimit"
                        type="number"
                        value={settings.limits.apiRateLimit}
                        onChange={(e) => updateLimitSettings('apiRateLimit', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={saveSettings}>Save Feature Settings</Button>
              </div>
            </TabsContent>

            <TabsContent value="system" className="space-y-6 mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    System Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold">{systemStats.totalUsers.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Users</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold">{systemStats.totalFarmers.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Farmers</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold">{systemStats.totalOrders.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Orders</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold">${systemStats.revenue.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Revenue</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold">{systemStats.systemUptime}</div>
                      <div className="text-sm text-muted-foreground">System Uptime</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold">{systemStats.lastBackup}</div>
                      <div className="text-sm text-muted-foreground">Last Backup</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>System Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={clearCache}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Clear System Cache
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={exportData}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Platform Data
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate System Report
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Emergency Shutdown
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6 mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    API Keys & Integrations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="openWeatherApi">OpenWeather API Key</Label>
                    <Input
                      id="openWeatherApi"
                      type="password"
                      value={apiKeys.openWeather}
                      placeholder="Enter OpenWeather API key"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stripeApi">Stripe API Key</Label>
                    <Input
                      id="stripeApi"
                      type="password"
                      value={apiKeys.stripe}
                      placeholder="Enter Stripe API key"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twilioApi">Twilio API Key</Label>
                    <Input
                      id="twilioApi"
                      type="password"
                      value={apiKeys.twilio}
                      placeholder="Enter Twilio API key"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="googleMapsApi">Google Maps API Key</Label>
                    <Input
                      id="googleMapsApi"
                      type="password"
                      value={apiKeys.googleMaps}
                      placeholder="Enter Google Maps API key"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Integration Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { service: "OpenWeather API", status: "connected", lastSync: "5 minutes ago" },
                      { service: "Stripe Payment", status: "connected", lastSync: "Active" },
                      { service: "Twilio SMS", status: "disconnected", lastSync: "N/A" },
                      { service: "Google Maps", status: "connected", lastSync: "Active" }
                    ].map((integration, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{integration.service}</p>
                          <p className="text-sm text-muted-foreground">
                            Last sync: {integration.lastSync}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            integration.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <span className="text-sm capitalize">{integration.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={saveSettings}>Save Integration Settings</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
}