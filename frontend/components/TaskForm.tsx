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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <div className="form-control">
        <label className="label">
          <span className="label-text">Title *</span>
        </label>
        <input
          type="text"
          placeholder="Enter task title"
          className="input input-bordered"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Description *</span>
        </label>
        <textarea
          placeholder="Enter task description"
          className="textarea textarea-bordered h-24"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Status *</span>
        </label>
        <select
          className="select select-bordered"
          value={formData.status}
          onChange={(e) =>
            setFormData({
              ...formData,
              status: e.target.value as 'pending' | 'in_progress' | 'completed',
            })
          }
          required
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Due Date *</span>
        </label>
        <input
          type="date"
          className="input input-bordered"
          value={formData.due_date}
          onChange={(e) =>
            setFormData({ ...formData, due_date: e.target.value })
          }
          required
        />
      </div>

      <div className="form-control mt-6">
        <button
          type="submit"
          className={`btn btn-primary ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? 'Saving...' : submitText}
        </button>
      </div>
    </form>
  );
}

