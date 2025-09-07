import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Phone, Clock, Star, Navigation, ExternalLink } from 'lucide-react';

interface Farmer {
  name: string;
  distance: number;
  price: number;
  rating: number;
  inStock: boolean;
  lat: number;
  lng: number;
  address: string;
  phone: string;
  hours: string;
  specialties: string[];
  description: string;
  organic: boolean;
}

interface FarmersMapProps {
  isOpen: boolean;
  onClose: () => void;
  cropName: string;
}

const FarmersMap: React.FC<FarmersMapProps> = ({ isOpen, onClose, cropName }) => {
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Mock farmer data with South African locations near major cities
  const farmers: Farmer[] = [
    {
      name: 'Sunshine Acres',
      distance: 12.5,
      price: 18.50,
      rating: 4.6,
      inStock: true,
      lat: -26.2041,
      lng: 28.0473,
      address: '123 Farm Road, Johannesburg, Gauteng',
      phone: '+27 11 123 4567',
      hours: '6:00 AM - 6:00 PM',
      specialties: ['Tomatoes', 'Peppers', 'Lettuce'],
      description: 'Family-owned organic farm specializing in fresh vegetables. We use sustainable farming practices and have been serving the community for over 20 years.',
      organic: true
    },
    {
      name: 'Green Valley Farm',
      distance: 15.2,
      price: 22.00,
      rating: 4.8,
      inStock: true,
      lat: -26.1520,
      lng: 28.0856,
      address: '456 Valley View, Sandton, Gauteng',
      phone: '+27 11 234 5678',
      hours: '7:00 AM - 5:00 PM',
      specialties: ['Organic Vegetables', 'Herbs', 'Fruits'],
      description: 'Premium organic produce farm with certified organic practices. We focus on quality over quantity and offer farm tours.',
      organic: true
    },
    {
      name: 'Fresh Fields Co-op',
      distance: 18.7,
      price: 16.75,
      rating: 4.4,
      inStock: false,
      lat: -26.2709,
      lng: 27.9756,
      address: '789 Co-op Street, Soweto, Gauteng',
      phone: '+27 11 345 6789',
      hours: '8:00 AM - 4:00 PM',
      specialties: ['Community Grown', 'Affordable Produce', 'Local Varieties'],
      description: 'Community cooperative supporting local farmers. We offer competitive prices and focus on feeding our community.',
      organic: false
    },
    {
      name: 'Organic Haven',
      distance: 22.1,
      price: 25.00,
      rating: 4.9,
      inStock: true,
      lat: -26.1367,
      lng: 28.2293,
      address: '321 Organic Lane, Kempton Park, Gauteng',
      phone: '+27 11 456 7890',
      hours: '6:30 AM - 7:00 PM',
      specialties: ['Premium Organic', 'Heirloom Varieties', 'Seasonal Produce'],
      description: 'Premium organic farm with rare and heirloom varieties. We offer the highest quality produce with full traceability.',
      organic: true
    },
    {
      name: 'Riverside Gardens',
      distance: 9.3,
      price: 19.75,
      rating: 4.5,
      inStock: true,
      lat: -26.1849,
      lng: 28.1214,
      address: '654 River Road, Alexandra, Gauteng',
      phone: '+27 11 567 8901',
      hours: '5:30 AM - 6:30 PM',
      specialties: ['Hydroponic Vegetables', 'Year-round Supply', 'Fresh Herbs'],
      description: 'Modern hydroponic farm ensuring consistent quality and supply throughout the year. Our controlled environment produces the freshest vegetables.',
      organic: false
    }
  ];

  const handleGetDirections = (farmer: Farmer) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${farmer.lat},${farmer.lng}`;
    window.open(url, '_blank');
  };

  const handleCallFarmer = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleViewOnMap = (farmer: Farmer) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${farmer.lat},${farmer.lng}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    if (isOpen && mapRef.current) {
      // Initialize an embedded Google Map
      const centerLat = -26.2041;
      const centerLng = 28.0473;
      
      // Create markers query string for Google Maps
      const markersQuery = farmers.map(farmer => 
        `markers=color:red%7Clabel:${farmer.name.charAt(0)}%7C${farmer.lat},${farmer.lng}`
      ).join('&');
      
      const mapSrc = `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dO5XPodgAn8A8o&center=${centerLat},${centerLng}&zoom=11&maptype=roadmap`;
      
      mapRef.current.innerHTML = `
        <iframe
          width="100%"
          height="100%"
          style="border:0;border-radius:8px;"
          loading="lazy"
          allowfullscreen
          referrerpolicy="no-referrer-when-downgrade"
          src="${mapSrc}">
        </iframe>
      `;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Local Farmers Growing {cropName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[70vh]">
          {/* Map Section */}
          <div className="lg:col-span-2 relative rounded-lg overflow-hidden bg-muted">
            <div ref={mapRef} className="w-full h-full" />
            
            {/* Fallback content */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 border-2 border-dashed border-muted-foreground/20 rounded-lg">
              <div className="text-center p-8">
                <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Interactive Farm Map</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {farmers.length} local farmers within 25km radius
                </p>
                <div className="space-y-2">
                  {farmers.slice(0, 3).map((farmer, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white/60 rounded">
                      <span className="text-sm font-medium">{farmer.name}</span>
                      <Badge variant="outline" className="text-xs">{farmer.distance}km</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Farmers List Section */}
          <div className="space-y-4 overflow-y-auto">
            <h3 className="font-semibold text-lg">Available Farmers ({farmers.length})</h3>
            
            {farmers.map((farmer, index) => (
              <Card 
                key={index} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedFarmer?.name === farmer.name ? 'ring-2 ring-primary' : ''
                } ${!farmer.inStock ? 'opacity-60' : ''}`}
                onClick={() => setSelectedFarmer(farmer)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{farmer.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={farmer.inStock ? 'default' : 'secondary'} className="text-xs">
                          {farmer.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                        {farmer.organic && (
                          <Badge variant="outline" className="text-xs">Organic</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">R{farmer.price}/kg</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{farmer.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{farmer.distance}km away</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{farmer.hours}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {farmer.specialties.slice(0, 2).map((specialty, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewOnMap(farmer);
                      }}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGetDirections(farmer);
                      }}
                    >
                      <Navigation className="w-3 h-3 mr-1" />
                      Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Selected Farmer Details */}
        {selectedFarmer && (
          <div className="mt-4 p-4 border rounded-lg bg-accent/50">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold">{selectedFarmer.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedFarmer.address}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCallFarmer(selectedFarmer.phone)}
                >
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleGetDirections(selectedFarmer)}
                >
                  <Navigation className="w-4 h-4 mr-1" />
                  Directions
                </Button>
              </div>
            </div>
            
            <p className="text-sm mb-3">{selectedFarmer.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-medium">Price</p>
                <p className="text-green-600">R{selectedFarmer.price}/kg</p>
              </div>
              <div>
                <p className="font-medium">Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{selectedFarmer.rating}/5</span>
                </div>
              </div>
              <div>
                <p className="font-medium">Distance</p>
                <p>{selectedFarmer.distance}km away</p>
              </div>
              <div>
                <p className="font-medium">Hours</p>
                <p>{selectedFarmer.hours}</p>
              </div>
            </div>
            
            <div className="mt-3">
              <p className="font-medium text-sm mb-2">Specialties:</p>
              <div className="flex flex-wrap gap-1">
                {selectedFarmer.specialties.map((specialty, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
              <h4 className="font-medium text-sm mb-1">Contact & Visit</h4>
              <p className="text-xs text-muted-foreground">
                Call ahead to confirm availability and arrange pickup times. 
                {selectedFarmer.organic ? ' This farm is certified organic.' : ''}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FarmersMap;