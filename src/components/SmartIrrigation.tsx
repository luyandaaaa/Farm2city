import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Droplets, 
  Calendar, 
  Clock, 
  Thermometer,
  CloudRain,
  Sprout,
  Settings,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

interface IrrigationSchedule {
  day: string;
  time: string;
  duration: number;
  amount: number;
  reason: string;
  status: 'scheduled' | 'completed' | 'skipped';
}

interface SoilSettings {
  type: string;
  area: number;
  crops: string[];
  autoMode: boolean;
}

export function SmartIrrigation() {
  const [soilSettings, setSoilSettings] = useState<SoilSettings>({
    type: '',
    area: 1,
    crops: [],
    autoMode: true
  });
  
  const [schedule, setSchedule] = useState<IrrigationSchedule[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<string>('');

  const soilTypes = [
    { value: 'clay', label: 'Clay Soil', waterRetention: 'High', frequency: 'Low' },
    { value: 'sand', label: 'Sandy Soil', waterRetention: 'Low', frequency: 'High' },
    { value: 'loam', label: 'Loamy Soil', waterRetention: 'Medium', frequency: 'Medium' },
    { value: 'silt', label: 'Silty Soil', waterRetention: 'Medium-High', frequency: 'Low-Medium' },
    { value: 'peat', label: 'Peat Soil', waterRetention: 'Very High', frequency: 'Very Low' },
    { value: 'chalk', label: 'Chalky Soil', waterRetention: 'Low', frequency: 'High' }
  ];

  const availableCrops = [
    'Tomatoes', 'Lettuce', 'Spinach', 'Carrots', 'Onions', 
    'Maize', 'Beans', 'Peppers', 'Cabbage', 'Potatoes'
  ];

  const generateIrrigationSchedule = async () => {
    if (!soilSettings.type || soilSettings.crops.length === 0) {
      toast.error('Please select soil type and at least one crop');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI-powered schedule generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockWeather = {
        temperature: 25,
        humidity: 60,
        rainfall: 0,
        forecast: ['sunny', 'sunny', 'rain', 'cloudy', 'sunny', 'sunny', 'cloudy']
      };

      const newSchedule: IrrigationSchedule[] = [];
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      
      days.forEach((day, index) => {
        const weather = mockWeather.forecast[index];
        const soilType = soilSettings.type;
        
        // AI logic simulation
        let duration = 30; // base duration in minutes
        let amount = 5; // base amount in liters per m²
        let shouldIrrigate = true;
        let reason = 'Regular irrigation schedule';
        
        // Adjust based on soil type
        if (soilType === 'sand') {
          duration = 20;
          amount = 3;
          reason = 'Sandy soil - frequent, light watering';
        } else if (soilType === 'clay') {
          duration = 45;
          amount = 8;
          reason = 'Clay soil - deep, less frequent watering';
        } else if (soilType === 'loam') {
          duration = 30;
          amount = 5;
          reason = 'Loam soil - balanced watering';
        }
        
        // Adjust based on weather
        if (weather === 'rain') {
          shouldIrrigate = false;
          reason = 'Skipped due to expected rainfall';
        } else if (weather === 'sunny') {
          duration *= 1.2;
          amount *= 1.2;
          reason += ' (increased for sunny weather)';
        }
        
        // Adjust based on crops
        if (soilSettings.crops.includes('Tomatoes') || soilSettings.crops.includes('Lettuce')) {
          amount *= 1.1;
          reason += ' (water-loving crops detected)';
        }
        
        if (shouldIrrigate) {
          newSchedule.push({
            day,
            time: index % 2 === 0 ? '06:00' : '18:00', // Alternate morning/evening
            duration: Math.round(duration),
            amount: Math.round(amount * soilSettings.area * 10) / 10,
            reason,
            status: 'scheduled'
          });
        } else {
          newSchedule.push({
            day,
            time: '06:00',
            duration: 0,
            amount: 0,
            reason,
            status: 'skipped'
          });
        }
      });
      
      setSchedule(newSchedule);
      toast.success('Smart irrigation schedule generated successfully!');
    } catch (error) {
      console.error('Schedule generation error:', error);
      toast.error('Failed to generate schedule');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleScheduleItem = (index: number) => {
    const newSchedule = [...schedule];
    if (newSchedule[index].status === 'scheduled') {
      newSchedule[index].status = 'completed';
      toast.success(`Irrigation for ${newSchedule[index].day} marked as completed`);
    } else if (newSchedule[index].status === 'completed') {
      newSchedule[index].status = 'scheduled';
    }
    setSchedule(newSchedule);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-primary" />;
      case 'skipped': return <AlertTriangle className="h-4 w-4 text-secondary" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-primary';
      case 'skipped': return 'text-secondary';
      default: return 'text-foreground';
    }
  };

  const totalWaterWeek = schedule.reduce((total, item) => total + item.amount, 0);
  const completedTasks = schedule.filter(item => item.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Smart Irrigation Scheduler</h2>
        <p className="text-muted-foreground">
          AI-powered irrigation planning based on soil type, crops, and weather conditions
        </p>
      </div>

      {/* Settings */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Farm Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Soil Type */}
          <div className="space-y-2">
            <Label>Soil Type</Label>
            <Select 
              value={soilSettings.type} 
              onValueChange={(value) => setSoilSettings(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your soil type" />
              </SelectTrigger>
              <SelectContent>
                {soilTypes.map((soil) => (
                  <SelectItem key={soil.value} value={soil.value}>
                    <div>
                      <div className="font-medium">{soil.label}</div>
                      <div className="text-sm text-muted-foreground">
                        Water retention: {soil.waterRetention}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Farm Area */}
          <div className="space-y-2">
            <Label>Farm Area (hectares): {soilSettings.area}</Label>
            <Slider
              value={[soilSettings.area]}
              onValueChange={(value) => setSoilSettings(prev => ({ ...prev, area: value[0] }))}
              max={10}
              min={0.1}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Crop Selection */}
          <div className="space-y-2">
            <Label>Selected Crops</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableCrops.map((crop) => (
                <label key={crop} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={soilSettings.crops.includes(crop)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSoilSettings(prev => ({
                          ...prev,
                          crops: [...prev.crops, crop]
                        }));
                      } else {
                        setSoilSettings(prev => ({
                          ...prev,
                          crops: prev.crops.filter(c => c !== crop)
                        }));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{crop}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Auto Mode */}
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-mode"
              checked={soilSettings.autoMode}
              onCheckedChange={(checked) => setSoilSettings(prev => ({ ...prev, autoMode: checked }))}
            />
            <Label htmlFor="auto-mode">Enable automatic schedule adjustments based on weather</Label>
          </div>

          <Button 
            onClick={generateIrrigationSchedule}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                Generating Smart Schedule...
              </>
            ) : (
              <>
                <Sprout className="h-4 w-4 mr-2" />
                Generate AI Irrigation Schedule
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Schedule Overview */}
      {schedule.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Droplets className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalWaterWeek.toFixed(1)}L</p>
                  <p className="text-sm text-muted-foreground">Weekly Water Usage</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedTasks}/7</p>
                  <p className="text-sm text-muted-foreground">Tasks Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{schedule.filter(s => s.status === 'scheduled').length}</p>
                  <p className="text-sm text-muted-foreground">Upcoming Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Weekly Schedule */}
      {schedule.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Irrigation Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {schedule.map((item, index) => (
                <div 
                  key={index}
                  className={`border rounded-lg p-4 transition-smooth hover:shadow-md ${
                    item.status === 'completed' ? 'bg-primary/5' : 
                    item.status === 'skipped' ? 'bg-secondary/5' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(item.status)}
                      <div>
                        <h3 className={`font-semibold ${getStatusColor(item.status)}`}>
                          {item.day}
                        </h3>
                        <p className="text-sm text-muted-foreground">{item.reason}</p>
                      </div>
                    </div>
                    
                    {item.status !== 'skipped' && (
                      <div className="flex items-center gap-4">
                        <div className="text-right text-sm">
                          <p className="font-medium">{item.time}</p>
                          <p className="text-muted-foreground">
                            {item.duration}min • {item.amount}L
                          </p>
                        </div>
                        <Button
                          variant={item.status === 'completed' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => toggleScheduleItem(index)}
                        >
                          {item.status === 'completed' ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Done
                            </>
                          ) : (
                            <>
                              <Play className="h-3 w-3 mr-1" />
                              Start
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                    
                    {item.status === 'skipped' && (
                      <Badge variant="secondary">Skipped</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">Smart Irrigation Tips</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Water early morning or late evening to reduce evaporation</li>
            <li>• Check soil moisture before irrigation - skip if soil is already moist</li>
            <li>• Adjust schedule based on seasonal weather patterns</li>
            <li>• Deep, less frequent watering encourages deeper root growth</li>
            <li>• Consider drip irrigation for water efficiency</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}