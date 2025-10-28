import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { BookOpen, Play, Clock, Users, Fish, Waves, Leaf } from "lucide-react";

const EducationPage = () => {
  const { theme } = useTheme();
  const learningModules = [
    {
      id: 1,
      title: "Marine Ecosystems Fundamentals",
      description: "Learn about the basic components and interactions within marine ecosystems",
      duration: "45 min",
      level: "Beginner",
      topics: ["Food chains", "Habitats", "Biodiversity", "Ocean zones"],
      icon: Fish,
      color: "text-blue-600",
      students: 1247
    },
    {
      id: 2,
      title: "Ocean Conservation Strategies",
      description: "Explore modern approaches to protecting and preserving marine environments",
      duration: "60 min", 
      level: "Intermediate",
      topics: ["Marine Protected Areas", "Sustainable fishing", "Pollution control", "Climate action"],
      icon: Leaf,
      color: "text-green-600",
      students: 892
    },
    {
      id: 3,
      title: "Deep Sea Exploration",
      description: "Discover the mysteries of the deep ocean and cutting-edge research methods",
      duration: "75 min",
      level: "Advanced",
      topics: ["Deep sea creatures", "Research technology", "Pressure adaptations", "Discoveries"],
      icon: Waves,
      color: "text-purple-600",
      students: 634
    }
  ];

  const quickFacts = [
    {
      title: "Ocean Coverage",
      fact: "Oceans cover 71% of Earth's surface",
      detail: "The Pacific Ocean alone covers about 46% of the water surface"
    },
    {
      title: "Marine Life",
      fact: "Over 80% of ocean remains unexplored",
      detail: "Scientists estimate millions of species are yet to be discovered"
    },
    {
      title: "Oxygen Production",
      fact: "50-80% of Earth's oxygen comes from oceans",
      detail: "Marine plants like phytoplankton are crucial oxygen producers"
    },
    {
      title: "Climate Regulation",
      fact: "Oceans absorb 25% of all CO2 emissions",
      detail: "Ocean currents help distribute heat around the globe"
    }
  ];

  const featuredContent = [
    {
      type: "Video",
      title: "Coral Reef Restoration Projects",
      description: "See how scientists are working to restore damaged coral reefs worldwide",
      duration: "12 min",
      views: "45K"
    },
    {
      type: "Article",
      title: "The Impact of Plastic Pollution",
      description: "Understanding how plastic waste affects marine life and food chains",
      duration: "8 min read",
      views: "23K"
    },
    {
      type: "Interactive",
      title: "Ocean Zones Explorer",
      description: "Interactive journey from surface to deep sea with marine life encounters",
      duration: "15 min",
      views: "67K"
    },
    {
      type: "Podcast",
      title: "Marine Biologist Interviews",
      description: "Conversations with leading researchers on current ocean science",
      duration: "35 min",
      views: "15K"
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Video": return "bg-red-100 text-red-800";
      case "Article": return "bg-blue-100 text-blue-800";
      case "Interactive": return "bg-purple-100 text-purple-800";
      case "Podcast": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-ocean" />
          <span>Marine Education</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Discover the fascinating world of marine science through interactive learning modules
        </p>
      </div>

      {/* Learning Modules */}
      <div className="grid lg:grid-cols-3 gap-6">
        {learningModules.map((module) => (
          <Card key={module.id} className="hover:shadow-wave transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <module.icon className={`h-8 w-8 ${module.color}`} />
                <Badge className={getLevelColor(module.level)}>
                  {module.level}
                </Badge>
              </div>
              <CardTitle className="text-lg">{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{module.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{module.students} students</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Topics covered:</h4>
                <div className="flex flex-wrap gap-1">
                  {module.topics.map((topic, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Button className="w-full bg-gradient-coral hover:opacity-90">
                <Play className="mr-2 h-4 w-4" />
                Start Learning
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Facts */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-primary">Ocean Quick Facts</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickFacts.map((fact, index) => (
            <Card key={index} className="hover:shadow-wave transition-all duration-300">
              <CardContent className="p-4">
                <h3 className="font-semibold text-ocean mb-2">{fact.title}</h3>
                <p className="text-sm font-medium mb-1">{fact.fact}</p>
                <p className="text-xs text-muted-foreground">{fact.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Content */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-primary">Featured Content</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {featuredContent.map((content, index) => (
            <Card key={index} className="hover:shadow-wave transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className={getTypeColor(content.type)}>
                    {content.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{content.views} views</span>
                </div>
                <CardTitle className="text-lg">{content.title}</CardTitle>
                <CardDescription>{content.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{content.duration}</span>
                  <Button variant="outline" size="sm">
                    {content.type === "Video" ? (
                      <>
                        <Play className="mr-1 h-3 w-3" />
                        Watch
                      </>
                    ) : content.type === "Article" ? (
                      <>
                        <BookOpen className="mr-1 h-3 w-3" />
                        Read
                      </>
                    ) : (
                      <>
                        <Play className="mr-1 h-3 w-3" />
                        Explore
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Path Suggestion */}
      <Card className="bg-gradient-ocean text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Recommended Learning Path</span>
          </CardTitle>
          <CardDescription className="text-blue-100">
            Follow our structured curriculum for comprehensive marine science education
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">1</div>
              <p className="text-sm">Start with Fundamentals</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">2</div>
              <p className="text-sm">Explore Conservation</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">3</div>
              <p className="text-sm">Advanced Research</p>
            </div>
          </div>
          <Button variant="secondary" className={`w-full mt-4 ${
            theme === 'ocean' 
              ? 'bg-white/40 text-gray-900 hover:bg-white/50 border-white/20' 
              : 'bg-white text-primary hover:bg-white/90'
          }`}>
            Start Your Learning Journey
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EducationPage;