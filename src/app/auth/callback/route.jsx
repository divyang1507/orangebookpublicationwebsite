import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  // This defaults to your homepage if no 'next' param is found
  const next = requestUrl.searchParams.get('next') || '/';
  
  // In production, this will be 'https://orangebookpublication.in'
  // In dev, it is 'http://localhost:3000'
  const origin = requestUrl.origin; 

  if (code) {
    // 1. Initialize Supabase (AWAIT is crucial here)
    const supabase = await createClient();
    
    // 2. Exchange the code for a session (This logs the user in)
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // --- (Optional) Profile Creation Logic Goes Here ---
      
      // 3. SUCCESS: Redirect to the homepage
      // This line sends the user from /auth/callback -> orangebookpublication.in
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // 4. FAILURE: Redirect to an error page or back to login
  console.error('Auth Code Exchange Failed');
  return NextResponse.redirect(`${origin}/login?error=auth_code_error`);
}