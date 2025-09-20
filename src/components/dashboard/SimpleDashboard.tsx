import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, Plus, Users, Vote } from 'lucide-react';
import { getAllPolls, Poll } from '@/data/mockPolls';
import { PollCard } from '@/components/poll/PollCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const SimpleDashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  useEffect(() => {
    // Load polls from localStorage or use mock data
    setPolls(getAllPolls());
  }, [refreshKey]);

  const genreOrder = [
    'Technology & Innovation',
    'Economy & Work',
    'Environment & Climate',
    'Healthcare & Wellness',
    'Education & Learning',
    'Social Issues & Equality',
  ];

  // Visual styles per genre for nice colored pills
  const genreStyles: Record<string, { base: string; selected: string }> = {
    'Technology & Innovation': {
      base: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      selected: 'bg-blue-600 text-white border-blue-600',
    },
    'Economy & Work': {
      base: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      selected: 'bg-amber-600 text-white border-amber-600',
    },
    'Environment & Climate': {
      base: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      selected: 'bg-emerald-600 text-white border-emerald-600',
    },
    'Healthcare & Wellness': {
      base: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      selected: 'bg-rose-600 text-white border-rose-600',
    },
    'Education & Learning': {
      base: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 border-violet-200 dark:border-violet-800',
      selected: 'bg-violet-600 text-white border-violet-600',
    },
    'Social Issues & Equality': {
      base: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
      selected: 'bg-cyan-600 text-white border-cyan-600',
    },
    Other: {
      base: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300 border-slate-200 dark:border-slate-800',
      selected: 'bg-slate-600 text-white border-slate-600',
    },
  };

  const pollsByGenre = useMemo(() => {
    const groups: Record<string, Poll[]> = {};
    for (const p of polls) {
      const g = p.genre || 'Other';
      if (!groups[g]) groups[g] = [];
      groups[g].push(p);
    }
    // Sort polls in each genre by created_at desc
    Object.keys(groups).forEach((g) => {
      groups[g].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    });
    return groups;
  }, [polls]);

  const availableGenres = useMemo(() => {
    const keys = Object.keys(pollsByGenre);
    return [
      ...genreOrder.filter((g) => keys.includes(g)),
      ...keys.filter((g) => !genreOrder.includes(g)),
    ];
  }, [pollsByGenre]);

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
          <div className="space-y-10" key={refreshKey}>
            {/* Header row */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Active Polls</h2>
                <p className="text-muted-foreground">
                  {selectedGenre ? (
                    <>Showing <span className="font-medium">{selectedGenre}</span> polls</>
                  ) : (
                    <>Browse polls grouped by genre</>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={selectedGenre ?? ''}
                  onValueChange={(v) => setSelectedGenre(v || null)}
                >
                  <SelectTrigger className="w-[240px]" aria-label="Filter by genre">
                    <SelectValue placeholder="All Genres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Genres</SelectItem>
                    {availableGenres.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedGenre && (
                  <Button
                    variant="outline"
                    onClick={() => setSelectedGenre(null)}
                  >
                    Clear Filter
                  </Button>
                )}
                <Button onClick={() => navigate('/admin')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Poll
                </Button>
              </div>
            </div>

            {/* Grouped sections by genre */}
            {(
              selectedGenre
                ? [selectedGenre]
                : [
                    ...genreOrder.filter((g) => pollsByGenre[g]),
                    ...Object.keys(pollsByGenre).filter((g) => !genreOrder.includes(g)),
                  ]
            ).map((genre) => (
              <section key={genre} className="space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className={`inline-flex items-center px-4 py-1.5 rounded-full border text-sm font-medium transition-colors hover:opacity-90 ${
                      (genreStyles[genre]?.base || genreStyles['Other'].base)
                    } ${selectedGenre === genre ? (genreStyles[genre]?.selected || genreStyles['Other'].selected) : ''}`}
                    onClick={() => setSelectedGenre(prev => (prev === genre ? null : genre))}
                    title={selectedGenre === genre ? 'Clear filter' : 'Show only this genre'}
                  >
                    <span className="w-2 h-2 rounded-full bg-current mr-2 opacity-70"></span>
                    {genre}
                  </button>
                  <Badge variant="secondary" className="text-xs">
                    {pollsByGenre[genre].length} Poll{pollsByGenre[genre].length === 1 ? '' : 's'}
                  </Badge>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {pollsByGenre[genre].map((poll) => (
                    <PollCard
                      key={poll.id}
                      poll={poll}
                      onVoteSubmitted={handleVoteSubmitted}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
