import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EmergencyPanicButton } from "@/components/EmergencyPanicButton";
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Scan, 
  Truck, 
  MessageSquare, 
  BookOpen, 
  User, 
  Settings,
  LogOut
} from "lucide-react";

interface FarmerLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  selectedLang?: string;
  translations?: any;
}

export function FarmerLayout({ children, currentPage, selectedLang = "en", translations }: FarmerLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("farm2city_token");
    const role = localStorage.getItem("farm2city_role");
    
    if (!token || role !== "farmer") {
      navigate("/");
    }
  }, [navigate]);

  // Inject Chatbase chatbot script once
  useEffect(() => {
    if (!document.getElementById('RX4btQ2iFWpLnYWcJK_9P')) {
      const script = document.createElement('script');
      script.src = 'https://www.chatbase.co/embed.min.js';
      script.id = 'RX4btQ2iFWpLnYWcJK_9P';
      document.body.appendChild(script);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("farm2city_token");
    localStorage.removeItem("farm2city_role");
    navigate("/");
  };

  const sidebarItems = [
    { icon: Home, label: translations?.sidebar?.dashboard || "Dashboard", path: "/farmer-dashboard" },
    { icon: Package, label: translations?.sidebar?.myProduce || "My Produce", path: "/farmer/my-produce" },
    { icon: ShoppingCart, label: translations?.sidebar?.ordersEarnings || "Orders & Earnings", path: "/farmer/orders-earnings" },
    { icon: Scan, label: translations?.sidebar?.cropHealth || "Crop Health Center", path: "/farmer/crop-health" },
    { icon: Truck, label: translations?.sidebar?.deliveryMatching || "Delivery Matching", path: "/farmer/delivery-matching" },
    { icon: MessageSquare, label: translations?.sidebar?.communityForum || "Community Forum", path: "/farmer/community-forum" },
    { icon: BookOpen, label: translations?.sidebar?.educationHub || "Education Hub", path: "/farmer/education-hub" },
    { icon: User, label: translations?.sidebar?.profileWallet || "Profile & Wallet", path: "/farmer/profile-wallet" },
    { icon: Settings, label: translations?.sidebar?.settings || "Settings", path: "/farmer/settings" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-card border-r shadow-card">
        <div className="p-6 border-b">
          <Link to="/farmer-dashboard">
            <h1 className="text-xl font-bold gradient-hero bg-clip-text text-transparent">
              Farm2City
            </h1>
          </Link>
          <p className="text-sm text-muted-foreground">Farmer Portal</p>
        </div>

        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <Link key={item.label} to={item.path}>
              <Button
                variant={isActive(item.path) ? "default" : "ghost"}
                className="w-full justify-start transition-smooth"
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <EmergencyPanicButton className="w-full justify-start" />
          <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        {children}
      </div>
    </div>
  );
}