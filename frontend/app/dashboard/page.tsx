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
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

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

  const handleDeleteClick = (id: number) => {
    setTaskToDelete(id);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      await tasksAPI.delete(taskToDelete);
      setTasks(tasks.filter((task) => task.id !== taskToDelete));
      setTaskToDelete(null);
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task');
    }
  };

  const cancelDelete = () => {
    setTaskToDelete(null);
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Tasks</h1>
          <p className="text-base-content/70">Manage and track your tasks efficiently</p>
        </div>
        <Link href="/tasks/new" className="btn btn-primary btn-lg gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Task
        </Link>
      </div>

      {/* Stats */}
      <div className="stats stats-vertical sm:stats-horizontal shadow-xl w-full bg-base-100">
        <div className="stat place-items-center">
          <div className="stat-title font-semibold">Total Tasks</div>
          <div className="stat-value text-primary">{tasks.length}</div>
          <div className="stat-desc">All your tasks</div>
        </div>
        <div className="stat place-items-center">
          <div className="stat-title font-semibold">Pending</div>
          <div className="stat-value text-error">{getTaskCount('pending')}</div>
          <div className="stat-desc">Not started yet</div>
        </div>
        <div className="stat place-items-center">
          <div className="stat-title font-semibold">In Progress</div>
          <div className="stat-value text-warning">{getTaskCount('in_progress')}</div>
          <div className="stat-desc">Currently working</div>
        </div>
        <div className="stat place-items-center">
          <div className="stat-title font-semibold">Completed</div>
          <div className="stat-value text-success">{getTaskCount('completed')}</div>
          <div className="stat-desc">Finished tasks</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="tabs tabs-boxed bg-base-100 p-2 shadow-md">
        <button
          className={`tab tab-lg ${filter === 'all' ? 'tab-active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All <span className="badge badge-sm ml-2">{tasks.length}</span>
        </button>
        <button
          className={`tab tab-lg ${filter === 'pending' ? 'tab-active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          📋 Pending <span className="badge badge-sm ml-2">{getTaskCount('pending')}</span>
        </button>
        <button
          className={`tab tab-lg ${filter === 'in_progress' ? 'tab-active' : ''}`}
          onClick={() => setFilter('in_progress')}
        >
          ⚡ In Progress <span className="badge badge-sm ml-2">{getTaskCount('in_progress')}</span>
        </button>
        <button
          className={`tab tab-lg ${filter === 'completed' ? 'tab-active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          ✅ Completed <span className="badge badge-sm ml-2">{getTaskCount('completed')}</span>
        </button>
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold mb-2">No tasks found</h3>
            <p className="text-base-content/70 mb-6">
              {filter === 'all' 
                ? "Get started by creating your first task!"
                : `No ${filter.replace('_', ' ')} tasks yet.`
              }
            </p>
            <Link href="/tasks/new" className="btn btn-primary btn-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create Your First Task
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={handleDeleteClick} />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-xl mb-4">Delete Task</h3>
            <p className="py-4 text-base-content/80">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="modal-action">
              <button onClick={cancelDelete} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={confirmDelete} className="btn btn-error">
                Delete
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={cancelDelete}></div>
        </dialog>
      )}
    </div>
  );
}

