import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ConsumerLayout } from "@/components/layouts/ConsumerLayout";
import { useCart } from "@/contexts/CartContext";
import { 
  Search,
  ShoppingCart, 
  Scan, 
  Trophy, 
  MessageSquare, 
  Sparkles, 
  User, 
  LogOut,
  MapPin,
  Star,
  Heart,
  Filter
} from "lucide-react";
import tomatoesImg from "@/assets/products/tomatoes.jpg";
import carrotsImg from "@/assets/products/carrotsSunnyAcres.jpeg";
import lettuceImg from "@/assets/products/letticeRiversideGardens.jpeg";
import applesImg from "@/assets/products/apples.jpg";
import cornImg from "@/assets/products/corn.jpg";
import peppersImg from "@/assets/products/peppers.jpg";
import spinachImg from "@/assets/products/spinach.jpg";
import sweetCornImg from "@/assets/products/sweet-corn.jpg";
import { toast } from "sonner";

export default function ConsumerDashboard() {
  const navigate = useNavigate();
  const [consumer, setConsumer] = useState({
    name: "Sipho Ndlovu",
    location: "Johannesburg",
    farmPoints: 850,
    savedFarmers: 5,
    totalOrders: 23
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("farm2city_token");
    const role = localStorage.getItem("farm2city_role");
    
    if (!token || role !== "consumer") {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("farm2city_token");
    localStorage.removeItem("farm2city_role");
    navigate("/");
  };

  const allProducts = [
    {
      id: 1,
      name: "Organic Baby Spinach",
      farm: "Green Pastures Farm",
      price: 42.99,
      unit: "kg",
      distance: 9.2,
      rating: 4.8,
      reviews: 15,
      image: spinachImg,
      category: "leafy"
    },
    {
      id: 2,
      name: "Heritage Tomatoes",
      farm: "Sunrise Organics",
      price: 38.50,
      unit: "kg",
      distance: 12.5,
      rating: 4.9,
      reviews: 22,
      image: tomatoesImg,
      category: "fruits"
    },
    {
      id: 3,
      name: "Organic Carrots",
      farm: "Earth & Sky Farm",
      price: 28.90,
      unit: "kg",
      distance: 7.3,
      rating: 4.6,
      reviews: 12,
      image: carrotsImg,
      category: "root"
    },
    {
      id: 4,
      name: "Fresh Lettuce",
      farm: "Valley Fresh",
      price: 32.50,
      unit: "kg",
      distance: 11.2,
      rating: 4.7,
      reviews: 18,
      image: lettuceImg,
      category: "leafy"
    },
    {
      id: 5,
      name: "Red Apples",
      farm: "Mountain View Orchard",
      price: 52.00,
      unit: "kg",
      distance: 14.8,
      rating: 4.8,
      reviews: 25,
      image: applesImg,
      category: "fruits"
    },
    {
      id: 6,
      name: "Sweet Corn",
      farm: "Golden Fields",
      price: 45.00,
      unit: "kg",
      distance: 8.5,
      rating: 4.9,
      reviews: 20,
      image: sweetCornImg,
      category: "grains"
    },
    {
      id: 7,
      name: "Bell Peppers",
      farm: "Colorful Gardens",
      price: 48.50,
      unit: "kg",
      distance: 13.7,
      rating: 4.6,
      reviews: 14,
      image: peppersImg,
      category: "fruits"
    },
    {
      id: 8,
      name: "Fresh Corn",
      farm: "Prairie Gold",
      price: 35.00,
      unit: "kg",
      distance: 10.3,
      rating: 4.5,
      reviews: 16,
      image: cornImg,
      category: "grains"
    }
  ];

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.farm.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" || product.category === selectedFilter;
    return matchesSearch && matchesFilter;
  }).slice(0, 8);

  const { addToCart: addItemToCart } = useCart();

  const addToCart = (productId: number) => {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
      addItemToCart({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
        farmer: product.farm,
        unit: product.unit,
      });
    }
  };

  const languages = [
    { code: "en", label: "English" },
    { code: "af", label: "Afrikaans" },
    { code: "zu", label: "Zulu" },
    { code: "xh", label: "Xhosa" },
    { code: "st", label: "Sotho" },
    { code: "tn", label: "Tswana" },
    { code: "ts", label: "Tsonga" },
    { code: "ve", label: "Venda" },
    { code: "nr", label: "Ndebele" },
    { code: "ss", label: "Swati" }
  ];
  const translations: Record<string, Record<string, string>> = {
    en: {
      welcome: "Welcome, {name}! 🛒",
      discover: "Discover fresh produce from local farmers in {location}.",
      farmPoints: "Farm Points",
      savedFarmers: "Saved Farmers",
      totalOrders: "Total Orders",
      searchPlaceholder: "Search for fresh produce...",
      all: "All",
      fruits: "Fruits",
      leafy: "Leafy Greens",
      root: "Root Vegetables",
      grains: "Grains",
      freshFrom: "Fresh from Local Farms",
      cropAnalysis: "Crop Analysis",
      analyzeNow: "Analyze Now",
      meetFarmers: "Meet the Farmers",
      browseProfiles: "Browse Profiles",
      aiRecommendations: "AI Recommendations",
      getSuggestions: "Get Suggestions"
    },
    zu: {
      welcome: "Siyakwamukela, {name}! 🛒",
      discover: "Thola imifino emisha kubalimi bendawo e {location}.",
      farmPoints: "Amaphuzu Epulazi",
      savedFarmers: "Abalimi Abagcinwe",
      totalOrders: "Ama-oda Aphelele",
      searchPlaceholder: "Sesha imifino emisha...",
      all: "Konke",
      fruits: "Izithelo",
      leafy: "Amahlamvu Aluhlaza",
      root: "Izimpande Zemifino",
      grains: "Okusanhlamvu",
      freshFrom: "Imifino Emisha Epulazini Lendawo",
      cropAnalysis: "Ukuhlaziywa Kwezolimo",
      analyzeNow: "Hlaziya Manje",
      meetFarmers: "Hlangana Nabalimi",
      browseProfiles: "Buka Amaphrofayela",
      aiRecommendations: "Izincomo ze-AI",
      getSuggestions: "Thola Izincomo"
    },
    // ...add more translations for other languages as needed...
  };
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const t = (key: string, vars?: Record<string, string>) => {
    let str = translations[selectedLanguage]?.[key] || translations["en"][key] || key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, v);
      });
    }
    return str;
  };
  const speak = (text: string) => {
    if (window.speechSynthesis) {
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = selectedLanguage;
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <ConsumerLayout currentPage="Dashboard">
      <div className="flex justify-end mb-4 gap-2">
        <select
          value={selectedLanguage}
          onChange={e => setSelectedLanguage(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
          aria-label="Select language"
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.label}</option>
          ))}
        </select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => speak(t("welcome", { name: consumer.name }) + " " + t("discover", { location: consumer.location }))}
        >
          Voiceover
        </Button>
      </div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("welcome", { name: consumer.name })}</h1>
        <p className="text-muted-foreground">
          {t("discover", { location: consumer.location })}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{consumer.farmPoints}</p>
                <p className="text-sm text-muted-foreground">{t("farmPoints")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Heart className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{consumer.savedFarmers}</p>
                <p className="text-sm text-muted-foreground">{t("savedFarmers")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{consumer.totalOrders}</p>
                <p className="text-sm text-muted-foreground">{t("totalOrders")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-card mb-8">
        <CardContent className="p-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={t("searchPlaceholder")}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Nearby
            </Button>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant={selectedFilter === "all" ? "default" : "outline"}
              onClick={() => setSelectedFilter("all")}
            >
              {t("all")}
            </Button>
            <Button 
              size="sm" 
              variant={selectedFilter === "fruits" ? "default" : "outline"}
              onClick={() => setSelectedFilter("fruits")}
            >
              {t("fruits")}
            </Button>
            <Button 
              size="sm" 
              variant={selectedFilter === "leafy" ? "default" : "outline"}
              onClick={() => setSelectedFilter("leafy")}
            >
              {t("leafy")}
            </Button>
            <Button 
              size="sm" 
              variant={selectedFilter === "root" ? "default" : "outline"}
              onClick={() => setSelectedFilter("root")}
            >
              {t("root")}
            </Button>
            <Button 
              size="sm" 
              variant={selectedFilter === "grains" ? "default" : "outline"}
              onClick={() => setSelectedFilter("grains")}
            >
              {t("grains")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Featured Products */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">{t("freshFrom")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="shadow-card transition-smooth hover:shadow-glow">
              <CardContent className="p-0">
                <div className="aspect-square rounded-t-lg overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{product.farm}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-secondary text-secondary" />
                      <span className="text-xs">{product.rating}</span>
                      <span className="text-xs text-muted-foreground">({product.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {product.distance}km
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold">R{product.price}</span>
                    <span className="text-sm text-muted-foreground">/ {product.unit}</span>
                  </div>
                  <Button 
                    variant="hero" 
                    className="w-full" 
                    size="sm"
                    onClick={() => addToCart(product.id)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Scan className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">{t("cropAnalysis")}</h3>
            <Link to="/consumer/crop-analysis">
              <Button variant="secondary" className="w-full">
                {t("analyzeNow")}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="font-semibold mb-2">{t("meetFarmers")}</h3>
            <Link to="/consumer/community">
              <Button variant="outline" className="w-full">
                {t("browseProfiles")}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">{t("aiRecommendations")}</h3>
            <Link to="/consumer/ai-features">
              <Button variant="outline" className="w-full">
                {t("getSuggestions")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </ConsumerLayout>
  );
}