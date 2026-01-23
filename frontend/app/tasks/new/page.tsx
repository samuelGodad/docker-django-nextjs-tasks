'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { tasksAPI } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import { TaskFormData } from '@/lib/types';
import TaskForm from '@/components/TaskForm';

export default function NewTaskPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (data: TaskFormData) => {
    await tasksAPI.create(data);
    router.push('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="btn btn-ghost">
          ← Back
        </Link>
        <h1 className="text-3xl font-bold">Create New Task</h1>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <TaskForm onSubmit={handleSubmit} submitText="Create Task" />
        </div>
      </div>
    </div>
  );
}

