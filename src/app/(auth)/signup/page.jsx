'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { FaGoogle } from 'react-icons/fa'; // Import Google Icon

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', mobile: '', address: '', password: '' });
  const router = useRouter();
  const supabase = createClient();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        // Redirect to callback to create profile and handle verification
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    const user = data?.user;
    if (user) {
      // Manual profile creation for Email/Password flow
      const { error: insertError } = await supabase.from('profiles').insert([
        {
          id: user.id,
          name: form.name,
          email: form.email,
          mobile: form.mobile,
          address: form.address,
          role: 'user', 
        },
      ]);

      if (insertError) {
        console.error(insertError);
        alert('Error saving profile: ' + insertError.message);
        return;
      }
    }

    alert('Registration successful! Please check your email to confirm.');
    router.push('/login');
  };

  // --- GOOGLE SIGNUP HANDLER ---
  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) alert(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ... existing fields ... */}
          {['name','email','mobile','address','password'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                name={field}
                type={field === 'password' ? 'password' : 'text'}
                placeholder={
                  field === 'name' ? 'Full Name' : 
                  field === 'email' ? 'you@example.com' : 
                  field === 'mobile' ? '+1234567890' : 'Your Address'
                }
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition duration-300 font-semibold"
          >
            Register
          </button>
        </form>

        {/* --- GOOGLE BUTTON --- */}
        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign up with</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition duration-300"
          >
            <FaGoogle className="text-red-500" />
            Sign up with Google
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account? <a href="/login" className="text-orange-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}