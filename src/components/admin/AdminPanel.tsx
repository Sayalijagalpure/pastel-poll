import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus, Trash2, Calendar } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [hasExpiry, setHasExpiry] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [expiryTime, setExpiryTime] = useState('');

  if (!user) {
    return <Navigate to="/auth" replace />;
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
      const { error } = await supabase
        .from('polls')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          options: uniqueOptions,
          expires_at: expiresAt,
          is_active: true,
          created_by: user.id
        });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success!",
        description: "Poll created successfully"
      });

      // Reset form
      setTitle('');
      setDescription('');
      setOptions(['', '']);
      setHasExpiry(false);
      setExpiryDate('');
      setExpiryTime('');
      
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
          <h1 className="text-2xl font-bold text-foreground">Create New Poll</h1>
          <p className="text-muted-foreground">Design a secure poll for your community</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Poll Details
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