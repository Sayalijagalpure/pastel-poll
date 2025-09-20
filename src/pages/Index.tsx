import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { HelpSidebar } from '@/components/help/HelpSidebar';
import { Vote, Shield, Users, BarChart3, ArrowRight, CheckCircle, Globe, Heart, GraduationCap, Scale, Cpu, Briefcase } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Remove automatic redirect - let users navigate freely

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center space-y-8">
        <div className="space-y-6">
          <div className="mx-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center">
            <Vote className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <div className="space-y-4">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Professional Voting Platform
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              SecureVote
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Anonymous, secure, and transparent voting platform with real-time results
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="px-8 py-6 text-lg"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="px-8 py-6 text-lg"
            >
              View Polls
            </Button>
          </div>
        </div>
      </section>

      {/* Genre Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Explore by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover polls organized by topics that matter most to our community
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/dashboard?genre=Environment%20%26%20Climate')}>
            <CardHeader>
              <Globe className="w-12 h-12 mx-auto text-green-600 mb-4" />
              <CardTitle className="text-lg">Environment & Climate</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3">
                Sustainability, climate change, environmental policies, and green initiatives
              </CardDescription>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="font-medium text-foreground">Featured Polls:</div>
                <div>• Most Effective Climate Action</div>
                <div>• Renewable Energy Priority</div>
                <div>• Sustainable Transportation</div>
                <div className="text-green-600 font-medium mt-2">3 Active Polls</div>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/dashboard?genre=Healthcare%20%26%20Wellness')}>
            <CardHeader>
              <Heart className="w-12 h-12 mx-auto text-red-600 mb-4" />
              <CardTitle className="text-lg">Healthcare & Wellness</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3">
                Health policies, mental health, wellness practices, and medical innovations
              </CardDescription>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="font-medium text-foreground">Featured Polls:</div>
                <div>• Mental Health in Workplace</div>
                <div>• Healthcare System Preference</div>
                <div>• Workplace Wellness Programs</div>
                <div className="text-red-600 font-medium mt-2">3 Active Polls</div>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/dashboard?genre=Education%20%26%20Learning')}>
            <CardHeader>
              <GraduationCap className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <CardTitle className="text-lg">Education & Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3">
                Educational policies, learning methods, skill development, and knowledge sharing
              </CardDescription>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="font-medium text-foreground">Featured Polls:</div>
                <div>• Most Important Skill for Future</div>
                <div>• Online vs Traditional Education</div>
                <div className="text-blue-600 font-medium mt-2">2 Active Polls</div>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/dashboard?genre=Social%20Issues%20%26%20Equality')}>
            <CardHeader>
              <Scale className="w-12 h-12 mx-auto text-purple-600 mb-4" />
              <CardTitle className="text-lg">Social Issues & Equality</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3">
                Social justice, equality, diversity, inclusion, and community development
              </CardDescription>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="font-medium text-foreground">Featured Polls:</div>
                <div>• Gender Pay Gap Solutions</div>
                <div>• Social Media Regulation</div>
                <div className="text-purple-600 font-medium mt-2">2 Active Polls</div>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/dashboard?genre=Technology%20%26%20Innovation')}>
            <CardHeader>
              <Cpu className="w-12 h-12 mx-auto text-cyan-600 mb-4" />
              <CardTitle className="text-lg">Technology & Innovation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3">
                Tech trends, digital transformation, AI, software development, and innovation
              </CardDescription>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="font-medium text-foreground">Featured Polls:</div>
                <div>• AI Impact on Jobs</div>
                <div>• Cryptocurrency Future</div>
                <div>• Best Programming Language</div>
                <div className="text-cyan-600 font-medium mt-2">4 Active Polls</div>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/dashboard?genre=Economy%20%26%20Work')}>
            <CardHeader>
              <Briefcase className="w-12 h-12 mx-auto text-orange-600 mb-4" />
              <CardTitle className="text-lg">Economy & Work</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3">
                Work culture, economic policies, career development, and workplace dynamics
              </CardDescription>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="font-medium text-foreground">Featured Polls:</div>
                <div>• Four-Day Work Week</div>
                <div>• Remote Work Productivity</div>
                <div>• Remote Work Preference</div>
                <div className="text-orange-600 font-medium mt-2">4 Active Polls</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose SecureVote?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Built with security, privacy, and user experience at its core
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardHeader>
              <Shield className="w-12 h-12 mx-auto text-primary" />
              <CardTitle className="text-lg">Secure & Anonymous</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your vote choices are completely anonymous while preventing duplicate voting
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="w-12 h-12 mx-auto text-primary" />
              <CardTitle className="text-lg">Real-time Results</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Watch results update instantly with beautiful charts and visualizations
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 mx-auto text-primary" />
              <CardTitle className="text-lg">Easy to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Intuitive interface makes voting simple for everyone in your community
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CheckCircle className="w-12 h-12 mx-auto text-primary" />
              <CardTitle className="text-lg">Transparent</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Open voting process with clear results and audit trails for trust
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it Works + Help */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* How it Works */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
              <p className="text-muted-foreground">
                Voting made simple in three easy steps
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Sign Up & Sign In</h3>
                  <p className="text-muted-foreground text-sm">
                    Create your secure account with just an email and password
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Browse & Vote</h3>
                  <p className="text-muted-foreground text-sm">
                    Explore active polls and cast your anonymous vote on topics that matter
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">View Results</h3>
                  <p className="text-muted-foreground text-sm">
                    See real-time results with interactive charts and detailed analytics
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Help Sidebar */}
          <div className="flex justify-center lg:justify-end">
            <HelpSidebar />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-accent/20 border-t">
        <div className="container mx-auto px-4 py-16 text-center space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Ready to Make Your Voice Heard?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Join thousands of users already participating in secure, anonymous voting
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="px-8 py-6 text-lg"
          >
            Start Voting Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
