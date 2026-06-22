import { useAuthStore } from "@/stores/auth.store";
import Modal from "react-native-modal";
import { WebView } from "react-native-webview";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export interface FilePreview {
  title?: string;
  fileName: string;
  url: string;
}

export interface ModalPreviewPdfProps extends FilePreview {
  isVisible?: boolean;
  onClose: () => void;
}

export default function ModalPreviewPdf({
  title,
  fileName,
  url,
  onClose,
  isVisible,
}: ModalPreviewPdfProps) {
  const { token } = useAuthStore();
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={{ margin: 0 }}
      className="absolute bottom-0 w-full"
    >
      <Card className="rounded-t-2xl rounded-b-none">
        {title && (
          <CardHeader>
            <CardTitle className="text-lg">{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <WebView
            source={{
              uri: url,
              headers: {
                //Accept: "application/pdf",
                Authorization: `Bearer ${token}`,
              },
            }}
            style={{ flex: 1 }}
            className="bg-green-500 w-full h-full max-h-[80vh] border border-border rounded-lg min-h-[50%]"
          />
        </CardContent>
      </Card>
    </Modal>
  );
}
