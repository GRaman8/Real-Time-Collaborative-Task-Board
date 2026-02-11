import { useState } from 'react';
import Modal from '../ui/Modal';
import { createBoardSchema } from '../../validation/boardValidation';

export default function CreateBoardModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const result = createBoardSchema.safeParse(form);
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
      await onSubmit(result.data);
      setForm({ name: '', description: '' });
      onClose();
    } catch (err) {
      setErrors({ general: err.response?.data?.msg || 'Failed to create board' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({ name: '', description: '' });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Board">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
            {errors.general}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Board Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Sprint 24, Marketing Campaign"
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 ${
              errors.name ? 'border-red-300 bg-red-50/50' : 'border-slate-200 bg-white'
            }`}
            autoFocus
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="What is this board for?"
            rows={3}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors outline-none resize-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 ${
              errors.description ? 'border-red-300 bg-red-50/50' : 'border-slate-200 bg-white'
            }`}
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-sky-500 to-indigo-500 rounded-lg hover:from-sky-600 hover:to-indigo-600 transition-all disabled:opacity-50 shadow-md shadow-sky-200"
          >
            {loading ? 'Creating...' : 'Create Board'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
