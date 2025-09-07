import { useState } from "react";
import { ConsumerLayout } from "@/components/layouts/ConsumerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Bell, Shield, CreditCard, Heart, Settings } from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bio: string;
  avatar: string;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    orderUpdates: boolean;
    promotions: boolean;
    organic: boolean;
    local: boolean;
  };
  stats: {
    totalOrders: number;
    totalSpent: number;
    favoriteProduct: string;
    loyaltyPoints: number;
  };
}

export default function MyProfile() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street",
    city: "Springfield",
    state: "CA",
    zipCode: "12345",
    bio: "Love fresh, local produce and supporting local farmers!",
    avatar: "",
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      orderUpdates: true,
      promotions: true,
      organic: true,
      local: true,
    },
    stats: {
      totalOrders: 24,
      totalSpent: 486.75,
      favoriteProduct: "Organic Tomatoes",
      loyaltyPoints: 1240,
    }
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handlePreferenceChange = (key: keyof typeof profile.preferences, value: boolean) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed."
    );
    
    if (confirmed) {
      // Remove user data from local storage
      localStorage.removeItem("farm2city_token");
      localStorage.removeItem("farm2city_role");
      localStorage.removeItem("farm2city_user");
      localStorage.removeItem("consumerOrders");
      localStorage.removeItem("cartItems");
      
      toast.success("Account deleted successfully");
      
      // Redirect to home page
      window.location.href = "/";
    }
  };

  return (
    <ConsumerLayout currentPage="My Profile">
      <div className="min-h-screen bg-muted/30 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Profile 👤</h1>
            <p className="text-muted-foreground">
              Manage your account information and preferences
            </p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6 mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                    <Button
                      variant="outline"
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    >
                      {isEditing ? "Save Changes" : "Edit Profile"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={profile.avatar} />
                        <AvatarFallback className="text-lg">
                          {profile.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">{profile.name}</h3>
                        <p className="text-muted-foreground">{profile.email}</p>
                        <Badge variant="secondary" className="mt-1">
                          Premium Member
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          disabled={!isEditing}
                          onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          disabled={!isEditing}
                          onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          disabled={!isEditing}
                          onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={profile.address}
                          disabled={!isEditing}
                          onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={profile.city}
                          disabled={!isEditing}
                          onChange={(e) => setProfile(prev => ({ ...prev, city: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={profile.state}
                          disabled={!isEditing}
                          onChange={(e) => setProfile(prev => ({ ...prev, state: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        disabled={!isEditing}
                        onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6 mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive order updates via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={profile.preferences.emailNotifications}
                      onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive urgent updates via SMS</p>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={profile.preferences.smsNotifications}
                      onCheckedChange={(checked) => handlePreferenceChange('smsNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="order-updates">Order Updates</Label>
                      <p className="text-sm text-muted-foreground">Get notified about order status changes</p>
                    </div>
                    <Switch
                      id="order-updates"
                      checked={profile.preferences.orderUpdates}
                      onCheckedChange={(checked) => handlePreferenceChange('orderUpdates', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="promotions">Promotions & Offers</Label>
                      <p className="text-sm text-muted-foreground">Receive promotional emails and special offers</p>
                    </div>
                    <Switch
                      id="promotions"
                      checked={profile.preferences.promotions}
                      onCheckedChange={(checked) => handlePreferenceChange('promotions', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Shopping Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="organic">Prefer Organic</Label>
                      <p className="text-sm text-muted-foreground">Show organic products first</p>
                    </div>
                    <Switch
                      id="organic"
                      checked={profile.preferences.organic}
                      onCheckedChange={(checked) => handlePreferenceChange('organic', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="local">Prefer Local</Label>
                      <p className="text-sm text-muted-foreground">Prioritize local farmers and products</p>
                    </div>
                    <Switch
                      id="local"
                      checked={profile.preferences.local}
                      onCheckedChange={(checked) => handlePreferenceChange('local', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <CreditCard className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{profile.stats.totalOrders}</p>
                        <p className="text-sm text-muted-foreground">Total Orders</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-secondary/10 rounded-lg">
                        <CreditCard className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">${profile.stats.totalSpent}</p>
                        <p className="text-sm text-muted-foreground">Total Spent</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-accent/10 rounded-lg">
                        <Heart className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-lg font-bold">{profile.stats.favoriteProduct}</p>
                        <p className="text-sm text-muted-foreground">Favorite Product</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-muted/10 rounded-lg">
                        <Badge className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{profile.stats.loyaltyPoints}</p>
                        <p className="text-sm text-muted-foreground">Loyalty Points</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Purchase History Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Most Ordered Category</p>
                        <p className="text-sm text-muted-foreground">Fresh Vegetables</p>
                      </div>
                      <Badge variant="secondary">67% of orders</Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Average Order Value</p>
                        <p className="text-sm text-muted-foreground">Last 30 days</p>
                      </div>
                      <Badge variant="outline">$23.45</Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Member Since</p>
                        <p className="text-sm text-muted-foreground">Account creation date</p>
                      </div>
                      <Badge variant="default">March 2024</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

             <TabsContent value="security" className="space-y-6 mt-6">
               <Card className="shadow-card">
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                     <Shield className="h-5 w-5" />
                     Account Security
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div className="flex justify-between items-center p-4 border rounded-lg">
                     <div>
                       <p className="font-medium">Password</p>
                       <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                     </div>
                     <Button variant="outline">Change Password</Button>
                   </div>
                   <div className="flex justify-between items-center p-4 border rounded-lg">
                     <div>
                       <p className="font-medium">Two-Factor Authentication</p>
                       <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                     </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Biometric Login</p>
                      <p className="text-sm text-muted-foreground">Use fingerprint or face ID</p>
                    </div>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Login Sessions</p>
                      <p className="text-sm text-muted-foreground">Manage active sessions</p>
                    </div>
                    <Button variant="outline">View Sessions</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-4 border border-destructive/20 rounded-lg">
                    <div>
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive" onClick={handleDeleteAccount}>Delete Account</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ConsumerLayout>
  );
}