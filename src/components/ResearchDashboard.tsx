import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Microscope, 
  Fish, 
  BookOpen, 
  FileText, 
  Database, 
  Map,
  Dna,
  Eye,
  ChevronRight,
  Activity,
  Users,
  Globe,
  Waves,
  Zap
} from 'lucide-react';

const ResearchDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const researchCategories = [
    {
      id: 'taxonomy',
      title: 'Taxonomy Research',
      description: 'Upload and analyze taxonomic datasets, species classification, and biodiversity studies',
      icon: <Database className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      path: '/dashboard/taxonomy',
      features: ['Darwin Core Support', 'Species Classification', 'Biodiversity Analysis', 'Data Validation'],
      status: 'Active',
      bgPattern: 'bg-blue-50 dark:bg-blue-950/20',
      hoverGlow: 'hover:shadow-blue-500/25',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      id: 'otolith',
      title: 'Otolith Analysis',
      description: 'Fish age determination and growth analysis through otolith structure examination',
      icon: <Fish className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-green-500 to-emerald-500',
      path: '/dashboard/otolith',
      features: ['Age Determination', 'Growth Analysis', 'Image Processing', 'Statistical Models'],
      status: 'Active',
      bgPattern: 'bg-green-50 dark:bg-green-950/20',
      hoverGlow: 'hover:shadow-green-500/25',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    {
      id: 'edna',
      title: 'eDNA Analysis',
      description: 'Environmental DNA sequencing, metabarcoding, and species detection from water samples',
      icon: <Dna className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-purple-500 to-indigo-500',
      path: '/dashboard/edna',
      features: ['Sequence Analysis', 'Metabarcoding', 'Species Detection', 'Quality Control'],
      status: 'Active',
      bgPattern: 'bg-purple-50 dark:bg-purple-950/20',
      hoverGlow: 'hover:shadow-purple-500/25',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      id: 'research-paper',
      title: 'Research Publishing',
      description: 'Submit, collaborate, and publish marine research papers with peer review system',
      icon: <FileText className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-orange-500 to-red-500',
      path: '/dashboard/research-publishing',
      features: ['Manuscript Submission', 'Peer Review', 'Collaboration Tools', 'Publication Management'],
      status: 'New',
      bgPattern: 'bg-orange-50 dark:bg-orange-950/20',
      hoverGlow: 'hover:shadow-orange-500/25',
      iconColor: 'text-orange-600 dark:text-orange-400'
    }
  ];

  const quickActions = [
    {
      title: '3D Marine Map',
      description: 'Explore real-time marine data on interactive 3D globe',
      icon: <Globe className="h-6 w-6" />,
      path: '/dashboard/marine-map',
      color: 'text-blue-600 dark:text-blue-400',
      accent: 'bg-blue-100 dark:bg-blue-900/30',
      border: 'border-blue-200 dark:border-blue-800'
    },
    {
      title: 'Real-time Analytics',
      description: 'View live marine data streams and analytics',
      icon: <Activity className="h-6 w-6" />,
      path: '/dashboard/analytics',
      color: 'text-green-600 dark:text-green-400',
      accent: 'bg-green-100 dark:bg-green-900/30',
      border: 'border-green-200 dark:border-green-800'
    },
    {
      title: 'Species Explorer',
      description: 'Browse and search marine species database',
      icon: <Eye className="h-6 w-6" />,
      path: '/dashboard/species',
      color: 'text-purple-600 dark:text-purple-400',
      accent: 'bg-purple-100 dark:bg-purple-900/30',
      border: 'border-purple-200 dark:border-purple-800'
    },
    {
      title: 'Community Hub',
      description: 'Connect with marine researchers worldwide',
      icon: <Users className="h-6 w-6" />,
      path: '/dashboard/community',
      color: 'text-orange-600 dark:text-orange-400',
      accent: 'bg-orange-100 dark:bg-orange-900/30',
      border: 'border-orange-200 dark:border-orange-800'
    }
  ];

  const handleCategorySelect = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen relative bg-gray-50 dark:bg-gray-900">
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Microscope className="h-16 w-16 mr-4 text-blue-600 dark:text-blue-400" />
              <div className="absolute -top-2 -right-2">
                <Zap className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
              </div>
            </div>
            <h1 className="text-5xl font-bold tracking-wide text-gray-900 dark:text-gray-100">
              Marine Research Hub
            </h1>
          </div>
          <div className="max-w-4xl mx-auto">
            <p className="text-2xl mb-4 font-light text-gray-700 dark:text-gray-300">
              Dive Deep into Marine Science Discovery
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Choose your research pathway and access advanced tools for comprehensive marine research
            </p>
          </div>
        </div>

        {/* Research Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {researchCategories.map((category) => (
            <Card 
              key={category.id} 
              className={`cursor-pointer border-2 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 ${category.bgPattern}`}
              onClick={() => handleCategorySelect(category.path)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className={`p-4 rounded-xl ${category.color} text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    {category.icon}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={category.status === 'New' ? 'default' : 'secondary'}
                      className={category.status === 'New' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse' : ''}
                    >
                      {category.status}
                    </Badge>
                    <ChevronRight className="h-6 w-6 transition-all duration-300 group-hover:translate-x-1 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-semibold transition-colors duration-300 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {category.title}
                </CardTitle>
                <CardDescription className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300">Key Features:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {category.features.map((feature, index) => (
                      <div key={index} className="flex items-center transition-colors duration-300 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200">
                        <div className="w-2 h-2 rounded-full mr-3 bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Access Tools */}
        <Card className="mb-8 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-gray-900 dark:text-gray-100">
              <Map className="h-8 w-8 mr-3 text-blue-600 dark:text-blue-400" />
              Quick Access Tools
              <Waves className="h-6 w-6 ml-3 animate-pulse text-blue-500 dark:text-blue-400" />
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
              Frequently used research tools and marine resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-start space-y-3 hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 w-full"
                  onClick={() => navigate(action.path)}
                >
                  <div className={`p-3 rounded-lg transition-colors duration-300 ${action.accent}`}>
                    <div className={action.color}>
                      {action.icon}
                    </div>
                  </div>
                  <div className="text-left w-full min-w-0">
                    <div className="font-semibold text-lg break-words">{action.title}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card className="backdrop-blur-sm shadow-2xl bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-gray-900 dark:text-gray-100">
              <BookOpen className="h-8 w-8 mr-3 text-blue-600 dark:text-blue-400" />
              Dive Into Marine Research
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3 p-6 rounded-lg border transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-blue-200 dark:border-blue-700">
                <h4 className="font-semibold text-xl text-gray-900 dark:text-gray-100">New to Marine Research?</h4>
                <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                  Start with our guided tutorials and sample datasets to learn the platform.
                </p>
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  onClick={() => navigate('/dashboard/education')}
                >
                  View Tutorials →
                </Button>
              </div>
              <div className="space-y-3 p-6 rounded-lg border transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-700">
                <h4 className="font-semibold text-xl text-gray-900 dark:text-gray-100">Need Help?</h4>
                <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                  Access documentation, API references, and community support.
                </p>
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                  onClick={() => navigate('/dashboard/api-docs')}
                >
                  Get Support →
                </Button>
              </div>
              <div className="space-y-3 p-6 rounded-lg border transition-all duration-300 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 border-purple-200 dark:border-purple-700">
                <h4 className="font-semibold text-xl text-gray-900 dark:text-gray-100">Share Your Research</h4>
                <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                  Publish findings and collaborate with the global marine research community.
                </p>
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                  onClick={() => navigate('/dashboard/research-publishing')}
                >
                  Learn More →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CSS for wave animation in global styles */}
    </div>
  );
};

export default ResearchDashboard;