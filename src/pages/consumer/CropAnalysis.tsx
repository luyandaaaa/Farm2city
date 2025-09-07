import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Camera, Upload, Scan, Leaf, Info, MapPin, Star, 
  Heart, ChefHat, Lightbulb, Zap, Eye, Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { pipeline } from '@huggingface/transformers';
import FarmersMap from '@/components/FarmersMap';
import { useTranslation } from 'react-i18next';
import { ConsumerLayout } from '@/components/layouts/ConsumerLayout';


interface CropInfo {
  name: string;
  confidence: number;
  diseaseStatus: {
    healthy: boolean;
    issues?: string[];
    recommendations?: string[];
  };
  quality: {
    ripeness: string;
    freshness: number;
    shelfLife: string;
    storageAdvice: string;
  };
  nutritionFacts: {
    calories: number;
    protein: number;
    carbs: number;
    fiber: number;
    vitamins: string[];
  };
  healthBenefits: string[];
  recipes: string[];
  seasonality: {
    inSeason: boolean;
    peakMonths: string[];
    availability: string;
  };
  nearbyFarmers: Array<{
    name: string;
    distance: number;
    price: number;
    rating: number;
    inStock: boolean;
  }>;
}
const CropAnalysis = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<CropInfo | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [showARScanner, setShowARScanner] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [showFarmersMap, setShowFarmersMap] = useState(false);
  const [realTimeDetections, setRealTimeDetections] = useState<Array<{
    crop: string;
    confidence: number;
    x: number;
    y: number;
    width: number;
    height: number;
    info?: string;
  }>>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [classifier, setClassifier] = useState<any>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        analyzeImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    setIsAnalyzing(true);
    
    // Mock analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Enhanced mock analysis result
    const mockResult: CropInfo = {
      name: 'Roma Tomato',
      confidence: 94,
      diseaseStatus: {
        healthy: true,
        issues: [],
        recommendations: ['Continue current care routine', 'Ensure adequate watering']
      },
      quality: {
        ripeness: 'Nearly ripe',
        freshness: 85,
        shelfLife: '5-7 days at room temperature',
        storageAdvice: 'Store at room temperature until fully ripe, then refrigerate'
      },
      nutritionFacts: {
        calories: 18,
        protein: 0.9,
        carbs: 3.9,
        fiber: 1.2,
        vitamins: ['Vitamin C', 'Vitamin K', 'Folate', 'Potassium']
      },
      healthBenefits: [
        'Rich in antioxidants including lycopene',
        'Supports heart health and reduces inflammation',
        'Good source of vitamin C for immune system',
        'Contains folate essential for cell function',
        'Low in calories, high in water content for hydration'
      ],
      recipes: [
        'Classic Tomato Pasta Sauce',
        'Fresh Caprese Salad',
        'Roasted Tomato Soup',
        'Mediterranean Bruschetta',
        'Tomato Gazpacho',
        'Stuffed Roma Tomatoes'
      ],
      seasonality: {
        inSeason: true,
        peakMonths: ['December', 'January', 'February'],
        availability: 'Peak season - best quality and prices'
      },
      nearbyFarmers: [
        { name: 'Sunshine Acres', distance: 12.5, price: 18.50, rating: 4.6, inStock: true },
        { name: 'Green Valley Farm', distance: 15.2, price: 22.00, rating: 4.8, inStock: true },
        { name: 'Fresh Fields Co-op', distance: 18.7, price: 16.75, rating: 4.4, inStock: false },
        { name: 'Organic Haven', distance: 22.1, price: 25.00, rating: 4.9, inStock: true }
      ]
    };
    
    setAnalysisResult(mockResult);
    setIsAnalyzing(false);
    
    toast({
      title: "Analysis Complete!",
      description: `Identified as ${mockResult.name} with ${mockResult.confidence}% confidence`,
    });
  };

  // Initialize CNN model for crop detection
  const initializeARModel = async () => {
    setIsLoadingModel(true);
    console.log('Starting model initialization...');
    
    try {
      console.log('Attempting to load image classification model...');
      // Use a simple, reliable model that definitely exists
      const cropClassifier = await pipeline(
        'image-classification',
        'Xenova/resnet-50'
      );
      console.log('Model loaded successfully:', cropClassifier);
      setClassifier(cropClassifier);
      
      toast({
        title: "AR Model Ready",
        description: "CNN model loaded successfully for real-time crop detection",
      });
    } catch (error) {
      console.error('Primary model loading failed:', error);
      
      try {
        console.log('Trying alternative model...');
        // Try an even simpler model
        const cropClassifier = await pipeline(
          'image-classification',
          'Xenova/vit-base-patch16-224'
        );
        console.log('Alternative model loaded:', cropClassifier);
        setClassifier(cropClassifier);
        
        toast({
          title: "AR Model Ready", 
          description: "CNN model loaded successfully for crop detection",
        });
      } catch (fallbackError) {
        console.error('Alternative model failed:', fallbackError);
        
        // Create a mock classifier for demo purposes
        console.log('Creating mock classifier for demo...');
        const mockClassifier = (imageData: string) => {
          return Promise.resolve([
            { label: 'tomato', score: 0.85 },
            { label: 'vegetable', score: 0.75 },
            { label: 'plant', score: 0.65 }
          ]);
        };
        setClassifier(mockClassifier);
        
        toast({
          title: "Demo Mode Active", 
          description: "Using mock classifier for demonstration",
        });
      }
    }
    setIsLoadingModel(false);
  };

  const startARScanner = async () => {
    try {
      // Show instruction first
      toast({
        title: "AR Scanner Starting",
        description: "Point your camera at crops for real-time AI detection",
      });

      // Small delay to ensure user sees the instruction
      await new Promise(resolve => setTimeout(resolve, 500));

      // Then open camera
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      console.log('Camera stream obtained:', stream);
      setCameraStream(stream);
      setShowARScanner(true);
      
      if (!classifier) {
        await initializeARModel();
      }
      
    } catch (error) {
      console.error('Camera access error:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopARScanner = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setShowARScanner(false);
      setRealTimeDetections([]);
    }
  };

  // Real-time crop detection
  const detectCropsInFrame = async () => {
    if (!videoRef.current || !canvasRef.current || !classifier) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.videoWidth === 0 || video.readyState !== 4) return;

    try {
      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob for processing
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        try {
          const img = new Image();
          img.onload = async () => {
            try {
              const results = await classifier(img);
              
              if (Array.isArray(results) && results.length > 0) {
                // More specific crop filtering
                const cropResults = results.filter((result: any) => {
                  const label = result.label?.toLowerCase() || '';
                  const score = result.score || 0;
                  
                  // Check for person/human detection first
                  if (label.includes('person') || label.includes('human') || label.includes('man') || label.includes('woman')) {
                    return false; // Exclude person detections
                  }
                  
                  // Only include actual crops and food items
                  return (
                    (label.includes('tomato') || label.includes('potato') || label.includes('corn') ||
                     label.includes('carrot') || label.includes('pepper') || label.includes('lettuce') ||
                     label.includes('cabbage') || label.includes('broccoli') || label.includes('cauliflower') ||
                     label.includes('cucumber') || label.includes('onion') || label.includes('garlic') ||
                     label.includes('apple') || label.includes('banana') || label.includes('orange') ||
                     label.includes('strawberry') || label.includes('grape') || label.includes('peach') ||
                     label.includes('vegetable') || label.includes('fruit') || label.includes('plant')) &&
                    score > 0.2 // Lower threshold for better detection
                  );
                });

                // Check if person was detected
                const personDetected = results.some((result: any) => {
                  const label = result.label?.toLowerCase() || '';
                  return label.includes('person') || label.includes('human') || label.includes('man') || label.includes('woman');
                });

                if (personDetected) {
                  setRealTimeDetections([{
                    crop: 'No Crop Detected',
                    confidence: 0,
                    info: 'Person detected - please point camera at crops',
                    x: canvas.width * 0.1,
                    y: canvas.height * 0.1,
                    width: canvas.width * 0.8,
                    height: canvas.height * 0.8
                  }]);
                } else if (cropResults.length > 0) {
                  const topResult = cropResults[0];
                  const cropName = topResult.label.replace(/[^a-zA-Z\s]/g, '').trim();
                  const confidence = Math.round((topResult.score || 0.5) * 100);
                  
                  // Get crop-specific info
                  const getCropInfo = (name: string) => {
                    const cropLower = name.toLowerCase();
                    if (cropLower.includes('tomato')) return 'Rich in lycopene and vitamin C';
                    if (cropLower.includes('carrot')) return 'High in beta-carotene and fiber';
                    if (cropLower.includes('lettuce')) return 'Low calorie, high in folate';
                    if (cropLower.includes('apple')) return 'Good source of fiber and antioxidants';
                    if (cropLower.includes('pepper')) return 'High in vitamin C and capsaicin';
                    return 'Nutritious and healthy crop';
                  };
                  
                  setRealTimeDetections([{
                    crop: cropName,
                    confidence: confidence,
                    info: getCropInfo(cropName),
                    x: canvas.width * 0.1,
                    y: canvas.height * 0.1,
                    width: canvas.width * 0.8,
                    height: canvas.height * 0.8
                  }]);
                } else {
                  // No crops detected
                  setRealTimeDetections([{
                    crop: 'No Crop Detected',
                    confidence: 0,
                    info: 'Point camera at fruits or vegetables',
                    x: canvas.width * 0.2,
                    y: canvas.height * 0.2,
                    width: canvas.width * 0.6,
                    height: canvas.height * 0.6
                  }]);
                }
              }
            } catch (classificationError) {
              console.log('Classification failed, using demo mode');
              setRealTimeDetections([{
                crop: 'Demo Mode',
                confidence: 75,
                info: 'AI model loading - showing demo detection',
                x: canvas.width * 0.15,
                y: canvas.height * 0.15,
                width: canvas.width * 0.7,
                height: canvas.height * 0.7
              }]);
            }
          };
          img.src = URL.createObjectURL(blob);
        } catch (blobError) {
          console.error('Blob processing error:', blobError);
        }
      }, 'image/jpeg', 0.8);
      
    } catch (error) {
      console.error('Detection error:', error);
    }
  };

  // Start real-time detection when AR scanner is active
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (showARScanner && classifier && videoRef.current) {
      intervalId = setInterval(detectCropsInFrame, 1000); // Detect every second
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [showARScanner, classifier]);

  // Effect to handle video stream assignment
  useEffect(() => {
    if (showARScanner && cameraStream && videoRef.current && !videoRef.current.srcObject) {
      console.log('Assigning camera stream to video element');
      
      const video = videoRef.current;
      video.srcObject = cameraStream;
      
      // Set up event handlers
      const handleCanPlay = () => {
        console.log('Video can play, starting playback');
        video.play().catch(error => {
          console.error('Error playing video:', error);
          // Only show error if it's a real error, not just a user gesture issue
          if (error.name !== 'NotAllowedError') {
            toast({
              title: "Video Error", 
              description: "Failed to start video playback. Please try again.",
              variant: "destructive"
            });
          }
        });
        video.removeEventListener('canplay', handleCanPlay);
      };
      
      video.addEventListener('canplay', handleCanPlay);
      
      // Cleanup
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [showARScanner, cameraStream]);

  // Start real-time detection when AR scanner is active

  const selectDetectedCrop = (detection: any) => {
    // Create mock analysis based on detected crop
    const mockResult: CropInfo = {
      name: detection.crop.replace(/[^a-zA-Z\s]/g, '').trim(),
      confidence: detection.confidence,
      diseaseStatus: {
        healthy: true,
        issues: [],
        recommendations: ['Continue monitoring crop health', 'Ensure adequate nutrition']
      },
      quality: {
        ripeness: 'Good condition',
        freshness: 90,
        shelfLife: '7-10 days',
        storageAdvice: 'Store in cool, dry place'
      },
      nutritionFacts: {
        calories: 25,
        protein: 1.5,
        carbs: 6.0,
        fiber: 2.5,
        vitamins: ['Vitamin C', 'Vitamin K', 'Folate']
      },
      healthBenefits: [
        'Rich in antioxidants and vitamins',
        'Supports immune system health',
        'Good source of dietary fiber',
        'Low in calories, high in nutrients'
      ],
      recipes: [
        'Fresh Garden Salad',
        'Roasted Vegetable Medley',
        'Healthy Smoothie Bowl',
        'Grilled Vegetable Skewers'
      ],
      seasonality: {
        inSeason: true,
        peakMonths: ['December', 'January', 'February'],
        availability: 'Available year-round'
      },
      nearbyFarmers: [
        { name: 'Local Farm Market', distance: 8.5, price: 15.50, rating: 4.7, inStock: true },
        { name: 'Green Valley Co-op', distance: 12.2, price: 18.00, rating: 4.5, inStock: true }
      ]
    };

    setAnalysisResult(mockResult);
    stopARScanner();
    
    toast({
      title: "Crop Selected!",
      description: `Analyzing ${detection.crop} with ${detection.confidence}% confidence`,
    });
  };

  // Generate page text for VoiceOver
  const pageText = useMemo(() => {
    if (analysisResult) {
      return `${t('crop.analysis.title')}: ${analysisResult.name}. ${analysisResult.confidence}% confidence. ${analysisResult.healthBenefits.join('. ')}.`;
    }
    return `${t('crop.title')}. ${t('crop.subtitle')}.`;
  }, [t, analysisResult]);

  return (
    <ConsumerLayout currentPage="Crop Analysis">
      <div className="space-y-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="w-5 h-5" />
              AI-Powered Crop Scanner
            </CardTitle>
            <CardDescription>
              Upload an image or take a photo to identify crops and get detailed information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Upload Area */}
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  {uploadedImage ? (
                    <div className="space-y-4">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded crop" 
                        className="max-w-full h-48 object-cover rounded-lg mx-auto"
                      />
                      <Button variant="outline" onClick={() => setUploadedImage(null)}>
                        Upload New Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                      <div>
                        <Label htmlFor="image-upload" className="cursor-pointer">
                          <div className="space-y-2">
                            <p className="text-lg font-medium">Upload Image</p>
                            <p className="text-sm text-muted-foreground">
                              Drag and drop or click to select an image
                            </p>
                          </div>
                        </Label>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </div>
                      <Button variant="outline" onClick={() => document.getElementById('image-upload')?.click()}>
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Analysis Status */}
            <div className="space-y-4">
              {isAnalyzing && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                      <div>
                        <p className="font-medium">Analyzing Image...</p>
                        <p className="text-sm text-muted-foreground">
                          Our AI is identifying the crop and gathering information
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {analysisResult && !isAnalyzing && (
                <Card className="bg-consumer-blue/5 border-consumer-blue/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-6 h-6 text-consumer-blue">
                        <Zap className="w-6 h-6 text-consumer-blue" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{analysisResult.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {analysisResult.confidence}% confidence match
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-consumer-blue text-white">
                      Analysis Complete
                    </Badge>
                  </CardContent>
                </Card>
              )}

              {/* Sample Analysis */}
              {!uploadedImage && !isAnalyzing && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">What you'll get:</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Crop identification and facts
                      </li>
                      <li className="flex items-center gap-2">
                        <Leaf className="w-4 h-4" />
                        Nutritional information
                      </li>
                      <li className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        Health benefits
                      </li>
                      <li className="flex items-center gap-2">
                        <ChefHat className="w-4 h-4" />
                        Recipe suggestions
                      </li>
                      <li className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Local vendor locations
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysisResult && (
          <Tabs defaultValue="nutrition" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="health-check">Health Status</TabsTrigger>
              <TabsTrigger value="quality">Quality & Storage</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="health">Benefits</TabsTrigger>
              <TabsTrigger value="recipes">Recipes</TabsTrigger>
              <TabsTrigger value="vendors">Buy Local</TabsTrigger>
            </TabsList>

            <TabsContent value="health-check">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {analysisResult.diseaseStatus.healthy ? (
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    ) : (
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    )}
                    Health Analysis
                  </CardTitle>
                  <CardDescription>AI-powered crop health assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg ${
                      analysisResult.diseaseStatus.healthy ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}>
                      <h4 className={`font-bold text-lg ${
                        analysisResult.diseaseStatus.healthy ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {analysisResult.diseaseStatus.healthy ? 'Healthy Crop ✓' : 'Issues Detected ⚠️'}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {analysisResult.diseaseStatus.healthy 
                          ? 'No diseases or pests detected. Crop appears healthy.' 
                          : 'Our AI has identified potential issues that need attention.'}
                      </p>
                    </div>

                    {analysisResult.diseaseStatus.issues && analysisResult.diseaseStatus.issues.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">Detected Issues:</h4>
                        <div className="space-y-2">
                          {analysisResult.diseaseStatus.issues.map((issue, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded">
                              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                              <p className="text-sm">{issue}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysisResult.diseaseStatus.recommendations && (
                      <div>
                        <h4 className="font-medium mb-3">AI Recommendations:</h4>
                        <div className="space-y-2">
                          {analysisResult.diseaseStatus.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded">
                              <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <p className="text-sm">{rec}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quality">
              <Card>
                <CardHeader>
                  <CardTitle>Quality Assessment & Storage</CardTitle>
                  <CardDescription>Freshness analysis and storage recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-3">Quality Metrics</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-muted rounded">
                            <span className="text-sm">Ripeness</span>
                            <Badge className="bg-orange-100 text-orange-800">{analysisResult.quality.ripeness}</Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-muted rounded">
                            <span className="text-sm">Freshness Score</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full transition-all" 
                                  style={{ width: `${analysisResult.quality.freshness}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-bold">{analysisResult.quality.freshness}%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-muted rounded">
                            <span className="text-sm">Expected Shelf Life</span>
                            <span className="text-sm font-medium">{analysisResult.quality.shelfLife}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-3">Storage Recommendations</h4>
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-sm">{analysisResult.quality.storageAdvice}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Seasonality Info</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Currently in season</span>
                            <Badge className={analysisResult.seasonality.inSeason ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {analysisResult.seasonality.inSeason ? 'Yes' : 'No'}
                            </Badge>
                          </div>
                          <div className="p-3 bg-muted rounded">
                            <p className="text-xs text-muted-foreground mb-1">Peak Months</p>
                            <p className="text-sm font-medium">{analysisResult.seasonality.peakMonths.join(', ')}</p>
                          </div>
                          <div className="p-3 bg-muted rounded">
                            <p className="text-xs text-muted-foreground mb-1">Availability Status</p>
                            <p className="text-sm">{analysisResult.seasonality.availability}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nutrition">
              <Card>
                <CardHeader>
                  <CardTitle>Nutritional Information</CardTitle>
                  <CardDescription>Per 100g serving of {analysisResult.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {analysisResult.nutritionFacts.calories}
                      </div>
                      <div className="text-sm text-muted-foreground">Calories</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {analysisResult.nutritionFacts.protein}g
                      </div>
                      <div className="text-sm text-muted-foreground">Protein</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {analysisResult.nutritionFacts.carbs}g
                      </div>
                      <div className="text-sm text-muted-foreground">Carbs</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {analysisResult.nutritionFacts.fiber}g
                      </div>
                      <div className="text-sm text-muted-foreground">Fiber</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Key Vitamins & Minerals</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.nutritionFacts.vitamins.map((vitamin) => (
                        <Badge key={vitamin} variant="outline">{vitamin}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="health">
              <Card>
                <CardHeader>
                  <CardTitle>Health Benefits</CardTitle>
                  <CardDescription>Why {analysisResult.name} is good for you</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysisResult.healthBenefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                        <Heart className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <p>{benefit}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recipes">
              <Card>
                <CardHeader>
                  <CardTitle>Recipe Suggestions</CardTitle>
                  <CardDescription>Delicious ways to use {analysisResult.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysisResult.recipes.map((recipe, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:bg-accent cursor-pointer">
                        <div className="flex items-center gap-3">
                          <ChefHat className="w-5 h-5 text-primary" />
                          <p className="font-medium">{recipe}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vendors">
              <Card>
                <CardHeader>
                  <CardTitle>Find Local Vendors</CardTitle>
                  <CardDescription>Buy {analysisResult.name} from nearby farmers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisResult.nearbyFarmers.map((farmer, index) => (
                      <div key={index} className={`p-4 border rounded-lg transition-all ${
                        farmer.inStock ? 'hover:bg-accent border-border' : 'border-muted bg-muted/30'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{farmer.name}</p>
                                {farmer.inStock ? (
                                  <Badge className="bg-green-100 text-green-800 text-xs">In Stock</Badge>
                                ) : (
                                  <Badge variant="secondary" className="text-xs">Out of Stock</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {farmer.distance}km away
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className={`font-bold ${farmer.inStock ? 'text-farm-green' : 'text-muted-foreground'}`}>
                                R{farmer.price}/kg
                              </p>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs">{farmer.rating}</span>
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              variant={farmer.inStock ? "default" : "outline"} 
                              disabled={!farmer.inStock}
                              onClick={() => farmer.inStock && setShowFarmersMap(true)}
                            >
                              {farmer.inStock ? 'Visit Farm' : 'Notify When Available'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Farmers Map Modal */}
        <FarmersMap
          isOpen={showFarmersMap}
          onClose={() => setShowFarmersMap(false)}
          cropName={analysisResult?.name || 'crops'}
        />
      </div>
    </ConsumerLayout>
  );
};

export default CropAnalysis;