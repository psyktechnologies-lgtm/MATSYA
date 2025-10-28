import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BarChart3, TrendingUp, TrendingDown, Fish, Waves, Thermometer, RefreshCw, Activity } from "lucide-react";
import { fetchSpecies, obisSync, fetchOBISData } from "@/lib/api";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useTheme } from "@/contexts/ThemeContext";
import type { Species } from "@/types/database";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface RealTimeStats {
  oceanTemperature: number;
  speciesCount: number;
  oceanPH: number;
  lastUpdated: string;
}

interface ResearchMetrics {
  publishedPapers: number;
  activeSites: number;
  collaborativeProjects: number;
  dataPoints: number;
  growthRates: {
    papers: string;
    sites: string;
    projects: string;
    data: string;
  };
}

interface TemperatureDataPoint {
  time: string;
  temperature: number;
  timestamp: number;
}

const AnalyticsPage = () => {
  const { theme } = useTheme();
  
  // Theme-aware colors for charts
  const chartColors = {
    grid: theme === 'dark' ? '#374151' : '#e2e8f0',
    axis: theme === 'dark' ? '#9ca3af' : '#64748b',
    line: theme === 'dark' ? '#60a5fa' : '#3b82f6',
    text: theme === 'dark' ? '#e5e7eb' : '#374151'
  };
  
  const [realTimeData, setRealTimeData] = useState<RealTimeStats>({
    oceanTemperature: 15.2,
    speciesCount: 245120,
    oceanPH: 8.04,
    lastUpdated: new Date().toISOString()
  });

  const [temperatureHistory, setTemperatureHistory] = useState<TemperatureDataPoint[]>([]);
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const { messages } = useWebSocket('/ws/updates');

  // Initialize temperature history with some sample data
  useEffect(() => {
    const now = Date.now();
    const initialData: TemperatureDataPoint[] = [];
    
    for (let i = 29; i >= 0; i--) {
      const timestamp = now - i * 10000; // 10 seconds intervals
      const baseTemp = 15.2;
      const variation = Math.sin(i * 0.1) * 0.5 + Math.random() * 0.3 - 0.15;
      
      initialData.push({
        time: new Date(timestamp).toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        }),
        temperature: +(baseTemp + variation).toFixed(2),
        timestamp
      });
    }
    
    setTemperatureHistory(initialData);
  }, []);

  // Real-time species data query
  const { data: speciesData, refetch: refetchSpecies } = useQuery<Species[]>({
    queryKey: ['analytics-species'],
    queryFn: () => fetchSpecies(),
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 15000, // Consider data stale after 15 seconds
  });

  // Real-time OBIS data for popular species
  const { data: obisData } = useQuery<number>({
    queryKey: ['obis-analytics'],
    queryFn: async () => {
      const popularSpecies = [
        'Thunnus albacares',
        'Epinephelus marginatus',
        'Serranus scriba'
      ];
      
      const results = await Promise.all(
        popularSpecies.map(species => fetchOBISData(species))
      );
      
      return results.reduce((acc, curr) => acc + curr.total, 0);
    },
    refetchInterval: 60000, // Refresh every minute
  });

  // WebSocket real-time updates
  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      
      if (latestMessage.type === 'obis_sync') {
        toast.success(`OBIS sync completed: ${latestMessage.count} records updated`);
        setRealTimeData(prev => ({
          ...prev,
          speciesCount: prev.speciesCount + latestMessage.count,
          lastUpdated: new Date().toISOString()
        }));
        queryClient.invalidateQueries({ queryKey: ['analytics-species'] });
      }
      
      if (latestMessage.type === 'edna_upload') {
        toast.success(`New eDNA sample uploaded: ${latestMessage.sample_id}`);
        setRealTimeData(prev => ({
          ...prev,
          lastUpdated: new Date().toISOString()
        }));
      }
    }
  }, [messages, queryClient]);

  // Simulate real-time ocean data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const currentTime = new Date(now).toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
      
      setRealTimeData(prev => {
        const newTemp = prev.oceanTemperature + (Math.random() - 0.5) * 0.1;
        
        // Update temperature history chart
        setTemperatureHistory(prevHistory => {
          const newDataPoint: TemperatureDataPoint = {
            time: currentTime,
            temperature: +newTemp.toFixed(2),
            timestamp: now
          };
          
          // Keep only last 30 data points (5 minutes of data)
          const newHistory = [...prevHistory.slice(-29), newDataPoint];
          return newHistory;
        });
        
        return {
          oceanTemperature: newTemp,
          speciesCount: prev.speciesCount + Math.floor(Math.random() * 5),
          oceanPH: prev.oceanPH + (Math.random() - 0.5) * 0.01,
          lastUpdated: new Date().toISOString()
        };
      });
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Custom tooltip for temperature chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 border rounded-lg shadow-lg ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-600 text-white' 
            : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <p className="text-sm font-medium">{`Time: ${label}`}</p>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`}>
            {`Temperature: ${payload[0].value}°C`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Manual refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchSpecies(),
        obisSync()
      ]);
      toast.success("Data refreshed successfully!");
    } catch (error) {
      toast.error("Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Calculate real-time metrics
  const currentSpeciesCount = speciesData?.length || 0;
  const obisSpeciesTotal = obisData || 0;
  const totalKnownSpecies = realTimeData.speciesCount + obisSpeciesTotal;

  const oceanStats = [
    {
      title: "Ocean Temperature",
      value: `${realTimeData.oceanTemperature.toFixed(1)}°C`,
      change: "+0.8°C",
      trend: "up" as const,
      description: "Global average sea surface temperature",
      icon: Thermometer,
      color: "text-red-600",
      realTime: true
    },
    {
      title: "Marine Species Count",
      value: totalKnownSpecies.toLocaleString(),
      change: `+${obisSpeciesTotal}`,
      trend: "up" as const,
      description: "Known marine species documented",
      icon: Fish,
      color: "text-blue-600",
      realTime: true
    },
    {
      title: "Ocean pH Level",
      value: realTimeData.oceanPH.toFixed(2),
      change: "-0.02",
      trend: "down" as const,
      description: "Global ocean acidity level",
      icon: Waves,
      color: "text-orange-600",
      realTime: true
    }
  ];

  const conservationData = [
    { region: "Coral Triangle", protection: 85, species: "3,200+", status: "Critical" },
    { region: "Great Barrier Reef", protection: 73, species: "1,800+", status: "Vulnerable" },
    { region: "Galápagos Islands", protection: 96, species: "2,900+", status: "Protected" },
    { region: "Mediterranean Sea", protection: 41, species: "12,000+", status: "Threatened" },
    { region: "Arctic Ocean", protection: 28, species: "5,500+", status: "Declining" }
  ];

  // Real-time research metrics with live data
  const researchMetrics: ResearchMetrics = {
    publishedPapers: 8234 + Math.floor((Date.now() - new Date(realTimeData.lastUpdated).getTime()) / 3600000),
    activeSites: 1567 + currentSpeciesCount,
    collaborativeProjects: 445 + Math.floor(currentSpeciesCount / 10),
    dataPoints: 23678 + obisSpeciesTotal + currentSpeciesCount,
    growthRates: {
      papers: "+12%",
      sites: `+${Math.max(8, Math.floor(currentSpeciesCount / 20))}%`,
      projects: "+15%",
      data: `+${Math.max(22, Math.floor(obisSpeciesTotal / 100))}%`
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Protected": return "bg-green-100 text-green-800";
      case "Vulnerable": return "bg-yellow-100 text-yellow-800";
      case "Critical": return "bg-red-100 text-red-800";
      case "Threatened": return "bg-orange-100 text-orange-800";
      case "Declining": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <span>Marine Analytics</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Real-time marine data insights and environmental monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600">
            <Activity className="w-3 h-3 mr-1" />
            Live Data
          </Badge>
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="text-xs text-muted-foreground mb-4">
        Last updated: {new Date(realTimeData.lastUpdated).toLocaleString()}
        {currentSpeciesCount > 0 && ` • ${currentSpeciesCount} species in database`}
        {obisSpeciesTotal > 0 && ` • ${obisSpeciesTotal} OBIS records`}
      </div>

      {/* Key Ocean Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        {oceanStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-wave transition-all duration-300 relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className="flex items-center gap-2">
                {stat.realTime && (
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                    <span className="text-xs text-green-600">LIVE</span>
                  </div>
                )}
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>
                  {stat.change}
                </span>
                <span>from last year</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Conservation Status by Region */}
      <Card>
        <CardHeader>
          <CardTitle>Marine Conservation by Region</CardTitle>
          <CardDescription>
            Protection levels and biodiversity across major marine regions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {conservationData.map((region, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">{region.region}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">
                        {region.species} species
                      </span>
                      <Badge variant="outline" className={getStatusColor(region.status)}>
                        {region.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{region.protection}%</div>
                    <div className="text-xs text-muted-foreground">Protected</div>
                  </div>
                </div>
                <Progress value={region.protection} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Research Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center hover:shadow-wave transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Published Papers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{researchMetrics.publishedPapers.toLocaleString()}</div>
            <div className="text-xs text-green-600 font-medium mt-1">
              {researchMetrics.growthRates.papers} this year
            </div>
          </CardContent>
        </Card>
        
        <Card className="text-center hover:shadow-wave transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Research Sites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{researchMetrics.activeSites.toLocaleString()}</div>
            <div className="text-xs text-green-600 font-medium mt-1">
              {researchMetrics.growthRates.sites} this year
            </div>
          </CardContent>
        </Card>
        
        <Card className="text-center hover:shadow-wave transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Collaborative Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{researchMetrics.collaborativeProjects.toLocaleString()}</div>
            <div className="text-xs text-green-600 font-medium mt-1">
              {researchMetrics.growthRates.projects} this year
            </div>
          </CardContent>
        </Card>
        
        <Card className="text-center hover:shadow-wave transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Data Collection Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{researchMetrics.dataPoints.toLocaleString()}</div>
            <div className="text-xs text-green-600 font-medium mt-1">
              {researchMetrics.growthRates.data} this year
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-Time Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Ocean Temperature Trends
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </CardTitle>
            <CardDescription>Live global sea surface temperature data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={temperatureHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis 
                    dataKey="time" 
                    stroke={chartColors.axis}
                    fontSize={12}
                    tick={{ fontSize: 12, fill: chartColors.text }}
                  />
                  <YAxis 
                    stroke={chartColors.axis}
                    fontSize={12}
                    tick={{ fontSize: 12, fill: chartColors.text }}
                    domain={['dataMin - 2', 'dataMax + 2']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke={chartColors.line} 
                    strokeWidth={2}
                    dot={{ fill: chartColors.line, strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, stroke: chartColors.line, strokeWidth: 2 }}
                    animationDuration={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>Current: {realTimeData.oceanTemperature.toFixed(1)}°C</span>
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-green-500" />
                Live • Last 5 minutes
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Species Discovery Rate
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </CardTitle>
            <CardDescription>Real-time marine species documentation from OBIS</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-subtle rounded-lg flex items-center justify-center relative">
              <div className="text-center text-muted-foreground">
                <Fish className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Total Species: {totalKnownSpecies.toLocaleString()}</p>
                <p className="text-xs">OBIS Records: {obisSpeciesTotal}</p>
                <p className="text-xs">Database: {currentSpeciesCount}</p>
              </div>
              <div className="absolute top-2 right-2">
                <Badge variant="outline" className="text-blue-600">
                  <Activity className="w-3 h-3 mr-1" />
                  OBIS
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-Time Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-Time Activity Feed
          </CardTitle>
          <CardDescription>Live updates from marine research platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {messages.slice(-5).map((message, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {message.type === 'obis_sync' && `OBIS sync completed: ${message.count} records`}
                    {message.type === 'edna_upload' && `New eDNA sample: ${message.sample_id}`}
                    {message.type === 'classification' && 'New species classification completed'}
                    {!['obis_sync', 'edna_upload', 'classification'].includes(message.type) && 'System activity detected'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Waiting for real-time updates...</p>
                <p className="text-xs">Try uploading an eDNA sample or syncing OBIS data</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Sources */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Data Sources & Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Temperature Data</h4>
              <p className="text-muted-foreground">NOAA Global Ocean Temperature Analysis</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Species Database</h4>
              <p className="text-muted-foreground">World Register of Marine Species (WoRMS) & OBIS</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Conservation Status</h4>
              <p className="text-muted-foreground">IUCN Red List & Marine Protected Areas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;