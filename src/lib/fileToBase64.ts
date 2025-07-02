import { readFile } from '@tauri-apps/plugin-fs';
import { extname } from '@tauri-apps/api/path';

export const fileToBase64 = async (path: string) => {
  const binary = await readFile(path);
  const ext = await extname(path); // e.g. ".jpg"
  const base64 = btoa(
    binary.reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
  return `data:image/${ext.replace('.', '')};base64,${base64}`;
};
