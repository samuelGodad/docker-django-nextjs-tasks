'use client';

import { useState } from 'react';
import { TaskFormData } from '@/lib/types';

interface TaskFormProps {
  initialData?: TaskFormData;
  onSubmit: (data: TaskFormData) => Promise<void>;
  submitText?: string;
}

export default function TaskForm({
  initialData,
  onSubmit,
  submitText = 'Create Task',
}: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>(
    initialData || {
      title: '',
      description: '',
      status: 'pending',
      due_date: '',
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold text-base">Task Title</span>
          <span className="badge badge-sm">Required</span>
        </label>
        <input
          type="text"
          placeholder="e.g., Complete project documentation"
          className="input input-bordered input-lg w-full"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold text-base">Description</span>
          <span className="badge badge-sm">Required</span>
        </label>
        <textarea
          placeholder="Describe what needs to be done..."
          className="textarea textarea-bordered textarea-lg h-32 w-full"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-base">Status</span>
          </label>
          <select
            className="select select-bordered select-lg w-full"
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as 'pending' | 'in_progress' | 'completed',
              })
            }
            required
          >
            <option value="pending">📋 Pending</option>
            <option value="in_progress">⚡ In Progress</option>
            <option value="completed">✅ Completed</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-base">Due Date</span>
            <span className="badge badge-sm">Required</span>
          </label>
          <input
            type="date"
            className="input input-bordered input-lg w-full"
            value={formData.due_date}
            onChange={(e) =>
              setFormData({ ...formData, due_date: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="form-control mt-8">
        <button
          type="submit"
          className={`btn btn-primary btn-lg w-full ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? 'Saving...' : submitText}
        </button>
      </div>
    </form>
  );
}

