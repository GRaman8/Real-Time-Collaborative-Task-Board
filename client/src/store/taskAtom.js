import { atom, selector } from 'recoil';

export const tasksAtom = atom({
  key: 'tasksAtom',
  default: [],
});

export const tasksLoadingAtom = atom({
  key: 'tasksLoadingAtom',
  default: false,
});

export const todoTasksSelector = selector({
  key: 'todoTasks',
  get: ({ get }) => {
    const tasks = get(tasksAtom);
    return tasks.filter(t => t.status === 'todo').sort((a, b) => a.position - b.position);
  },
});

export const inProgressTasksSelector = selector({
  key: 'inProgressTasks',
  get: ({ get }) => {
    const tasks = get(tasksAtom);
    return tasks.filter(t => t.status === 'in-progress').sort((a, b) => a.position - b.position);
  },
});

export const doneTasksSelector = selector({
  key: 'doneTasks',
  get: ({ get }) => {
    const tasks = get(tasksAtom);
    return tasks.filter(t => t.status === 'done').sort((a, b) => a.position - b.position);
  },
});
