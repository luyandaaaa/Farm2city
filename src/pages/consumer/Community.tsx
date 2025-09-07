import { useState } from "react";
import { ConsumerLayout } from "@/components/layouts/ConsumerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MapPin, 
  Calendar, 
  Users, 
  Search,
  Camera,
  Award,
  UserPlus,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import farmersImg from "@/assets/farmers-tech.jpg";
import sustainableJourney from "@/assets/stories/sustainable-journey.jpg";
import heritageStory from "@/assets/stories/heritage-story.jpg";
import innovationStory from "@/assets/stories/innovation-story.jpg";
import communityStory from "@/assets/stories/community-story.jpg";

interface FarmerProfile {
  id: string;
  name: string;
  farm: string;
  location: string;
  image: string;
  bio: string;
  specialties: string[];
  rating: number;
  followers: number;
  verified: boolean;
  joinDate: string;
}

interface CommunityPost {
  id: string;
  farmer: FarmerProfile;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  liked: boolean;
}

interface Event {
  id: string;
  title: string;
  organizer: string;
  date: string;
  location: string;
  description: string;
  attendees: number;
  maxAttendees?: number;
  joined?: boolean;
}

interface Story {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  image: string;
  date: string;
}

export default function Community() {
  const [searchTerm, setSearchTerm] = useState("");
  const [followedFarmers, setFollowedFarmers] = useState<string[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<string[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: "1",
      farmer: {
        id: "1",
        name: "Sarah Johnson",
        farm: "Green Valley Farm",
        location: "Sacramento, CA",
        image: "",
        bio: "Organic farming specialist with 15 years experience",
        specialties: ["Organic Vegetables", "Herbs", "Sustainable Farming"],
        rating: 4.9,
        followers: 1247,
        verified: true,
        joinDate: "2022-03-15"
      },
      content: "Just harvested our first batch of heirloom tomatoes this season! The weather has been perfect for growing. These beauties will be available at the farmers market this weekend. 🍅✨",
      image: farmersImg,
      likes: 156,
      comments: 23,
      shares: 12,
      timestamp: "2 hours ago",
      liked: false
    },
    {
      id: "2",
      farmer: {
        id: "2",
        name: "Miguel Rodriguez",
        farm: "Sunny Acres",
        location: "Fresno, CA",
        image: "",
        bio: "Third-generation farmer specializing in citrus and stone fruits",
        specialties: ["Citrus Fruits", "Stone Fruits", "Traditional Methods"],
        rating: 4.8,
        followers: 892,
        verified: true,
        joinDate: "2021-11-08"
      },
      content: "Sharing some wisdom from my grandfather: 'The best fertilizer is the farmer's footsteps.' Walking through the orchards daily helps you understand what your trees need. What's your favorite farming wisdom?",
      likes: 203,
      comments: 45,
      shares: 28,
      timestamp: "5 hours ago",
      liked: true
    }
  ]);

  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Sustainable Farming Workshop",
      organizer: "Farm2City Community",
      date: "2024-09-15",
      location: "Community Center, Sacramento",
      description: "Learn about sustainable farming practices and modern agricultural techniques",
      attendees: 45,
      maxAttendees: 60,
      joined: false
    },
    {
      id: "2",
      title: "Harvest Festival",
      organizer: "Local Farmers Alliance",
      date: "2024-09-22",
      location: "Central Park, Downtown",
      description: "Celebrate the harvest season with local farmers, fresh produce, and community activities",
      attendees: 234,
      maxAttendees: 500,
      joined: false
    }
  ]);

  const [stories] = useState<Story[]>([
    {
      id: "1",
      title: "From Wasteland to Wonder",
      summary: "How Sarah transformed 50 acres of barren land into a thriving organic farm using sustainable practices.",
      content: "When Sarah Johnson first laid eyes on the 50 acres of neglected farmland outside Sacramento, most people would have seen an impossible challenge. The soil was depleted, the irrigation system was broken, and weeds had taken over everything. But Sarah saw potential.\n\n'I knew it would take years to restore this land,' Sarah recalls, 'but I also knew that with patience and the right techniques, we could create something beautiful.'\n\nThe transformation began with soil restoration. Sarah spent the first year composting organic matter, introducing beneficial microorganisms, and carefully planning crop rotations. She installed solar-powered irrigation systems and built greenhouses using recycled materials.\n\nToday, Green Valley Farm produces over 200 varieties of organic vegetables and herbs, supplying 15 local restaurants and three farmers markets. The farm has become a model for sustainable agriculture, hosting workshops for other farmers and urban gardening enthusiasts.\n\n'The most rewarding part isn't the financial success,' Sarah explains, 'it's knowing that we're healing the land and providing healthy food for our community. Every tomato we grow is a small victory for sustainable farming.'",
      author: "Sarah Johnson - Green Valley Farm",
      image: sustainableJourney,
      date: "August 2024"
    },
    {
      id: "2",
      title: "Three Generations of Wisdom",
      summary: "Miguel shares the traditional farming techniques passed down through his family.",
      content: "The Rodriguez family has been farming the same land in Fresno for over 80 years. What started with Miguel's grandfather arriving from Mexico with nothing but determination has grown into one of the region's most respected citrus operations.\n\n'My grandfather used to say that the land teaches you if you listen,' Miguel explains as he walks through the orange groves that his family has tended for decades. 'He taught my father, my father taught me, and now I'm teaching my children.'\n\nThe farm has survived droughts, economic downturns, and market changes by adapting while staying true to core principles. They still use many traditional techniques, like companion planting and natural pest control methods that Miguel's grandfather brought from his homeland.\n\n'We've incorporated modern technology where it makes sense,' Miguel says, pointing to the drip irrigation system they installed five years ago. 'But we never forget that farming is about understanding the rhythm of the seasons and respecting the land.'\n\nToday, Sunny Acres produces some of the region's finest oranges, lemons, and stone fruits. Miguel's children are actively involved in the operation, ensuring that the family's farming wisdom will continue for another generation.",
      author: "Miguel Rodriguez - Sunny Acres",
      image: heritageStory,
      date: "July 2024"
    },
    {
      id: "3",
      title: "The Tech-Forward Farm",
      summary: "Emily shows how modern technology is revolutionizing small-scale farming.",
      content: "At first glance, Riverside Gardens might look like any other small farm. But look closer, and you'll see the future of agriculture unfolding in real-time. Emily Chen has transformed her 15-acre operation into a showcase of agricultural innovation.\n\n'I believe technology should serve the farmer, not replace them,' Emily explains as she checks her phone for real-time soil moisture data from sensors placed throughout her fields. 'These tools help me make better decisions and use resources more efficiently.'\n\nThe farm uses precision agriculture techniques that would make much larger operations envious. Drones monitor crop health and identify problem areas before they're visible to the naked eye. Automated hydroponic systems grow leafy greens year-round in climate-controlled greenhouses.\n\nBut Emily's favorite innovation is her farm management app, which she developed herself. It tracks everything from planting schedules to harvest yields, helping her optimize production and reduce waste.\n\n'Last year, we increased our yield by 40% while using 30% less water,' Emily proudly reports. 'Technology isn't just changing how we farm – it's helping us farm better.'\n\nRiverside Gardens now supplies high-end restaurants and specialty grocery stores throughout Northern California, proving that small farms can compete in the modern marketplace.",
      author: "Emily Chen - Riverside Gardens",
      image: innovationStory,
      date: "September 2024"
    },
    {
      id: "4",
      title: "Building Community Through Food",
      summary: "How the Farm2City platform is connecting urban consumers with local farmers.",
      content: "The farmers market in downtown Sacramento buzzes with activity every Saturday morning. Vendors arrange their colorful displays of fresh produce while early customers select the best picks of the week. But this isn't just about buying and selling – it's about building community.\n\n'When I started farming 10 years ago, I struggled to reach customers directly,' remembers Marcus Thompson, who grows heirloom vegetables just outside the city. 'The Farm2City platform changed everything for me.'\n\nFarm2City has created more than just an online marketplace. It's built a community where farmers and consumers connect, share stories, and learn from each other. Customers can visit farms, participate in harvest activities, and understand where their food comes from.\n\n'We've had families come out for our 'Pick Your Own' days,' Marcus continues. 'Kids who thought carrots came from the supermarket suddenly understand that food comes from the soil. Parents learn about seasonal eating and sustainable practices.'\n\nThe platform has facilitated over 10,000 direct farmer-to-consumer transactions in the past year alone. But more importantly, it's fostering relationships that go beyond commerce.\n\n'Food is connection,' explains platform co-founder Lisa Park. 'When people know their farmer, they value their food more. When farmers know their customers, they take even more pride in their work. That's how we build a sustainable food system.'",
      author: "Farm2City Community",
      image: communityStory,
      date: "August 2024"
    }
  ]);

  const featuredFarmers: FarmerProfile[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      farm: "Green Valley Farm",
      location: "Sacramento, CA",
      image: "",
      bio: "Organic farming specialist with 15 years experience",
      specialties: ["Organic Vegetables", "Herbs", "Sustainable Farming"],
      rating: 4.9,
      followers: 1247,
      verified: true,
      joinDate: "2022-03-15"
    },
    {
      id: "2",
      name: "Miguel Rodriguez",
      farm: "Sunny Acres",
      location: "Fresno, CA",
      image: "",
      bio: "Third-generation farmer specializing in citrus and stone fruits",
      specialties: ["Citrus Fruits", "Stone Fruits", "Traditional Methods"],
      rating: 4.8,
      followers: 892,
      verified: true,
      joinDate: "2021-11-08"
    },
    {
      id: "3",
      name: "Emily Chen",
      farm: "Riverside Gardens",
      location: "Stockton, CA",
      image: "",
      bio: "Innovative farmer using technology for precision agriculture",
      specialties: ["Leafy Greens", "Tech Integration", "Hydroponic Systems"],
      rating: 4.7,
      followers: 634,
      verified: true,
      joinDate: "2023-01-20"
    }
  ];

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [showComments, setShowComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");

  const handleComment = (postId: string) => {
    setShowComments(showComments === postId ? null : postId);
  };

  const addComment = (postId: string) => {
    if (!newComment.trim()) return;
    toast.success("Comment added!");
    setNewComment("");
    setShowComments(null);
  };

  const createNewPost = () => {
    if (!newPostContent.trim()) return;
    const newPost: CommunityPost = {
      id: Date.now().toString(),
      farmer: {
        id: "current-user",
        name: "You",
        farm: "Your Garden",
        location: "Your Location",
        image: "",
        bio: "Consumer sharing experiences",
        specialties: [],
        rating: 0,
        followers: 0,
        verified: false,
        joinDate: new Date().toISOString()
      },
      content: newPostContent,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: "Just now",
      liked: false
    };
    setPosts(prev => [newPost, ...prev]);
    setNewPostContent("");
    setShowNewPost(false);
    toast.success("Post created successfully!");
  };

  const handleShare = (postId: string) => {
    toast.success("Post shared to your feed!");
  };

  const handleFollow = (farmerId: string) => {
    setFollowedFarmers(prev => 
      prev.includes(farmerId) 
        ? prev.filter(id => id !== farmerId)
        : [...prev, farmerId]
    );
    const isFollowing = followedFarmers.includes(farmerId);
    toast.success(isFollowing ? "Unfollowed farmer!" : "Following farmer!");
  };

  const joinEvent = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, joined: !event.joined, attendees: event.joined ? event.attendees - 1 : event.attendees + 1 }
        : event
    ));
    const event = events.find(e => e.id === eventId);
    toast.success(event?.joined ? "Left event!" : "Successfully joined event!");
  };

  return (
    <ConsumerLayout currentPage="Community">
      <div className="min-h-screen bg-muted/30 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Community 👥</h1>
            <p className="text-muted-foreground">
              Connect with local farmers and discover their stories
            </p>
          </div>

          <Tabs defaultValue="feed" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="feed">Community Feed</TabsTrigger>
              <TabsTrigger value="farmers">Farmers</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="stories">Stories</TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* New Post Section */}
                  <Card className="shadow-card">
                    <CardContent className="p-6">
                      {!showNewPost ? (
                        <Button 
                          onClick={() => setShowNewPost(true)}
                          variant="outline" 
                          className="w-full justify-start"
                        >
                          Share something with the community...
                        </Button>
                      ) : (
                        <div className="space-y-4">
                          <textarea
                            className="w-full p-3 border rounded-lg resize-none"
                            placeholder="What's happening in your garden or kitchen?"
                            rows={3}
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Button onClick={createNewPost}>Post</Button>
                            <Button variant="outline" onClick={() => setShowNewPost(false)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  {posts.map((post) => (
                    <Card key={post.id} className="shadow-card">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={post.farmer.image} />
                            <AvatarFallback>
                              {post.farmer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{post.farmer.name}</h3>
                              {post.farmer.verified && (
                                <Badge variant="secondary" className="text-xs">
                                  <Award className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{post.farmer.farm}</p>
                            <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">{post.content}</p>
                        {post.image && (
                          <img 
                            src={post.image} 
                            alt="Post content" 
                            className="w-full h-64 object-cover rounded-lg mb-4"
                          />
                        )}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLike(post.id)}
                              className={`flex items-center gap-1 ${post.liked ? 'text-red-500' : ''}`}
                            >
                              <Heart className={`h-4 w-4 ${post.liked ? 'fill-red-500' : ''}`} />
                              {post.likes}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleComment(post.id)}
                              className="flex items-center gap-1"
                            >
                              <MessageCircle className="h-4 w-4" />
                              {post.comments}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShare(post.id)}
                              className="flex items-center gap-1"
                            >
                              <Share2 className="h-4 w-4" />
                              {post.shares}
                            </Button>
                          </div>
                        </div>
                        
                        {/* Comments Section */}
                        {showComments === post.id && (
                          <div className="pt-4 border-t space-y-3">
                            <div className="flex gap-2">
                              <Input
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addComment(post.id)}
                              />
                              <Button size="sm" onClick={() => addComment(post.id)}>
                                Post
                              </Button>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm p-2 bg-muted rounded">
                                <span className="font-medium">Sarah Johnson:</span> Great harvest! 🌱
                              </div>
                              <div className="text-sm p-2 bg-muted rounded">
                                <span className="font-medium">Mike Chen:</span> Those look amazing!
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="space-y-6">
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle className="text-lg">Featured Farmers</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {featuredFarmers.slice(0, 3).map((farmer) => (
                        <div key={farmer.id} className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={farmer.image} />
                            <AvatarFallback>
                              {farmer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{farmer.name}</p>
                            <p className="text-xs text-muted-foreground">{farmer.farm}</p>
                          </div>
                          <Button 
                            size="sm" 
                            variant={followedFarmers.includes(farmer.id) ? "default" : "outline"} 
                            onClick={() => handleFollow(farmer.id)}
                          >
                            <UserPlus className="h-3 w-3 mr-1" />
                            {followedFarmers.includes(farmer.id) ? "Following" : "Follow"}
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle className="text-lg">Upcoming Events</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {events.slice(0, 2).map((event) => (
                        <div key={event.id} className="p-3 border rounded-lg">
                          <h4 className="font-medium text-sm">{event.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2">
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </div>
                          <Button size="sm" className="w-full" onClick={() => joinEvent(event.id)}>
                            Join Event
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="farmers" className="space-y-6 mt-6">
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search farmers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredFarmers.map((farmer) => (
                  <Card key={farmer.id} className="shadow-card">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={farmer.image} />
                          <AvatarFallback className="text-lg">
                            {farmer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{farmer.name}</h3>
                            {farmer.verified && (
                              <Badge variant="secondary" className="text-xs">
                                <Award className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{farmer.farm}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {farmer.location}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{farmer.bio}</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {farmer.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {farmer.followers}
                          </div>
                          <div>⭐ {farmer.rating}</div>
                        </div>
                        <Button 
                          size="sm" 
                          variant={followedFarmers.includes(farmer.id) ? "default" : "outline"} 
                          onClick={() => handleFollow(farmer.id)}
                        >
                          <UserPlus className="h-3 w-3 mr-1" />
                          {followedFarmers.includes(farmer.id) ? "Following" : "Follow"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="shadow-card">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {event.title}
                        <Badge variant="outline">
                          {event.attendees}/{event.maxAttendees || '∞'}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          Organized by {event.organizer}
                        </div>
                        <p className="text-sm">{event.description}</p>
                        <Button 
                          className="w-full" 
                          variant={event.joined ? "secondary" : "default"}
                          onClick={() => joinEvent(event.id)}
                          disabled={event.maxAttendees ? event.attendees >= event.maxAttendees && !event.joined : false}
                        >
                          {event.joined ? 'Leave Event' : 
                           event.maxAttendees && event.attendees >= event.maxAttendees ? 'Event Full' : 
                           'Join Event'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="stories" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((story) => (
                  <Card key={story.id} className="shadow-card">
                    <div className="relative">
                      <img 
                        src={story.image} 
                        alt={story.title} 
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary">{story.date}</Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{story.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        {story.summary}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {story.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{story.author}</span>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              Read More
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-2xl mb-2">{story.title}</DialogTitle>
                              <div className="text-sm text-muted-foreground mb-4">
                                By {story.author} • {story.date}
                              </div>
                            </DialogHeader>
                            <div className="space-y-4">
                              <img 
                                src={story.image} 
                                alt={story.title} 
                                className="w-full h-64 object-cover rounded-lg"
                              />
                              <div className="prose prose-sm max-w-none">
                                {story.content.split('\n\n').map((paragraph, index) => (
                                  <p key={index} className="mb-4 leading-relaxed text-sm">
                                    {paragraph}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ConsumerLayout>
  );
}