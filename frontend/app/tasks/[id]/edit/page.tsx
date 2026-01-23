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
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <p className="text-xl">Task not found</p>
        <Link href="/dashboard" className="btn btn-primary mt-4">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="btn btn-ghost">
          ← Back
        </Link>
        <h1 className="text-3xl font-bold">Edit Task</h1>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
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

