import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTheme } from "@/contexts/ThemeContext";
import MarineMap from "@/components/MarineMap";
import { 
  BarChart3, 
  MessageCircle, 
  BookOpen, 
  TrendingUp, 
  Users, 
  Waves,
  Crown,
  Activity,
  Fish,
  Database,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";

interface UserProfile {
  fullName: string;
  userType: string;
  organization?: string;
  bio?: string;
}

const Dashboard = () => {
  const { theme } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('matsya_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const isAdvancedUser = profile?.userType === "researchers" || profile?.userType === "marine_business";

  const basicFeatures = [
    {
      title: "Research Hub",
      description: "Choose your research pathway: taxonomy, otolith, eDNA, or publishing",
      icon: BookOpen,
      link: "/dashboard/research-hub",
      color: "text-purple-600"
    },
    {
      title: "AI Marine Assistant",
      description: "Ask questions about marine ecosystems, species, and conservation",
      icon: MessageCircle,
      link: "/dashboard/chatbot",
      color: "text-blue-600"
    },
    {
      title: "Data Analytics",
      description: "View marine data trends and comprehensive statistics",
      icon: BarChart3,
      link: "/dashboard/analytics", 
      color: "text-green-600"
    },
    {
      title: "Education Hub",
      description: "Learn about marine biology, conservation, and ocean science",
      icon: BookOpen,
      link: "/dashboard/education",
      color: "text-purple-600"
    },
    {
      title: "Research Portal",
      description: "Access latest research papers and marine science publications",
      icon: Database,
      link: "/dashboard/research",
      color: "text-blue-600"
    },
    {
      title: "Community Hub",
      description: "Connect with researchers and marine science professionals",
      icon: Users,
      link: "/dashboard/community",
      color: "text-accent"
    }
  ];

  const advancedFeatures = [
    {
      title: "Real-time Visualizations",
      description: "Live marine data streams and interactive maps",
      icon: TrendingUp,
      link: "/dashboard/realtime",
      color: "text-blue-600"
    },
    {
      title: "Premium Analytics",
      description: "Advanced research tools and deep-dive analysis",
      icon: Crown,
      link: "/dashboard/premium",
      color: "text-accent"
    }
  ];

  const mockStats = [
    { label: "OBIS Data Points", value: "150M+", change: "+5.2%", icon: Database },
    { label: "Active Users", value: "12,543", change: "+12.1%", icon: Users },
    { label: "Species Identified", value: "45,678", change: "+3.8%", icon: Fish },
    { label: "Real-time Streams", value: "24/7", change: "Live", icon: Activity },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            MATSYA Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Marine Analytics, Taxonomy, and Species Analysis Platform
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Waves className="h-8 w-8 text-blue-600" />
          {profile && (
            <Badge variant={isAdvancedUser ? "default" : "secondary"} className="text-xs bg-blue-600 text-white">
              {profile.userType === "researchers" ? "Researcher" : 
               profile.userType === "marine_business" ? "Marine Business" : "Student"}
            </Badge>
          )}
        </div>
      </div>

      {/* Quick Access Actions */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Link to="/dashboard/chatbot">
          <Button className="h-24 bg-blue-600 hover:bg-blue-700 flex flex-col items-center justify-center space-y-2 w-full text-white">
            <MessageCircle className="h-6 w-6" />
            <span>AI Marine Assistant</span>
          </Button>
        </Link>
        <Link to="/dashboard/marine-map">
          <Button className="h-24 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 flex flex-col items-center justify-center space-y-2 w-full text-white">
            <Globe className="h-6 w-6" />
            <span>3D Ocean Map</span>
          </Button>
        </Link>
        <Link to="/dashboard/research-hub">
          <Button className="h-24 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 flex flex-col items-center justify-center space-y-2 w-full text-white">
            <BookOpen className="h-6 w-6" />
            <span>Research Hub</span>
          </Button>
        </Link>
      </div>

      {/* Real-time 3D Marine Data Map */}
      <MarineMap />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-wave transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {basicFeatures.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={feature.link}>
                <Button className="w-full" variant="outline">
                  Explore
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}

        {isAdvancedUser && advancedFeatures.map((feature, index) => (
          <Card key={`advanced-${index}`} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-accent/20">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
                <CardTitle className="text-lg flex items-center space-x-2">
                  <span>{feature.title}</span>
                  <Badge variant="default" className="bg-accent text-accent-foreground text-xs">
                    Premium
                  </Badge>
                </CardTitle>
              </div>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={feature.link}>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                  Access Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-blue-900">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Waves className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription>
            Get started with the most popular features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Link to="/dashboard/chatbot">
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="mr-2 h-4 w-4" />
                Ask AI about marine life
              </Button>
            </Link>
            <Link to="/dashboard/analytics">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                View ocean statistics
              </Button>
            </Link>
            <Link to="/dashboard/research">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Research papers</span>
              </Button>
            </Link>
            <Link to="/dashboard/community">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                <span>Join community</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* User Type Upgrade Banner for Normal Users */}
      {!isAdvancedUser && (
        <Card className="bg-blue-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Crown className="h-5 w-5" />
              <span>Unlock Advanced Features</span>
            </CardTitle>
            <CardDescription className="text-blue-100">
              Get access to real-time data, advanced analytics, and research tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm opacity-90">Become a verified researcher or policy maker</p>
                <div className="flex space-x-2">
                  <Badge variant="secondary" className="bg-white/40 text-white border-white/20">Real-time Data</Badge>
                  <Badge variant="secondary" className="bg-white/40 text-white border-white/20">Advanced Analytics</Badge>
                  <Badge variant="secondary" className="bg-white/40 text-white border-white/20">Research Tools</Badge>
                </div>
              </div>
              <Button variant="secondary" className="bg-white/40 text-gray-900 hover:bg-white/50 border-white/20">
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;