import { useState, useEffect } from "react";
import { ConsumerLayout } from "@/components/layouts/ConsumerLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Star, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import appleRidgeFarmImg from "@/assets/products/appleRidgeFarm.jpeg";
import applesImg from "@/assets/products/apples.jpg";
import bananaImg from "@/assets/products/banana.jpeg";
import bellPeppersVeggiePatchImg from "@/assets/products/bell peppers Veggie Patch.jpeg";
import carrotsRiverBendFarmImg from "@/assets/products/carrotsRiverBendFarm.jpeg";
import carrotsSunnyAcresImg from "@/assets/products/carrotsSunnyAcres.jpeg";
import cheeseImg from "@/assets/products/cheese.jpeg";
import cornImg from "@/assets/products/corn.jpg";
import eggsCountryCoopImg from "@/assets/products/eggsCountry Coop.jpeg";
import eggsHappyHensFarmImg from "@/assets/products/eggsHappy Hens Farm.jpeg";
import greekYogurtImg from "@/assets/products/greekyYogurt.jpeg";
import heritageTomatoesImg from "@/assets/products/heritage-tomatoes.jpg";
import letticeRiversideGardensImg from "@/assets/products/letticeRiversideGardens.jpeg";
import letticeUrbanGreensImg from "@/assets/products/letticeUrbanGreens.jpeg";
import mintLeavesImg from "@/assets/products/mintLeaves.jpeg";
import oatsImg from "@/assets/products/rolleOats.jpeg";
import parselyImg from "@/assets/products/parsely.jpeg";
import peppersImg from "@/assets/products/peppers.jpg";
import pearsImg from "@/assets/products/pears.jpeg";
import spinachImg from "@/assets/products/spinach.jpg";
import sweetCornImg from "@/assets/products/sweet-corn.jpg";
import tomatoesImg from "@/assets/products/tomatoes.jpg";
import wheatBreadImg from "@/assets/products/wheatBread.jpeg";
import whiteRiceImg from "@/assets/products/whiteRice.jpeg";
import dairyImg from "@/assets/categories/dairy.jpg";
import herbsImg from "@/assets/categories/herbs.jpg";
import fruitsImg from "@/assets/categories/fruits.jpg";
import vegetablesImg from "@/assets/categories/vegetables.jpg";
import grainsImg from "@/assets/categories/grains.jpg";
import { saveOrder, getAllFarmerProducts } from '@/lib/localStorageUtils';


