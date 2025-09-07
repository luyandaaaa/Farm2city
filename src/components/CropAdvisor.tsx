import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Sprout, 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Wind,
  Sun,
  MapPin,
  Calendar,
  Leaf,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  condition: string;
  forecast: {
    day: string;
    temp: number;
    condition: string;
    rain: number;
  }[];
}

interface CropRecommendation {
  crop: string;
  suitability: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  plantingTime: string;
  harvestTime: string;
  expectedYield: string;
  notes: string[];
}

const OPENWEATHER_API_KEY = '3f3ddd58048f265f0b5ec4c455279f3b';

export function CropAdvisor() {
  const [selectedSoil, setSelectedSoil] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);

  const soilTypes = [
    { value: 'clay', label: 'Clay Soil', description: 'Heavy, water-retaining soil' },
    { value: 'sand', label: 'Sandy Soil', description: 'Light, well-draining soil' },
    { value: 'loam', label: 'Loamy Soil', description: 'Balanced, fertile soil' },
    { value: 'silt', label: 'Silty Soil', description: 'Fine particles, moisture-retaining' },
    { value: 'peat', label: 'Peat Soil', description: 'Organic, acidic soil' },
    { value: 'chalk', label: 'Chalky Soil', description: 'Alkaline, free-draining soil' }
  ];

  const cropDatabase: Record<string, Record<string, CropRecommendation[]>> = {
    clay: {
      wet: [
        {
          crop: 'Rice',
          suitability: 'Excellent',
          plantingTime: 'October - November',
          harvestTime: 'March - April',
          expectedYield: '4-6 tons/hectare',
          notes: ['Clay soil retains water well for rice', 'Prepare fields early for proper puddling']
        },
        {
          crop: 'Beans',
          suitability: 'Good',
          plantingTime: 'September - October',
          harvestTime: 'December - January',
          expectedYield: '1.5-2 tons/hectare',
          notes: ['Ensure good drainage to prevent waterlogging', 'Clay provides good nutrients']
        }
      ],
      dry: [
        {
          crop: 'Sorghum',
          suitability: 'Good',
          plantingTime: 'October - December',
          harvestTime: 'March - May',
          expectedYield: '2-3 tons/hectare',
          notes: ['Drought tolerant crop suitable for clay', 'Deep roots can penetrate clay soil']
        },
        {
          crop: 'Sunflower',
          suitability: 'Fair',
          plantingTime: 'September - November',
          harvestTime: 'February - March',
          expectedYield: '1-1.5 tons/hectare',
          notes: ['May struggle in heavy clay', 'Consider soil amendment']
        }
      ]
    },
    sand: {
      wet: [
        {
          crop: 'Watermelon',
          suitability: 'Excellent',
          plantingTime: 'September - October',
          harvestTime: 'December - February',
          expectedYield: '20-30 tons/hectare',
          notes: ['Sandy soil provides excellent drainage', 'Requires regular irrigation']
        },
        {
          crop: 'Carrots',
          suitability: 'Excellent',
          plantingTime: 'February - March',
          harvestTime: 'May - June',
          expectedYield: '15-25 tons/hectare',
          notes: ['Perfect for root development', 'Loose soil allows straight growth']
        }
      ],
      dry: [
        {
          crop: 'Millet',
          suitability: 'Good',
          plantingTime: 'October - November',
          harvestTime: 'February - March',
          expectedYield: '1-2 tons/hectare',
          notes: ['Drought tolerant', 'Deep roots can find moisture']
        }
      ]
    },
    loam: {
      wet: [
        {
          crop: 'Maize',
          suitability: 'Excellent',
          plantingTime: 'October - December',
          harvestTime: 'March - May',
          expectedYield: '4-7 tons/hectare',
          notes: ['Ideal soil for maize production', 'Good moisture and nutrient retention']
        },
        {
          crop: 'Tomatoes',
          suitability: 'Excellent',
          plantingTime: 'August - September',
          harvestTime: 'November - January',
          expectedYield: '30-50 tons/hectare',
          notes: ['Perfect soil structure for tomatoes', 'Maintain consistent moisture']
        }
      ],
      dry: [
        {
          crop: 'Wheat',
          suitability: 'Good',
          plantingTime: 'May - June',
          harvestTime: 'October - November',
          expectedYield: '2-4 tons/hectare',
          notes: ['Suitable for winter wheat', 'May need supplemental irrigation']
        }
      ]
    }
  };

  const fetchWeatherData = async () => {
    setIsLoadingWeather(true);
    try {
      // Default to Johannesburg, South Africa
      const lat = -26.2041;
      const lon = 28.0473;
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      
      if (!response.ok) throw new Error('Weather fetch failed');
      
      const data = await response.json();
      
      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      
      const forecastData = await forecastResponse.json();
      
      const weatherInfo: WeatherData = {
        location: data.name,
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        rainfall: data.rain?.['1h'] || 0,
        windSpeed: data.wind.speed,
        condition: data.weather[0].main,
        forecast: forecastData.list.slice(0, 5).map((item: any) => ({
          day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
          temp: Math.round(item.main.temp),
          condition: item.weather[0].main,
          rain: item.rain?.['3h'] || 0
        }))
      };
      
      setWeatherData(weatherInfo);
      toast.success('Weather data updated successfully');
    } catch (error) {
      console.error('Weather fetch error:', error);
      // Fallback to mock data
      setWeatherData({
        location: 'Johannesburg',
        temperature: 22,
        humidity: 65,
        rainfall: 2.5,
        windSpeed: 8,
        condition: 'Clouds',
        forecast: [
          { day: 'Mon', temp: 24, condition: 'Clear', rain: 0 },
          { day: 'Tue', temp: 26, condition: 'Clouds', rain: 1.2 },
          { day: 'Wed', temp: 23, condition: 'Rain', rain: 5.8 },
          { day: 'Thu', temp: 21, condition: 'Rain', rain: 3.2 },
          { day: 'Fri', temp: 25, condition: 'Clear', rain: 0 }
        ]
      });
      toast.error('Using mock weather data - API may be unavailable');
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const generateRecommendations = () => {
    if (!selectedSoil || !weatherData) return;

    const isWetSeason = weatherData.rainfall > 1 || weatherData.humidity > 70;
    const season = isWetSeason ? 'wet' : 'dry';
    
    const crops = cropDatabase[selectedSoil]?.[season] || [];
    setRecommendations(crops);
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  useEffect(() => {
    generateRecommendations();
  }, [selectedSoil, weatherData]);

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case 'Excellent': return 'text-primary';
      case 'Good': return 'text-secondary';
      case 'Fair': return 'text-accent';
      case 'Poor': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear': return <Sun className="h-4 w-4" />;
      case 'clouds': return <CloudRain className="h-4 w-4" />;
      case 'rain': return <Droplets className="h-4 w-4" />;
      default: return <Sun className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Smart Crop Advisor</h2>
        <p className="text-muted-foreground">
          Get personalized crop recommendations based on your soil type and current weather conditions
        </p>
      </div>

      {/* Soil Selection */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sprout className="h-5 w-5" />
            Select Your Soil Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedSoil} onValueChange={setSelectedSoil}>
            <SelectTrigger>
              <SelectValue placeholder="Choose your soil type" />
            </SelectTrigger>
            <SelectContent>
              {soilTypes.map((soil) => (
                <SelectItem key={soil.value} value={soil.value}>
                  <div>
                    <div className="font-medium">{soil.label}</div>
                    <div className="text-sm text-muted-foreground">{soil.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Weather Information */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <CloudRain className="h-5 w-5" />
              Current Weather Conditions
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchWeatherData}
              disabled={isLoadingWeather}
            >
              {isLoadingWeather ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {weatherData ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">{weatherData.location}</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Thermometer className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{weatherData.temperature}°C</p>
                  <p className="text-sm text-muted-foreground">Temperature</p>
                </div>
                
                <div className="text-center">
                  <Droplets className="h-6 w-6 mx-auto mb-2 text-secondary" />
                  <p className="text-2xl font-bold">{weatherData.humidity}%</p>
                  <p className="text-sm text-muted-foreground">Humidity</p>
                </div>
                
                <div className="text-center">
                  <CloudRain className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <p className="text-2xl font-bold">{weatherData.rainfall}mm</p>
                  <p className="text-sm text-muted-foreground">Rainfall</p>
                </div>
                
                <div className="text-center">
                  <Wind className="h-6 w-6 mx-auto mb-2 text-primary-glow" />
                  <p className="text-2xl font-bold">{weatherData.windSpeed}m/s</p>
                  <p className="text-sm text-muted-foreground">Wind Speed</p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">5-Day Forecast</h4>
                <div className="grid grid-cols-5 gap-2">
                  {weatherData.forecast.map((day, index) => (
                    <div key={index} className="text-center p-2 bg-muted/50 rounded">
                      <p className="text-xs font-medium mb-1">{day.day}</p>
                      <div className="flex justify-center mb-1">
                        {getWeatherIcon(day.condition)}
                      </div>
                      <p className="text-sm font-bold">{day.temp}°</p>
                      <p className="text-xs text-muted-foreground">{day.rain}mm</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-muted-foreground">Loading weather data...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Crop Recommendations */}
      {recommendations.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Recommended Crops
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{rec.crop}</h3>
                    <Badge variant="outline" className={getSuitabilityColor(rec.suitability)}>
                      {rec.suitability}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Planting Time
                      </p>
                      <p className="text-muted-foreground">{rec.plantingTime}</p>
                    </div>
                    <div>
                      <p className="font-medium">Harvest Time</p>
                      <p className="text-muted-foreground">{rec.harvestTime}</p>
                    </div>
                    <div>
                      <p className="font-medium">Expected Yield</p>
                      <p className="text-muted-foreground">{rec.expectedYield}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium mb-2">Growing Notes:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {rec.notes.map((note, noteIndex) => (
                        <li key={noteIndex}>{note}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedSoil && recommendations.length === 0 && (
        <Alert>
          <Droplets className="h-4 w-4" />
          <AlertDescription>
            No specific recommendations available for the selected soil type and current weather conditions.
            Please check back later or consult with local agricultural experts.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}