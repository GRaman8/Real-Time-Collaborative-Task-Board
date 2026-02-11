import { atom } from 'recoil';

export const boardsAtom = atom({
  key: 'boardsAtom',
  default: [],
});

export const currentBoardAtom = atom({
  key: 'currentBoardAtom',
  default: null,
});

export const boardsLoadingAtom = atom({
  key: 'boardsLoadingAtom',
  default: false,
});
