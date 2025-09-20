import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth, UserRole } from '@/hooks/useAuth';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Vote, Shield, Users, UserCheck, Settings } from 'lucide-react';

export const AuthPage = () => {
  const { user, loading: authLoading, signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const selectedRole = (searchParams.get('role') as UserRole) || 'voter';

  // Show loading while auth state is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Only redirect if we're sure the user is authenticated
  if (user && !authLoading) {
    // Redirect based on user role
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn(email, password, selectedRole);
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signUp(email, password, selectedRole);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Vote className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">SecureVote</h1>
            <p className="text-muted-foreground mt-2">Professional voting platform</p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center">
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

        {/* Role Badge */}
        <div className="flex justify-center">
          <Badge variant="secondary" className="text-sm px-4 py-2">
            {selectedRole === 'admin' ? (
              <>
                <Settings className="w-4 h-4 mr-2" />
                Admin Access
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4 mr-2" />
                Voter Access
              </>
            )}
          </Badge>
        </div>

        {/* Auth Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedRole === 'admin' ? 'Admin Authentication' : 'Voter Authentication'}
            </CardTitle>
            <CardDescription>
              {selectedRole === 'admin' 
                ? 'Sign in to access poll management features'
                : 'Join thousands of users making their voices heard'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      minLength={6}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our secure voting practices and privacy policy
        </p>
      </div>
    </div>
  );
};