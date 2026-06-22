import { useAuthStore } from '@/stores/auth.store';
import { File, Paths } from 'expo-file-system';

export const downloadFile = async (url: string, fileName: string) => {
  const token = useAuthStore.getState().token;
  const dest = new File(Paths.document, fileName);
  const downloadTask = File.createDownloadTask(url, dest, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    onProgress: ({ bytesWritten, totalBytes }) => {
      console.log(`Downloaded ${bytesWritten} of ${totalBytes} bytes`);
    }
  });
  return await downloadTask.downloadAsync();
}