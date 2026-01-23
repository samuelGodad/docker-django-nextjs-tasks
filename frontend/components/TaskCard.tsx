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
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 border border-base-300">
      <div className="card-body">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h2 className="card-title text-lg flex-1 line-clamp-2">{task.title}</h2>
          <span className={`badge badge-lg ${getStatusColor(task.status)} font-semibold`}>
            {getStatusText(task.status)}
          </span>
        </div>
        
        <p className="text-sm text-base-content/70 line-clamp-3 mb-4">{task.description}</p>
        
        <div className="flex items-center gap-2 text-sm text-base-content/60 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-medium">Due: {format(new Date(task.due_date), 'MMM dd, yyyy')}</span>
        </div>

        <div className="card-actions justify-end gap-2 mt-auto pt-4 border-t border-base-300">
          <Link href={`/tasks/${task.id}/edit`} className="btn btn-sm btn-primary btn-outline gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </Link>
          <button
            onClick={() => onDelete(task.id)}
            className="btn btn-sm btn-error btn-outline gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

