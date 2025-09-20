import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Trash2, Calendar, AlertTriangle } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { addNewPoll, getAllPolls, deletePoll, Poll } from '@/data/mockPolls';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export const SimpleAdminPanel = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [hasExpiry, setHasExpiry] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [expiryTime, setExpiryTime] = useState('');
  const [genre, setGenre] = useState<string>('Technology & Innovation');
  
  // Delete poll state
  const [polls, setPolls] = useState<Poll[]>([]);
  const [deletingPollId, setDeletingPollId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Load polls on component mount
  useEffect(() => {
    const loadPolls = () => {
      const allPolls = getAllPolls();
      setPolls(allPolls);
    };
    loadPolls();
  }, []);

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
    return <Navigate to="/auth?role=admin" replace />;
  }

  // Restrict access to admin users only
  if (user && user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
            <p className="text-muted-foreground mt-2">You need admin privileges to access this page.</p>
          </div>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
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

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Poll title is required",
        variant: "destructive"
      });
      return;
    }

    const validOptions = options.filter(opt => opt.trim().length > 0);
    if (validOptions.length < 2) {
      toast({
        title: "Validation Error",
        description: "At least 2 options are required",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate options
    const uniqueOptions = [...new Set(validOptions.map(opt => opt.trim()))];
    if (uniqueOptions.length !== validOptions.length) {
      toast({
        title: "Validation Error",  
        description: "Options must be unique",
        variant: "destructive"
      });
      return;
    }

    let expiresAt = null;
    if (hasExpiry && expiryDate && expiryTime) {
      expiresAt = new Date(`${expiryDate}T${expiryTime}`).toISOString();
      
      // Check if expiry is in the future
      if (new Date(expiresAt) <= new Date()) {
        toast({
          title: "Validation Error",
          description: "Expiry date must be in the future",
          variant: "destructive"
        });
        return;
      }
    }

    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create the new poll
      const newPoll = addNewPoll({
        title: title.trim(),
        description: description.trim() || '',
        options: uniqueOptions,
        expires_at: expiresAt,
        creator_email: user.email,
        creator_role: user.role,
        genre
      });

      toast({
        title: "Success!",
        description: `Poll "${newPoll.title}" created successfully!`
      });

      // Reset form
      setTitle('');
      setDescription('');
      setOptions(['', '']);
      setHasExpiry(false);
      setExpiryDate('');
      setExpiryTime('');
      setGenre('Technology & Innovation');
      
      // Refresh polls list
      const updatedPolls = getAllPolls();
      setPolls(updatedPolls);
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating poll:', error);
      toast({
        title: "Error",
        description: "Failed to create poll",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePoll = async (pollId: string) => {
    setDeletingPollId(pollId);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const success = deletePoll(pollId);
      
      if (success) {
        toast({
          title: "Poll Deleted",
          description: "The poll has been permanently deleted."
        });
        
        // Refresh polls list
        const updatedPolls = getAllPolls();
        setPolls(updatedPolls);
      } else {
        toast({
          title: "Error",
          description: "Failed to delete poll. Poll not found.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete poll. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeletingPollId(null);
      setShowDeleteConfirm(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get minimum date for expiry (today)
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toTimeString().slice(0, 5);

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
          <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground">Manage polls and create new ones for your community</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Existing Polls Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trash2 className="w-5 h-5 mr-2" />
              Manage Existing Polls
            </CardTitle>
            <CardDescription>
              View and delete existing polls. Deleted polls cannot be recovered.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {polls.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No polls found.</p>
            ) : (
              <div className="space-y-4">
                {polls.map((poll) => (
                  <div key={poll.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{poll.title}</h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                        <span>{poll.total_votes} votes</span>
                        <span>Created {formatDate(poll.created_at)}</span>
                        {poll.expires_at && (
                          <Badge variant={new Date(poll.expires_at) < new Date() ? "destructive" : "secondary"}>
                            {new Date(poll.expires_at) < new Date() ? "Expired" : "Active"}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {showDeleteConfirm === poll.id ? (
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeletePoll(poll.id)}
                            disabled={deletingPollId === poll.id}
                          >
                            {deletingPollId === poll.id ? "Deleting..." : "Confirm Delete"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowDeleteConfirm(null)}
                            disabled={deletingPollId === poll.id}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowDeleteConfirm(poll.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create New Poll Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Create New Poll
            </CardTitle>
            <CardDescription>
              Create a new poll with multiple choice options. All votes are anonymous and secure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Poll Title *</Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's your question?"
                  required
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground">
                  {title.length}/200 characters
                </p>
              </div>

              {/* Genre */}
              <div className="space-y-2">
                <Label htmlFor="genre">Genre *</Label>
                <Select value={genre} onValueChange={setGenre}>
                  <SelectTrigger id="genre">
                    <SelectValue placeholder="Select a genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology & Innovation">Technology & Innovation</SelectItem>
                    <SelectItem value="Economy & Work">Economy & Work</SelectItem>
                    <SelectItem value="Environment & Climate">Environment & Climate</SelectItem>
                    <SelectItem value="Healthcare & Wellness">Healthcare & Wellness</SelectItem>
                    <SelectItem value="Education & Learning">Education & Learning</SelectItem>
                    <SelectItem value="Social Issues & Equality">Social Issues & Equality</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide additional context or details..."
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">
                  {description.length}/500 characters
                </p>
              </div>

              {/* Options */}
              <div className="space-y-4">
                <Label>Poll Options *</Label>
                <div className="space-y-3">
                  {options.map((option, index) => (
                    <div key={index} className="flex space-x-2">
                      <Input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        maxLength={100}
                        className="flex-1"
                      />
                      {options.length > 2 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeOption(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                {options.length < 10 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addOption}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Option
                  </Button>
                )}
                
                <p className="text-xs text-muted-foreground">
                  Add 2-10 options for your poll. Each option can be up to 100 characters.
                </p>
              </div>

              {/* Expiry Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="has-expiry">Set Expiry Date</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically close the poll at a specific date and time
                    </p>
                  </div>
                  <Switch
                    id="has-expiry"
                    checked={hasExpiry}
                    onCheckedChange={setHasExpiry}
                  />
                </div>

                {hasExpiry && (
                  <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-accent/20">
                    <div className="space-y-2">
                      <Label htmlFor="expiry-date">Expiry Date</Label>
                      <Input
                        id="expiry-date"
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        min={today}
                        required={hasExpiry}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiry-time">Expiry Time</Label>
                      <Input
                        id="expiry-time"
                        type="time"
                        value={expiryTime}
                        onChange={(e) => setExpiryTime(e.target.value)}
                        min={expiryDate === today ? now : undefined}
                        required={hasExpiry}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="pt-4 border-t">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Creating Poll...' : 'Create Poll'}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Your poll will be immediately available to all users
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
