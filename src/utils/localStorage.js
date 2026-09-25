import { INITIAL_DATA } from './dummyData';

const COLLECTIONS = [
  'books',
  'students',
  'transactions',
  'users',
  'categories',
  'notifications',
  'settings'
];

export const initLocalStorage = () => {
  const isInitialized = localStorage.getItem('isInitialized');
  if (!isInitialized) {
    Object.keys(INITIAL_DATA).forEach(key => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(INITIAL_DATA[key]));
      }
    });
    if (!localStorage.getItem('notifications')) {
      localStorage.setItem('notifications', JSON.stringify([]));
    }
    // Don't set users yet, it happens during Admin setup
  }
};

export const setAsInitialized = () => {
  localStorage.setItem('isInitialized', 'true');
};

export const getData = (collection) => {
  const data = localStorage.getItem(collection);
  return data ? JSON.parse(data) : [];
};

export const getObject = (collection) => {
  const data = localStorage.getItem(collection);
  return data ? JSON.parse(data) : null;
};

export const saveData = (collection, data) => {
  localStorage.setItem(collection, JSON.stringify(data));
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};
