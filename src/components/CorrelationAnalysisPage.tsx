import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  TrendingUp, 
  BarChart3, 
  Waves, 
  Thermometer,
  Activity,
  Fish,
  Globe,
  Zap,
  Download,
  Play
} from "lucide-react";

const CorrelationAnalysisPage = () => {
  const [selectedParameters, setSelectedParameters] = useState<string[]>([]);

  const oceanParameters = [
    { id: "temperature", name: "Sea Surface Temperature", unit: "°C", icon: Thermometer },
    { id: "salinity", name: "Salinity", unit: "PSU", icon: Waves },
    { id: "ph", name: "pH Level", unit: "pH", icon: Activity },
    { id: "oxygen", name: "Dissolved Oxygen", unit: "mg/L", icon: Activity },
    { id: "chlorophyll", name: "Chlorophyll-a", unit: "mg/m³", icon: Activity },
    { id: "depth", name: "Water Depth", unit: "m", icon: Waves },
  ];

  const biodiversityMetrics = [
    { id: "species_richness", name: "Species Richness", description: "Number of species" },
    { id: "shannon_diversity", name: "Shannon Diversity Index", description: "H' diversity measure" },
    { id: "evenness", name: "Species Evenness", description: "Distribution uniformity" },
    { id: "abundance", name: "Total Abundance", description: "Individual count" },
    { id: "biomass", name: "Total Biomass", description: "kg/m³" },
    { id: "endemism", name: "Endemic Species", description: "Region-specific species" },
  ];

  const correlationResults = [
    {
      parameter1: "Sea Surface Temperature",
      parameter2: "Species Richness", 
      correlation: -0.74,
      pValue: 0.002,
      significance: "High",
      samples: 156
    },
    {
      parameter1: "Chlorophyll-a",
      parameter2: "Fish Abundance",
      correlation: 0.68,
      pValue: 0.008,
      significance: "Medium", 
      samples: 134
    },
    {
      parameter1: "pH Level",
      parameter2: "Coral Diversity",
      correlation: 0.82,
      pValue: 0.001,
      significance: "High",
      samples: 89
    }
  ];

  const analysisTypes = [
    {
      name: "Pearson Correlation",
      description: "Linear relationships between continuous variables",
      icon: TrendingUp,
      suitable: "Numeric data with normal distribution"
    },
    {
      name: "Spearman Correlation", 
      description: "Monotonic relationships, non-parametric",
      icon: BarChart3,
      suitable: "Ranked or non-normal data"
    },
    {
      name: "Canonical Correlation",
      description: "Multivariate relationships between datasets",
      icon: Activity,
      suitable: "Multiple dependent variables"
    },
    {
      name: "Time Series Analysis",
      description: "Temporal patterns and cross-correlations", 
      icon: Waves,
      suitable: "Time-dependent data"
    }
  ];

  const handleParameterSelect = (parameterId: string) => {
    setSelectedParameters(prev => 
      prev.includes(parameterId) 
        ? prev.filter(id => id !== parameterId)
        : [...prev, parameterId]
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Cross-Disciplinary Correlation Analysis</h1>
        <p className="text-muted-foreground">Study relationships between ocean parameters, biodiversity, and ecosystem health</p>
      </div>

      <Tabs defaultValue="setup" className="space-y-4">
        <TabsList>
          <TabsTrigger value="setup">Analysis Setup</TabsTrigger>
          <TabsTrigger value="results">Correlation Results</TabsTrigger>
          <TabsTrigger value="visualization">Data Visualization</TabsTrigger>
          <TabsTrigger value="methods">Analysis Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Waves className="h-5 w-5 text-ocean" />
                  <span>Ocean Parameters</span>
                </CardTitle>
                <CardDescription>Select oceanographic variables for analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {oceanParameters.map((param) => (
                  <div key={param.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={param.id}
                      checked={selectedParameters.includes(param.id)}
                      onCheckedChange={() => handleParameterSelect(param.id)}
                    />
                    <div className="flex items-center space-x-2 flex-1">
                      <param.icon className="h-4 w-4 text-muted-foreground" />
                      <label htmlFor={param.id} className="text-sm font-medium cursor-pointer">
                        {param.name}
                      </label>
                      <Badge variant="outline" className="text-xs">{param.unit}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Fish className="h-5 w-5 text-accent" />
                  <span>Biodiversity Metrics</span>
                </CardTitle>
                <CardDescription>Select biodiversity and ecosystem health indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {biodiversityMetrics.map((metric) => (
                  <div key={metric.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={metric.id}
                      checked={selectedParameters.includes(metric.id)}
                      onCheckedChange={() => handleParameterSelect(metric.id)}
                    />
                    <div className="flex-1">
                      <label htmlFor={metric.id} className="text-sm font-medium cursor-pointer block">
                        {metric.name}
                      </label>
                      <p className="text-xs text-muted-foreground">{metric.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Analysis Configuration</CardTitle>
              <CardDescription>Configure correlation analysis parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Analysis Method</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pearson">Pearson Correlation</SelectItem>
                      <SelectItem value="spearman">Spearman Correlation</SelectItem>
                      <SelectItem value="canonical">Canonical Correlation</SelectItem>
                      <SelectItem value="timeseries">Time Series Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Time Range</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1month">Last Month</SelectItem>
                      <SelectItem value="3months">Last 3 Months</SelectItem>
                      <SelectItem value="6months">Last 6 Months</SelectItem>
                      <SelectItem value="1year">Last Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Spatial Scale</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select scale" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local (&lt; 50 km)</SelectItem>
                      <SelectItem value="regional">Regional (50-500 km)</SelectItem>
                      <SelectItem value="basin">Basin Scale (&gt; 500 km)</SelectItem>
                      <SelectItem value="global">Global</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button className="bg-gradient-ocean">
                  <Play className="w-4 h-4 mr-2" />
                  Run Analysis
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Setup
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {correlationResults.map((result, index) => (
            <Card key={index} className="hover:shadow-wave transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {result.parameter1} × {result.parameter2}
                  </CardTitle>
                  <Badge variant={
                    result.significance === 'High' ? 'default' :
                    result.significance === 'Medium' ? 'secondary' : 'outline'
                  }>
                    {result.significance} Significance
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Correlation</p>
                    <p className={`text-2xl font-bold ${
                      Math.abs(result.correlation) > 0.7 ? 'text-green-600' :
                      Math.abs(result.correlation) > 0.5 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {result.correlation > 0 ? '+' : ''}{result.correlation}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">P-Value</p>
                    <p className="text-lg font-semibold">{result.pValue}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Samples</p>
                    <p className="text-lg font-semibold">{result.samples}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Strength</p>
                    <p className="text-lg font-semibold">
                      {Math.abs(result.correlation) > 0.7 ? 'Strong' :
                       Math.abs(result.correlation) > 0.5 ? 'Moderate' : 'Weak'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Plot
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button size="sm" variant="outline">
                    <Globe className="w-4 h-4 mr-2" />
                    Map View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="visualization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Correlation Matrix</CardTitle>
              <CardDescription>Explore relationships between all selected parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/20 rounded-lg p-8 text-center">
                <BarChart3 className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  Interactive correlation heatmap will be displayed here
                </p>
                <div className="mt-4 space-x-2">
                  <Button size="sm">Generate Heatmap</Button>
                  <Button size="sm" variant="outline">3D Visualization</Button>
                  <Button size="sm" variant="outline">Network Graph</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Scatter Plot Matrix</CardTitle>
                <CardDescription>Pairwise relationship visualization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/10 rounded-lg p-6 text-center">
                  <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">Scatter plots</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Time Series Correlation</CardTitle>
                <CardDescription>Temporal correlation patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/10 rounded-lg p-6 text-center">
                  <Activity className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">Time series</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="methods" className="space-y-4">
          <div className="grid gap-4">
            {analysisTypes.map((method, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <method.icon className="h-5 w-5 text-ocean" />
                    <CardTitle className="text-lg">{method.name}</CardTitle>
                  </div>
                  <CardDescription>{method.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Best for:</p>
                      <p className="text-sm font-medium">{method.suitable}</p>
                    </div>
                    <Button size="sm">
                      <Zap className="w-4 h-4 mr-2" />
                      Apply Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CorrelationAnalysisPage;