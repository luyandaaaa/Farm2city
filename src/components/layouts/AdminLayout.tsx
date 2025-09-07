import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Shield, 
  Settings,
  LogOut
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

export function AdminLayout({ children, currentPage }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("farm2city_token");
    const role = localStorage.getItem("farm2city_role");
    
    if (!token || role !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("farm2city_token");
    localStorage.removeItem("farm2city_role");
    navigate("/");
  };

  const sidebarItems = [
    { icon: Users, label: "User Management", path: "/admin/user-management" },
    { icon: FileText, label: "Farmer Applications", path: "/admin/farmer-applications" },
    { icon: MessageSquare, label: "Dispute Resolution", path: "/admin/dispute-resolution" },
    { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
    { icon: Shield, label: "Security", path: "/admin/security" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-card border-r shadow-card">
        <div className="p-6 border-b">
          <Link to="/admin-dashboard">
            <h1 className="text-xl font-bold gradient-hero bg-clip-text text-transparent">
              Farm2City
            </h1>
          </Link>
          <p className="text-sm text-muted-foreground">Admin Portal</p>
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

        <div className="absolute bottom-4 left-4 right-4">
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