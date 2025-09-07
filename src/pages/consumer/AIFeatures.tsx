import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, TrendingUp, ShoppingCart, Lightbulb, Leaf, 
  Calendar, MapPin, Star, Heart, Zap, Target, AlertCircle,
  Trash2, DollarSign, Apple
} from 'lucide-react';
import { ConsumerLayout } from '@/components/layouts/ConsumerLayout';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import lettuceImg from '@/assets/products/letticeRiversideGardens.jpeg';
import carrotsImg from '@/assets/products/carrotsSunnyAcres.jpeg';
import peppersImg from '@/assets/products/peppers.jpg';

const AIFeatures = () => {
  const { addToCart } = useCart();
  const [showSeasonalDeals, setShowSeasonalDeals] = useState(false);
  const [recipeModal, setRecipeModal] = useState<{ open: boolean; recipe: string | null }>({ open: false, recipe: null });

  const productImages: Record<string, string> = {
    'Organic Kale': lettuceImg, // fallback to lettuce
    'Heritage Beetroot': carrotsImg, // fallback to carrots
    'Sweet Bell Peppers': peppersImg,
  };

  const personalizedRecommendations = [
    {
      id: '1',
      name: 'Organic Kale',
      reason: 'Based on your preference for leafy greens',
      farmer: 'Green Valley Farm',
      price: 35.00,
      rating: 4.8,
      distance: 8.2,
      confidence: 92,
      image: '🥬'
    },
    {
      id: '2',
      name: 'Heritage Beetroot',
      reason: 'Customers with similar taste profiles love this',
      farmer: 'Rainbow Fields',
      price: 28.00,
      rating: 4.9,
      distance: 12.5,
      confidence: 87,
      image: '🥕'
    },
    {
      id: '3',
      name: 'Sweet Bell Peppers',
      reason: 'Perfect for your favorite recipes',
      farmer: 'Sunshine Farm',
      price: 42.00,
      rating: 4.6,
      distance: 15.3,
      confidence: 89,
      image: '🫑'
    }
  ];

  const pricingInsights = [
    {
      product: 'Roma Tomatoes',
      currentPrice: 18.50,
      marketAverage: 22.00,
      trend: 'below_average',
      savings: 16,
      recommendation: 'Great deal! Price is 16% below market average',
      forecast: 'Prices expected to rise 8% next week'
    },
    {
      product: 'Organic Spinach',
      currentPrice: 45.00,
      marketAverage: 38.00,
      trend: 'above_average',
      markup: 18,
      recommendation: 'Consider alternatives or wait for better prices',
      forecast: 'Better deals expected in 3-4 days'
    },
    {
      product: 'Baby Carrots',
      currentPrice: 30.00,
      marketAverage: 30.50,
      trend: 'fair_price',
      difference: 2,
      recommendation: 'Fair market price - good time to buy',
      forecast: 'Stable prices expected this week'
    }
  ];

  const harvestPredictions = [
    {
      crop: 'Tomatoes',
      expectedVolume: 'High',
      timeframe: '2-3 weeks',
      priceImpact: 'Prices may drop 15-20%',
      farmers: 12,
      recommendation: 'Wait for bulk availability'
    },
    {
      crop: 'Lettuce',
      expectedVolume: 'Medium',
      timeframe: '1 week',
      priceImpact: 'Stable prices expected',
      farmers: 8,
      recommendation: 'Buy now if needed'
    },
    {
      crop: 'Bell Peppers',
      expectedVolume: 'Low',
      timeframe: '3-4 weeks',
      priceImpact: 'Prices may rise 10%',
      farmers: 5,
      recommendation: 'Stock up if you use regularly'
    }
  ];

  const behavioralInsights = [
    {
      insight: "You frequently buy leafy greens on Mondays",
      suggestion: "Set up automatic reminders for weekend planning",
      action: "Enable Notifications",
      icon: <Calendar className="w-5 h-5" />
    },
    {
      insight: "You prefer organic produce from farms within 15km",
      suggestion: "We can filter results to show only nearby organic options",
      action: "Update Preferences",
      icon: <MapPin className="w-5 h-5" />
    },
    {
      insight: "You tend to buy more vegetables during seasonal changes",
      suggestion: "Subscribe to seasonal produce boxes for convenience",
      action: "View Subscriptions",
      icon: <Leaf className="w-5 h-5" />
    }
  ];

  const ecoImpact = {
    totalCarbonSaved: 24.8,
    localPurchases: 89,
    foodMiles: 156,
    equivalentTrees: 2.1,
    alternatives: [
      {
        product: 'Imported Tomatoes',
        local: 'Local Roma Tomatoes',
        carbonSaving: '2.3kg CO₂',
        priceDiff: 'R4.50 cheaper'
      },
      {
        product: 'Greenhouse Lettuce',
        local: 'Field-grown Lettuce',
        carbonSaving: '1.8kg CO₂',
        priceDiff: 'R8.00 cheaper'
      }
    ]
  };

  const seasonalRecipes: Record<string, { title: string; steps: string[] }> = {
    Apple: {
      title: 'Classic Apple Pie',
      steps: [
        '1. Preheat oven to 180°C (350°F).',
        '2. Prepare a pie crust in a baking dish.',
        '3. Peel, core, and slice 6 apples.',
        '4. Toss apples with sugar, cinnamon, and a bit of lemon juice.',
        '5. Fill the crust with apple mixture, dot with butter.',
        '6. Cover with top crust, seal edges, and cut slits for steam.',
        '7. Bake for 45-50 minutes until golden brown.',
        '8. Cool slightly before serving. Enjoy with ice cream!'
      ]
    },
    Pear: {
      title: 'Poached Pears in Red Wine',
      steps: [
        '1. Peel 4 pears, leaving stems intact.',
        '2. In a saucepan, combine 2 cups red wine, 1/2 cup sugar, cinnamon stick, and orange peel.',
        '3. Bring to a simmer, add pears, and cover.',
        '4. Simmer for 20-25 minutes, turning pears occasionally.',
        '5. Remove pears and reduce sauce until syrupy.',
        '6. Pour sauce over pears and serve warm or chilled.'
      ]
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'below_average': return 'text-green-600';
      case 'above_average': return 'text-red-600';
      case 'fair_price': return 'text-blue-600';
      default: return 'text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'below_average': return <TrendingUp className="w-4 h-4 text-green-600 rotate-180" />;
      case 'above_average': return <TrendingUp className="w-4 h-4 text-red-600" />;
      case 'fair_price': return <Target className="w-4 h-4 text-blue-600" />;
      default: return null;
    }
  };

  return (
    <ConsumerLayout currentPage="AI-Powered Features">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI-Powered Features</h1>
          <p className="text-muted-foreground">
            Smart insights to help you make better purchasing decisions
          </p>
        </div>

        {/* AI Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">94%</div>
                  <p className="text-sm text-muted-foreground">Prediction Accuracy</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">R127</div>
                  <p className="text-sm text-muted-foreground">Avg. Monthly Savings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-8 h-8 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">32</div>
                  <p className="text-sm text-muted-foreground">Smart Recommendations</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Leaf className="w-8 h-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">25kg</div>
                  <p className="text-sm text-muted-foreground">CO₂ Saved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="recommendations" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="recommendations">Smart Picks</TabsTrigger>
            <TabsTrigger value="pricing">Price AI</TabsTrigger>
            <TabsTrigger value="harvest">Harvest Pro</TabsTrigger>
            <TabsTrigger value="behavior">My Patterns</TabsTrigger>
            <TabsTrigger value="eco">Eco Impact</TabsTrigger>
            <TabsTrigger value="waste">Food Waste</TabsTrigger>
            <TabsTrigger value="budget">Budget Track</TabsTrigger>
            <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Personalized Product Recommendations
                </CardTitle>
                <CardDescription>
                  AI-curated suggestions based on your preferences and purchase history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {personalizedRecommendations.map((product) => (
                    <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="text-4xl">{product.image}</div>
                          <Badge className="bg-primary text-white">
                            {product.confidence}% match
                          </Badge>
                        </div>
                        <h4 className="font-semibold mb-1">{product.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{product.farmer}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{product.rating}</span>
                          <MapPin className="w-3 h-3 text-muted-foreground ml-2" />
                          <span className="text-sm text-muted-foreground">{product.distance}km</span>
                        </div>
                        <div className="bg-muted p-2 rounded text-xs mb-3">
                          <Lightbulb className="w-3 h-3 inline mr-1" />
                          {product.reason}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-farm-green">R{product.price}/kg</span>
                          <Button 
                            size="sm" 
                            variant="default" 
                            onClick={() => {
                              addToCart({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: productImages[product.name] || '',
                                farmer: product.farmer,
                                unit: 'kg',
                              });
                              toast.success(`${product.name} added to cart!`);
                            }}
                          >
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Smart Pricing Insights
                </CardTitle>
                <CardDescription>
                  Real-time price analysis to help you find the best deals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pricingInsights.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{item.product}</h4>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(item.trend)}
                        <span className={`font-bold ${getTrendColor(item.trend)}`}>
                          R{item.currentPrice}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Market Average</p>
                        <p className="font-medium">R{item.marketAverage}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {item.trend === 'below_average' ? 'Your Savings' : 
                           item.trend === 'above_average' ? 'Premium' : 'Difference'}
                        </p>
                        <p className={`font-medium ${getTrendColor(item.trend)}`}>
                          {item.savings && `${item.savings}% saved`}
                          {item.markup && `${item.markup}% above`}
                          {item.difference && `${item.difference}% difference`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">AI Recommendation:</p>
                      <p className="text-sm text-muted-foreground">{item.recommendation}</p>
                      <p className="text-xs text-muted-foreground italic">{item.forecast}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="harvest" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Harvest Predictions
                </CardTitle>
                <CardDescription>
                  Forecasted crop availability and market impact
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {harvestPredictions.map((prediction, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{prediction.crop}</h4>
                      <Badge variant={prediction.expectedVolume === 'High' ? 'default' : 
                                    prediction.expectedVolume === 'Medium' ? 'secondary' : 'outline'}>
                        {prediction.expectedVolume} Volume Expected
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Timeframe</p>
                        <p className="font-medium">{prediction.timeframe}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Participating Farmers</p>
                        <p className="font-medium">{prediction.farmers} farms</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Price Impact</p>
                        <p className="font-medium">{prediction.priceImpact}</p>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-3 rounded">
                      <p className="text-sm font-medium mb-1">AI Recommendation:</p>
                      <p className="text-sm text-muted-foreground">{prediction.recommendation}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Behavioral Insights
                </CardTitle>
                <CardDescription>
                  Personalized insights based on your shopping patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {behavioralInsights.map((insight, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {insight.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{insight.insight}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{insight.suggestion}</p>
                        <Button size="sm" variant="outline">{insight.action}</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="eco" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5" />
                  Environmental Impact Analysis
                </CardTitle>
                <CardDescription>
                  Track your carbon footprint and discover eco-friendly alternatives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{ecoImpact.totalCarbonSaved}kg</div>
                    <p className="text-sm text-muted-foreground">CO₂ Saved This Year</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{ecoImpact.localPurchases}%</div>
                    <p className="text-sm text-muted-foreground">Local Purchases</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{ecoImpact.foodMiles}</div>
                    <p className="text-sm text-muted-foreground">Avg. Food Miles</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{ecoImpact.equivalentTrees}</div>
                    <p className="text-sm text-muted-foreground">Trees Equivalent</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Eco-Friendly Alternatives</h4>
                  {ecoImpact.alternatives.map((alt, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-green-50/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Switch from {alt.product}</p>
                          <p className="text-sm text-muted-foreground">to {alt.local}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">{alt.carbonSaving}</p>
                          <p className="text-sm text-muted-foreground">{alt.priceDiff}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="waste" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trash2 className="w-5 h-5" />
                  Food Waste Reduction Dashboard
                </CardTitle>
                <CardDescription>
                  Track and reduce your food waste with AI-powered insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">78%</div>
                    <p className="text-sm text-muted-foreground">Waste Reduction</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">R245</div>
                    <p className="text-sm text-muted-foreground">Money Saved</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">2.3kg</div>
                    <p className="text-sm text-muted-foreground">Waste This Month</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Smart Recommendations</h4>
                  {[
                    { item: 'Use spinach within 2 days', action: 'Add to smoothie recipes', priority: 'high' },
                    { item: 'Tomatoes ripening fast', action: 'Make pasta sauce today', priority: 'medium' },
                    { item: 'Carrots stored well', action: 'Good for 1 more week', priority: 'low' }
                  ].map((recommendation, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{recommendation.item}</p>
                          <p className="text-sm text-muted-foreground">{recommendation.action}</p>
                        </div>
                        <Badge variant={recommendation.priority === 'high' ? 'destructive' : 
                                     recommendation.priority === 'medium' ? 'secondary' : 'outline'}>
                          {recommendation.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Food Budget Tracker
                </CardTitle>
                <CardDescription>
                  Track your food spending and get personalized budget recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-3">Monthly Budget Overview</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Total Budget</span>
                          <span className="font-bold">R1,200</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Spent This Month</span>
                          <span className="font-bold text-green-600">R856</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Remaining</span>
                          <span className="font-bold text-primary">R344</span>
                        </div>
                        <div className="w-full bg-muted-foreground/20 rounded-full h-2 mt-2">
                          <div className="w-3/4 bg-green-500 h-2 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-3">Category Breakdown</h4>
                      <div className="space-y-2">
                        {[
                          { category: 'Vegetables', spent: 320, budget: 400, color: 'bg-green-500' },
                          { category: 'Fruits', spent: 180, budget: 250, color: 'bg-blue-500' },
                          { category: 'Herbs & Spices', spent: 45, budget: 80, color: 'bg-purple-500' }
                        ].map((cat, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{cat.category}</span>
                              <span>R{cat.spent}/R{cat.budget}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className={`${cat.color} h-2 rounded-full`}
                                style={{ width: `${(cat.spent / cat.budget) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-3">Smart Savings Tips</h4>
                      <div className="space-y-3">
                        {[
                          'Buy seasonal produce to save 15-20%',
                          'Consider bulk purchases for herbs',
                          'Try local alternatives to save on transport costs',
                          'Weekly meal planning reduces impulse buying'
                        ].map((tip, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5" />
                            <p className="text-sm">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">This Month's Achievement</h4>
                      <p className="text-sm text-green-700">
                        You're 12% under budget! You've saved R87 compared to last month.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seasonal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Seasonal Food Calendar
                </CardTitle>
                <CardDescription>
                  Discover what's in season in Johannesburg this September
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-3">Currently in Season</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 p-2 bg-white rounded">
                          <Apple className="w-4 h-4 text-red-500" />
                          <span className="text-sm">Apples</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white rounded">
                          <span className="text-lg">🍐</span>
                          <span className="text-sm">Pears</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-medium text-orange-800 mb-3">Coming into Season</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 p-2 bg-white rounded">
                          <span className="text-lg">🎃</span>
                          <span className="text-sm">Pumpkins</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white rounded">
                          <span className="text-lg">🍠</span>
                          <span className="text-sm">Sweet Potatoes</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white rounded">
                          <span className="text-lg">🥦</span>
                          <span className="text-sm">Brussels Sprouts</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white rounded">
                          <span className="text-lg">🍒</span>
                          <span className="text-sm">Cranberries</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white rounded">
                          <span className="text-lg">🥬</span>
                          <span className="text-sm">Kale</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white rounded">
                          <span className="text-lg">🎃</span>
                          <span className="text-sm">Winter Squash</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-3">Seasonal Availability</h4>
                      <div className="space-y-2">
                        {[
                          { item: 'Apples', category: 'Fruit', status: 'In Season', local: 'Yes', color: 'text-green-600' },
                          { item: 'Pumpkins', category: 'Vegetable', status: 'Out of Season', local: 'Yes', color: 'text-red-600' },
                          { item: 'Sweet Potatoes', category: 'Vegetable', status: 'Out of Season', local: 'No', color: 'text-red-600' },
                          { item: 'Brussels Sprouts', category: 'Vegetable', status: 'Out of Season', local: 'Yes', color: 'text-red-600' },
                          { item: 'Pears', category: 'Fruit', status: 'In Season', local: 'Yes', color: 'text-green-600' }
                        ].map((food, index) => (
                          <div key={index} className="grid grid-cols-4 gap-2 text-xs p-2 border rounded">
                            <span className="font-medium">{food.item}</span>
                            <span className="text-muted-foreground">{food.category}</span>
                            <span className={food.color}>{food.status}</span>
                            <span className="text-muted-foreground">{food.local}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-3">Seasonal Savings</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Price Drops</span>
                          <span className="font-bold text-blue-600">2 items</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Estimated Savings</span>
                          <span className="font-bold text-green-600">22%</span>
                        </div>
                        <p className="text-xs text-blue-700 mt-2">
                          Average savings when buying seasonal produce
                        </p>
                        <Button size="sm" className="w-full mt-2" onClick={() => setShowSeasonalDeals(true)}>
                          Find Seasonal Deals
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Seasonal Recipes</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Apple className="w-6 h-6 text-red-500" />
                        <h5 className="font-medium">Apple Recipes</h5>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Discover new ways to enjoy apples while it's in season
                      </p>
                      <Button size="sm" variant="outline" className="w-full" onClick={() => setRecipeModal({ open: true, recipe: 'Apple' })}>
                        View Recipes
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🍐</span>
                        <h5 className="font-medium">Pear Recipes</h5>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Discover new ways to enjoy pears while it's in season
                      </p>
                      <Button size="sm" variant="outline" className="w-full" onClick={() => setRecipeModal({ open: true, recipe: 'Pear' })}>
                        View Recipes
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {showSeasonalDeals && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowSeasonalDeals(false)}
                aria-label="Close"
              >
                ×
              </button>
              <h3 className="text-xl font-bold mb-4 text-blue-800">Current Seasonal Deals</h3>
              <div className="space-y-3">
                {/* Example deals, can be replaced with dynamic data */}
                <div className="p-3 border rounded flex items-center justify-between">
                  <div>
                    <span className="font-medium">Apples</span>
                    <span className="ml-2 text-xs text-green-700 bg-green-100 rounded px-2 py-0.5">In Season</span>
                  </div>
                  <span className="font-bold text-blue-600">Save 22%</span>
                </div>
                <div className="p-3 border rounded flex items-center justify-between">
                  <div>
                    <span className="font-medium">Pears</span>
                    <span className="ml-2 text-xs text-green-700 bg-green-100 rounded px-2 py-0.5">In Season</span>
                  </div>
                  <span className="font-bold text-blue-600">Save 18%</span>
                </div>
                <div className="p-3 border rounded flex items-center justify-between">
                  <div>
                    <span className="font-medium">Pumpkins</span>
                    <span className="ml-2 text-xs text-orange-700 bg-orange-100 rounded px-2 py-0.5">Coming Soon</span>
                  </div>
                  <span className="font-bold text-orange-600">Deal Next Week</span>
                </div>
              </div>
              <div className="mt-6 text-right">
                <Button variant="outline" onClick={() => setShowSeasonalDeals(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {recipeModal.open && recipeModal.recipe && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setRecipeModal({ open: false, recipe: null })}
                aria-label="Close"
              >
                ×
              </button>
              <h3 className="text-xl font-bold mb-4 text-green-800">{seasonalRecipes[recipeModal.recipe].title}</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 mb-4">
                {seasonalRecipes[recipeModal.recipe].steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
              <div className="text-right">
                <Button variant="outline" onClick={() => setRecipeModal({ open: false, recipe: null })}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ConsumerLayout>
  );
};

export default AIFeatures;