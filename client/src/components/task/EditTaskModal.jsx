import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { updateTaskSchema } from '../../validation/taskValidation';

export default function EditTaskModal({ isOpen, onClose, onSubmit, task }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    tags: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        tags: (task.tags || []).join(', '),
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const tagsArray = form.tags
      ? form.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const payload = {
      title: form.title,
      description: form.description,
      status: form.status,
      priority: form.priority,
      tags: tagsArray,
    };

    const result = updateTaskSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(task._id, result.data);
      onClose();
    } catch (err) {
      setErrors({ general: err.response?.data?.msg || 'Failed to update task' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
            {errors.general}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 ${
              errors.title ? 'border-red-300 bg-red-50/50' : 'border-slate-200'
            }`}
            autoFocus
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm outline-none resize-none transition-colors focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm outline-none bg-white transition-colors focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm outline-none bg-white transition-colors focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Tags</label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="Comma separated tags"
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm outline-none transition-colors focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-sky-500 to-indigo-500 rounded-lg hover:from-sky-600 hover:to-indigo-600 transition-all disabled:opacity-50 shadow-md shadow-sky-200"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
