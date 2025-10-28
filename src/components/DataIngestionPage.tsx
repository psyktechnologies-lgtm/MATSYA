import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Database, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Workflow,
  Settings,
  Monitor
} from "lucide-react";

const DataIngestionPage = () => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const pipelineStatus = [
    { name: "Oceanographic Data", status: "active", progress: 85, records: "1.2M" },
    { name: "Taxonomy Database", status: "completed", progress: 100, records: "850K" },
    { name: "Otolith Images", status: "processing", progress: 45, records: "340K" },
    { name: "eDNA Sequences", status: "queued", progress: 0, records: "0" },
  ];

  const dataFormats = [
    { format: "Darwin Core", description: "Biodiversity data standard", supported: true },
    { format: "OBIS Schema", description: "Ocean biogeographic information", supported: true },
    { format: "NetCDF", description: "Oceanographic data format", supported: true },
    { format: "FASTA/FASTQ", description: "Molecular sequence data", supported: true },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Data Ingestion Pipeline</h1>
        <p className="text-muted-foreground">Automated data ingestion, standardization, and metadata tagging</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pipelines">Active Pipelines</TabsTrigger>
          <TabsTrigger value="formats">Data Formats</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Records Ingested</CardTitle>
                <Database className="h-4 w-4 text-ocean" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.39M</div>
                <p className="text-xs text-muted-foreground">+12.5% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Pipelines</CardTitle>
                <Workflow className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">4 processing, 4 queued</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">97.8%</div>
                <p className="text-xs text-muted-foreground">Data validation success</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Upload</CardTitle>
              <CardDescription>Upload new datasets for automated processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Drop files here or click to browse
                </p>
                <Button>Select Files</Button>
              </div>
              {uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipelines" className="space-y-4">
          {pipelineStatus.map((pipeline, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{pipeline.name}</CardTitle>
                  <Badge variant={
                    pipeline.status === 'active' ? 'default' : 
                    pipeline.status === 'completed' ? 'secondary' : 
                    pipeline.status === 'processing' ? 'destructive' : 'outline'
                  }>
                    {pipeline.status}
                  </Badge>
                </div>
                <CardDescription>{pipeline.records} records processed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{pipeline.progress}%</span>
                  </div>
                  <Progress value={pipeline.progress} />
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button size="sm" variant="outline">
                    <Monitor className="w-4 h-4 mr-2" />
                    Monitor
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="formats" className="space-y-4">
          <div className="grid gap-4">
            {dataFormats.map((format, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{format.format}</CardTitle>
                      <CardDescription>{format.description}</CardDescription>
                    </div>
                    <Badge variant={format.supported ? "secondary" : "outline"}>
                      {format.supported ? "Supported" : "Planned"}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Real-time monitoring of ingestion pipelines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">API Status</p>
                  <p className="text-xs text-muted-foreground">Operational</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Database</p>
                  <p className="text-xs text-muted-foreground">Healthy</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Queue</p>
                  <p className="text-xs text-muted-foreground">4 pending</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Errors</p>
                  <p className="text-xs text-muted-foreground">2 today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataIngestionPage;