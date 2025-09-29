// app/settings/page.tsx - UPDATED
"use client";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/store/store';
import { fetchUserProfile, changePassword } from '@/src/features/user/userThunks';
import { useForm } from 'react-hook-form';
import { User as UserIcon, Lock } from 'lucide-react';

export default function SettingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, error } = useSelector((state: RootState) => state.user);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPasswordForm } = useForm();

  useEffect(() => {
    if (!profile) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, profile]);

  const onPasswordSubmit = (data: any) => {
    setMessage(null);
    dispatch(changePassword({ oldPassword: data.oldPassword, newPassword: data.newPassword }))
      .unwrap()
      .then(() => {
        setMessage({ text: 'Password changed successfully!', type: 'success' });
        resetPasswordForm();
      })
      .catch((err) => {
        setMessage({ text: `Error: ${err}`, type: 'error' });
      });
  };
  
  const TabButton = ({ tabName, currentTab, setTab, children }: any) => (
    <button
      onClick={() => setTab(tabName)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        currentTab === tabName
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );

  const ProfileDetail = ({ label, value }: { label: string; value: string | undefined }) => (
    <div className="py-2">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-md text-gray-900">{value || 'Not available'}</p>
    </div>
  );

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-sky-900">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences.</p>
      </div>

      {message && (
        <div className={`p-3 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Tab Navigation */}
        <div className="flex border-b mb-6">
          <TabButton tabName="profile" currentTab={activeTab} setTab={setActiveTab}>
            <UserIcon size={16} /> Profile
          </TabButton>
          <TabButton tabName="password" currentTab={activeTab} setTab={setActiveTab}>
            <Lock size={16} /> Password
          </TabButton>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Profile Information</h2>
              {loading && <p>Loading profile...</p>}
              {profile && (
                 <div className="space-y-4">
                    <ProfileDetail label="Name" value={profile.name} />
                    <ProfileDetail label="Email" value={profile.email} />
                    <ProfileDetail label="Phone" value={profile.phone} />
                    <ProfileDetail label="State" value={profile.state} />
                 </div>
              )}
            </div>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Change Password</h2>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Current Password</label>
                <input type="password" {...registerPassword('oldPassword')} className="w-full p-2 border rounded-md" required />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">New Password</label>
                <input type="password" {...registerPassword('newPassword')} className="w-full p-2 border rounded-md" required />
              </div>
              <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}