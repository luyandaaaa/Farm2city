import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FarmerLayout } from "@/components/layouts/FarmerLayout";
import { 
  Package, 
  ShoppingCart, 
  Scan, 
  Trophy, 
  Plus,
  TrendingUp,
  Wallet
} from "lucide-react";

const languages = [
  { code: "en", label: "English" },
  { code: "af", label: "Afrikaans" },
  { code: "zu", label: "isiZulu" },
  { code: "xh", label: "isiXhosa" },
  { code: "st", label: "Sesotho" },
  { code: "tn", label: "Setswana" },
  { code: "ss", label: "siSwati" },
  { code: "ve", label: "Tshivenda" },
  { code: "ts", label: "Xitsonga" },
  { code: "nso", label: "Sepedi" }
];

const translations = {
  en: {
    welcome: `Welcome back, Lindiwe Mthembu! 🌱`,
    overview: `Your farm in Eastern Cape is thriving. Here's your overview.`,
    sidebar: {
      dashboard: "Dashboard",
      myProduce: "My Produce",
      ordersEarnings: "Orders & Earnings",
      cropHealth: "Crop Health Center",
      deliveryMatching: "Delivery Matching",
      communityForum: "Community Forum",
      educationHub: "Education Hub",
      profileWallet: "Profile & Wallet",
      settings: "Settings"
    },
    actions: {
      addNewProduce: "Add New Produce",
      addNewProduceDesc: "List new crops from your harvest to reach more buyers.",
      addProduceBtn: "Add Produce",
      cropHealthScanner: "Crop Health Scanner",
      cropHealthScannerDesc: "Use AI to check your crops for diseases and get treatment advice.",
      scanCropsBtn: "Scan Crops",
      recentActivity: "Recent Activity"
    }
  },
  af: {
    welcome: `Welkom terug, Lindiwe Mthembu! 🌱`,
    overview: `Jou plaas in Oos-Kaap floreer. Hier is jou oorsig.`,
    sidebar: {
      dashboard: "Dashboard",
      myProduce: "My Produkte",
      ordersEarnings: "Bestellings & Verdienste",
      cropHealth: "Oes Gesondheid Sentrum",
      deliveryMatching: "Aflewering Pasmaak",
      communityForum: "Gemeenskapsforum",
      educationHub: "Opvoedingsentrum",
      profileWallet: "Profiel & Beursie",
      settings: "Instellings"
    },
    actions: {
      addNewProduce: "Voeg Nuwe Produkte By",
      addNewProduceDesc: "Lys nuwe gewasse van jou oes om meer kopers te bereik.",
      addProduceBtn: "Voeg Produkte By",
      cropHealthScanner: "Oes Gesondheid Skandeerder",
      cropHealthScannerDesc: "Gebruik KI om jou gewasse vir siektes te toets en behandeling te kry.",
      scanCropsBtn: "Skandeer Gewasse",
      recentActivity: "Onlangse Aktiwiteit"
    }
  },
  zu: {
    welcome: `Siyakwamukela futhi, Lindiwe Mthembu! 🌱`,
    overview: `Ipulazi lakho eMpumalanga Cape liyachuma. Nansi isifinyezo sakho.`,
    sidebar: {
      dashboard: "Ishashalazi",
      myProduce: "Imikhiqizo Yami",
      ordersEarnings: "Ama-oda & Imali etholakele",
      cropHealth: "Isikhungo Sezempilo Yezitshalo",
      deliveryMatching: "Ukufanisa Ukulethwa",
      communityForum: "Iphoyisa Lomphakathi",
      educationHub: "Isikhungo Semfundo",
      profileWallet: "Iphrofayela & I-Wallet",
      settings: "Izilungiselelo"
    },
    actions: {
      addNewProduce: "Faka Imikhiqizo Emisha",
      addNewProduceDesc: "Bhala izitshalo ezintsha ezivela kuvuno lwakho ukuze ufinyelele abathengi abaningi.",
      addProduceBtn: "Faka Imikhiqizo",
      cropHealthScanner: "Iskena Sezempilo Yezitshalo",
      cropHealthScannerDesc: "Sebenzisa i-AI ukuhlola izifo ezitshalweni zakho nokuthola izeluleko zokwelashwa.",
      scanCropsBtn: "Hlola Izitshalo",
      recentActivity: "Umsebenzi Wakamuva"
    }
  },
  xh: {
    welcome: `Wamkelekile kwakhona, Lindiwe Mthembu! 🌱`,
    overview: `Ifama yakho eMpuma Kapa iyachuma. Nantsi isishwankathelo sakho.`,
    sidebar: {
      dashboard: "Ideshibhodi",
      myProduce: "Imveliso Yam",
      ordersEarnings: "Imiyalelo & Ingeniso",
      cropHealth: "Iziko leMpilo yeZityalo",
      deliveryMatching: "Uthelekiso loThutho",
      communityForum: "Iqonga loLuntu",
      educationHub: "Iziko leMfundo",
      profileWallet: "Iprofayile & I-Wallet",
      settings: "Izicwangciso"
    },
    actions: {
      addNewProduce: "Yongeza Imveliso Entsha",
      addNewProduceDesc: "Bhalisela ukutya okutsha okuvela kwiiharvest zakho ukuze ufikelele kubathengi abaninzi.",
      addProduceBtn: "Yongeza Imveliso",
      cropHealthScanner: "Iskena seMpilo yeZityalo",
      cropHealthScannerDesc: "Sebenzisa i-AI ukujonga izifo kwiindawo zakho zokulima kunye nokufumana iingcebiso zokunyanga.",
      scanCropsBtn: "Jonga Izityalo",
      recentActivity: "Umsebenzi Okwangoku"
    }
  },
  st: {
    welcome: `Rea u amohela hape, Lindiwe Mthembu! 🌱`,
    overview: `Polasi ea hau Eastern Cape e atlehile. Mona ke kakaretso ea hau.`,
    sidebar: {
      dashboard: "Leqephe la Sehlooho",
      myProduce: "Lihlahisoa tsa Ka",
      ordersEarnings: "Litaelo & Meputso",
      cropHealth: "Setsi sa Bophelo ba Lihlahisoa",
      deliveryMatching: "Ho Tshwanelana ha Phano",
      communityForum: "Foramo ya Sechaba",
      educationHub: "Setsi sa Thuto",
      profileWallet: "Phephahalo & Wallet",
      settings: "Ditshebeletso"
    },
    actions: {
      addNewProduce: "Eketsa Lihlahisoa Tse Ncha",
      addNewProduceDesc: "Ngola meroho e mecha e tsoang ho jarete ea hau ho fihlella bareki ba bangata.",
      addProduceBtn: "Eketsa Lihlahisoa",
      cropHealthScanner: "Sesebediswa sa Bophelo ba Lihlahisoa",
      cropHealthScannerDesc: "Sebetsa ka AI ho hlahloba lijalo tsa hau bakeng sa maloetse le ho fumana keletso ea phekolo.",
      scanCropsBtn: "Hlahloba Lijalo",
      recentActivity: "Mokhoa o Macha"
    }
  },
  tn: {
    welcome: `O amogetswe hafuh, Lindiwe Mthembu! 🌱`,
    overview: `Polase ya gago kwa Eastern Cape e a atlega. Fano ke kakaretso ya gago.`,
    sidebar: {
      dashboard: "Letlhopha la Tlhahlamolodi",
      myProduce: "Dithoto tsa Me",
      ordersEarnings: "Ditaelo & Ditseno",
      cropHealth: "Setheo sa Bophelo jwa Dithoto",
      deliveryMatching: "Go Tshwanelana ga Thulaganyo",
      communityForum: "Foramo ya Setšhaba",
      educationHub: "Setheo sa Thuto",
      profileWallet: "Profailo & Wallet",
      settings: "Ditlhophiso"
    },
    actions: {
      addNewProduce: "Oketsa Dithoto Tsa Mosha",
      addNewProduceDesc: "Ngwaga ya gago e ntjha go tswa mo harvest ya gago go fitlhelela bareki ba bantle.",
      addProduceBtn: "Oketsa Dithoto",
      cropHealthScanner: "Sesebediswa sa Bophelo jwa Dithoto",
      cropHealthScannerDesc: "Dirisa AI go lekola dijalo tsa gago ka mafu le go bona keletso ya phekolo.",
      scanCropsBtn: "Lekola Dijalo",
      recentActivity: "Tsamaiso e Amanang"
    }
  },
  ss: {
    welcome: `Wemukelekile futsi, Lindiwe Mthembu! 🌱`,
    overview: `Lipulazi lakho eMpumalanga Cape liyachuma. Nansi isifinyezo sakho.`,
    sidebar: {
      dashboard: "Ishashalazi",
      myProduce: "Imikhiqizo Yami",
      ordersEarnings: "Imiyalelo & Imali etholakele",
      cropHealth: "Isikhungo Sezempilo Yezitshalo",
      deliveryMatching: "Ukufanisa Ukulethwa",
      communityForum: "Iphoyisa Lomphakathi",
      educationHub: "Isikhungo Semfundo",
      profileWallet: "Iphrofayela & I-Wallet",
      settings: "Izilungiselelo"
    },
    actions: {
      addNewProduce: "Faka Imikhiqizo Emisha",
      addNewProduceDesc: "Bhala izitshalo ezintsha ezivela kuvuno lwakho ukuze ufinyelele abathengi abaningi.",
      addProduceBtn: "Faka Imikhiqizo",
      cropHealthScanner: "Iskena Sezempilo Yezitshalo",
      cropHealthScannerDesc: "Sebenzisa i-AI ukuhlola izifo ezitshalweni zakho nokuthola izeluleko zokwelashwa.",
      scanCropsBtn: "Hlola Izitshalo",
      recentActivity: "Umsebenzi Wakamuva"
    }
  },
  ve: {
    welcome: `Ni amogela hafhu, Lindiwe Mthembu! 🌱`,
    overview: `Fhama yau Eastern Cape i khou bvelela. Hezwi ndi zwidodombedzwa zwau.`,
    sidebar: {
      dashboard: "Dashboard",
      myProduce: "Zwithu Zwanga",
      ordersEarnings: "Zwiito & Muthu",
      cropHealth: "Tshikolo tsha Mutakalo wa Zwithu",
      deliveryMatching: "U Fanela U Rumela",
      communityForum: "Forum ya Tshitshavha",
      educationHub: "Tshikolo tsha Vhudivhi",
      profileWallet: "Profile & Wallet",
      settings: "Zwithu zwa u Shuma"
    },
    actions: {
      addNewProduce: "Add New Produce",
      addNewProduceDesc: "List new crops from your harvest to reach more buyers.",
      addProduceBtn: "Add Produce",
      cropHealthScanner: "Crop Health Scanner",
      cropHealthScannerDesc: "Use AI to check your crops for diseases and get treatment advice.",
      scanCropsBtn: "Scan Crops",
      recentActivity: "Recent Activity"
    }
  },
  ts: {
    welcome: `U amukeriwile nakambe, Lindiwe Mthembu! 🌱`,
    overview: `Purasi ya wena e Eastern Cape ya humelela. Laha i ntlhotlho wa wena.`,
    sidebar: {
      dashboard: "Dashboard",
      myProduce: "Switirhisiwa swa Mina",
      ordersEarnings: "Swileriso & Miholo",
      cropHealth: "Xikolo xa Rihanyo ra Switirhisiwa",
      deliveryMatching: "Ku Fanelana ka Ku Humesa",
      communityForum: "Foramu ya Vanhwana",
      educationHub: "Xikolo xa Dyondzo",
      profileWallet: "Profile & Wallet",
      settings: "Switirhisiwa"
    },
    actions: {
      addNewProduce: "Add New Produce",
      addNewProduceDesc: "List new crops from your harvest to reach more buyers.",
      addProduceBtn: "Add Produce",
      cropHealthScanner: "Crop Health Scanner",
      cropHealthScannerDesc: "Use AI to check your crops for diseases and get treatment advice.",
      scanCropsBtn: "Scan Crops",
      recentActivity: "Recent Activity"
    }
  },
  nso: {
    welcome: `O amogetswe gape, Lindiwe Mthembu! 🌱`,
    overview: `Polase ya gago Eastern Cape e a atlega. Fano ke kakaretso ya gago.`,
    sidebar: {
      dashboard: "Dashboard",
      myProduce: "Dithoto tša ka",
      ordersEarnings: "Ditaelo & Meholo",
      cropHealth: "Setheo sa Bophelo bja Dithoto",
      deliveryMatching: "Go Tshwanelana ga Thulaganyo",
      communityForum: "Foramo ya Setšhaba",
      educationHub: "Setheo sa Thuto",
      profileWallet: "Profailo & Wallet",
      settings: "Ditlhophiso"
    },
    actions: {
      addNewProduce: "Add New Produce",
      addNewProduceDesc: "List new crops from your harvest to reach more buyers.",
      addProduceBtn: "Add Produce",
      cropHealthScanner: "Crop Health Scanner",
      cropHealthScannerDesc: "Use AI to check your crops for diseases and get treatment advice.",
      scanCropsBtn: "Scan Crops",
      recentActivity: "Recent Activity"
    }
  }
};

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const [farmer, setFarmer] = useState({
    name: "Lindiwe Mthembu",
    location: "Eastern Cape",
    rating: 4.8,
    totalEarnings: 12540,
    activeOrders: 8,
    totalProducts: 15
  });
  const [selectedLang, setSelectedLang] = useState("en");

  const speakDashboard = () => {
    window.speechSynthesis.cancel();
    const msg = new window.SpeechSynthesisUtterance();
    const sidebarText = Object.values(translations[selectedLang].sidebar).join(", ");
    const actionsText = Object.values(translations[selectedLang].actions).join(", ");
    msg.text = `${translations[selectedLang].welcome} ${translations[selectedLang].overview} ${sidebarText} ${actionsText}`;
    msg.lang = selectedLang === "en" ? "en-ZA" : selectedLang + "-ZA";
    window.speechSynthesis.speak(msg);
  };

  useEffect(() => {
    const token = localStorage.getItem("farm2city_token");
    const role = localStorage.getItem("farm2city_role");
    
    if (!token || role !== "farmer") {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("farm2city_token");
    localStorage.removeItem("farm2city_role");
    navigate("/");
  };

  return (
    <FarmerLayout currentPage="Dashboard" selectedLang={selectedLang} translations={translations[selectedLang]}>
      <div className="space-y-8">
        {/* Language & Voiceover Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label htmlFor="lang-select" className="font-medium">Translate:</label>
            <select
              id="lang-select"
              value={selectedLang}
              onChange={e => setSelectedLang(e.target.value)}
              className="border rounded px-2 py-1"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>
          <Button variant="outline" onClick={speakDashboard}>
            Play Voiceover
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{translations[selectedLang].welcome}</h1>
          <p className="text-muted-foreground">
            {translations[selectedLang].overview}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card transition-smooth hover:shadow-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R{farmer.totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="shadow-card transition-smooth hover:shadow-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{farmer.activeOrders}</div>
              <p className="text-xs text-muted-foreground">5 pending pickup</p>
            </CardContent>
          </Card>

          <Card className="shadow-card transition-smooth hover:shadow-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products Listed</CardTitle>
              <Package className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{farmer.totalProducts}</div>
              <p className="text-xs text-muted-foreground">3 low stock alerts</p>
            </CardContent>
          </Card>

          <Card className="shadow-card transition-smooth hover:shadow-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Farm Rating</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary-glow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{farmer.rating}/5</div>
              <p className="text-xs text-muted-foreground">Based on 47 reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                {translations[selectedLang].actions.addNewProduce}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {translations[selectedLang].actions.addNewProduceDesc}
              </p>
              <Button 
                variant="hero" 
                className="w-full"
                onClick={() => navigate("/farmer/my-produce")}
              >
                {translations[selectedLang].actions.addProduceBtn}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="h-5 w-5 text-secondary" />
                {translations[selectedLang].actions.cropHealthScanner}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {translations[selectedLang].actions.cropHealthScannerDesc}
              </p>
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => navigate("/farmer/crop-health-center")}
              >
                {translations[selectedLang].actions.scanCropsBtn}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>{translations[selectedLang].actions.recentActivity}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <div className="h-2 w-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New order received: 5kg Spinach</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <Badge variant="default">New</Badge>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <div className="h-2 w-2 bg-secondary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Payment received: R450</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
                <Badge variant="secondary">Payment</Badge>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <div className="h-2 w-2 bg-accent rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Quiz completed: Soil Management</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
                <Badge variant="outline">+50 Points</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </FarmerLayout>
  );
}