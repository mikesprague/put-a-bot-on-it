import fs from 'node:fs';
import path from 'node:path';

const storageDir = () =>
  process.env.STORAGE_DIR ??
  (process.env.NODE_ENV === 'production'
    ? '/local-storage'
    : './local-storage');

export const readHistory = (key) => {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(storageDir(), `${key}.json`), 'utf8')
    );
  } catch {
    return [];
  }
};

export const writeHistory = (key, value) => {
  const dir = storageDir();
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${key}.json`), JSON.stringify(value));
};

export const removeHistory = (key) => {
  try {
    fs.unlinkSync(path.join(storageDir(), `${key}.json`));
  } catch {}
};

export const trimHistory = (history) =>
  history.length > 9 ? history.slice(-9) : history;
