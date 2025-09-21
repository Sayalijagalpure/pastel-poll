-- Enable RLS on all public tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vote_tokens ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT COALESCE(role, 'voter') FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- PROFILES policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- GENRES policies (public read access)
CREATE POLICY "Anyone can view genres" ON public.genres
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage genres" ON public.genres
  FOR ALL USING (public.get_current_user_role() = 'admin');

-- POLLS policies
CREATE POLICY "Anyone can view published polls" ON public.polls
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can view all polls" ON public.polls
  FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Authenticated users can create polls" ON public.polls
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = created_by);

CREATE POLICY "Admins can update polls" ON public.polls
  FOR UPDATE USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can delete polls" ON public.polls
  FOR DELETE USING (public.get_current_user_role() = 'admin');

-- OPTIONS policies (tied to polls visibility)
CREATE POLICY "Anyone can view options for published polls" ON public.options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.polls 
      WHERE polls.id = options.poll_id 
      AND polls.is_published = true
    )
  );

CREATE POLICY "Admins can view all options" ON public.options
  FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can manage options" ON public.options
  FOR ALL USING (public.get_current_user_role() = 'admin');

-- VOTES policies
CREATE POLICY "Users can view their own votes" ON public.votes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all votes" ON public.votes
  FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Authenticated users can create votes" ON public.votes
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL 
    AND auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.polls 
      WHERE polls.id = votes.poll_id 
      AND polls.is_published = true
      AND (polls.ends_at IS NULL OR polls.ends_at > now())
    )
  );

CREATE POLICY "Users can update their own votes if poll allows revote" ON public.votes
  FOR UPDATE USING (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.polls 
      WHERE polls.id = votes.poll_id 
      AND polls.allow_revote = true
      AND polls.is_published = true
      AND (polls.ends_at IS NULL OR polls.ends_at > now())
    )
  );

-- VOTE_TOKENS policies (very restricted)
CREATE POLICY "Admins can manage vote tokens" ON public.vote_tokens
  FOR ALL USING (public.get_current_user_role() = 'admin');

-- AUDIT_LOGS policies (admin only)
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "System can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (true);