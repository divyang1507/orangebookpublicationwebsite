"use client";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const supabase = createClient();
  const { user, profile } = useAuth();

  // Profile info state
  const [profileForm, setProfileForm] = useState({
    name: "",
    mobile: "",
    address: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Email state
  const [emailForm, setEmailForm] = useState(user?.email || "");
  const [emailLoading, setEmailLoading] = useState(false);

  // Password state
  const [passwordForm, setPasswordForm] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Initialize profile form when profile is loaded
  useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name || "",
        mobile: profile.mobile || "",
        address: profile.address || "",
      });
    }
  }, [profile]);

  // ===== Handlers =====
  const handleProfileChange = (e) => {
    setProfileForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEmailChange = (e) => {
    setEmailForm(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPasswordForm(e.target.value);
  };

  // ===== Submit functions =====
  const updateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: profileForm.name,
          mobile: profileForm.mobile,
          address: profileForm.address,
        })
        .eq("id", user.id);

      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error updating profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const updateEmail = async (e) => {
    e.preventDefault();
    if (!emailForm || emailForm === user.email) return;

    setEmailLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: emailForm });
      if (error) throw error;
      toast.success("Email updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error updating email");
    } finally {
      setEmailLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm) return;

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwordForm });
      if (error) throw error;
      toast.success("Password updated successfully!");
      setPasswordForm("");
    } catch (err) {
      console.error(err);
      toast.error("Error updating password");
    } finally {
      setPasswordLoading(false);
    }
  };

return (
  <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-6">
    <div className="w-full max-w-lg space-y-10">

      {/* ===== Profile Info Section ===== */}
      <div className="bg-white rounded-3xl shadow-lg border border-orange-200 p-8">
        <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">
          Profile Info
        </h2>

        <form
          onSubmit={updateProfile}
          className="flex flex-col gap-5 text-gray-700"
        >
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Full Name
            </label>
            <input
              name="name"
              value={profileForm.name}
              onChange={handleProfileChange}
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-xl bg-orange-50 border border-orange-200 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Mobile Number
            </label>
            <input
              name="mobile"
              value={profileForm.mobile}
              onChange={handleProfileChange}
              placeholder="Enter your mobile number"
              className="w-full px-4 py-2 rounded-xl bg-orange-50 border border-orange-200 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Address
            </label>
            <input
              name="address"
              value={profileForm.address}
              onChange={handleProfileChange}
              placeholder="Enter your address"
              className="w-full px-4 py-2 rounded-xl bg-orange-50 border border-orange-200 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={profileLoading}
            className="mt-4 w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg shadow-md transition-all disabled:opacity-50"
          >
            {profileLoading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>

      {/* ===== Email Update Section ===== */}
      <div className="bg-white rounded-3xl shadow-lg border border-orange-200 p-8">
        <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">
          Update Email
        </h2>

        <form
          onSubmit={updateEmail}
          className="flex flex-col gap-5 text-gray-700"
        >
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={emailForm}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-xl bg-orange-50 border border-orange-200 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={emailLoading}
            className="mt-4 w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg shadow-md transition-all disabled:opacity-50"
          >
            {emailLoading ? "Updating..." : "Update Email"}
          </button>
        </form>
      </div>

      {/* ===== Password Update Section ===== */}
      <div className="bg-white rounded-3xl shadow-lg border border-orange-200 p-8">
        <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">
          Update Password
        </h2>

        <form
          onSubmit={updatePassword}
          className="flex flex-col gap-5 text-gray-700"
        >
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              New Password
            </label>
            <input
              name="password"
              type="password"
              value={passwordForm}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-xl bg-orange-50 border border-orange-200 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            className="mt-4 w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg shadow-md transition-all disabled:opacity-50"
          >
            {passwordLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

    </div>
  </div>
);


}
