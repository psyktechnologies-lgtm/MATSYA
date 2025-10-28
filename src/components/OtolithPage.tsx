import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { 
  Shapes, 
  Ruler, 
  Camera, 
  BarChart3,
  Upload,
  Download,
  Eye,
  Settings,
  Zap
} from "lucide-react";

const OtolithPage = () => {
  const [morphometricParams, setMorphometricParams] = useState({
    length: [12.5],
    width: [8.2],
    perimeter: [34.7],
    area: [78.3]
  });

  const otolithSamples = [
    {
      id: "OT-001",
      species: "Thunnus albacares",
      age: "3 years", 
      length: 12.8,
      width: 8.5,
      shape: "Elliptical",
      region: "Arabian Sea"
    },
    {
      id: "OT-002", 
      species: "Epinephelus marginatus",
      age: "5 years",
      length: 15.2,
      width: 10.1,
      shape: "Oval",
      region: "Red Sea"
    },
    {
      id: "OT-003",
      species: "Serranus scriba", 
      age: "2 years",
      length: 8.9,
      width: 6.2,
      shape: "Round",
      region: "Indian Ocean"
    }
  ];

  const shapeAnalysisTools = [
    {
      name: "Fourier Analysis",
      description: "Quantitative shape analysis using Fourier descriptors",
      accuracy: "96.2%",
      icon: BarChart3
    },
    {
      name: "Elliptic Fourier",
      description: "Advanced shape characterization for complex otoliths",  
      accuracy: "94.8%",
      icon: Shapes
    },
    {
      name: "Wavelet Transform",
      description: "Multi-scale shape analysis for detailed morphometry",
      accuracy: "92.1%", 
      icon: Zap
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Otolith Morphometry</h1>
        <p className="text-muted-foreground">Interactive otolith shape analysis and morphometric visualization</p>
      </div>

      <Tabs defaultValue="analysis" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analysis">Shape Analysis</TabsTrigger>
          <TabsTrigger value="morphometry">Morphometry</TabsTrigger>
          <TabsTrigger value="samples">Sample Library</TabsTrigger>
          <TabsTrigger value="tools">Analysis Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Otolith Image</CardTitle>
                <CardDescription>Upload high-resolution otolith images for analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Camera className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Drop otolith images here (.jpg, .png, .tiff)
                  </p>
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Select Images
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analysis Preview</CardTitle>
                <CardDescription>Real-time shape analysis visualization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/20 rounded-lg p-6 text-center">
                  <div className="w-32 h-24 mx-auto bg-gradient-ocean rounded-full mb-4 opacity-50"></div>
                  <p className="text-sm text-muted-foreground">Upload an image to start analysis</p>
                  <div className="mt-4 space-y-2">
                    <Button size="sm" variant="outline" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      View Contour
                    </Button>
                    <Button size="sm" variant="outline" className="w-full">
                      <Shapes className="w-4 h-4 mr-2" />
                      Shape Descriptors
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {shapeAnalysisTools.map((tool, index) => (
              <Card key={index} className="hover:shadow-wave transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <tool.icon className="h-5 w-5 text-ocean" />
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                  </div>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">Accuracy</span>
                    <Badge variant="secondary">{tool.accuracy}</Badge>
                  </div>
                  <Button className="w-full" size="sm">
                    Apply Analysis
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="morphometry" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Morphometric Parameters</CardTitle>
              <CardDescription>Adjust parameters to explore morphometric relationships</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">Length (mm)</label>
                    <span className="text-sm text-muted-foreground">{morphometricParams.length[0]}</span>
                  </div>
                  <Slider 
                    value={morphometricParams.length}
                    onValueChange={(value) => setMorphometricParams({...morphometricParams, length: value})}
                    max={25}
                    min={5}
                    step={0.1}
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">Width (mm)</label>
                    <span className="text-sm text-muted-foreground">{morphometricParams.width[0]}</span>
                  </div>
                  <Slider
                    value={morphometricParams.width}
                    onValueChange={(value) => setMorphometricParams({...morphometricParams, width: value})}
                    max={15}
                    min={3}
                    step={0.1}
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">Perimeter (mm)</label>
                    <span className="text-sm text-muted-foreground">{morphometricParams.perimeter[0]}</span>
                  </div>
                  <Slider
                    value={morphometricParams.perimeter}
                    onValueChange={(value) => setMorphometricParams({...morphometricParams, perimeter: value})}
                    max={60}
                    min={15}
                    step={0.1}
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">Area (mm²)</label>
                    <span className="text-sm text-muted-foreground">{morphometricParams.area[0]}</span>
                  </div>
                  <Slider
                    value={morphometricParams.area}
                    onValueChange={(value) => setMorphometricParams({...morphometricParams, area: value})}
                    max={150}
                    min={20}
                    step={0.1}
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate Analysis
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Advanced Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="samples" className="space-y-4">
          <div className="grid gap-4">
            {otolithSamples.map((sample, index) => (
              <Card key={index} className="hover:shadow-wave transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{sample.id}</CardTitle>
                      <CardDescription className="italic">{sample.species}</CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{sample.age}</Badge>
                      <p className="text-sm text-muted-foreground mt-1">{sample.region}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Length</p>
                      <p className="font-semibold">{sample.length} mm</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Width</p>
                      <p className="font-semibold">{sample.width} mm</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Shape</p>
                      <p className="font-semibold">{sample.shape}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Region</p>
                      <p className="font-semibold">{sample.region}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View Image
                    </Button>
                    <Button size="sm" variant="outline">
                      <Ruler className="w-4 h-4 mr-2" />
                      Morphometry
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Batch Processing</CardTitle>
                <CardDescription>Process multiple otoliths simultaneously</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full mb-4">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Batch
                </Button>
                <div className="text-sm text-muted-foreground">
                  <p>• Support for ZIP archives</p>
                  <p>• Automatic file organization</p>
                  <p>• Parallel processing</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Export</CardTitle>
                <CardDescription>Export morphometric data in various formats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">CSV Export</Button>
                  <Button variant="outline" className="w-full">Excel Export</Button>
                  <Button variant="outline" className="w-full">JSON Export</Button>
                  <Button variant="outline" className="w-full">R Data Export</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OtolithPage;