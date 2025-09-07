import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, CheckCircle, Info } from "lucide-react";

interface UssdAccessProps {
  className?: string;
}

export function UssdAccess({ className }: UssdAccessProps) {
  const [isOpen, setIsOpen] = useState(false);

  const ussdCommands = [
    { code: "*120*FARM#", description: "Main Farm2City menu" },
    { code: "*120*FARM*1#", description: "Add new produce listing" },
    { code: "*120*FARM*2#", description: "Check pending orders" },
    { code: "*120*FARM*3#", description: "View wallet balance" },
    { code: "*120*FARM*4#", description: "Emergency alert" },
    { code: "*120*FARM*9#", description: "Help and support" },
  ];

  const ussdFlow = [
    "Dial *120*FARM# from any phone",
    "Follow the menu options displayed",
    "Enter numbers to navigate menus",
    "Confirm actions with #",
    "Receive SMS confirmations"
  ];

  return (
    <>
      <Button 
        variant="outline" 
        className={`transition-smooth ${className}`}
        onClick={() => setIsOpen(true)}
      >
        <Phone className="h-4 w-4 mr-2" />
        USSD Access
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              USSD Access - No Internet Required
            </DialogTitle>
            <DialogDescription>
              Access Farm2City features from any phone, even basic feature phones without internet connection.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Main USSD Code */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6 bg-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Dial this code:</p>
                  <p className="text-3xl font-bold text-primary">*120*FARM#</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Works on all networks across South Africa
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Available Commands */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Available Commands</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ussdCommands.map((command, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-mono text-sm font-medium">{command.code}</p>
                        <p className="text-xs text-muted-foreground">{command.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* How it Works */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">How USSD Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ussdFlow.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full text-xs font-bold text-primary">
                        {index + 1}
                      </div>
                      <p className="text-sm">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-medium text-blue-700 dark:text-blue-300">Important Notes:</p>
                  <ul className="text-blue-600 dark:text-blue-400 space-y-1">
                    <li>• USSD works on all phone types, no smartphone required</li>
                    <li>• Small data charges may apply (usually free on most networks)</li>
                    <li>• Available 24/7 across all South African networks</li>
                    <li>• Transactions are confirmed via SMS</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsOpen(false)}>
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}