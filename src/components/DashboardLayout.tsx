import { useState, useEffect } from "react";
import { Outlet, useNavigate, NavLink, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider,
  SidebarTrigger,
  useSidebar 
} from "@/components/ui/sidebar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Waves, 
  LayoutDashboard, 
  MessageCircle, 
  BarChart3, 
  BookOpen, 
  TrendingUp, 
  Crown,
  User,
  LogOut,
  Users
} from "lucide-react";

interface UserProfile {
  fullName: string;
  userType: string;
  organization?: string;
  bio?: string;
}

const DashboardSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('matsya_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const isAdvancedUser = profile?.userType === "researchers" || profile?.userType === "marine_business";

  const basicNavItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Research Hub", url: "/dashboard/research-hub", icon: BookOpen },
    { title: "AI Assistant", url: "/dashboard/chatbot", icon: MessageCircle },
    { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
    { title: "Education", url: "/dashboard/education", icon: BookOpen },
    { title: "Research Tools", url: "/dashboard/research", icon: BookOpen },
    { title: "Community", url: "/dashboard/community", icon: Users },
  ];

  const advancedNavItems = [
    { title: "Real-time Data", url: "/dashboard/realtime", icon: TrendingUp },
    { title: "Premium Features", url: "/dashboard/premium", icon: Crown },
  ];

  const currentPath = location.pathname;
  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-ocean/10 text-ocean font-medium" : "hover:bg-muted/50";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-ocean font-semibold">
            {!collapsed && "Main Features"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {basicNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdvancedUser && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-accent font-semibold">
              {!collapsed && "Advanced Tools"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {advancedNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavCls}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

const DashboardLayout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('matsya_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case "researchers": return "Researchers";
      case "marine_business": return "Marine Business";
      default: return "Students";
    }
  };

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case "researchers": return "bg-blue-100 text-blue-800";
      case "marine_business": return "bg-purple-100 text-purple-800";
      default: return "bg-green-100 text-green-800";
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b bg-card/50 backdrop-blur-sm px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <Link to="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                  <Waves className="h-6 w-6 text-ocean" />
                  <h1 className="text-xl font-bold text-primary">MATSYA</h1>
                </Link>
              </div>
              
              <div className="flex items-center space-x-4">
                <ThemeSwitcher />
                {profile && (
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-sm font-medium">{profile.fullName}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getUserTypeColor(profile.userType)}`}>
                      {getUserTypeLabel(profile.userType)}
                    </span>
                  </div>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-ocean text-ocean-foreground">
                          {profile?.fullName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;