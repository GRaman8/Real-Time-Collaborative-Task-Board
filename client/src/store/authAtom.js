import { atom } from 'recoil';

const storedUser = (() => {
  try {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  } catch { return null; }
})();

export const authAtom = atom({
  key: 'authAtom',
  default: {
    user: storedUser,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
  },
});
