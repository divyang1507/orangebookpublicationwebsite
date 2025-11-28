import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    
    // 1. Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // 2. Fetch the logged-in user
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // 3. Check if a profile already exists
        const { data: existingProfile, error: profileFetchError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        // 4. If no profile exists, create one using Google data
        if (!existingProfile) {
          
          // Extract name from Google metadata, fallback to email part
          const googleName = user.user_metadata.full_name || 
                             user.user_metadata.name || 
                             user.email?.split('@')[0];

          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              name: googleName,      // <--- Uses Google Display Name
              email: user.email,
              role: 'user',          // Default role
              mobile: '',            // Empty initially
              address: ''            // Empty initially
            });

          if (insertError) {
            console.error("Error creating profile from Google login:", insertError);
          }
        }
      }

      // 5. Redirect to home/next page
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Handle errors
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}