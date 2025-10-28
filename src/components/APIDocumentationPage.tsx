import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Code, 
  Book, 
  Download, 
  ExternalLink,
  Key,
  Terminal,
  FileText,
  Globe,
  Users,
  Shield
} from "lucide-react";

const APIDocumentationPage = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState("");

  const apiEndpoints = [
    {
      method: "GET",
      endpoint: "/api/v1/species",
      description: "Retrieve marine species data",
      params: ["limit", "offset", "taxonomy", "region"],
      response: "Array of species objects"
    },
    {
      method: "POST", 
      endpoint: "/api/v1/data/ingest",
      description: "Upload new dataset for processing",
      params: ["file", "format", "metadata"],
      response: "Upload status and job ID"
    },
    {
      method: "GET",
      endpoint: "/api/v1/oceanographic",
      description: "Access oceanographic parameters",
      params: ["lat", "lon", "depth", "date_range"],
      response: "Oceanographic measurements"
    },
    {
      method: "GET",
      endpoint: "/api/v1/edna/sequences",
      description: "Query eDNA sequence database", 
      params: ["sequence", "species", "region"],
      response: "Matching sequences and metadata"
    }
  ];

  const sdkExamples = [
    {
      language: "Python",
      code: `import matsya_sdk

# Initialize client
client = matsya_sdk.Client(api_key="your_api_key")

# Query species data
species = client.species.get(
    taxonomy="Actinopterygii",
    region="Arabian Sea"
)

# Upload eDNA data
upload = client.data.upload(
    file_path="sequences.fasta",
    data_type="edna"
)`
    },
    {
      language: "JavaScript",
      code: `const { MatsyaClient } = require('matsya-sdk');

// Initialize client  
const client = new MatsyaClient({
  apiKey: 'your_api_key'
});

// Query oceanographic data
const oceanData = await client.oceanographic.get({
  lat: 15.5,
  lon: 68.7,
  dateRange: '2024-01-01,2024-01-31'
});`
    },
    {
      language: "R",
      code: `library(matsya)

# Set API key
matsya_auth("your_api_key")

# Get species diversity data
diversity <- get_species_diversity(
  region = "Indian Ocean",
  depth_range = c(0, 200)
)

# Correlation analysis
correlations <- analyze_correlations(
  variables = c("temperature", "species_richness"),
  spatial_scale = "regional"
)`
    }
  ];

  const userManuals = [
    {
      title: "Getting Started Guide",
      description: "Complete introduction to MATSYA platform",
      pages: 45,
      format: "PDF",
      updated: "2024-01-15"
    },
    {
      title: "Data Ingestion Manual",
      description: "How to upload and process marine datasets",
      pages: 28,
      format: "PDF", 
      updated: "2024-01-12"
    },
    {
      title: "API Reference",
      description: "Complete API documentation with examples",
      pages: 67,
      format: "HTML",
      updated: "2024-01-20"
    },
    {
      title: "Analysis Workflows",
      description: "Step-by-step analysis procedures",
      pages: 34,
      format: "PDF",
      updated: "2024-01-18"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">API Documentation & User Manuals</h1>
        <p className="text-muted-foreground">Comprehensive documentation for developers and researchers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Endpoints</CardTitle>
            <Code className="h-4 w-4 text-ocean" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">REST API endpoints</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SDK Languages</CardTitle>
            <Terminal className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Python, R, JavaScript, Java, MATLAB</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentation Pages</CardTitle>
            <Book className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">174</div>
            <p className="text-xs text-muted-foreground">Updated daily</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="api" className="space-y-4">
        <TabsList>
          <TabsTrigger value="api">API Reference</TabsTrigger>
          <TabsTrigger value="sdk">SDK Examples</TabsTrigger>
          <TabsTrigger value="manuals">User Manuals</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
        </TabsList>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoint Explorer</CardTitle>
              <CardDescription>Browse and test API endpoints interactively</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Input placeholder="Search endpoints..." className="flex-1" />
                <Button>
                  <Key className="w-4 h-4 mr-2" />
                  Test API
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {apiEndpoints.map((endpoint, index) => (
              <Card key={index} className="hover:shadow-wave transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant={
                        endpoint.method === 'GET' ? 'secondary' :
                        endpoint.method === 'POST' ? 'default' : 'outline'
                      }>
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {endpoint.endpoint}
                      </code>
                    </div>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Try It
                    </Button>
                  </div>
                  <CardDescription>{endpoint.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Parameters:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {endpoint.params.map((param, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {param}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Response:</p>
                      <p className="text-sm text-muted-foreground">{endpoint.response}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sdk" className="space-y-4">
          {sdkExamples.map((example, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Terminal className="h-5 w-5 text-ocean" />
                    <span>{example.language} SDK</span>
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Install
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Docs
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted/20 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{example.code}</code>
                </pre>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader>
              <CardTitle>Installation Instructions</CardTitle>
              <CardDescription>Quick setup for different programming languages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium mb-2">Python:</p>
                <code className="bg-muted/20 px-3 py-1 rounded text-sm">pip install matsya-sdk</code>
              </div>
              <div>
                <p className="font-medium mb-2">R:</p>
                <code className="bg-muted/20 px-3 py-1 rounded text-sm">install.packages("matsya")</code>
              </div>
              <div>
                <p className="font-medium mb-2">JavaScript/Node.js:</p>
                <code className="bg-muted/20 px-3 py-1 rounded text-sm">npm install matsya-sdk</code>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manuals" className="space-y-4">
          <div className="grid gap-4">
            {userManuals.map((manual, index) => (
              <Card key={index} className="hover:shadow-wave transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{manual.title}</CardTitle>
                      <CardDescription>{manual.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{manual.format}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <p>{manual.pages} pages • Updated {manual.updated}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        <Globe className="w-4 h-4 mr-2" />
                        View Online
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Video Tutorials</CardTitle>
              <CardDescription>Step-by-step video guides for common tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-16 flex flex-col">
                  <FileText className="w-6 h-6 mb-2" />
                  <span>Platform Overview</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col">
                  <Code className="w-6 h-6 mb-2" />
                  <span>API Integration</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col">
                  <Users className="w-6 h-6 mb-2" />
                  <span>Collaboration Tools</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col">
                  <Shield className="w-6 h-6 mb-2" />
                  <span>Data Security</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authentication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Authentication</CardTitle>
              <CardDescription>Secure access to MATSYA APIs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium mb-2">API Key Authentication:</p>
                <pre className="bg-muted/20 p-3 rounded text-sm">
{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: application/json" \\
     https://api.matsya.org/v1/species`}
                </pre>
              </div>

              <div>
                <p className="font-medium mb-2">Rate Limits:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Free tier: 1,000 requests/hour</li>
                  <li>• Research tier: 10,000 requests/hour</li> 
                  <li>• Enterprise: Unlimited</li>
                </ul>
              </div>

              <Button className="w-full">
                <Key className="w-4 h-4 mr-2" />
                Generate New API Key
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Access Levels</CardTitle>
              <CardDescription>Different permission levels for various user types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Public Access</span>
                    <Badge variant="secondary">Free</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Basic species data, limited oceanographic parameters
                  </p>
                </div>

                <div className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Research Access</span>
                    <Badge variant="default">Verified</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Full dataset access, advanced analysis tools, data upload
                  </p>
                </div>

                <div className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Enterprise Access</span>
                    <Badge variant="outline">Premium</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Priority support, custom integrations, dedicated resources
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default APIDocumentationPage;