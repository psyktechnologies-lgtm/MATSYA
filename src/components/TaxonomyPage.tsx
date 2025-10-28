import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  Search, 
  Filter, 
  TreePine, 
  Camera, 
  Microscope, 
  Dna,
  Star,
  Book,
  Globe,
  Upload,
  Database,
  CheckCircle,
  FileText,
  Loader2
} from "lucide-react";

const TaxonomyPage = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [taxonomyDatasets, setTaxonomyDatasets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch taxonomy datasets from our enhanced backend
  useEffect(() => {
    fetchTaxonomyDatasets();
  }, []);

  const fetchTaxonomyDatasets = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/taxonomy/datasets');
      if (response.ok) {
        const datasets = await response.json();
        setTaxonomyDatasets(datasets);
      }
    } catch (error) {
      console.error('Failed to fetch taxonomy datasets:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('dataset_name', `Uploaded Dataset ${Date.now()}`);
      formData.append('data_format', file.name.split('.').pop() || 'csv');
      formData.append('source', 'User Upload');
      formData.append('description', 'User uploaded taxonomy dataset');

      const response = await fetch('http://127.0.0.1:8000/api/taxonomy/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Upload Successful",
          description: `Taxonomy dataset uploaded with ${result.record_count || 0} records`,
        });
        
        // Refresh datasets
        fetchTaxonomyDatasets();
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your taxonomy data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const validateTaxonomyData = async (file: File) => {
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://127.0.0.1:8000/api/taxonomy/validate', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Validation Complete",
          description: `Darwin Core validation completed with score: ${result.validation_result?.validation_score || 0}%`,
        });
        
        return result;
      }
    } catch (error) {
      toast({
        title: "Validation Failed",
        description: "Error validating taxonomy data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const taxonomicGroups = [
    { kingdom: "Animalia", phylum: "Chordata", class: "Actinopterygii", count: 32567 },
    { kingdom: "Animalia", phylum: "Mollusca", class: "Gastropoda", count: 18432 },
    { kingdom: "Animalia", phylum: "Arthropoda", class: "Malacostraca", count: 14892 },
    { kingdom: "Plantae", phylum: "Ochrophyta", class: "Phaeophyceae", count: 8765 },
  ];

  const recentIdentifications = [
    {
      species: "Thunnus albacares",
      commonName: "Yellowfin Tuna",
      confidence: 97.8,
      method: "AI Classification",
      location: "Indian Ocean"
    },
    {
      species: "Sepioteuthis lessoniana",
      commonName: "Bigfin Reef Squid", 
      confidence: 94.2,
      method: "Morphological",
      location: "Arabian Sea"
    },
    {
      species: "Epinephelus marginatus",
      commonName: "Dusky Grouper",
      confidence: 89.1,
      method: "DNA Barcoding",
      location: "Red Sea"
    }
  ];

  const classificationTools = [
    {
      name: "AI Visual Classifier",
      description: "Upload images for automated species identification",
      icon: Camera,
      accuracy: "94.5%"
    },
    {
      name: "Morphometric Analysis", 
      description: "Detailed morphological measurements and classification",
      icon: Microscope,
      accuracy: "91.2%"
    },
    {
      name: "DNA Barcoding",
      description: "Molecular identification using genetic sequences",
      icon: Dna,
      accuracy: "99.1%"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Taxonomy & Classification</h1>
        <p className="text-muted-foreground">Comprehensive taxonomic database and species identification tools</p>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search species, taxonomy, or common names..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Button>
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="browse" className="space-y-4">
        <TabsList>
          <TabsTrigger value="browse">Browse Taxonomy</TabsTrigger>
          <TabsTrigger value="identify">Species Identification</TabsTrigger>
          <TabsTrigger value="upload">Upload Data</TabsTrigger>
          <TabsTrigger value="recent">Recent Classifications</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <div className="mb-6">
            <Card className={
              theme === 'ocean' 
                ? 'bg-gradient-to-r from-white/25 to-blue-500/30 border-white/20' 
                : 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-800'
            }>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className={`h-5 w-5 ${
                    theme === 'ocean' 
                      ? 'text-cyan-300' 
                      : 'text-blue-600 dark:text-blue-400'
                  }`} />
                  Enhanced Taxonomy Backend
                </CardTitle>
                <CardDescription>
                  Powered by advanced Darwin Core validation, phylogenetic analysis, and API integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-ocean">6</div>
                    <p className="text-sm text-gray-600">Service Classes</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-ocean">30+</div>
                    <p className="text-sm text-gray-600">Analysis Methods</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-ocean">40+</div>
                    <p className="text-sm text-gray-600">Validation Rules</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-ocean">99%</div>
                    <p className="text-sm text-gray-600">API Accuracy</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Badge variant="secondary">Darwin Core Compliant</Badge>
                  <Badge variant="secondary">GBIF Integration</Badge>
                  <Badge variant="secondary">FishBase API</Badge>
                  <Badge variant="secondary">ML Enhanced</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4">
            {taxonomicGroups.map((group, index) => (
              <Card key={index} className="hover:shadow-wave transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TreePine className="h-5 w-5 text-ocean" />
                      <CardTitle className="text-lg">
                        {group.class}
                      </CardTitle>
                    </div>
                    <Badge variant="secondary">{group.count.toLocaleString()} species</Badge>
                  </div>
                  <CardDescription>
                    {group.kingdom} → {group.phylum} → {group.class}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Globe className="w-4 h-4 mr-2" />
                      View Distribution
                    </Button>
                    <Button size="sm" variant="outline">
                      <Book className="w-4 h-4 mr-2" />
                      Browse Species
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="identify" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {classificationTools.map((tool, index) => (
              <Card key={index} className="hover:shadow-wave transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <tool.icon className="h-6 w-6 text-ocean" />
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                  </div>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Accuracy</span>
                    <Badge variant="secondary">{tool.accuracy}</Badge>
                  </div>
                  <Button className="w-full">
                    Start Identification
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Upload</CardTitle>
              <CardDescription>Upload specimen images for automated identification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Camera className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Drop specimen images here for AI classification
                </p>
                <Button>Upload Images</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-ocean" />
                  Upload Taxonomy Database
                </CardTitle>
                <CardDescription>
                  Upload taxonomic datasets in various formats (Darwin Core, CSV, Excel, JSON)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Dataset Name</label>
                  <Input placeholder="e.g., WoRMS Marine Taxa 2024" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Format</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="darwin_core">Darwin Core</option>
                    <option value="csv">CSV</option>
                    <option value="tsv">TSV</option>
                    <option value="json">JSON</option>
                    <option value="excel">Excel (.xlsx)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Source</label>
                  <Input placeholder="e.g., FishBase, WoRMS, GBIF" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea 
                    className="w-full p-2 border rounded-md h-20 resize-none"
                    placeholder="Brief description of the taxonomic dataset..."
                  />
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drop your taxonomy file here or click to browse
                  </p>
                  <p className="text-xs text-gray-500">
                    Supported: .csv, .tsv, .xlsx, .json, .dwc, .xml (max 500MB)
                  </p>
                  <input
                    type="file"
                    id="taxonomy-file-upload"
                    className="hidden"
                    accept=".csv,.tsv,.xlsx,.json,.dwc,.xml"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                  />
                  <Button 
                    className="mt-3"
                    onClick={() => document.getElementById('taxonomy-file-upload')?.click()}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      'Select File'
                    )}
                  </Button>
                  {uploadProgress > 0 && (
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          theme === 'ocean' 
                            ? 'bg-cyan-400' 
                            : 'bg-blue-600 dark:bg-blue-400'
                        }`} 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>
                
                <Button 
                  className={`w-full ${
                    theme === 'ocean' 
                      ? 'bg-cyan-500 hover:bg-cyan-600 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600'
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Upload Taxonomy Data'
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    const input = document.getElementById('taxonomy-file-upload') as HTMLInputElement;
                    if (input?.files?.[0]) {
                      validateTaxonomyData(input.files[0]);
                    } else {
                      toast({
                        title: "No File Selected",
                        description: "Please select a file first",
                        variant: "destructive",
                      });
                    }
                  }}
                  disabled={isLoading}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Validate Darwin Core Data
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-ocean" />
                  Supported Formats
                </CardTitle>
                <CardDescription>
                  Compatible data formats for taxonomy uploads
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Darwin Core</p>
                      <p className="text-sm text-gray-600">Standard biodiversity data format</p>
                    </div>
                    <Badge variant="secondary">Recommended</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">CSV/TSV</p>
                      <p className="text-sm text-gray-600">Comma or tab separated values</p>
                    </div>
                    <Badge variant="outline">Popular</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Excel (.xlsx)</p>
                      <p className="text-sm text-gray-600">Microsoft Excel spreadsheets</p>
                    </div>
                    <Badge variant="outline">Common</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">JSON</p>
                      <p className="text-sm text-gray-600">Structured data format</p>
                    </div>
                    <Badge variant="outline">API Ready</Badge>
                  </div>
                </div>
                
                <div className={`mt-4 p-4 rounded-lg ${
                  theme === 'ocean' 
                    ? 'bg-white/25 border border-white/20' 
                    : 'bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800'
                }`}>
                  <p className="text-sm text-blue-800 font-medium">Required Fields:</p>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• Scientific Name</li>
                    <li>• Kingdom, Phylum, Class</li>
                    <li>• Family, Genus, Species</li>
                    <li>• Conservation Status (optional)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Uploads</CardTitle>
                <CardDescription>Recently uploaded taxonomy datasets from backend</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {taxonomyDatasets.length > 0 ? (
                    taxonomyDatasets.map((dataset: any, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            theme === 'ocean' 
                              ? 'bg-white/30' 
                              : 'bg-green-100 dark:bg-green-900/30'
                          }`}>
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{dataset.dataset_name}</p>
                            <p className="text-sm text-gray-600">
                              {dataset.record_count?.toLocaleString()} records • {dataset.data_format}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">{dataset.upload_date}</p>
                          <Badge variant={dataset.status === 'active' ? 'default' : 'secondary'}>
                            {dataset.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <Database className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No taxonomy datasets uploaded yet</p>
                      <p className="text-sm">Upload your first dataset to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          {recentIdentifications.map((identification, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg italic">{identification.species}</CardTitle>
                    <CardDescription>{identification.commonName}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">{identification.confidence}%</span>
                    </div>
                    <Badge variant="outline">{identification.method}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Location: {identification.location}</span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm" variant="outline">Export</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Species</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-ocean">74,656</div>
                <p className="text-sm text-muted-foreground">Across all marine taxa</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Classifications Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">1,247</div>
                <p className="text-sm text-muted-foreground">+15% from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Average Confidence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">92.3%</div>
                <p className="text-sm text-muted-foreground">AI classification accuracy</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxonomyPage;