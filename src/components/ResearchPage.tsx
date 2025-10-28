import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, FileText, Search, Calendar, User, ExternalLink } from 'lucide-react';

const ResearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const researchPapers = [
    {
      id: 1,
      title: "AI-Powered Marine Species Identification in Indian Ocean Waters",
      authors: ["Dr. Priya Sharma", "Dr. Rajesh Kumar"],
      journal: "Marine Biology Research",
      date: "2024-01-15",
      tags: ["AI/ML", "Species Identification", "Indian Ocean"],
      abstract: "This study presents a novel approach to automated marine species identification using advanced machine learning techniques...",
      doi: "10.1016/j.mbr.2024.01.015"
    },
    {
      id: 2,
      title: "Oceanographic Data Integration for Climate Change Assessment",
      authors: ["Dr. Anita Patel", "Dr. Vikram Singh"],
      journal: "Climate Science Today",
      date: "2024-02-10",
      tags: ["Climate Change", "Oceanography", "Data Integration"],
      abstract: "We present a comprehensive framework for integrating heterogeneous oceanographic datasets to assess climate change impacts...",
      doi: "10.1038/cst.2024.02.010"
    },
    {
      id: 3,
      title: "eDNA Metabarcoding Reveals Hidden Marine Biodiversity",
      authors: ["Dr. Sarah Johnson", "Dr. Michael Chen"],
      journal: "Environmental DNA",
      date: "2024-03-05",
      tags: ["eDNA", "Biodiversity", "Metabarcoding"],
      abstract: "Environmental DNA metabarcoding techniques reveal previously unknown marine biodiversity patterns in coastal ecosystems...",
      doi: "10.1002/edn3.2024.03.005"
    }
  ];

  const blogs = [
    {
      id: 1,
      title: "The Future of Marine Conservation Technology",
      author: "Dr. Marine Expert",
      date: "2024-03-10",
      category: "Conservation",
      readTime: "5 min read",
      excerpt: "Exploring how cutting-edge technology is revolutionizing marine conservation efforts worldwide...",
      image: "/api/placeholder/400/200"
    },
    {
      id: 2,
      title: "Understanding Ocean Acidification Through Data",
      author: "Prof. Ocean Science",
      date: "2024-03-08",
      category: "Research",
      readTime: "7 min read",
      excerpt: "Deep dive into how data analytics is helping us understand the complex process of ocean acidification...",
      image: "/api/placeholder/400/200"
    },
    {
      id: 3,
      title: "AI in Marine Biology: A Game Changer",
      author: "Dr. Tech Innovator",
      date: "2024-03-05",
      category: "Technology",
      readTime: "6 min read",
      excerpt: "How artificial intelligence is transforming marine biology research and species conservation efforts...",
      image: "/api/placeholder/400/200"
    }
  ];

  const filteredPapers = researchPapers.filter(paper =>
    paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Research & Publications</h1>
          <p className="text-muted-foreground mt-2">
            Explore latest research papers, publications, and expert insights in marine science
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search research papers, blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="papers" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="papers" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Research Papers</span>
          </TabsTrigger>
          <TabsTrigger value="blogs" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Expert Blogs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="papers" className="space-y-4">
          {filteredPapers.map((paper) => (
            <Card key={paper.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 hover:text-ocean cursor-pointer">
                      {paper.title}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{paper.authors.join(', ')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{paper.date}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{paper.abstract}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {paper.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">DOI: {paper.doi}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="blogs" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <Card key={blog.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{blog.category}</Badge>
                    <span className="text-xs text-muted-foreground">{blog.readTime}</span>
                  </div>
                  <CardTitle className="text-lg hover:text-ocean">{blog.title}</CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{blog.author}</span>
                    <span>•</span>
                    <span>{blog.date}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{blog.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResearchPage;