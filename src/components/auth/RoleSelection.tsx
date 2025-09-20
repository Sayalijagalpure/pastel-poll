import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Vote, Shield, Users, UserCheck, Settings, ArrowRight } from 'lucide-react';

export const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role: 'voter' | 'admin') => {
    navigate(`/auth?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Vote className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Welcome to SecureVote</h1>
            <p className="text-muted-foreground mt-2 text-lg">Choose how you want to participate</p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center max-w-md mx-auto">
          <div className="space-y-2">
            <Shield className="w-6 h-6 mx-auto text-primary" />
            <p className="text-xs text-muted-foreground">Secure</p>
          </div>
          <div className="space-y-2">
            <Users className="w-6 h-6 mx-auto text-primary" />
            <p className="text-xs text-muted-foreground">Anonymous</p>
          </div>
          <div className="space-y-2">
            <Vote className="w-6 h-6 mx-auto text-primary" />
            <p className="text-xs text-muted-foreground">Real-time</p>
          </div>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Voter Card */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-blue-200">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <UserCheck className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-blue-700">I'm a Voter</CardTitle>
              <CardDescription className="text-base">
                Participate in polls and make your voice heard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Vote on active polls</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">View real-time results</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Anonymous and secure voting</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Access to poll dashboard</span>
                </div>
              </div>
              <Button 
                onClick={() => handleRoleSelection('voter')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                Continue as Voter
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Admin Card */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-orange-200">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Settings className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-2xl text-orange-700">I'm an Admin</CardTitle>
              <CardDescription className="text-base">
                Create and manage polls for your community
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Create new polls</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Manage existing polls</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Delete polls when needed</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Full admin dashboard access</span>
                </div>
              </div>
              <Button 
                onClick={() => handleRoleSelection('admin')}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                size="lg"
              >
                Continue as Admin
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
          Your role determines your permissions within the platform. Voters can participate in polls, 
          while Admins can create and manage polls. You can always contact support to change your role later.
        </p>
      </div>
    </div>
  );
};
