import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  Video, 
  FileText, 
  Download, 
  Play,
  Clock,
  Award,
  Search,
  Globe,
  CheckCircle,
  Star
} from "lucide-react";
import { FarmerLayout } from "@/components/layouts/FarmerLayout";
import { ChatBot } from "@/components/ChatBot";

export default function EducationHub() {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const handleStartCourse = (courseId) => {
    if (!enrolledCourses.includes(courseId)) {
      setEnrolledCourses([...enrolledCourses, courseId]);
      toast({
        title: "Course Started",
        description: "You've successfully enrolled in this course!",
      });
    }
  };

  const handleDownloadCertificate = (courseTitle) => {
    toast({
      title: "Certificate Generated",
      description: `Certificate for "${courseTitle}" is being prepared for download.`,
    });
  };
  
  const [courses] = useState([
    {
      id: 1,
      title: "Sustainable Farming Practices",
      description: "Learn eco-friendly farming methods that improve soil health and crop yields",
      type: "video",
      duration: "2h 45m",
      modules: 8,
      progress: 60,
      difficulty: "Beginner",
      rating: 4.8,
      enrolled: 234,
      instructor: "Dr. Sarah Mthembu",
      languages: ["English", "Zulu", "Xhosa"]
    },
    {
      id: 2,
      title: "Organic Certification Process",
      description: "Complete guide to obtaining organic certification for your farm",
      type: "document",
      duration: "1h 30m",
      modules: 5,
      progress: 0,
      difficulty: "Intermediate", 
      rating: 4.6,
      enrolled: 189,
      instructor: "James Nkomo",
      languages: ["English", "Afrikaans"]
    },
    {
      id: 3,
      title: "Digital Marketing for Farmers",
      description: "Master online sales and social media marketing for your produce",
      type: "video",
      duration: "3h 15m", 
      modules: 12,
      progress: 100,
      difficulty: "Intermediate",
      rating: 4.9,
      enrolled: 156,
      instructor: "Nomsa Dube",
      languages: ["English", "Zulu", "Sotho"]
    }
  ]);

  const [videos] = useState([
    {
      id: 1,
      title: "Water-Efficient Irrigation Techniques",
      duration: "15:32",
      views: 1250,
      category: "Water Management",
      thumbnail: "💧",
      languages: ["English", "Zulu", "Xhosa"]
    },
    {
      id: 2,
      title: "Soil Health Assessment", 
      duration: "12:45",
      views: 890,
      category: "Soil Management",
      thumbnail: "🌱",
      languages: ["English", "Afrikaans"]
    },
    {
      id: 3,
      title: "Pest Control Without Chemicals",
      duration: "18:20",
      views: 2100,
      category: "Pest Management", 
      thumbnail: "🐛",
      languages: ["English", "Zulu", "Sotho"]
    }
  ]);

  const [articles] = useState([
    {
      id: 1,
      title: "Climate-Smart Agriculture for Small Farms",
      readTime: "8 min read",
      category: "Climate Adaptation",
      downloadCount: 450,
      format: "PDF",
      languages: ["English", "Zulu", "Xhosa", "Sotho"]
    },
    {
      id: 2,
      title: "Record Keeping for Better Farm Management",
      readTime: "12 min read", 
      category: "Farm Management",
      downloadCount: 380,
      format: "PDF",
      languages: ["English", "Afrikaans"]
    },
    {
      id: 3,
      title: "Market Pricing Strategies Guide",
      readTime: "15 min read",
      category: "Business",
      downloadCount: 620,
      format: "PDF", 
      languages: ["English", "Zulu", "Xhosa"]
    }
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'default';
      case 'Intermediate': return 'secondary';
      case 'Advanced': return 'destructive';
      default: return 'outline';
    }
  };

  const languages = ["English", "Zulu", "Xhosa", "Sotho", "Afrikaans"];

  return (
    <FarmerLayout currentPage="Education Hub">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Education Hub 📚</h1>
            <p className="text-muted-foreground">
              Learn, grow, and master modern farming techniques
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <select 
                className="bg-background border rounded px-3 py-1"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Learning Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">Courses Enrolled</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Award className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1</p>
                  <p className="text-sm text-muted-foreground">Certificates Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Video className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">15</p>
                  <p className="text-sm text-muted-foreground">Videos Watched</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-glow/10 rounded-lg">
                  <Clock className="h-6 w-6 text-primary-glow" />
                </div>
                <div>
                  <p className="text-2xl font-bold">24h</p>
                  <p className="text-sm text-muted-foreground">Learning Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search courses, videos, articles..." 
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="videos">Video Guides</TabsTrigger>
            <TabsTrigger value="articles">Articles & PDFs</TabsTrigger>
            <TabsTrigger value="certificates">My Certificates</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                      </div>
                      <Badge variant={getDifficultyColor(course.difficulty)}>
                        {course.difficulty}
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-medium">{course.duration}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Modules</p>
                        <p className="font-medium">{course.modules}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rating</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current text-secondary" />
                          <span className="font-medium">{course.rating}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Enrolled</p>
                        <p className="font-medium">{course.enrolled}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {course.languages.map(lang => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        className="flex-1" 
                        variant={course.progress > 0 ? "default" : "secondary"}
                      >
                        {course.progress > 0 ? "Continue" : "Start Course"}
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Card key={video.id} className="shadow-card">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-primary rounded-t-lg flex items-center justify-center text-6xl relative">
                      {video.thumbnail}
                      <div className="absolute inset-0 bg-black/20 rounded-t-lg flex items-center justify-center">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{video.title}</h3>
                      <div className="flex justify-between text-sm text-muted-foreground mb-3">
                        <span>{video.duration}</span>
                        <span>{video.views} views</span>
                      </div>
                      <Badge variant="outline" className="mb-3">{video.category}</Badge>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {video.languages.map(lang => (
                          <Badge key={lang} variant="outline" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                      <Button className="w-full" size="sm">
                        <Play className="h-4 w-4 mr-1" />
                        Watch Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="articles">
            <div className="space-y-4">
              {articles.map((article) => (
                <Card key={article.id} className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span>{article.readTime}</span>
                          <span>•</span>
                          <span>{article.downloadCount} downloads</span>
                          <Badge variant="outline">{article.category}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {article.languages.map(lang => (
                            <Badge key={lang} variant="outline" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <div className="text-center">
                          <FileText className="h-8 w-8 text-primary mx-auto mb-1" />
                          <p className="text-xs text-muted-foreground">{article.format}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="certificates">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardContent className="p-6 text-center">
                  <Award className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Digital Marketing for Farmers</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Completed on January 15, 2024
                  </p>
                  <div className="flex items-center justify-center gap-1 mb-4">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Verified Certificate</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Certificate
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-dashed">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Earn More Certificates</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete courses to earn verified certificates
                  </p>
                  <Button variant="default" size="sm">
                    Browse Courses
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Chatbot */}
      <ChatBot />
    </FarmerLayout>
  );
}