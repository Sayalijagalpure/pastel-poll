import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, Plus, Users, Vote } from 'lucide-react';
import { getAllPolls, Poll } from '@/data/mockPolls';
import { PollCard } from '@/components/poll/PollCard';

export const SimpleDashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Load polls from localStorage or use mock data
    setPolls(getAllPolls());
  }, [refreshKey]);

  const handleVoteSubmitted = () => {
    // Refresh polls to show updated vote counts
    setPolls(getAllPolls());
    setRefreshKey(prev => prev + 1);
  };

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

  // Only redirect if we're sure the user is not authenticated
  if (!user && !authLoading) {
    return <Navigate to="/auth?role=voter" replace />;
  }

  // Don't render anything if we don't have a user yet
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-foreground">SecureVote Dashboard</h1>
            <Badge variant="secondary" className="text-xs">
              {polls.length} Active Polls
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Poll
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {polls.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">No Active Polls</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              There are no active polls at the moment. Create your first poll to get started!
            </p>
            <Button onClick={() => navigate('/admin')} size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Poll
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Active Polls</h2>
                <p className="text-muted-foreground">Vote on polls or view results</p>
              </div>
              <Button onClick={() => navigate('/admin')}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Poll
              </Button>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" key={refreshKey}>
              {polls.map((poll) => (
                <PollCard 
                  key={poll.id} 
                  poll={poll} 
                  onVoteSubmitted={handleVoteSubmitted}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
