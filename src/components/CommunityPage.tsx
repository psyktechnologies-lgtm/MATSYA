import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageCircle, 
  ThumbsUp, 
  Share2, 
  Calendar,
  MapPin,
  UserPlus,
  Bookmark
} from 'lucide-react';

const CommunityPage = () => {
  const [newPost, setNewPost] = useState('');

  const forumPosts = [
    {
      id: 1,
      author: "Dr. Marine Biologist",
      avatar: "MB",
      time: "2 hours ago",
      title: "New Species Discovery in Arabian Sea",
      content: "Excited to share our recent discovery of a new coral species in the Arabian Sea. The unique characteristics and implications for biodiversity are fascinating...",
      likes: 24,
      comments: 8,
      tags: ["Discovery", "Coral", "Arabian Sea"],
      category: "Research"
    },
    {
      id: 2,
      author: "Ocean Conservationist",
      avatar: "OC",
      time: "5 hours ago",
      title: "Plastic Pollution Impact Study Results",
      content: "Our 6-month study on plastic pollution in Indian coastal waters reveals concerning trends. Looking for collaboration opportunities...",
      likes: 18,
      comments: 12,
      tags: ["Pollution", "Conservation", "Research"],
      category: "Conservation"
    },
    {
      id: 3,
      author: "Marine Student",
      avatar: "MS",
      time: "1 day ago",
      title: "Seeking Internship Opportunities",
      content: "Final year marine biology student looking for internship opportunities in marine research institutes. Particularly interested in marine ecology...",
      likes: 7,
      comments: 15,
      tags: ["Internship", "Student", "Career"],
      category: "Career"
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Marine Conservation Webinar",
      date: "March 25, 2024",
      time: "2:00 PM IST",
      location: "Online",
      attendees: 156,
      type: "Webinar"
    },
    {
      id: 2,
      title: "Indian Ocean Research Conference",
      date: "April 10-12, 2024",
      time: "9:00 AM IST",
      location: "Mumbai, India",
      attendees: 324,
      type: "Conference"
    },
    {
      id: 3,
      title: "Coastal Cleanup Drive",
      date: "March 30, 2024",
      time: "6:00 AM IST",
      location: "Goa Beach",
      attendees: 89,
      type: "Community"
    }
  ];

  const experts = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      title: "Marine Ecologist",
      institution: "CMLRE",
      expertise: ["Marine Ecology", "Biodiversity", "Climate Change"],
      followers: 1240,
      posts: 156
    },
    {
      id: 2,
      name: "Prof. Rajesh Kumar",
      title: "Oceanographer",
      institution: "INCOIS",
      expertise: ["Physical Oceanography", "Data Analytics", "Remote Sensing"],
      followers: 980,
      posts: 203
    },
    {
      id: 3,
      name: "Dr. Sarah Johnson",
      title: "Marine Geneticist",
      institution: "University Marine Lab",
      expertise: ["eDNA", "Molecular Biology", "Species Identification"],
      followers: 756,
      posts: 89
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Marine Community</h1>
          <p className="text-muted-foreground mt-2">
            Connect with researchers, share knowledge, and collaborate on marine science projects
          </p>
        </div>
        <Button className="bg-gradient-ocean">
          <UserPlus className="h-4 w-4 mr-2" />
          Join Community
        </Button>
      </div>

      <Tabs defaultValue="forum" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="forum">Discussion Forum</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="experts">Expert Network</TabsTrigger>
        </TabsList>

        <TabsContent value="forum" className="space-y-6">
          {/* Create New Post */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Share with Community</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="What's on your mind? Share your research, ask questions, or start a discussion..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Badge variant="outline">Research</Badge>
                  <Badge variant="outline">Conservation</Badge>
                  <Badge variant="outline">Career</Badge>
                </div>
                <Button className="bg-gradient-wave">Post</Button>
              </div>
            </CardContent>
          </Card>

          {/* Forum Posts */}
          <div className="space-y-4">
            {forumPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarFallback className="bg-ocean text-ocean-foreground">
                        {post.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{post.author}</h3>
                        <Badge variant="secondary">{post.category}</Badge>
                        <span className="text-sm text-muted-foreground">{post.time}</span>
                      </div>
                      <h4 className="text-lg font-medium mt-2 text-primary">{post.title}</h4>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{post.content}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    <button className="flex items-center space-x-1 hover:text-accent">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-accent">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-accent">
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-accent">
                      <Bookmark className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{event.type}</Badge>
                    <Button variant="ghost" size="sm">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{event.date} at {event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{event.attendees} attending</span>
                  </div>
                  <Button className="w-full bg-gradient-coral">
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="experts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {experts.map((expert) => (
              <Card key={expert.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-ocean text-ocean-foreground text-lg">
                        {expert.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{expert.name}</h3>
                      <p className="text-sm text-muted-foreground">{expert.title}</p>
                      <p className="text-xs text-muted-foreground">{expert.institution}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {expert.expertise.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{expert.followers} followers</span>
                    <span>{expert.posts} posts</span>
                  </div>
                  <Button className="w-full" variant="outline">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Follow
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityPage;