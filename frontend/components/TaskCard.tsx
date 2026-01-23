import Link from 'next/link';
import { Task } from '@/lib/types';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onDelete: (id: number) => void;
}

export default function TaskCard({ task, onDelete }: TaskCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'badge-success';
      case 'in_progress':
        return 'badge-warning';
      case 'pending':
        return 'badge-error';
      default:
        return 'badge-ghost';
    }
  };

  const getStatusText = (status: string) => {
    return status.replace('_', ' ').toUpperCase();
  };

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <h2 className="card-title">{task.title}</h2>
          <span className={`badge ${getStatusColor(task.status)}`}>
            {getStatusText(task.status)}
          </span>
        </div>
        
        <p className="text-sm opacity-70 line-clamp-3">{task.description}</p>
        
        <div className="text-sm opacity-60 mt-2">
          <p>Due: {format(new Date(task.due_date), 'MMM dd, yyyy')}</p>
        </div>

        <div className="card-actions justify-end mt-4">
          <Link href={`/tasks/${task.id}/edit`} className="btn btn-sm btn-primary">
            Edit
          </Link>
          <button
            onClick={() => onDelete(task.id)}
            className="btn btn-sm btn-error"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

