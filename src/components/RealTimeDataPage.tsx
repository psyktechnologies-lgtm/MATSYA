import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import MarineMap from './MarineMap';
import { TrendingUp, Activity, MapPin, Thermometer, Waves, Fish, Satellite, RefreshCw } from "lucide-react";

const RealTimeDataPage = () => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const liveStations = [
    {
      id: "GBR-001",
      name: "Great Barrier Reef Station",
      location: "Queensland, Australia",
      status: "Active",
      temperature: 26.8,
      ph: 8.12,
      salinity: 35.2,
      depth: 12,
      species_count: 47
    },
    {
      id: "ARC-003", 
      name: "Arctic Ocean Monitor",
      location: "Svalbard, Norway",
      status: "Active",
      temperature: -1.2,
      ph: 8.05,
      salinity: 34.8,
      depth: 45,
      species_count: 23
    },
    {
      id: "PAC-007",
      name: "Pacific Deep Station",
      location: "Mariana Trench",
      status: "Limited",
      temperature: 2.1,
      ph: 7.98,
      salinity: 34.6,
      depth: 2340,
      species_count: 12
    },
    {
      id: "ATL-012",
      name: "Atlantic Current Monitor",
      location: "North Atlantic",
      status: "Active",
      temperature: 15.6,
      ph: 8.08,
      salinity: 35.0,
      depth: 78,
      species_count: 89
    }
  ];

  const globalMetrics = [
    {
      title: "Global Ocean Temperature",
      value: "15.23°C",
      change: "+0.02°C",
      trend: "up",
      description: "Last 24 hours average",
      icon: Thermometer
    },
    {
      title: "Active Research Stations", 
      value: "1,247",
      change: "+3",
      trend: "up",
      description: "Worldwide monitoring",
      icon: Satellite
    },
    {
      title: "Species Observations",
      value: "23,456",
      change: "+1,234",
      trend: "up", 
      description: "Recorded today",
      icon: Fish
    },
    {
      title: "Wave Height Average",
      value: "2.8m",
      change: "-0.2m",
      trend: "down",
      description: "Global significant wave height",
      icon: Waves
    }
  ];

  const recentEvents = [
    {
      time: "2 minutes ago",
      event: "Whale migration detected",
      location: "Pacific Ocean",
      severity: "info"
    },
    {
      time: "15 minutes ago", 
      event: "Temperature spike recorded",
      location: "Coral Triangle",
      severity: "warning"
    },
    {
      time: "1 hour ago",
      event: "New species observation",
      location: "Antarctic Waters",
      severity: "success"
    },
    {
      time: "3 hours ago",
      event: "Storm system detected",
      location: "North Atlantic",
      severity: "warning"
    }
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Limited": return "bg-yellow-100 text-yellow-800";
      case "Offline": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "success": return "border-l-green-500 bg-green-50";
      case "warning": return "border-l-yellow-500 bg-yellow-50";
      case "error": return "border-l-red-500 bg-red-50";
      default: return "border-l-blue-500 bg-blue-50";
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-ocean" />
            <span>Real-time Marine Data</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Live monitoring stations and ocean metrics from around the world
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Last updated</p>
            <p className="text-sm font-medium">{lastUpdate.toLocaleTimeString()}</p>
          </div>
          <Button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Global Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {globalMetrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-wave transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-5 w-5 text-ocean" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center space-x-2 text-xs">
                <Activity className={`h-3 w-3 ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                <span className={metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {metric.change}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Real-time Marine Data Map */}
      <MarineMap className="h-[600px]" />

      {/* Live Monitoring Stations */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-ocean" />
              <span>Live Monitoring Stations</span>
            </CardTitle>
            <CardDescription>
              Real-time data from ocean monitoring stations worldwide
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {liveStations.map((station) => (
                <div key={station.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{station.name}</h3>
                      <p className="text-sm text-muted-foreground">{station.location}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(station.status)}>
                        {station.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Activity className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Temperature</p>
                      <p className="font-medium">{station.temperature}°C</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">pH Level</p>
                      <p className="font-medium">{station.ph}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Salinity</p>
                      <p className="font-medium">{station.salinity} ppt</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Depth</p>
                      <p className="font-medium">{station.depth}m</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Species</p>
                      <p className="font-medium">{station.species_count} observed</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>
              Latest observations and alerts from monitoring stations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEvents.map((event, index) => (
                <div key={index} className={`p-3 border-l-4 rounded ${getSeverityColor(event.severity)}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{event.event}</p>
                    <span className="text-xs text-muted-foreground">{event.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{event.location}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Quality</CardTitle>
            <CardDescription>
              Real-time monitoring system health and data reliability
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Satellite Coverage</span>
                <span>94%</span>
              </div>
              <Progress value={94} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Station Connectivity</span>
                <span>87%</span>
              </div>
              <Progress value={87} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Data Accuracy</span>
                <span>98%</span>
              </div>
              <Progress value={98} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>System Uptime</span>
                <span>99.2%</span>
              </div>
              <Progress value={99.2} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Premium Features Notice */}
      <Card className="bg-gradient-coral text-white">
        <CardHeader>
          <CardTitle>Advanced Real-time Features</CardTitle>
          <CardDescription className="text-orange-100">
            Available for verified researchers and policy makers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2" />
              <p className="font-medium">Predictive Analytics</p>
            </div>
            <div className="text-center">
              <MapPin className="h-8 w-8 mx-auto mb-2" />
              <p className="font-medium">Custom Monitoring Zones</p>
            </div>
            <div className="text-center">
              <Activity className="h-8 w-8 mx-auto mb-2" />
              <p className="font-medium">Historical Data Export</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeDataPage;