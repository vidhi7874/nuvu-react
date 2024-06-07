export const localStorageService = {
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove: (key) => {
    localStorage.removeItem(key);
  },
  get: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};
