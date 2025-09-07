import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthModal } from "@/components/auth/AuthModal";
import { UssdAccess } from "@/components/UssdAccess";
import { Leaf } from "lucide-react";
import freshProduceBg from "@/assets/fresh-produce-bg.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"farmer" | "consumer" | "admin">("farmer");

  useEffect(() => {
    const token = localStorage.getItem("farm2city_token");
    const role = localStorage.getItem("farm2city_role");
   
    if (token && role) {
      switch (role) {
        case "farmer":
          navigate("/farmer-dashboard");
          break;
        case "consumer":
          navigate("/consumer-dashboard");
          break;
        case "admin":
          navigate("/admin-dashboard");
          break;
      }
    }
  }, [navigate]);

  const handleRoleSelect = (role: "farmer" | "consumer" | "admin") => {
    setSelectedRole(role);
    setShowAuthModal(true);
  };

  const handleAuth = (token: string, role: string) => {
    switch (role) {
      case "farmer":
        navigate("/farmer-dashboard");
        break;
      case "consumer":
        navigate("/consumer-dashboard");
        break;
      case "admin":
        navigate("/admin-dashboard");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Image - no overlay, no blur, no opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${freshProduceBg})`
        }}
      />

      {/* Hero Section */}
      <div className="relative">
        {/* Removed gradient-hero overlay */}
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
                <Leaf className="h-5 w-5 text-primary" />
                <span className="text-primary font-extrabold drop-shadow">Connecting Farms to Cities</span>
              </div>
            </div>
            <div className="relative">
              {/* Overlay covers heading, paragraph, and role selection cards */}
              <div className="absolute inset-0 bg-card/80 backdrop-blur-sm rounded-2xl shadow-card"></div>
              <div className="relative z-10">
                <h1 className="text-5xl lg:text-7xl font-bold mb-6">
                  <span className="gradient-hero bg-clip-text text-transparent">Farm2City</span>
                </h1>
                <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                  Bridging the gap between small-scale farmers and urban consumers.
                  Fresh produce, fair prices, sustainable communities.
                </p>
                {/* Role Selection Cards */}
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card
                      className="shadow-card transition-smooth hover:shadow-glow cursor-pointer group border-0"
                      onClick={() => handleRoleSelect("farmer")}
                    >
                      <CardHeader className="text-center">
                        <CardTitle className="text-2xl text-primary">Farmer Portal</CardTitle>
                      </CardHeader>
                    </Card>

                    <Card
                      className="shadow-card transition-smooth hover:shadow-glow cursor-pointer group border-0"
                      onClick={() => handleRoleSelect("consumer")}
                    >
                      <CardHeader className="text-center">
                        <CardTitle className="text-2xl text-secondary">Consumer Portal</CardTitle>
                      </CardHeader>
                    </Card>

                    <Card
                      className="shadow-card transition-smooth hover:shadow-glow cursor-pointer group border-0"
                      onClick={() => handleRoleSelect("admin")}
                    >
                      <CardHeader className="text-center">
                        <CardTitle className="text-2xl text-accent">Admin Portal</CardTitle>
                      </CardHeader>
                    </Card>
                  </div>

                  {/* Offline Mode Button */}
                  <div className="text-center">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-primary/20 hover:bg-primary/10"
                      onClick={() => window.open('/ussd.html', '_blank')}
                    >
                      Offline Mode (USSD)
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuth={handleAuth}
      />
    </div>
  );
};

export default Index;