interface Product {
  id: string;
  name: string;
  farmer: string;
  price: number;
  unit: string;
  distance: string;
  rating: number;
  image: string;
  organic: boolean;
  freshness: string;
  description: string;
  category: string;
  farmerProfile?: any; // add farmerProfile field
}

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});
  const { addToCart: addItemToCart, cartItems } = useCart();
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Get farmer products from localStorage (global list for consumer)
    const farmerProductsRaw = JSON.parse(localStorage.getItem('farm2city_products') || '[]');
    const farmerProducts: Product[] = (farmerProductsRaw || []).map((p: any) => ({
      id: p.id?.toString() || Math.random().toString(),
      name: p.name,
      farmer: p.farmerProfile?.name || p.farmer || p.farmerProfile?.farmName || "Local Farmer",
      price: Number(p.price),
      unit: p.unit || "kg",
      distance: p.distance || "-",
      rating: p.rating || 4.5,
      image: p.image,
      organic: p.organic ?? false,
      freshness: p.freshness || "Fresh",
      description: p.description || "",
      category: p.category || "other",
      farmerProfile: p.farmerProfile
    }));
    // Merge with static products
    setAllProducts([...products, ...farmerProducts]);
  }, []);

  const categories = [
    { id: "all", name: "All Products", image: fruitsImg },
    { id: "fruits", name: "Fruits", image: fruitsImg },
    { id: "vegetables", name: "Vegetables", image: vegetablesImg },
    { id: "herbs", name: "Herbs", image: herbsImg },
    { id: "dairy", name: "Dairy", image: dairyImg },
    { id: "grains", name: "Grains", image: grainsImg }
  ];

  const products: Product[] = [
    // Tomatoes from different farmers
    {
      id: "1",
      name: "Fresh Tomatoes",
      farmer: "Green Valley Farm",
      price: 65.50,
      unit: "kg",
      distance: "2.3 km",
      rating: 4.8,
      image: tomatoesImg,
      organic: true,
      freshness: "Harvested Today",
      description: "Vine-ripened organic tomatoes with rich flavor",
      category: "vegetables"
    },
    {
      id: "9",
      name: "Fresh Tomatoes",
      farmer: "Sunrise Fields",
      price: 59.99,
      unit: "kg",
      distance: "3.0 km",
      rating: 4.7,
      image: heritageTomatoesImg,
      organic: false,
      freshness: "Harvested Yesterday",
      description: "Classic tomatoes, perfect for salads and sauces",
      category: "vegetables"
    },
    // Apples from different farmers
    {
      id: "4",
      name: "Red Apples",
      farmer: "Mountain View Orchard",
      price: 75.00,
      unit: "kg",
      distance: "4.2 km",
      rating: 4.6,
      image: applesImg,
      organic: true,
      freshness: "Harvested 2 days ago",
      description: "Sweet, juicy red apples with crisp texture",
      category: "fruits"
    },
    {
      id: "10",
      name: "Red Apples",
      farmer: "Apple Ridge Farm",
      price: 69.50,
      unit: "kg",
      distance: "5.1 km",
      rating: 4.5,
      image: appleRidgeFarmImg,
      organic: false,
      freshness: "Harvested Yesterday",
      description: "Crisp apples, great for snacking and baking",
      category: "fruits"
    },
    // Carrots from different farmers
    {
      id: "2",
      name: "Organic Carrots",
      farmer: "Sunny Acres",
      price: 45.20,
      unit: "kg",
      distance: "1.8 km",
      rating: 4.9,
      image: carrotsSunnyAcresImg,
      organic: true,
      freshness: "Harvested Yesterday",
      description: "Sweet, crisp organic carrots perfect for cooking or snacking",
      category: "vegetables"
    },
    {
      id: "11",
      name: "Organic Carrots",
      farmer: "Riverbend Farm",
      price: 49.00,
      unit: "kg",
      distance: "2.5 km",
      rating: 4.8,
      image: carrotsRiverBendFarmImg,
      organic: true,
      freshness: "Harvested Today",
      description: "Locally grown organic carrots, full of flavor",
      category: "vegetables"
    },
    // Lettuce from different farmers
    {
      id: "3",
      name: "Fresh Lettuce",
      farmer: "Riverside Gardens",
      price: 38.80,
      unit: "head",
      distance: "3.1 km",
      rating: 4.7,
      image: letticeRiversideGardensImg, // updated image
      organic: false,
      freshness: "Harvested Today",
      description: "Crisp, fresh lettuce heads perfect for salads",
      category: "vegetables"
    },
    {
      id: "12",
      name: "Fresh Lettuce",
      farmer: "Urban Greens",
      price: 35.00,
      unit: "head",
      distance: "2.0 km",
      rating: 4.6,
      image: letticeUrbanGreensImg, // updated image
      organic: true,
      freshness: "Harvested Today",
      description: "Organic lettuce, grown in the city for maximum freshness",
      category: "vegetables"
    },
    // Corn from different farmers
    {
      id: "5",
      name: "Sweet Corn",
      farmer: "Prairie Gold Farm",
      price: 95.50,
      unit: "dozen",
      distance: "2.9 km",
      rating: 4.8,
      image: cornImg,
      organic: false,
      freshness: "Harvested Today",
      description: "Fresh sweet corn perfect for grilling or boiling",
      category: "grains"
    },
    {
      id: "13",
      name: "Sweet Corn",
      farmer: "Golden Fields",
      price: 89.99,
      unit: "dozen",
      distance: "3.7 km",
      rating: 4.7,
      image: sweetCornImg,
      organic: true,
      freshness: "Harvested Yesterday",
      description: "Organic sweet corn, tender and delicious",
      category: "grains"
    },
    // Peppers from different farmers
    {
      id: "6",
      name: "Bell Peppers",
      farmer: "Sunshine Vegetables",
      price: 68.80,
      unit: "kg",
      distance: "1.5 km",
      rating: 4.7,
      image: peppersImg,
      organic: true,
      freshness: "Harvested Today",
      description: "Colorful organic bell peppers, perfect for cooking",
      category: "vegetables"
    },
    {
      id: "14",
      name: "Bell Peppers",
      farmer: "Veggie Patch",
      price: 62.00,
      unit: "kg",
      distance: "2.2 km",
      rating: 4.6,
      image: bellPeppersVeggiePatchImg,
      organic: false,
      freshness: "Harvested 2 days ago",
      description: "Fresh bell peppers, great for stir-fries and salads",
      category: "vegetables"
    },
    // Spinach
    {
      id: "15",
      name: "Baby Spinach",
      farmer: "Leafy Greens Farm",
      price: 32.00,
      unit: "bunch",
      distance: "1.9 km",
      rating: 4.9,
      image: spinachImg,
      organic: true,
      freshness: "Harvested Today",
      description: "Tender baby spinach, perfect for salads and smoothies",
      category: "vegetables"
    },
    // Dairy
    {
      id: "8",
      name: "Farm Fresh Milk",
      farmer: "Dairy Valley",
      price: 18.50,
      unit: "liter",
      distance: "3.5 km",
      rating: 4.8,
      image: dairyImg,
      organic: false,
      freshness: "Bottled Today",
      description: "Fresh whole milk from grass-fed cows",
      category: "dairy"
    },
    // Herbs
    {
      id: "7",
      name: "Fresh Basil",
      farmer: "Herb Garden Co",
      price: 25.00,
      unit: "bunch",
      distance: "1.2 km",
      rating: 4.9,
      image: herbsImg,
      organic: true,
      freshness: "Harvested Today",
      description: "Aromatic fresh basil perfect for cooking",
      category: "herbs"
    },
    // Eggs
    {
      id: "16",
      name: "Free Range Eggs",
      farmer: "Happy Hens Farm",
      price: 32.00,
      unit: "dozen",
      distance: "2.4 km",
      rating: 4.9,
      image: eggsHappyHensFarmImg,
      organic: true,
      freshness: "Laid Today",
      description: "Fresh free-range eggs from pasture-raised hens",
      category: "dairy"
    },
    {
      id: "17",
      name: "Farm Eggs",
      farmer: "Country Coop",
      price: 28.50,
      unit: "dozen",
      distance: "3.2 km",
      rating: 4.7,
      image: eggsCountryCoopImg,
      organic: false,
      freshness: "Laid Yesterday",
      description: "Farm eggs, perfect for breakfast and baking",
      category: "dairy"
    },
    // More Fruits
    {
      id: "18",
      name: "Juicy Pears",
      farmer: "Orchard Lane",
      price: 55.00,
      unit: "kg",
      distance: "4.0 km",
      rating: 4.8,
      image: pearsImg,
      organic: true,
      freshness: "Harvested Today",
      description: "Sweet, juicy pears, perfect for snacking",
      category: "fruits"
    },
    {
      id: "19",
      name: "Bananas",
      farmer: "Tropical Grove",
      price: 30.00,
      unit: "kg",
      distance: "5.5 km",
      rating: 4.7,
      image: bananaImg,
      organic: false,
      freshness: "Harvested Yesterday",
      description: "Ripe bananas, great for smoothies and snacks",
      category: "fruits"
    },
    // More Herbs
    {
      id: "20",
      name: "Fresh Parsley",
      farmer: "Herb Haven",
      price: 18.00,
      unit: "bunch",
      distance: "1.7 km",
      rating: 4.8,
      image: parselyImg,
      organic: true,
      freshness: "Harvested Today",
      description: "Aromatic parsley, perfect for garnishing dishes",
      category: "herbs"
    },
    {
      id: "21",
      name: "Mint Leaves",
      farmer: "Minty Fresh Farm",
      price: 20.00,
      unit: "bunch",
      distance: "2.1 km",
      rating: 4.9,
      image: mintLeavesImg, // updated image
      organic: true,
      freshness: "Harvested Today",
      description: "Fresh mint leaves, great for tea and desserts",
      category: "herbs"
    },
    // More Dairy
    {
      id: "22",
      name: "Farmhouse Cheese",
      farmer: "Dairy Valley",
      price: 60.00,
      unit: "block",
      distance: "3.5 km",
      rating: 4.8,
      image: cheeseImg,
      organic: false,
      freshness: "Made This Week",
      description: "Creamy farmhouse cheese, perfect for sandwiches",
      category: "dairy"
    },
    {
      id: "23",
      name: "Greek Yogurt",
      farmer: "Creamery Co",
      price: 25.00,
      unit: "tub",
      distance: "2.8 km",
      rating: 4.9,
      image: greekYogurtImg, // updated image
      organic: true,
      freshness: "Made Today",
      description: "Thick, creamy Greek yogurt, high in protein",
      category: "dairy"
    },
    // More Grains
    {
      id: "24",
      name: "Rolled Oats",
      farmer: "Grain Millers",
      price: 40.00,
      unit: "kg",
      distance: "4.5 km",
      rating: 4.7,
      image: oatsImg,
      organic: true,
      freshness: "Packed This Week",
      description: "Whole rolled oats, perfect for breakfast",
      category: "grains"
    },
    {
      id: "25",
      name: "White Rice",
      farmer: "Rice Fields",
      price: 35.00,
      unit: "kg",
      distance: "6.0 km",
      rating: 4.6,
      image: whiteRiceImg,
      organic: false,
      freshness: "Packed This Month",
      description: "Premium white rice, ideal for any meal",
      category: "grains"
    },
    {
      id: "26",
      name: "Whole Wheat Bread",
      farmer: "Bakery Lane",
      price: 28.00,
      unit: "loaf",
      distance: "2.3 km",
      rating: 4.8,
      image: wheatBreadImg,
      organic: true,
      freshness: "Baked Today",
      description: "Freshly baked whole wheat bread, soft and healthy",
      category: "grains"
    }
  ];

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.farmer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (productId: string) => {
    const product = allProducts.find(p => p.id === productId);
    const quantity = quantities[productId] || 1;
    if (product) {
      addItemToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        farmer: product.farmer,
        unit: product.unit,
        // farmerProfile removed from cart item
      }, quantity);
      // Save order to local storage
      const user = localStorage.getItem('farm2city_user');
      if (user) {
        const order = {
          id: 'ORD-' + Date.now(),
          items: [{
            id: product.id,
            name: product.name,
            quantity,
            price: product.price,
            image: product.image,
            farmer: product.farmer,
            farmerProfile: product.farmerProfile, // attach profile
          }],
          status: 'pending',
          total: product.price * quantity,
          orderDate: new Date().toISOString(),
          estimatedDelivery: new Date(Date.now() + 2*24*60*60*1000).toISOString(),
          farmer: product.farmer,
          farmerProfile: product.farmerProfile, // attach profile
          consumer: user,
          address: 'To be filled',
        };
        saveOrder(order);
      }
    }
  };

  return (
    <ConsumerLayout currentPage="Marketplace">
      <div className="min-h-screen bg-muted/30 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Fresh Local Marketplace 🛒</h1>
            <p className="text-muted-foreground">
              Discover fresh produce from verified local farmers
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products or farmers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Nearby
              </Button>
            </div>
            
            {/* Category Filter */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {categories.map((category) => (
                <Card 
                  key={category.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedCategory === category.id 
                      ? 'ring-2 ring-primary shadow-md' 
                      : ''
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-3 text-center">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-12 h-12 object-cover rounded-full mx-auto mb-2"
                    />
                    <p className="text-xs font-medium">{category.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="shadow-card transition-smooth hover:shadow-glow">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                    onError={e => { e.currentTarget.src = '/placeholder.svg'; }}
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    {product.organic && (
                      <Badge variant="secondary" className="bg-primary text-primary-foreground">
                        Organic
                      </Badge>
                    )}
                    <Badge variant="outline" className="bg-card text-card-foreground">
                      {product.freshness}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{product.farmer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        R{product.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">per {product.unit}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <label htmlFor={`quantity-${product.id}`} className="text-sm font-medium">Qty:</label>
                    <Input
                      id={`quantity-${product.id}`}
                      type="number"
                      min={1}
                      value={quantities[product.id] || 1}
                      onChange={e => {
                        const value = Math.max(1, Number(e.target.value));
                        setQuantities(q => ({ ...q, [product.id]: value }));
                      }}
                      className="w-20"
                    />
                    <span className="text-xs text-muted-foreground">{product.unit}</span>
                  </div>
                  <Button 
                    onClick={() => addToCart(product.id)}
                    disabled={cartItems.some(item => item.id === product.id)}
                    className="w-full"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {cartItems.some(item => item.id === product.id) ? "Added to Cart" : "Add to Cart"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No products found matching your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </ConsumerLayout>
  );
}