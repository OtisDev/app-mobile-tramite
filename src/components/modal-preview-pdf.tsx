import { downloadFile } from "@/lib/file";
import { appendQueryParams } from "@/lib/utils";
import * as Sharing from "expo-sharing";
import {
  openBrowserAsync,
  WebBrowserPresentationStyle,
} from "expo-web-browser";
import {
  LucideBug,
  LucideDownloadCloud,
  LucideExternalLink,
} from "lucide-react-native";
import { Fragment, useState } from "react";
import { Dimensions, View } from "react-native";
import Modal from "react-native-modal";
import { WebView } from "react-native-webview";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Text } from "./ui/text";

export interface PdfPreviewProps {
  title?: string;
  fileName: string;
  url: string;
}

export interface ModalPreviewPdfProps extends PdfPreviewProps {
  isVisible?: boolean;
  onClose: () => void;
}

const { height, width } = Dimensions.get("window");

export default function ModalPreviewPdf({
  title,
  fileName,
  url,
  onClose,
  isVisible,
}: ModalPreviewPdfProps) {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const onOpenBrowser = async () => {
    const newUrl = appendQueryParams(url, {
      opwd: "IgDvg29X96tX76ZT",
      //stamp: true,
    });
    await openBrowserAsync(newUrl, {
      presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
    });
  };

  const onDownload = async () => {
    try {
      const newUrl = appendQueryParams(url, {
        opwd: "IgDvg29X96tX76ZT",
        //stamp: true,
        download: true,
      });
      setDownloading(true);
      downloadFile(newUrl, fileName)
        .then(async (result) => {
          if (result?.exists) {
            const available = await Sharing.isAvailableAsync();

            if (!available) {
              throw new Error("Sharing no disponible");
            }

            await Sharing.shareAsync(result.uri, {
              mimeType: "application/pdf",
              dialogTitle: "Abrir documento",
            });
          }
        })
        .catch((error) => setError(error.message))
        .finally(() => setDownloading(false));
    } catch (error: any) {
      onClose();
      setError(error.message);
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={{ margin: 0 }}
      className="absolute bottom-0 w-full"
    >
      <Card className="rounded-t-2xl rounded-b-none pb-0">
        {title && (
          <CardHeader>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="text-sm">{fileName}</CardDescription>
          </CardHeader>
        )}
        <CardContent className="flex-1 p-0 relative bg-gray-700">
          {isVisible && (
            <WebView
              title={title}
              source={{
                uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`,
              }}
              style={{
                flex: 1,
                height: height / 1.6,
              }}
              className="bg-gray-700 flex-1 w-full h-full absolute top-0 left-0 right-0 bottom-0"
              onLoadEnd={() => setLoaded(true)}
            />
          )}
          {loaded && (
            <Fragment>
              <Button
                onPress={onOpenBrowser}
                variant="dark"
                className="rounded-none h-10 w-10 absolute top-3 right-4"
              >
                <LucideExternalLink
                  className="text-gray-300"
                  color={"#fefefe"}
                />
              </Button>
              <Button
                onPress={onDownload}
                variant="dark"
                className="rounded-none h-10 w-10 absolute top-16 right-4"
              >
                <LucideDownloadCloud
                  className="text-gray-300"
                  color={"#fefefe"}
                />
              </Button>
            </Fragment>
          )}
          {downloading && (
            <View className="absolute bottom-0 right-0 bg-gray-50 rounded-tl-lg px-2 py-1">
              <Text className="text-gray-600">Descargando...</Text>
            </View>
          )}
          {error && (
            <View className="absolute bottom-0 left-0 w-full p-4">
              <Alert
                icon={LucideBug}
                variant="destructive"
                className="bg-red-50 border-destructive"
              >
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error || "Ocurrió un error al cargar el documento."}
                </AlertDescription>
              </Alert>
            </View>
          )}
        </CardContent>
      </Card>
    </Modal>
  );
}
