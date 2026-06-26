import { useAuthStore } from '@/stores/auth.store';
import { File, Paths } from 'expo-file-system';

export type DownloadProgressCallback = (bytesWritten: number, totalBytes: number) => void;

export const downloadFile = async (url: string, fileName: string, onProgress?: DownloadProgressCallback) => {
  const token = useAuthStore.getState().token;
  const dest = new File(Paths.document, fileName);
  const downloadTask = File.createDownloadTask(url, dest, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    onProgress: ({ bytesWritten, totalBytes }) => {
      onProgress?.(bytesWritten, totalBytes);
    }
  });
  return await downloadTask.downloadAsync();
}