// app/profile/page.tsx
"use client";

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/store/store';
import { fetchUserProfile, updateUserProfile } from '@/src/features/user/userThunks';
import { useForm } from 'react-hook-form';
import { User } from '@/src/types';

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, error } = useSelector((state: RootState) => state.user);
  const { register, handleSubmit, setValue } = useForm<Partial<User>>();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name);
      // You can set other form values here
    }
  }, [profile, setValue]);

  const onSubmit = (data: Partial<User>) => {
    dispatch(updateUserProfile(data));
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md">
        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input {...register('name')} className="w-full p-2 border rounded" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input value={profile?.email} disabled className="w-full p-2 border rounded bg-gray-100" />
        </div>
        {/* Add other profile fields here */}
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Save Changes</button>
      </form>
    </div>
  );
}