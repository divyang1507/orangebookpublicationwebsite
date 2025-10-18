'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', mobile: '', address: '', password: '' });
  const router = useRouter();
  const supabase = createClient();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1️⃣ Sign up user in auth
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    // 2️⃣ Create profile in profiles table
    const user = data?.user;
    if (user) {
      const { error: insertError } = await supabase.from('profiles').insert([
        {
          id: user.id,
          name: form.name,
          email: form.email,
          mobile: form.mobile,
          address: form.address,
          role: 'user', // default role
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {['name','email','mobile','address','password'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                name={field}
                type={field === 'password' ? 'password' : 'text'}
                placeholder={
                  field === 'name'
                    ? 'Full Name'
                    : field === 'email'
                    ? 'you@example.com'
                    : field === 'mobile'
                    ? '+1234567890'
                    : 'Your Address'
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
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account? <a href="/login" className="text-orange-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}
