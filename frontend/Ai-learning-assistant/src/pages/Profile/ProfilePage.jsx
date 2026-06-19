import React, { useState } from "react";
import toast from "react-hot-toast";
import { User, Mail, Lock } from "lucide-react";

const ProfilePage = () => {
  // Local state parameters 
  const [profile, setProfile] = useState({
    username: "Anu_ap",
    email: "np9409717@gmail.com"
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("New passwords do not match!");
    }
    toast.success("Password updated successfully!");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="min-h-screen bg-slate-50/30 p-6 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Main Section Header */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Profile Settings</h1>
        </div>

        {/* 1. User Information Card Dashboard Frame */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-5">
          <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
            User Information
          </h3>
          
          <div className="space-y-4">
            {/* Username Attribute Field Row */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  readOnly
                  value={profile.username}
                  className="w-full pl-9 pr-4 h-10 text-sm bg-slate-50 border border-slate-200 text-slate-700 rounded-lg outline-none font-normal"
                />
              </div>
            </div>

            {/* Email Field Row */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  readOnly
                  value={profile.email}
                  className="w-full pl-9 pr-4 h-10 text-sm bg-slate-50 border border-slate-200 text-slate-700 rounded-lg outline-none font-normal"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Change Password Security Action Box */}
        <form onSubmit={handleSavePassword} className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-5">
          <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
            Change Password
          </h3>

          <div className="space-y-4">
            {/* Current Password Block Input */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Current Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 h-10 text-sm bg-white border border-slate-200 text-slate-800 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* New Password Block Input */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 h-10 text-sm bg-white border border-slate-200 text-slate-800 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Confirm New Password Block Input */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 h-10 text-sm bg-white border border-slate-200 text-slate-800 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Action Trigger Button wrapper layout */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="h-10 px-5 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 active:scale-98 rounded-lg shadow-xs transition-all"
            >
              Update Password
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ProfilePage;