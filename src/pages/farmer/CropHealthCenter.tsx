import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FarmerLayout } from "@/components/layouts/FarmerLayout";
import { CropHealthScanner } from "@/components/CropHealthScanner";
import { CropAdvisor } from "@/components/CropAdvisor";
import { SmartIrrigation } from "@/components/SmartIrrigation";
import {
  Scan,
  Sprout,
  Droplets,
  Thermometer,
  Calendar,
  Lightbulb
} from "lucide-react";

export default function CropHealthCenter() {
  return (
    <FarmerLayout currentPage="Crop Health Center">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Crop Health Center 🌱</h1>
          <p className="text-muted-foreground">
            AI-powered tools to monitor, analyze, and optimize your crop health and farm productivity
          </p>
        </div>


        {/* Main Content Tabs */}
        <Tabs defaultValue="scanner" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scanner" className="flex items-center gap-2">
              <Scan className="h-4 w-4" />
              Disease Scanner
            </TabsTrigger>
            <TabsTrigger value="advisor" className="flex items-center gap-2">
              <Sprout className="h-4 w-4" />
              Crop Advisor
            </TabsTrigger>
            <TabsTrigger value="irrigation" className="flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              Smart Irrigation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scanner">
            <CropHealthScanner />
          </TabsContent>

          <TabsContent value="advisor">
            <CropAdvisor />
          </TabsContent>

          <TabsContent value="irrigation">
            <SmartIrrigation />
          </TabsContent>
        </Tabs>

        {/* Quick Tips */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Quick Tips for Healthy Crops
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Regular Monitoring
                </h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Check crops daily for early disease detection</li>
                  <li>Monitor soil moisture levels regularly</li>
                  <li>Track weather patterns and plan accordingly</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-1">
                  <Thermometer className="h-3 w-3" />
                  Environmental Care
                </h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Maintain proper plant spacing for air circulation</li>
                  <li>Water early morning or late evening</li>
                  <li>Use crop rotation to prevent soil depletion</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </FarmerLayout>
  );
}
