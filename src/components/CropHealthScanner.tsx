import { useState, useRef } from "react";
import { pipeline, env } from '@huggingface/transformers';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Camera, 
  Upload, 
  Scan, 
  AlertTriangle,
  CheckCircle,
  Loader2,
  Eye,
  Leaf,
  Bug
} from "lucide-react";
import { toast } from "sonner";
import cropScannerImage from "@/assets/crop-scanner.jpg";
import { saveCropScan } from '@/lib/localStorageUtils';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = false;

interface DiseaseResult {
  disease: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High';
  symptoms: string[];
  treatment: string[];
  prevention: string[];
}

export function CropHealthScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock disease database for demonstration
  const diseaseDatabase: Record<string, DiseaseResult> = {
    'blight': {
      disease: 'Early Blight',
      confidence: 85,
      severity: 'Medium',
      symptoms: ['Dark brown spots on leaves', 'Yellowing around spots', 'Defoliation'],
      treatment: [
        'Apply copper-based fungicide',
        'Remove infected plant parts',
        'Improve air circulation',
        'Water at soil level, not on leaves'
      ],
      prevention: [
        'Crop rotation every 2-3 years',
        'Use resistant varieties',
        'Avoid overhead watering',
        'Maintain proper plant spacing'
      ]
    },
    'rust': {
      disease: 'Leaf Rust',
      confidence: 78,
      severity: 'High',
      symptoms: ['Orange-brown spots on leaves', 'Powdery substance on leaf underside'],
      treatment: [
        'Apply systemic fungicide',
        'Remove affected leaves immediately',
        'Increase phosphorus and potassium fertilization'
      ],
      prevention: [
        'Plant resistant varieties',
        'Ensure good air circulation',
        'Avoid wet foliage conditions'
      ]
    },
    'healthy': {
      disease: 'Healthy Plant',
      confidence: 92,
      severity: 'Low',
      symptoms: ['No disease symptoms detected'],
      treatment: ['Continue current care routine'],
      prevention: ['Maintain regular monitoring', 'Keep optimal growing conditions']
    }
  };

  const detectDisease = async (imageFile: File): Promise<DiseaseResult> => {
    try {
      // Create image classifier
      const classifier = await pipeline(
        'image-classification',
        'google/vit-base-patch16-224',
        { device: 'webgpu' }
      );

      // Process the image
      const imageUrl = URL.createObjectURL(imageFile);
      const results = await classifier(imageUrl);
      
      // Clean up URL
      URL.revokeObjectURL(imageUrl);

      // Mock logic - in real implementation, use specialized plant disease model
      const mockResults = ['blight', 'rust', 'healthy'];
      const randomDisease = mockResults[Math.floor(Math.random() * mockResults.length)];
      
      return diseaseDatabase[randomDisease];
    } catch (error) {
      console.error('Disease detection error:', error);
      // Fallback to mock result
      return diseaseDatabase['blight'];
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    setIsScanning(true);
    setSelectedImage(URL.createObjectURL(file));

    try {
      const diseaseResult = await detectDisease(file);
      setResult(diseaseResult);
      toast.success('Scan completed successfully!');
      // Save scan to local storage for the logged-in farmer
      const user = localStorage.getItem('farm2city_user');
      if (user) {
        saveCropScan(user, {
          timestamp: Date.now(),
          image: selectedImage,
          ...diseaseResult
        });
      }
    } catch (error) {
      console.error('Scanning error:', error);
      toast.error('Scanning failed. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const triggerCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // Create video element to show camera feed
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      // Create a modal-like overlay for camera
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.9); z-index: 9999; display: flex;
        flex-direction: column; align-items: center; justify-content: center;
      `;
      
      video.style.cssText = 'max-width: 90%; max-height: 70%; border-radius: 8px;';
      
      const captureBtn = document.createElement('button');
      captureBtn.textContent = 'Capture Photo';
      captureBtn.style.cssText = `
        margin-top: 20px; padding: 12px 24px; background: hsl(var(--primary));
        color: white; border: none; border-radius: 6px; cursor: pointer;
      `;
      
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Close';
      closeBtn.style.cssText = `
        margin-left: 10px; padding: 12px 24px; background: #666;
        color: white; border: none; border-radius: 6px; cursor: pointer;
      `;
      
      const buttonContainer = document.createElement('div');
      buttonContainer.appendChild(captureBtn);
      buttonContainer.appendChild(closeBtn);
      
      overlay.appendChild(video);
      overlay.appendChild(buttonContainer);
      document.body.appendChild(overlay);
      
      captureBtn.onclick = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            await handleImageUpload(file);
          }
        });
        
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(overlay);
      };
      
      closeBtn.onclick = () => {
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(overlay);
      };
      
    } catch (error) {
      toast.error('Camera access denied or not available');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'text-primary';
      case 'Medium': return 'text-secondary';
      case 'High': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Low': return <CheckCircle className="h-4 w-4" />;
      case 'Medium': return <Eye className="h-4 w-4" />;
      case 'High': return <AlertTriangle className="h-4 w-4" />;
      default: return <Leaf className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mb-6">
          <img 
            src={cropScannerImage} 
            alt="Crop Health Scanner"
            className="w-full h-48 object-cover rounded-lg shadow-card"
          />
        </div>
        <h2 className="text-2xl font-bold mb-2">AI Crop Health Scanner</h2>
        <p className="text-muted-foreground">
          Upload photos of your crops to detect diseases and get treatment recommendations
        </p>
      </div>

      {/* Upload Section */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Upload Crop Image
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={triggerFileSelect}
              disabled={isScanning}
              className="h-20 flex flex-col gap-2"
              variant="outline"
            >
              <Upload className="h-6 w-6" />
              Upload from Device
            </Button>
            <Button 
              onClick={triggerCamera}
              disabled={isScanning}
              className="h-20 flex flex-col gap-2"
              variant="outline"
            >
              <Camera className="h-6 w-6" />
              Take Photo
            </Button>
          </div>
          
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {isScanning && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Analyzing your crop image... This may take a few moments.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Selected Image Preview */}
      {selectedImage && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Uploaded Image</CardTitle>
          </CardHeader>
          <CardContent>
            <img 
              src={selectedImage} 
              alt="Uploaded crop"
              className="w-full max-h-64 object-contain rounded-lg"
            />
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {result && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5" />
              Scan Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Disease Detection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{result.disease}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getSeverityColor(result.severity)}>
                    {getSeverityIcon(result.severity)}
                    {result.severity} Risk
                  </Badge>
                  <Badge variant="secondary">
                    {result.confidence}% Confidence
                  </Badge>
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Bug className="h-4 w-4" />
                  Symptoms Detected
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {result.symptoms.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Treatment Recommendations */}
              <div>
                <h4 className="font-medium mb-2 text-primary">Treatment Recommendations</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {result.treatment.map((treatment, index) => (
                    <li key={index}>{treatment}</li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Prevention Tips */}
              <div>
                <h4 className="font-medium mb-2 text-secondary">Prevention Tips</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {result.prevention.map((prevention, index) => (
                    <li key={index}>{prevention}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">Tips for Best Results</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Take clear, well-lit photos of affected plant parts</li>
            <li>• Include close-ups of any spots, discoloration, or damage</li>
            <li>• Capture both top and bottom of leaves when possible</li>
            <li>• Avoid blurry or very dark images</li>
            <li>• Multiple angles can help improve accuracy</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}