const priorityConfig = {
  high: { label: 'High', color: 'bg-red-100 text-red-700 border-red-200' },
  medium: { label: 'Medium', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  low: { label: 'Low', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

export default function TaskCard({ task, onEdit, onDelete, provided, isDragging }) {
  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`bg-white rounded-lg border p-3.5 transition-all group ${
        isDragging
          ? 'shadow-xl shadow-sky-200/50 border-sky-300 rotate-[2deg] scale-105'
          : 'border-slate-200 hover:border-sky-200 hover:shadow-md hover:shadow-slate-100'
      }`}
    >
      {/* Priority + Actions row */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${priority.color}`}>
          {priority.label}
        </span>
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(task); }}
            className="p-1 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(task._id); }}
            className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Title */}
      <h4 className="text-sm font-medium text-slate-800 mb-1 leading-snug">
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-500 mb-2.5 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {task.tags.map((tag, i) => (
            <span
              key={i}
              className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      {task.assignedTo && (
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white text-[9px] font-bold">
            {task.assignedTo.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-[11px] text-slate-400">{task.assignedTo.name}</span>
        </div>
      )}
    </div>
  );
}
