'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { tasksAPI } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import { Task, TaskFormData } from '@/lib/types';
import TaskForm from '@/components/TaskForm';

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = parseInt(params.id as string);
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    fetchTask();
  }, [router, taskId]);

  const fetchTask = async () => {
    try {
      const data = await tasksAPI.getOne(taskId);
      setTask(data);
    } catch (error) {
      console.error('Failed to fetch task:', error);
      alert('Failed to load task');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: TaskFormData) => {
    await tasksAPI.update(taskId, data);
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-base-content/70">Loading task...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="max-w-md mx-auto px-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold mb-2">Task Not Found</h2>
            <p className="text-base-content/70 mb-6">
              The task you're looking for doesn't exist or has been deleted.
            </p>
            <Link href="/dashboard" className="btn btn-primary btn-lg gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
        <h1 className="text-4xl font-bold mb-2">Edit Task</h1>
        <p className="text-base-content/70">Update your task details below</p>
      </div>

      <div className="card bg-base-100 shadow-2xl border border-base-300">
        <div className="card-body p-8">
          <TaskForm
            initialData={{
              title: task.title,
              description: task.description,
              status: task.status,
              due_date: task.due_date,
            }}
            onSubmit={handleSubmit}
            submitText="Update Task"
          />
        </div>
      </div>
    </div>
  );
}

