import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FarmerDashboard from "./pages/FarmerDashboard";
import ConsumerDashboard from "./pages/ConsumerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

// Farmer Pages
import MyProduce from "./pages/farmer/MyProduce";
import OrdersEarnings from "./pages/farmer/OrdersEarnings";
import CropHealthCenter from "./pages/farmer/CropHealthCenter";
import DeliveryMatching from "./pages/farmer/DeliveryMatching";
import CommunityForum from "./pages/farmer/CommunityForum";
import EducationHub from "./pages/farmer/EducationHub";
import ProfileWallet from "./pages/farmer/ProfileWallet";
import FarmerSettings from "./pages/farmer/Settings";

// Consumer Pages
import Marketplace from "./pages/consumer/Marketplace";
import CropAnalysis from "./pages/consumer/CropAnalysis";
import FarmRewards from "./pages/consumer/FarmRewards";
import Community from "./pages/consumer/Community";
import AIFeatures from "./pages/consumer/AIFeatures";
import MyOrders from "./pages/consumer/MyOrders";
import MyProfile from "./pages/consumer/MyProfile";

// Admin Pages
import UserManagement from "./pages/admin/UserManagement";
import FarmerApplications from "./pages/admin/FarmerApplications";
import DisputeResolution from "./pages/admin/DisputeResolution";
import Analytics from "./pages/admin/Analytics";
import Security from "./pages/admin/Security";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Farmer Routes */}
          <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
          <Route path="/farmer/my-produce" element={<MyProduce />} />
          <Route path="/farmer/orders-earnings" element={<OrdersEarnings />} />
          <Route path="/farmer/crop-health" element={<CropHealthCenter />} />
          <Route path="/farmer/crop-health-center" element={<CropHealthCenter />} />
          <Route path="/farmer/delivery-matching" element={<DeliveryMatching />} />
          <Route path="/farmer/community-forum" element={<CommunityForum />} />
          <Route path="/farmer/education-hub" element={<EducationHub />} />
          <Route path="/farmer/profile-wallet" element={<ProfileWallet />} />
          <Route path="/farmer/settings" element={<FarmerSettings />} />
          
          {/* Consumer Routes */}
          <Route path="/consumer-dashboard" element={<ConsumerDashboard />} />
          <Route path="/consumer/marketplace" element={<Marketplace />} />
          <Route path="/consumer/crop-analysis" element={<CropAnalysis />} />
          <Route path="/consumer/farm-rewards" element={<FarmRewards />} />
          <Route path="/consumer/community" element={<Community />} />
          <Route path="/consumer/ai-features" element={<AIFeatures />} />
          <Route path="/consumer/my-orders" element={<MyOrders />} />
          <Route path="/consumer/my-profile" element={<MyProfile />} />
          
          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/user-management" element={<UserManagement />} />
          <Route path="/admin/farmer-applications" element={<FarmerApplications />} />
          <Route path="/admin/dispute-resolution" element={<DisputeResolution />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/security" element={<Security />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
