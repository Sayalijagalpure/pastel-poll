import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, Users, CheckCircle, BarChart3 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface Poll {
  id: string;
  title: string;
  description: string;
  options: string[];
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
}

interface VoteResult {
  option: string;
  count: number;
  percentage: number;
}

export const PollDetail = () => {
  const { pollId } = useParams<{ pollId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [results, setResults] = useState<VoteResult[]>([]);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [viewMode, setViewMode] = useState<'vote' | 'results'>('vote');

  const COLORS = ['hsl(220, 70%, 65%)', 'hsl(270, 50%, 75%)', 'hsl(160, 40%, 65%)', 'hsl(45, 85%, 65%)', 'hsl(0, 70%, 65%)'];

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    if (pollId) {
      fetchPollData();
    }
  }, [pollId, user]);

  const fetchPollData = async () => {
    if (!pollId) return;

    try {
      // Fetch poll details
      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .select('*')
        .eq('id', pollId)
        .single();

      if (pollError || !pollData) {
        toast({
          title: "Error",
          description: "Poll not found",
          variant: "destructive"
        });
        navigate('/dashboard');
        return;
      }

      setPoll(pollData);

      // Check if user has voted
      const { data: voteData } = await supabase
        .from('votes')
        .select('option')
        .eq('poll_id', pollId)
        .eq('user_id', user.id)
        .single();

      if (voteData) {
        setUserVote(voteData.option);
        setViewMode('results');
      }

      // Fetch vote results
      await fetchResults();
    } catch (error) {
      console.error('Error fetching poll:', error);
      toast({
        title: "Error",
        description: "Failed to load poll",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    if (!pollId || !poll) return;

    try {
      const { data: votes, error } = await supabase
        .from('votes')
        .select('option')
        .eq('poll_id', pollId);

      if (error) {
        console.error('Error fetching results:', error);
        return;
      }

      // Calculate results
      const voteCounts = poll.options.reduce((acc, option) => {
        acc[option] = 0;
        return acc;
      }, {} as Record<string, number>);

      votes?.forEach(vote => {
        if (voteCounts.hasOwnProperty(vote.option)) {
          voteCounts[vote.option]++;
        }
      });

      const totalVotes = votes?.length || 0;
      const results: VoteResult[] = poll.options.map(option => ({
        option,
        count: voteCounts[option],
        percentage: totalVotes > 0 ? (voteCounts[option] / totalVotes) * 100 : 0
      }));

      setResults(results);
    } catch (error) {
      console.error('Error calculating results:', error);
    }
  };

  const handleVote = async () => {
    if (!selectedOption || !pollId || voting) return;

    setVoting(true);
    try {
      const { error } = await supabase
        .from('votes')
        .insert({
          poll_id: pollId,
          user_id: user.id,
          option: selectedOption
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already Voted",
            description: "You have already voted on this poll",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
          });
        }
        return;
      }

      setUserVote(selectedOption);
      setViewMode('results');
      await fetchResults();
      
      toast({
        title: "Vote Recorded!",
        description: "Your vote has been successfully recorded"
      });
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: "Failed to record vote",
        variant: "destructive"
      });
    } finally {
      setVoting(false);
    }
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalVotes = results.reduce((sum, result) => sum + result.count, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading poll...</p>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Poll not found</h2>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const expired = isExpired(poll.expires_at);
  const canVote = !userVote && !expired && poll.is_active;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Poll Info & Voting */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">{poll.title}</CardTitle>
                    <CardDescription className="text-base">
                      {poll.description || 'No description provided'}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {userVote && (
                      <Badge className="bg-vote-success text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Voted: {userVote}
                      </Badge>
                    )}
                    {expired && (
                      <Badge variant="secondary" className="bg-vote-expired text-white">
                        <Clock className="w-3 h-3 mr-1" />
                        Expired
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {totalVotes} total votes
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Created {formatDate(poll.created_at)}
                  </span>
                  {poll.expires_at && (
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Expires {formatDate(poll.expires_at)}
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {canVote && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Cast Your Vote</h3>
                    <div className="space-y-3">
                      {poll.options.map((option, index) => (
                        <label
                          key={index}
                          className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all hover:bg-accent ${
                            selectedOption === option ? 'border-primary bg-accent' : 'border-border'
                          }`}
                        >
                          <input
                            type="radio"
                            name="poll-option"
                            value={option}
                            checked={selectedOption === option}
                            onChange={(e) => setSelectedOption(e.target.value)}
                            className="text-primary"
                          />
                          <span className="flex-1 font-medium">{option}</span>
                        </label>
                      ))}
                    </div>
                    <Button
                      onClick={handleVote}
                      disabled={!selectedOption || voting}
                      className="w-full"
                      size="lg"
                    >
                      {voting ? 'Recording Vote...' : 'Submit Vote'}
                    </Button>
                  </div>
                )}

                {!canVote && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Poll Results</h3>
                      <div className="flex space-x-2">
                        <Button
                          variant={viewMode === 'results' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('results')}
                        >
                          <BarChart3 className="w-4 h-4 mr-1" />
                          Results
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {results.map((result, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className={`font-medium ${userVote === result.option ? 'text-vote-success' : ''}`}>
                              {result.option}
                              {userVote === result.option && <CheckCircle className="w-4 h-4 inline ml-2" />}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {result.count} votes ({result.percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <Progress 
                            value={result.percentage} 
                            className="h-3"
                            style={{
                              backgroundColor: userVote === result.option ? 'hsl(var(--vote-success))' : undefined
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Charts Sidebar */}
          {!canVote && results.length > 0 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Vote Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={results}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ percentage }) => `${percentage.toFixed(0)}%`}
                      >
                        {results.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Vote Counts</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={results}>
                      <XAxis 
                        dataKey="option" 
                        tick={false}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar 
                        dataKey="count" 
                        fill="hsl(220, 70%, 65%)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};