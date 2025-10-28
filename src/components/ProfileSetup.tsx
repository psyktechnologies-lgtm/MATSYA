import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Waves, User, Briefcase, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProfileSetup = () => {
  const [fullName, setFullName] = useState("");
  const [userType, setUserType] = useState("students");
  const [organization, setOrganization] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const userTypes = [
    {
      value: "students",
      label: "Students",
      description: "Students learning about marine sciences and ocean data",
      icon: GraduationCap,
      features: ["AI Chatbot", "Get Educated Section", "Basic Analytics", "Learning Resources"]
    },
    {
      value: "researchers",
      label: "Researchers",
      description: "Academic or scientific researchers in marine sciences",
      icon: User,
      features: ["Advanced Analytics", "Real-time Visualisation", "Research Tools", "All Student Features"]
    },
    {
      value: "marine_business", 
      label: "Marine Business",
      description: "Marine industry professionals and business stakeholders",
      icon: Briefcase,
      features: ["Business Insights", "Payment Gateway", "Premium Reports", "All Features"]
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate profile creation - in real app would save to database
    try {
      // Store profile data in localStorage for demo
      const profileData = {
        fullName,
        userType,
        organization,
        bio,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('matsya_profile', JSON.stringify(profileData));
      
      toast({
        title: "Profile created successfully!",
        description: "Welcome to MATSYA marine analytics platform.",
      });

      // Navigate to appropriate dashboard
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error creating profile",
        description: "Please try again.",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  const selectedUserType = userTypes.find(type => type.value === userType);

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Waves className="h-10 w-10 text-ocean" />
            <h1 className="text-3xl font-bold text-primary">MATSYA</h1>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Complete Your Profile</h2>
          <p className="text-muted-foreground">Help us personalize your marine analytics experience</p>
        </div>

        <Card className="shadow-ocean">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Tell us about yourself to get the most relevant marine insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-4">
                <Label>User Type</Label>
                <RadioGroup value={userType} onValueChange={setUserType}>
                  {userTypes.map((type) => (
                    <div key={type.value} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={type.value} id={type.value} />
                        <Label 
                          htmlFor={type.value} 
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <type.icon className="h-5 w-5 text-ocean" />
                          <span className="font-medium">{type.label}</span>
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">{type.description}</p>
                      <div className="flex flex-wrap gap-1 ml-6">
                        {type.features.map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {(userType === "researchers" || userType === "marine_business") && (
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Your institution or organization"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about your interest in marine sciences..."
                  className="min-h-[100px]"
                />
              </div>

              {selectedUserType && (
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Your Access Level:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {selectedUserType.features.map((feature) => (
                      <Badge key={feature} className="bg-ocean text-ocean-foreground">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-coral hover:opacity-90" 
                disabled={loading}
                size="lg"
              >
                {loading ? "Creating Profile..." : "Complete Setup"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;