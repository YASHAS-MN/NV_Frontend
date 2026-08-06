export type ModuleShellAdapter = {
  getPathname: () => string;
  navigate: (path: string) => void;
  getStorageItem: (key: string) => string | null;
  setStorageItem: (key: string, value: string) => void;
  removeStorageItem: (key: string) => void;
};

export function createBrowserShellAdapter(): ModuleShellAdapter {
  return {
    getPathname: () => (typeof window !== "undefined" ? window.location.pathname : ""),
    navigate: (path) => {
      if (typeof window !== "undefined") {
        window.location.assign(path);
      }
    },
    getStorageItem: (key) => {
      if (typeof window === "undefined") {
        return null;
      }

      return window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key);
    },
    setStorageItem: (key, value) => {
      if (typeof window === "undefined") {
        return;
      }

      window.localStorage.setItem(key, value);
      window.sessionStorage.setItem(key, value);
    },
    removeStorageItem: (key) => {
      if (typeof window === "undefined") {
        return;
      }

      window.localStorage.removeItem(key);
      window.sessionStorage.removeItem(key);
    },
  };
}
