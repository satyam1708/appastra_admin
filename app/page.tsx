// app/page.tsx
"use client";

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/store/store';
import { fetchDashboardStats } from '@/src/features/admin/adminThunks';
import { BarChart, Users, BookOpen, IndianRupee } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) => (
  <div className="bg-card p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className="bg-muted p-3 rounded-full">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  </div>
);

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, loading, error } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading) return <p className="text-center p-10">Loading dashboard...</p>;
  if (error) return <p className="text-center p-10 text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats?.totalUsers ?? 0} icon={Users} />
        <StatCard title="Total Courses" value={stats?.totalCourses ?? 0} icon={BookOpen} />
        <StatCard title="Total Enrollments" value={stats?.totalEnrollments ?? 0} icon={BarChart} />
        <StatCard title="Total Revenue" value={`₹${stats?.totalRevenue.toLocaleString() ?? 0}`} icon={IndianRupee} />
      </div>
      {/* You can add more dashboard components like charts or recent activity here */}
    </div>
  );
}