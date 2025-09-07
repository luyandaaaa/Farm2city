import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, LogIn, Shield, Fingerprint } from "lucide-react";
import { BiometricAuth } from "./BiometricAuth";
import { registerUser, findUser } from '@/lib/localStorageUtils';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (token: string, role: string) => void;
}

export function AuthModal({ isOpen, onClose, onAuth }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"farmer" | "consumer" | "admin">("farmer");
  const [showBiometric, setShowBiometric] = useState(false);

  const handleAuth = async (type: "login" | "register") => {
    setIsLoading(true);
    if (type === "register") {
      // Save user to local storage
      registerUser({ username: email, password, role });
      const mockToken = `mock-jwt-${Date.now()}`;
      localStorage.setItem("farm2city_token", mockToken);
      localStorage.setItem("farm2city_role", role);
      localStorage.setItem("farm2city_user", email);
      onAuth(mockToken, role);
      setIsLoading(false);
      onClose();
      return;
    }
    if (type === "login") {
      const user = findUser(email, password);
      if (user) {
        const mockToken = `mock-jwt-${Date.now()}`;
        localStorage.setItem("farm2city_token", mockToken);
        localStorage.setItem("farm2city_role", user.role);
        localStorage.setItem("farm2city_user", user.username);
        onAuth(mockToken, user.role);
        setIsLoading(false);
        onClose();
      } else {
        setIsLoading(false);
        alert('Invalid credentials. Please try again.');
      }
    }
  };

  const handleBiometricAuth = (success: boolean) => {
    if (success) {
      const mockToken = `biometric-jwt-${Date.now()}`;
      localStorage.setItem("farm2city_token", mockToken);
      localStorage.setItem("farm2city_role", role);
      onAuth(mockToken, role);
      onClose();
    }
    setShowBiometric(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Farm2City Access
          </DialogTitle>
        </DialogHeader>
        
        {showBiometric ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="biometric-role">Select Role for Biometric Login</Label>
              <Select value={role} onValueChange={(value) => setRole(value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="farmer">🧑‍🌾 Farmer</SelectItem>
                  <SelectItem value="consumer">🛒 Consumer</SelectItem>
                  <SelectItem value="admin">🧑‍💼 Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <BiometricAuth onBiometricAuth={handleBiometricAuth} />
            <Button 
              variant="ghost" 
              onClick={() => setShowBiometric(false)}
              className="w-full"
            >
              Back to Traditional Login
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <Button
                variant="outline"
                onClick={() => setShowBiometric(true)}
                className="flex items-center gap-2"
              >
                <Fingerprint className="h-4 w-4" />
                Use Biometric Login
              </Button>
            </div>
            
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Register
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-role">Role</Label>
                  <Select value={role} onValueChange={(value) => setRole(value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="farmer">🧑‍🌾 Farmer</SelectItem>
                      <SelectItem value="consumer">🛒 Consumer</SelectItem>
                      <SelectItem value="admin">🧑‍💼 Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  variant="default" 
                  className="w-full" 
                  onClick={() => handleAuth("login")}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-role">Role</Label>
                  <Select value={role} onValueChange={(value) => setRole(value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="farmer">🧑‍🌾 Farmer</SelectItem>
                      <SelectItem value="consumer">🛒 Consumer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  variant="default" 
                  className="w-full" 
                  onClick={() => handleAuth("register")}
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}