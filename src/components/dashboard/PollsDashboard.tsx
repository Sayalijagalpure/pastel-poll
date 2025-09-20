import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { LogOut, Plus, Clock, Users, CheckCircle, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Poll {
  id: string;
  title: string;
  description: string;
  options: string[];
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
  vote_count?: number;
  user_voted?: boolean;
}

export const PollsDashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string>('');

  const genreFilter = searchParams.get('genre');

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
    return <Navigate to="/auth" replace />;
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

  useEffect(() => {
    if (genreFilter) {
      setSelectedGenre(decodeURIComponent(genreFilter));
    } else {
      setSelectedGenre('');
    }
    fetchPolls();
  }, [user, genreFilter]);

  const fetchPolls = async () => {
    try {
      // Check if we're using mock data or Supabase
      const storedPolls = localStorage.getItem('allPolls');
      const useMockData = storedPolls !== null;

      if (useMockData) {
        // Use mock data system
        const mockPollsData = JSON.parse(storedPolls);
        let filteredPolls = mockPollsData;

        if (genreFilter) {
          filteredPolls = mockPollsData.filter((poll: any) =>
            poll.genre === decodeURIComponent(genreFilter)
          );
        }

        // Enrich mock polls with vote data
        const enrichedPolls = await Promise.all(
          filteredPolls.map(async (poll: any) => {
            const pollVotes = JSON.parse(localStorage.getItem('userVotes') || '[]');
            const userVote = pollVotes.find((vote: any) =>
              vote.poll_id === poll.id && vote.user_email === user?.email
            );
            const voteCount = pollVotes.filter((vote: any) => vote.poll_id === poll.id).length;

            return {
              ...poll,
              vote_count: voteCount,
              user_voted: !!userVote
            };
          })
        );

        setPolls(enrichedPolls);
      } else {
        // Use Supabase
        let query = supabase
          .from('polls')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        // Note: Supabase schema doesn't have genre field yet, so filtering by genre won't work
        // This would need to be added to the database schema

        const { data: pollsData, error: pollsError } = await query;

        if (pollsError) {
          console.error('Error fetching polls:', pollsError);
          setPolls([]);
          setLoading(false);
          return;
        }

        if (!pollsData || pollsData.length === 0) {
          setPolls([]);
          setLoading(false);
          return;
        }

        // For each poll, check if user has voted and get vote count
        const enrichedPolls = await Promise.all(
          pollsData.map(async (poll) => {
            try {
              // Check if user voted
              const { data: userVote } = await supabase
                .from('votes')
                .select('id')
                .eq('poll_id', poll.id)
                .eq('user_id', user?.id)
                .single();

              // Get vote count
              const { count } = await supabase
                .from('votes')
                .select('*', { count: 'exact', head: true })
                .eq('poll_id', poll.id);

              return {
                ...poll,
                vote_count: count || 0,
                user_voted: !!userVote
              };
            } catch (error) {
              // If there's an error with individual poll, just return the poll without vote data
              return {
                ...poll,
                vote_count: 0,
                user_voted: false
              };
            }
          })
        );

        setPolls(enrichedPolls);
      }
    } catch (error) {
      console.error('Error fetching polls:', error);
      setPolls([]);
    } finally {
      setLoading(false);
    }
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading polls...</p>
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
            {selectedGenre && (
              <Badge variant="secondary" className="text-xs">
                <Filter className="w-3 h-3 mr-1" />
                {selectedGenre}
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs">
              {polls.length} {selectedGenre ? 'Filtered' : 'Active'} Polls
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user.email}
            </span>
            {selectedGenre && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchParams({});
                  setSelectedGenre('');
                }}
              >
                Clear Filter
              </Button>
            )}
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
              There are no active polls at the moment. Check back later or create your own!
            </p>
            <Button onClick={() => navigate('/admin')}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Poll
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {polls.map((poll) => {
              const expired = isExpired(poll.expires_at);
              
              return (
                <Card 
                  key={poll.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    expired ? 'opacity-60' : ''
                  } ${poll.user_voted ? 'border-vote-success' : ''}`}
                  onClick={() => navigate(`/poll/${poll.id}`)}
                >
                  <CardHeader className="space-y-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg leading-tight">{poll.title}</CardTitle>
                      <div className="flex flex-col items-end space-y-1">
                        {poll.user_voted && (
                          <Badge variant="secondary" className="text-xs bg-vote-success text-white">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Voted
                          </Badge>
                        )}
                        {expired && (
                          <Badge variant="secondary" className="text-xs bg-vote-expired text-white">
                            <Clock className="w-3 h-3 mr-1" />
                            Expired
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {poll.description || 'No description provided'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {poll.vote_count} votes
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {poll.expires_at 
                          ? `Expires ${formatDate(poll.expires_at)}`
                          : 'No expiry'
                        }
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-medium">
                        {poll.options.length} options available
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {poll.options.slice(0, 3).map((option, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {option.length > 15 ? `${option.slice(0, 15)}...` : option}
                          </Badge>
                        ))}
                        {poll.options.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{poll.options.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};