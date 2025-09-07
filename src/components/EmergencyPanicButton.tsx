import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Phone, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmergencyPanicButtonProps {
  className?: string;
}

export function EmergencyPanicButton({ className }: EmergencyPanicButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const alertTypes = [
    { id: "theft", label: "Theft or Burglary", description: "Equipment or produce stolen" },
    { id: "assault", label: "Physical Threat", description: "Personal safety at risk" },
    { id: "fraud", label: "Payment/Fraud Issue", description: "Suspicious transactions" },
    { id: "delivery", label: "Delivery Dispute", description: "Problems with delivery service" },
    { id: "other", label: "Other Emergency", description: "Any other urgent situation" },
  ];

  const handleEmergencyAlert = async () => {
    if (!alertType) return;
    
    setIsSubmitting(true);
    
    // Simulate API call to emergency services
    setTimeout(() => {
      toast({
        title: "Emergency Alert Sent",
        description: "Your alert has been sent to our support team and local authorities if needed. Help is on the way.",
      });
      
      // Log emergency details (in real app, this would go to backend)
      console.log("Emergency Alert:", {
        type: alertType,
        description,
        timestamp: new Date().toISOString(),
        location: "GPS coordinates would be captured here",
        userId: localStorage.getItem("farm2city_token")
      });
      
      setIsSubmitting(false);
      setIsOpen(false);
      setAlertType("");
      setDescription("");
    }, 2000);
  };

  return (
    <>
      <Button 
        variant="destructive" 
        className={`transition-smooth hover:scale-105 ${className}`}
        onClick={() => setIsOpen(true)}
      >
        <AlertTriangle className="h-4 w-4 mr-2" />
        Emergency Panic
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Emergency Alert System
            </DialogTitle>
            <DialogDescription>
              This will immediately notify our support team and relevant authorities. Only use for genuine emergencies.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Emergency Type</Label>
              <RadioGroup value={alertType} onValueChange={setAlertType} className="mt-2">
                {alertTypes.map((type) => (
                  <div key={type.id} className="flex items-start space-x-2">
                    <RadioGroupItem value={type.id} id={type.id} className="mt-1" />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor={type.id} className="text-sm font-medium">
                        {type.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {type.description}
                      </p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                placeholder="Provide any additional details about the emergency..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 h-20"
              />
            </div>

            <div className="bg-muted/50 p-3 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>Your GPS location will be automatically shared</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" />
                <span>Emergency contacts will be notified</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Response team will follow up within 15 minutes</span>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleEmergencyAlert}
              disabled={!alertType || isSubmitting}
            >
              {isSubmitting ? "Sending Alert..." : "Send Emergency Alert"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}