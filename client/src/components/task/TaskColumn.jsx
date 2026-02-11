import { Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';

const columnConfig = {
  todo: {
    title: 'To Do',
    accent: 'from-slate-400 to-slate-500',
    bg: 'bg-slate-50',
    count: 'bg-slate-200 text-slate-600',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  'in-progress': {
    title: 'In Progress',
    accent: 'from-sky-400 to-blue-500',
    bg: 'bg-sky-50/50',
    count: 'bg-sky-200 text-sky-700',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4" /><path d="M12 18v4" /><path d="m4.93 4.93 2.83 2.83" /><path d="m16.24 16.24 2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" /><path d="m4.93 19.07 2.83-2.83" /><path d="m16.24 7.76 2.83-2.83" />
      </svg>
    ),
  },
  done: {
    title: 'Done',
    accent: 'from-emerald-400 to-green-500',
    bg: 'bg-emerald-50/50',
    count: 'bg-emerald-200 text-emerald-700',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" />
      </svg>
    ),
  },
};

export default function TaskColumn({ status, tasks, onEditTask, onDeleteTask }) {
  const config = columnConfig[status];

  return (
    <div className={`flex flex-col rounded-xl ${config.bg} border border-slate-200/60 min-h-[300px]`}>
      {/* Column header */}
      <div className="px-4 py-3 border-b border-slate-200/60">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${config.accent} flex items-center justify-center text-white shadow-sm`}>
            {config.icon}
          </div>
          <h3 className="text-sm font-semibold text-slate-700">{config.title}</h3>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${config.count}`}>
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-2.5 space-y-2.5 transition-colors ${
              snapshot.isDraggingOver ? 'bg-sky-50/70' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(dragProvided, dragSnapshot) => (
                  <TaskCard
                    task={task}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    provided={dragProvided}
                    isDragging={dragSnapshot.isDragging}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            {/* Empty state */}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex items-center justify-center py-8 text-xs text-slate-400">
                Drop tasks here
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
