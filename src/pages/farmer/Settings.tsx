import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, 
  Bell, 
  Shield, 
  Palette, 
  Volume2,
  Moon,
  Sun,
  Smartphone,
  Mail,
  MessageSquare,
  Eye,
  Settings as SettingsIcon
} from "lucide-react";
import { FarmerLayout } from "@/components/layouts/FarmerLayout";

export default function Settings() {
  const [settings, setSettings] = useState({
    language: "English",
    theme: "system",
    notifications: {
      email: true,
      sms: true,
      push: true,
      orderAlerts: true,
      paymentAlerts: true,
      marketingEmails: false
    },
    accessibility: {
      textToSpeech: false,
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReader: false
    },
    privacy: {
      profileVisibility: "public",
      shareLocation: true,
      analyticsTracking: true,
      marketingCookies: false
    },
    sounds: {
      volume: [75],
      notifications: true,
      keyboardSounds: false
    }
  });

  const languages = [
    { value: "English", label: "English" },
    { value: "Zulu", label: "isiZulu" },
    { value: "Xhosa", label: "isiXhosa" },
    { value: "Sotho", label: "Sesotho" },
    { value: "Afrikaans", label: "Afrikaans" },
    { value: "Tswana", label: "Setswana" },
    { value: "Venda", label: "Tshivenda" }
  ];

  const updateSettings = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...(prev[category as keyof typeof prev] as any),
        [key]: value
      }
    }));
  };

  return (
    <FarmerLayout currentPage="Settings">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Settings ⚙️</h1>
          <p className="text-muted-foreground">
            Customize your Farm2City experience
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="language" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="language">Language</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="language">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Language & Region
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="language" className="text-base font-medium">
                    Display Language
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Choose your preferred language for the interface
                  </p>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Volume2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Text-to-Speech</p>
                      <p className="text-sm text-muted-foreground">
                        Enable audio reading for better accessibility
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.accessibility.textToSpeech}
                    onCheckedChange={(checked) => updateSettings('accessibility', 'textToSpeech', checked)}
                  />
                </div>

                <Button className="w-full md:w-auto">
                  Save Language Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Communication Methods</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) => updateSettings('notifications', 'email', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive alerts via SMS</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications.sms}
                      onCheckedChange={(checked) => updateSettings('notifications', 'sms', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Mobile app notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) => updateSettings('notifications', 'push', checked)}
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Alert Types</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">New Orders</p>
                        <p className="text-sm text-muted-foreground">When you receive new orders</p>
                      </div>
                      <Switch
                        checked={settings.notifications.orderAlerts}
                        onCheckedChange={(checked) => updateSettings('notifications', 'orderAlerts', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Payment Received</p>
                        <p className="text-sm text-muted-foreground">When payments are processed</p>
                      </div>
                      <Switch
                        checked={settings.notifications.paymentAlerts}
                        onCheckedChange={(checked) => updateSettings('notifications', 'paymentAlerts', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing Emails</p>
                        <p className="text-sm text-muted-foreground">Product updates and tips</p>
                      </div>
                      <Switch
                        checked={settings.notifications.marketingEmails}
                        onCheckedChange={(checked) => updateSettings('notifications', 'marketingEmails', checked)}
                      />
                    </div>
                  </div>
                </div>

                <Button className="w-full md:w-auto">
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accessibility">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Accessibility Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">High Contrast Mode</p>
                      <p className="text-sm text-muted-foreground">Improve visibility with higher contrast</p>
                    </div>
                    <Switch
                      checked={settings.accessibility.highContrast}
                      onCheckedChange={(checked) => updateSettings('accessibility', 'highContrast', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Large Text</p>
                      <p className="text-sm text-muted-foreground">Increase text size for better readability</p>
                    </div>
                    <Switch
                      checked={settings.accessibility.largeText}
                      onCheckedChange={(checked) => updateSettings('accessibility', 'largeText', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Reduced Motion</p>
                      <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                    </div>
                    <Switch
                      checked={settings.accessibility.reducedMotion}
                      onCheckedChange={(checked) => updateSettings('accessibility', 'reducedMotion', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Screen Reader Support</p>
                      <p className="text-sm text-muted-foreground">Enhanced support for screen readers</p>
                    </div>
                    <Switch
                      checked={settings.accessibility.screenReader}
                      onCheckedChange={(checked) => updateSettings('accessibility', 'screenReader', checked)}
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Sound Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-medium">Notification Volume</p>
                        <span className="text-sm text-muted-foreground">{settings.sounds.volume[0]}%</span>
                      </div>
                      <Slider
                        value={settings.sounds.volume}
                        onValueChange={(value) => updateSettings('sounds', 'volume', value)}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notification Sounds</p>
                        <p className="text-sm text-muted-foreground">Play sounds for notifications</p>
                      </div>
                      <Switch
                        checked={settings.sounds.notifications}
                        onCheckedChange={(checked) => updateSettings('sounds', 'notifications', checked)}
                      />
                    </div>
                  </div>
                </div>

                <Button className="w-full md:w-auto">
                  Save Accessibility Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="profileVisibility" className="text-base font-medium">
                      Profile Visibility
                    </Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Control who can see your farm profile
                    </p>
                    <Select
                      value={settings.privacy.profileVisibility}
                      onValueChange={(value) => updateSettings('privacy', 'profileVisibility', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public - Anyone can view</SelectItem>
                        <SelectItem value="registered">Registered Users Only</SelectItem>
                        <SelectItem value="private">Private - By invitation only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Share Location</p>
                      <p className="text-sm text-muted-foreground">Allow customers to see your farm location</p>
                    </div>
                    <Switch
                      checked={settings.privacy.shareLocation}
                      onCheckedChange={(checked) => updateSettings('privacy', 'shareLocation', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Analytics Tracking</p>
                      <p className="text-sm text-muted-foreground">Help improve our platform with usage data</p>
                    </div>
                    <Switch
                      checked={settings.privacy.analyticsTracking}
                      onCheckedChange={(checked) => updateSettings('privacy', 'analyticsTracking', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing Cookies</p>
                      <p className="text-sm text-muted-foreground">Personalized ads and recommendations</p>
                    </div>
                    <Switch
                      checked={settings.privacy.marketingCookies}
                      onCheckedChange={(checked) => updateSettings('privacy', 'marketingCookies', checked)}
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Data Management</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      Download My Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      View Privacy Policy
                    </Button>
                    <Button variant="destructive" className="w-full justify-start">
                      Delete Account
                    </Button>
                  </div>
                </div>

                <Button className="w-full md:w-auto">
                  Save Privacy Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance & Theme
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="theme" className="text-base font-medium">
                    Theme Preference
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Choose how Farm2City looks to you
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      variant={settings.theme === 'light' ? 'default' : 'outline'}
                      className="h-20 flex flex-col gap-2"
                      onClick={() => setSettings(prev => ({ ...prev, theme: 'light' }))}
                    >
                      <Sun className="h-5 w-5" />
                      Light
                    </Button>
                    <Button
                      variant={settings.theme === 'dark' ? 'default' : 'outline'}
                      className="h-20 flex flex-col gap-2"
                      onClick={() => setSettings(prev => ({ ...prev, theme: 'dark' }))}
                    >
                      <Moon className="h-5 w-5" />
                      Dark
                    </Button>
                    <Button
                      variant={settings.theme === 'system' ? 'default' : 'outline'}
                      className="h-20 flex flex-col gap-2"
                      onClick={() => setSettings(prev => ({ ...prev, theme: 'system' }))}
                    >
                      <SettingsIcon className="h-5 w-5" />
                      System
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Display Options</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Compact Mode</p>
                        <p className="text-sm text-muted-foreground">Show more content in less space</p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Show Animations</p>
                        <p className="text-sm text-muted-foreground">Enable smooth transitions and effects</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <Button className="w-full md:w-auto">
                  Save Appearance Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </FarmerLayout>
  );
}