'use client';

import Script from 'next/script';
import { createClient } from '@/utils/supabase/client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';

const GoogleOneTap = () => {
  const supabase = createClient();
  const router = useRouter();
  const { user, loading } = useAuth();

  // Core logic to initialize One Tap
  const initializeGoogleOneTap = () => {
    if (!window.google || user || loading) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          // 1. Sign in to Supabase using the ID token from Google
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: response.credential,
          });

          if (error) throw error;

          // 2. Check and Create Profile (Similar to your auth/callback logic)
          const loggedInUser = data.user;
          if (loggedInUser) {
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', loggedInUser.id)
              .single();

            if (!existingProfile) {
              const googleName = loggedInUser.user_metadata.full_name || 
                                 loggedInUser.user_metadata.name || 
                                 loggedInUser.email?.split('@')[0];

              await supabase.from('profiles').insert({
                id: loggedInUser.id,
                name: googleName,
                email: loggedInUser.email,
                role: 'user',
                mobile: '',
                address: ''
              });
            }
          }

          toast.success('Logged in successfully!');
          router.refresh();
          
        } catch (error) {
          console.error('One Tap Error:', error);
          toast.error('Google One Tap Failed');
        }
      },
      // UI Customization
      cancel_on_tap_outside: false, // Keep prompt open if user clicks outside
      prompt_parent_id: 'oneTap', // Optional: attach to specific div
    //   use_fedcm_for_prompt: false
    });

    // Display the prompt
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        console.log('One Tap skipped:', notification.getNotDisplayedReason());
      }
    });
  };

  useEffect(() => {
    // Try to initialize if the script is already loaded (e.g. on navigation)
    if (window.google) {
      initializeGoogleOneTap();
    }
  }, [user, loading]); // Re-run if user state changes

  // Don't render anything if user is already logged in
  if (user || loading) return null;

  return (
    <>
      <Script 
        src="https://accounts.google.com/gsi/client" 
        strategy="afterInteractive"
        onLoad={initializeGoogleOneTap}
      />
      {/* Container helps with positioning stability */}
      <div id="oneTap" className="fixed top-0 right-0 z-[9999]" />
    </>
  );
};

export default GoogleOneTap;