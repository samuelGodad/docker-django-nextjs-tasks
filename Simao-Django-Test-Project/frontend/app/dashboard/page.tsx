'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { tasksAPI } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import { Task } from '@/lib/types';
import TaskCard from '@/components/TaskCard';

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    fetchTasks();
  }, [router]);

  const fetchTasks = async () => {
    try {
      const data = await tasksAPI.getAll();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await tasksAPI.delete(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const getTaskCount = (status: string) => {
    if (status === 'all') return tasks.length;
    return tasks.filter((task) => task.status === status).length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Tasks</h1>
        <Link href="/tasks/new" className="btn btn-primary">
          + New Task
        </Link>
      </div>

      {/* Stats */}
      <div className="stats shadow w-full mb-8">
        <div className="stat">
          <div className="stat-title">Total Tasks</div>
          <div className="stat-value">{tasks.length}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Pending</div>
          <div className="stat-value text-error">{getTaskCount('pending')}</div>
        </div>
        <div className="stat">
          <div className="stat-title">In Progress</div>
          <div className="stat-value text-warning">{getTaskCount('in_progress')}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Completed</div>
          <div className="stat-value text-success">{getTaskCount('completed')}</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="tabs tabs-boxed mb-6">
        <button
          className={`tab ${filter === 'all' ? 'tab-active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({tasks.length})
        </button>
        <button
          className={`tab ${filter === 'pending' ? 'tab-active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending ({getTaskCount('pending')})
        </button>
        <button
          className={`tab ${filter === 'in_progress' ? 'tab-active' : ''}`}
          onClick={() => setFilter('in_progress')}
        >
          In Progress ({getTaskCount('in_progress')})
        </button>
        <button
          className={`tab ${filter === 'completed' ? 'tab-active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed ({getTaskCount('completed')})
        </button>
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl opacity-60">No tasks found</p>
          <Link href="/tasks/new" className="btn btn-primary mt-4">
            Create Your First Task
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

