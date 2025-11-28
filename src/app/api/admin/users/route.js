import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

// ... (Keep the existing GET function as is) ...
export async function GET(request) {
  const supabase = await createClient();

  // 1. Check if the requester is an Admin
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin' && profile?.role !== 'superadmin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 2. Initialize Admin Client (Service Role)
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return NextResponse.json({ error: 'Server configuration error: Missing Service Key' }, { status: 500 });
  }
  
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  try {
    // 3. Fetch Auth Users (Contains email, last_sign_in_at, confirmed_at)
    const { data: { users: authUsers }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    if (usersError) throw usersError;

    // 4. Fetch Profiles (Contains name, mobile, address)
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    if (profilesError) throw profilesError;

    // 5. Merge Data
    const combinedUsers = authUsers.map(authUser => {
      const userProfile = profiles.find(p => p.id === authUser.id);
      return {
        id: authUser.id,
        email: authUser.email,
        verified: !!authUser.email_confirmed_at, // Boolean status
        last_sign_in: authUser.last_sign_in_at,
        created_at: authUser.created_at,
        // Profile data
        name: userProfile?.name || 'N/A',
        mobile: userProfile?.mobile || 'N/A',
        address: userProfile?.address || 'N/A',
        role: userProfile?.role || 'user',
      };
    });

    return NextResponse.json({ users: combinedUsers });

  } catch (error) {
    console.error("Admin Users API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ... (Keep the existing DELETE function as is) ...
export async function DELETE(request) {
  const supabase = await createClient();

  // 1. Check Admin Permissions
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin' && profile?.role !== 'superadmin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 2. Get User ID to Delete
  const { userId } = await request.json();
  if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

  // 3. Delete User using Admin Client
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseAdmin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey);

  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) throw error;

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- NEW PATCH METHOD FOR ROLE UPDATES ---
export async function PATCH(request) {
  const supabase = await createClient();

  // 1. Check Admin Permissions
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin' && profile?.role !== 'superadmin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 2. Get Data
  const { userId, newRole } = await request.json();
  
  if (!userId || !newRole) {
    return NextResponse.json({ error: 'Missing userId or newRole' }, { status: 400 });
  }

  // 3. Update Profile using Service Role (to bypass strict RLS if necessary)
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseAdmin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey);

  try {
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'User role updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}