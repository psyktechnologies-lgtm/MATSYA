import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";
import { Crown, Check, Star, TrendingUp, Database, FileText, MapPin, Users } from "lucide-react";

const PremiumPage = () => {
  const { theme } = useTheme();
  const premiumFeatures = [
    {
      category: "Advanced Analytics",
      icon: TrendingUp,
      features: [
        "Predictive modeling and forecasting",
        "Custom data visualizations",
        "Machine learning-powered insights",
        "Advanced statistical analysis",
        "Comparative trend analysis"
      ]
    },
    {
      category: "Research Tools",
      icon: Database,
      features: [
        "Raw data export capabilities",
        "API access for integration",
        "Custom query builder",
        "Bulk data processing",
        "Historical dataset access"
      ]
    },
    {
      category: "Collaboration",
      icon: Users,
      features: [
        "Team workspace creation",
        "Data sharing protocols",
        "Collaborative annotation tools",
        "Multi-user project management",
        "Institution-wide access"
      ]
    },
    {
      category: "Reports & Publications",
      icon: FileText,
      features: [
        "Automated report generation",
        "Publication-ready charts",
        "Citation management",
        "Peer review collaboration",
        "Journal submission tools"
      ]
    }
  ];

  const pricingTiers = [
    {
      name: "Researcher",
      price: "$49",
      period: "per month",
      description: "Perfect for individual researchers and graduate students",
      features: [
        "Advanced analytics tools",
        "Data export capabilities",
        "5 collaborative projects",
        "Priority support",
        "Monthly webinars"
      ],
      highlighted: false
    },
    {
      name: "Institution",
      price: "$199",
      period: "per month",
      description: "Ideal for research institutions and universities",
      features: [
        "Everything in Researcher",
        "Unlimited collaborative projects",
        "Institution-wide access",
        "Custom data integration",
        "Dedicated account manager",
        "Training sessions"
      ],
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For large organizations and government agencies",
      features: [
        "Everything in Institution",
        "Custom feature development",
        "On-premise deployment options",
        "24/7 dedicated support",
        "SLA guarantees",
        "Compliance certifications"
      ],
      highlighted: false
    }
  ];

  const successStories = [
    {
      institution: "Marine Research Institute",
      researcher: "Dr. Sarah Chen",
      quote: "MATSYA's premium tools helped us identify critical migration patterns that led to establishing new marine protected areas.",
      impact: "3 new MPAs established"
    },
    {
      institution: "Ocean Conservation Fund",
      researcher: "Prof. James Rodriguez",
      quote: "The predictive analytics features allowed us to forecast coral bleaching events with 85% accuracy.",
      impact: "Early warning system deployed"
    },
    {
      institution: "National Fisheries Department",
      researcher: "Dr. Maria Santos",
      quote: "Policy recommendations generated through MATSYA analytics directly influenced sustainable fishing regulations.",
      impact: "New legislation passed"
    }
  ];

  return (
    <div className="p-6 space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary flex items-center justify-center space-x-2 mb-4">
          <Crown className="h-10 w-10 text-accent" />
          <span>Premium Features</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Unlock advanced marine research capabilities with our premium suite of tools designed for serious researchers and institutions
        </p>
      </div>

      {/* Feature Categories */}
      <div className="grid md:grid-cols-2 gap-8">
        {premiumFeatures.map((category, index) => (
          <Card key={index} className="hover:shadow-wave transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <category.icon className="h-6 w-6 text-accent" />
                <span>{category.category}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {category.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pricing Tiers */}
      <div className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">Choose Your Plan</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <Card key={index} className={`relative ${tier.highlighted ? 'border-accent shadow-lg scale-105' : ''} hover:shadow-wave transition-all duration-300`}>
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-accent text-accent-foreground px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <div className="py-4">
                  <span className="text-4xl font-bold text-primary">{tier.price}</span>
                  {tier.price !== "Custom" && <span className="text-muted-foreground">/{tier.period}</span>}
                </div>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {tier.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${tier.highlighted ? 'bg-gradient-coral hover:opacity-90' : ''}`}
                  variant={tier.highlighted ? "default" : "outline"}
                >
                  {tier.price === "Custom" ? "Contact Sales" : "Get Started"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Success Stories */}
      <div className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">Success Stories</h2>
        <div className="grid lg:grid-cols-3 gap-6">
          {successStories.map((story, index) => (
            <Card key={index} className="hover:shadow-wave transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{story.researcher}</CardTitle>
                    <CardDescription>{story.institution}</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {story.impact}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <blockquote className="text-sm italic text-muted-foreground">
                  "{story.quote}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-ocean text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl mb-2">Ready to Advance Your Research?</CardTitle>
          <CardDescription className="text-blue-100">
            Join leading marine researchers and institutions using MATSYA Premium
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">500+</div>
              <p>Active Researchers</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">150+</div>
              <p>Institutions</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">50+</div>
              <p>Countries</p>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Button variant="secondary" size="lg" className={
              theme === 'ocean' 
                ? 'bg-white/40 text-gray-900 hover:bg-white/50 border-white/20' 
                : 'bg-white text-primary hover:bg-white/90'
            }>
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg" className={
              theme === 'ocean' 
                ? 'border-white/40 text-white hover:bg-white/20' 
                : 'border-white text-white hover:bg-white/10'
            }>
              Schedule Demo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Need Help Choosing?</CardTitle>
          <CardDescription>
            Our team is here to help you select the right plan for your research needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Contact Sales</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Speak with our marine research specialists about institutional plans and custom solutions.
              </p>
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Contact Sales Team
              </Button>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Technical Support</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Get help with implementation, training, and technical questions from our expert team.
              </p>
              <Button variant="outline">
                <MapPin className="mr-2 h-4 w-4" />
                Get Technical Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumPage;