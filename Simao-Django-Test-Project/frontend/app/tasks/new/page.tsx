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
    <div className="max-w-3xl mx-auto px-4">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="btn btn-ghost gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">Create New Task</h1>
        <p className="text-base-content/70">Fill in the details to create a new task</p>
      </div>

      <div className="card bg-base-100 shadow-2xl border border-base-300">
        <div className="card-body p-8">
          <TaskForm onSubmit={handleSubmit} submitText="Create Task" />
        </div>
      </div>
    </div>
  );
}

