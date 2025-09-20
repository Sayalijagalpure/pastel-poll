import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// This component runs globally to handle Supabase email verification links
// It exchanges the `code` in the URL for a session and then cleans the URL
export const AuthCallbackHandler = () => {
  useEffect(() => {
    const url = window.location.href;
    const hasCode = url.includes('code=');

    if (hasCode) {
      (async () => {
        const { error } = await supabase.auth.exchangeCodeForSession(url);
        if (error) {
          toast({
            title: 'Verification Error',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Verified',
            description: 'Your email has been verified and you are now signed in.',
          });
        }
        // Clean the URL so the code params are removed
        window.history.replaceState({}, document.title, window.location.pathname);
      })();
    }
  }, []);

  return null;
};
