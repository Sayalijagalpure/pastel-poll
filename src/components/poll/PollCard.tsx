import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Clock, Users, CheckCircle, Vote } from 'lucide-react';
import { Poll, saveUserVote, hasUserVoted, getUserVoteForPoll, getAllPolls } from '@/data/mockPolls';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface PollCardProps {
  poll: Poll;
  onVoteSubmitted?: () => void;
}

export const PollCard = ({ poll, onVoteSubmitted }: PollCardProps) => {
  const { user } = useAuth();
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isVoting, setIsVoting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentPoll, setCurrentPoll] = useState<Poll>(poll);

  // Update poll data when it changes
  useEffect(() => {
    const polls = getAllPolls();
    const updatedPoll = polls.find(p => p.id === poll.id);
    if (updatedPoll) {
      setCurrentPoll(updatedPoll);
    }
  }, [poll.id]);

  const userHasVoted = user ? hasUserVoted(currentPoll.id, user.email) : false;
  const userVote = user ? getUserVoteForPoll(currentPoll.id, user.email) : null;

  const isExpired = currentPoll.expires_at ? new Date(currentPoll.expires_at) < new Date() : false;

  const handleVote = async () => {
    if (!user || !selectedOption) return;

    setIsVoting(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      saveUserVote({
        poll_id: poll.id,
        option_id: selectedOption,
        user_email: user.email
      });

      toast({
        title: "Vote Submitted!",
        description: "Your vote has been recorded successfully.",
      });

      // Get updated poll data immediately after voting
      const polls = getAllPolls();
      const updatedPoll = polls.find(p => p.id === poll.id);
      if (updatedPoll) {
        setCurrentPoll(updatedPoll);
      }
      
      setShowResults(true);
      // Force component to re-render with updated data
      onVoteSubmitted?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit vote. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVoting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getOptionPercentage = (votes: number) => {
    return currentPoll.total_votes > 0 ? Math.round((votes / currentPoll.total_votes) * 100) : 0;
  };

  return (
    <Card className={`transition-all hover:shadow-lg ${userHasVoted ? 'border-green-200' : ''}`}>
      <CardHeader className="space-y-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg leading-tight">{poll.title}</CardTitle>
          <div className="flex flex-col items-end space-y-1">
            {userHasVoted && (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Voted
              </Badge>
            )}
            {isExpired && (
              <Badge variant="secondary" className="text-xs bg-red-100 text-red-800">
                <Clock className="w-3 h-3 mr-1" />
                Expired
              </Badge>
            )}
          </div>
        </div>
        <CardDescription className="line-clamp-2">
          {poll.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {currentPoll.total_votes} votes
          </span>
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {currentPoll.expires_at 
              ? `Expires ${formatDate(currentPoll.expires_at)}`
              : 'No expiry'
            }
          </span>
        </div>

        {/* Voting Interface */}
        {!userHasVoted && !isExpired && !showResults && (
          <div className="space-y-4">
            <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
              {currentPoll.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <Button 
              onClick={handleVote}
              disabled={!selectedOption || isVoting}
              className="w-full"
            >
              <Vote className="w-4 h-4 mr-2" />
              {isVoting ? 'Submitting Vote...' : 'Submit Vote'}
            </Button>
          </div>
        )}

        {/* Results Interface */}
        {(userHasVoted || showResults || isExpired) && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-sm">Results</h4>
              {!showResults && !isExpired && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowResults(!showResults)}
                >
                  {showResults ? 'Hide Results' : 'View Results'}
                </Button>
              )}
            </div>
            
            {currentPoll.options.map((option) => {
              const percentage = getOptionPercentage(option.votes);
              const isUserChoice = userVote?.option_id === option.id;
              
              return (
                <div key={option.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${isUserChoice ? 'font-semibold text-green-700 dark:text-green-400' : ''}`}>
                      {option.text}
                      {isUserChoice && ' ✓'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {option.votes} ({percentage}%)
                    </span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className={`h-3 ${isUserChoice ? '[&>div]:bg-green-500 bg-green-100 dark:bg-green-900/20' : ''}`}
                  />
                </div>
              );
            })}
          </div>
        )}

        <div className="text-xs text-muted-foreground pt-2 border-t">
          Created {formatDate(poll.created_at)} by {poll.creator_email}
        </div>
      </CardContent>
    </Card>
  );
};
