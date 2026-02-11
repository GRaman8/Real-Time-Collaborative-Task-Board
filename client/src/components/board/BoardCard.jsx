import { useNavigate } from 'react-router-dom';

export default function BoardCard({ board, onEdit, onDelete }) {
  const navigate = useNavigate();

  const memberCount = board.members?.length || 0;
  const createdDate = new Date(board.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:shadow-slate-200/60 hover:border-sky-200 transition-all duration-200 cursor-pointer"
      onClick={() => navigate(`/boards/${board._id}`)}
    >
      {/* Color accent bar */}
      <div className="w-full h-1.5 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 mb-4" />

      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-slate-800 group-hover:text-sky-600 transition-colors line-clamp-1">
          {board.name}
        </h3>

        {/* Actions */}
        <div
          className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onEdit(board)}
            className="p-1.5 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-colors"
            title="Edit board"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(board._id)}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete board"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      {board.description && (
        <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
          {board.description}
        </p>
      )}

      <div className="flex items-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          {memberCount} member{memberCount !== 1 ? 's' : ''}
        </span>
        <span>{createdDate}</span>
      </div>
    </div>
  );
}
