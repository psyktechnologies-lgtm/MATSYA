import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  FileText, 
  Upload, 
  Users, 
  Calendar, 
  Star, 
  Download,
  Edit,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search
} from 'lucide-react';

const ResearchPublishingPage: React.FC = () => {
  const [manuscripts, setManuscripts] = useState([
    {
      id: 1,
      title: "Impact of Climate Change on Coral Reef Biodiversity in the Pacific",
      authors: ["Dr. Sarah Johnson", "Dr. Michael Chen", "Dr. Emily Rodriguez"],
      status: "Under Review",
      submissionDate: "2024-01-15",
      journal: "Marine Biology International",
      abstract: "This study examines the effects of rising ocean temperatures on coral reef ecosystems...",
      keywords: ["coral reefs", "climate change", "biodiversity", "pacific ocean"],
      stage: "peer-review"
    },
    {
      id: 2,
      title: "Novel eDNA Techniques for Deep Sea Species Detection",
      authors: ["Dr. Alex Thompson", "Dr. Lisa Park"],
      status: "Draft",
      submissionDate: "2024-02-01",
      journal: "",
      abstract: "Environmental DNA sampling techniques have revolutionized marine species detection...",
      keywords: ["eDNA", "deep sea", "species detection", "molecular techniques"],
      stage: "draft"
    }
  ]);

  const [collaborators, setCollaborators] = useState([
    { id: 1, name: "Dr. Sarah Johnson", email: "s.johnson@marine.edu", role: "Lead Author", status: "active" },
    { id: 2, name: "Dr. Michael Chen", email: "m.chen@ocean.org", role: "Co-Author", status: "active" },
    { id: 3, name: "Dr. Emily Rodriguez", email: "e.rodriguez@research.gov", role: "Reviewer", status: "invited" }
  ]);

  const handleNewManuscript = () => {
    // Placeholder for new manuscript creation
    console.log("Creating new manuscript...");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Published': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'draft': return <Edit className="h-4 w-4" />;
      case 'peer-review': return <Clock className="h-4 w-4" />;
      case 'published': return <CheckCircle className="h-4 w-4" />;
      case 'revision': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <FileText className="h-8 w-8 mr-3 text-blue-600" />
                Research Publishing Hub
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Collaborate, submit, and publish your marine research
              </p>
            </div>
            <Button onClick={handleNewManuscript} className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              New Manuscript
            </Button>
          </div>
        </div>

        <Tabs defaultValue="manuscripts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="manuscripts">My Manuscripts</TabsTrigger>
            <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
            <TabsTrigger value="submit">Submit Paper</TabsTrigger>
            <TabsTrigger value="published">Published Works</TabsTrigger>
          </TabsList>

          {/* Manuscripts Tab */}
          <TabsContent value="manuscripts" className="space-y-6">
            <div className="grid gap-6">
              {manuscripts.map((manuscript) => (
                <Card key={manuscript.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-xl">{manuscript.title}</CardTitle>
                        <CardDescription>
                          {manuscript.authors.join(", ")}
                        </CardDescription>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {manuscript.submissionDate}
                          </span>
                          {manuscript.journal && (
                            <span>Journal: {manuscript.journal}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={getStatusColor(manuscript.status)}>
                          {getStageIcon(manuscript.stage)}
                          <span className="ml-1">{manuscript.status}</span>
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-300">
                        {manuscript.abstract}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {manuscript.keywords.map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center space-x-3 pt-4">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Users className="h-4 w-4 mr-2" />
                          Collaborators
                        </Button>
                        {manuscript.status === "Draft" && (
                          <Button size="sm">
                            <Send className="h-4 w-4 mr-2" />
                            Submit
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Collaboration Tab */}
          <TabsContent value="collaboration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Collaborations</CardTitle>
                <CardDescription>
                  Manage your research collaborators and invitations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {collaborators.map((collaborator) => (
                    <div key={collaborator.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-medium">{collaborator.name}</h4>
                        <p className="text-sm text-gray-500">{collaborator.email}</p>
                        <Badge variant="outline" className="text-xs">
                          {collaborator.role}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={collaborator.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {collaborator.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submit Paper Tab */}
          <TabsContent value="submit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Submit New Research Paper</CardTitle>
                <CardDescription>
                  Upload your manuscript and metadata for submission
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Paper Title</Label>
                      <Input id="title" placeholder="Enter your paper title..." />
                    </div>
                    <div>
                      <Label htmlFor="authors">Authors</Label>
                      <Input id="authors" placeholder="Author names separated by commas..." />
                    </div>
                    <div>
                      <Label htmlFor="journal">Target Journal</Label>
                      <Input id="journal" placeholder="Select target journal..." />
                    </div>
                    <div>
                      <Label htmlFor="keywords">Keywords</Label>
                      <Input id="keywords" placeholder="Keywords separated by commas..." />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="abstract">Abstract</Label>
                      <Textarea 
                        id="abstract" 
                        placeholder="Enter your paper abstract..." 
                        className="min-h-[150px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="manuscript">Upload Manuscript</Label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          Drag and drop your manuscript file here, or click to browse
                        </p>
                        <Button variant="outline" className="mt-2">
                          Browse Files
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button variant="outline">Save as Draft</Button>
                  <Button>Submit for Review</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Published Works Tab */}
          <TabsContent value="published" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Published Research</CardTitle>
                    <CardDescription>
                      Your published papers and citation metrics
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input placeholder="Search publications..." className="w-64" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No Published Papers Yet</h3>
                  <p>Your published research papers will appear here once they are accepted and published.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResearchPublishingPage;