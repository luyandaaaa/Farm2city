import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Star, 
  Award, 
  Target, 
  Zap,
  Crown,
  Medal,
  Gift
} from "lucide-react";
import { FarmerLayout } from "@/components/layouts/FarmerLayout";

export default function Gamification() {
  const [farmer] = useState({
    name: "Lindiwe Mthembu",
    points: 1250,
    level: 3,
    nextLevelPoints: 1500,
    badges: 8,
    rank: 12
  });

  const [badges] = useState([
    { id: 1, name: "First Sale", description: "Complete your first order", earned: true, icon: "🎯", date: "2024-01-10" },
    { id: 2, name: "Green Thumb", description: "List 10 different crops", earned: true, icon: "🌱", date: "2024-01-12" },
    { id: 3, name: "Customer Favorite", description: "Achieve 4.5+ rating", earned: true, icon: "⭐", date: "2024-01-15" },
    { id: 4, name: "Eco Warrior", description: "Use organic farming methods", earned: false, icon: "🌿", date: null },
    { id: 5, name: "Quick Delivery", description: "Complete 50 deliveries on time", earned: false, icon: "🚀", date: null },
    { id: 6, name: "Community Helper", description: "Help 10 fellow farmers", earned: true, icon: "🤝", date: "2024-01-08" }
  ]);

  const [challenges] = useState([
    {
      id: 1,
      title: "Harvest Champion",
      description: "List 5 new products this week",
      progress: 3,
      target: 5,
      reward: 100,
      timeLeft: "3 days",
      difficulty: "Easy"
    },
    {
      id: 2, 
      title: "Customer Satisfaction",
      description: "Maintain 4.8+ rating for 2 weeks",
      progress: 10,
      target: 14,
      reward: 250,
      timeLeft: "4 days",
      difficulty: "Medium"
    },
    {
      id: 3,
      title: "Knowledge Seeker",
      description: "Complete 3 farming courses",
      progress: 1,
      target: 3,
      reward: 200,
      timeLeft: "1 week",
      difficulty: "Medium"
    }
  ]);

  const [leaderboard] = useState([
    { rank: 1, name: "Thabo Mokoena", points: 2450, location: "Limpopo" },
    { rank: 2, name: "Sarah van der Merwe", points: 2380, location: "Western Cape" },
    { rank: 3, name: "James Nkomo", points: 2220, location: "KwaZulu-Natal" },
    { rank: 4, name: "Nomsa Dube", points: 1890, location: "Mpumalanga" },
    { rank: 5, name: "Pieter Botha", points: 1750, location: "Free State" },
    { rank: 12, name: "Lindiwe Mthembu", points: 1250, location: "Eastern Cape", isCurrentUser: true }
  ]);

  const pointsToNextLevel = farmer.nextLevelPoints - farmer.points;
  const progressPercentage = (farmer.points / farmer.nextLevelPoints) * 100;

  return (
    <FarmerLayout currentPage="Gamification">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">FarmRewards 🏆</h1>
          <p className="text-muted-foreground">
            Earn points, unlock badges, and compete with fellow farmers
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{farmer.points}</p>
                  <p className="text-sm text-muted-foreground">Farm Points</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Trophy className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">Level {farmer.level}</p>
                  <p className="text-sm text-muted-foreground">{pointsToNextLevel} to Level {farmer.level + 1}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{farmer.badges}</p>
                  <p className="text-sm text-muted-foreground">Badges Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-glow/10 rounded-lg">
                  <Crown className="h-6 w-6 text-primary-glow" />
                </div>
                <div>
                  <p className="text-2xl font-bold">#{farmer.rank}</p>
                  <p className="text-sm text-muted-foreground">Regional Rank</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Level Progress */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Level {farmer.level} Progress</h3>
                <p className="text-sm text-muted-foreground">{pointsToNextLevel} points to Level {farmer.level + 1}</p>
              </div>
              <Badge variant="default">Level {farmer.level}</Badge>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="challenges" className="space-y-6">
          <TabsList>
            <TabsTrigger value="challenges">Active Challenges</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="rewards">Rewards Store</TabsTrigger>
          </TabsList>

          <TabsContent value="challenges">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="shadow-card">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{challenge.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{challenge.description}</p>
                      </div>
                      <Badge variant={challenge.difficulty === 'Easy' ? 'secondary' : 'default'}>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{challenge.progress}/{challenge.target}</span>
                        </div>
                        <Progress value={(challenge.progress / challenge.target) * 100} />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-accent" />
                          <span className="font-semibold">{challenge.reward} points</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{challenge.timeLeft} left</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="badges">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map((badge) => (
                <Card key={badge.id} className={`shadow-card ${badge.earned ? 'bg-primary/5' : 'opacity-60'}`}>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{badge.icon}</div>
                    <h3 className="font-semibold mb-2">{badge.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{badge.description}</p>
                    {badge.earned ? (
                      <div>
                        <Badge variant="default" className="mb-2">Earned</Badge>
                        <p className="text-xs text-muted-foreground">Earned on {badge.date}</p>
                      </div>
                    ) : (
                      <Badge variant="outline">Not Earned</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Regional Leaderboard - Eastern Cape</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((farmer) => (
                    <div 
                      key={farmer.rank} 
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        farmer.isCurrentUser ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary/20">
                          {farmer.rank <= 3 ? (
                            <Medal className="h-4 w-4 text-secondary" />
                          ) : (
                            <span className="text-sm font-bold">#{farmer.rank}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{farmer.name}</p>
                          <p className="text-sm text-muted-foreground">{farmer.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{farmer.points} points</p>
                        {farmer.isCurrentUser && (
                          <Badge variant="default" className="text-xs">You</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="shadow-card">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Gift className="h-8 w-8 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">5% Transaction Discount</h3>
                    <p className="text-sm text-muted-foreground mb-4">Reduce platform fees for 1 month</p>
                    <p className="font-bold text-primary mb-4">500 points</p>
                    <Button variant="outline" className="w-full">Redeem</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Gift className="h-8 w-8 mx-auto mb-4 text-secondary" />
                    <h3 className="font-semibold mb-2">Premium Listing Boost</h3>
                    <p className="text-sm text-muted-foreground mb-4">Feature your products for 1 week</p>
                    <p className="font-bold text-secondary mb-4">750 points</p>
                    <Button variant="outline" className="w-full">Redeem</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Gift className="h-8 w-8 mx-auto mb-4 text-accent" />
                    <h3 className="font-semibold mb-2">Free Educational Course</h3>
                    <p className="text-sm text-muted-foreground mb-4">Access to premium farming courses</p>
                    <p className="font-bold text-accent mb-4">1000 points</p>
                    <Button variant="outline" className="w-full" disabled>
                      Need {1000 - farmer.points} more points
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </FarmerLayout>
  );
}