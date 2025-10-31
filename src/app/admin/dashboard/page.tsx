'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Package, FileText, FolderOpen, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { LoadingPage } from '@/components/shared/Loading';

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <LoadingPage />;
  }

  if (!session) {
    return null;
  }

  const stats = [
    {
      title: 'Total Products',
      value: '0',
      icon: Package,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50',
    },
    {
      title: 'Total Articles',
      value: '0',
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Categories',
      value: '0',
      icon: FolderOpen,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Views',
      value: '0',
      icon: Eye,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">
          Welcome back, {session.user.name}!
        </h1>
        <p className="text-gray-600">Here&apos;s what&apos;s happening with your store.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={24} className={stat.color} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="btn btn-primary justify-start">
              <Package size={20} />
              Add New Product
            </button>
            <button className="btn btn-secondary justify-start">
              <FileText size={20} />
              Write Article
            </button>
            <button className="btn btn-ghost justify-start">
              <FolderOpen size={20} />
              Manage Categories
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
