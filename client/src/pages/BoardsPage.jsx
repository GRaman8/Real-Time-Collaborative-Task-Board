import { useState, useEffect, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { boardsAtom, boardsLoadingAtom } from '../store/boardAtom';
import { getBoards, createBoard, updateBoard, deleteBoard } from '../api/boards';
import BoardCard from '../components/board/BoardCard';
import CreateBoardModal from '../components/board/CreateBoardModal';
import EditBoardModal from '../components/board/EditBoardModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function BoardsPage() {
  const [boards, setBoards] = useRecoilState(boardsAtom);
  const [loading, setLoading] = useRecoilState(boardsLoadingAtom);
  const [showCreate, setShowCreate] = useState(false);
  const [editBoard, setEditBoard] = useState(null);
  const [error, setError] = useState('');

  const fetchBoards = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBoards();
      setBoards(data);
    } catch (err) {
      setError('Failed to load boards');
    } finally {
      setLoading(false);
    }
  }, [setBoards, setLoading]);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const handleCreate = async (boardData) => {
    const newBoard = await createBoard(boardData);
    setBoards((prev) => [...prev, newBoard]);
  };

  const handleUpdate = async (id, boardData) => {
    const updated = await updateBoard(id, boardData);
    setBoards((prev) => prev.map((b) => (b._id === id ? { ...b, ...updated } : b)));
    setEditBoard(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this board? All tasks will be lost.')) return;
    try {
      await deleteBoard(id);
      setBoards((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      setError('Failed to delete board');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-sky-50/30 to-indigo-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Your Boards</h1>
            <p className="text-sm text-slate-500 mt-1">
              {boards.length} board{boards.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl hover:from-sky-600 hover:to-indigo-600 transition-all shadow-lg shadow-sky-200/50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Board
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : boards.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-100 mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" /><path d="M9 21V9" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No boards yet</h3>
            <p className="text-sm text-slate-500 mb-6">Create your first board to start organizing tasks</p>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl hover:from-sky-600 hover:to-indigo-600 transition-all shadow-lg shadow-sky-200/50"
            >
              Create Your First Board
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {boards.map((board) => (
              <BoardCard
                key={board._id}
                board={board}
                onEdit={setEditBoard}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateBoardModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
      />
      <EditBoardModal
        isOpen={!!editBoard}
        onClose={() => setEditBoard(null)}
        onSubmit={handleUpdate}
        board={editBoard}
      />
    </div>
  );
}
