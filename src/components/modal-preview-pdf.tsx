import { downloadFile } from "@/lib/file";
import { appendQueryParams, cn } from "@/lib/utils";
import * as Sharing from "expo-sharing";
import {
  openBrowserAsync,
  WebBrowserPresentationStyle,
} from "expo-web-browser";
import {
  LucideBug,
  LucideDownloadCloud,
  LucideExternalLink,
  LucideRefreshCw,
} from "lucide-react-native";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Dimensions, View } from "react-native";
import Modal from "react-native-modal";
import { WebView } from "react-native-webview";
import Loading from "./shared/loading";
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
const ownerPassword = "IgDvg29X96tX76ZT";

export default function ModalPreviewPdf({
  title,
  fileName,
  url,
  onClose,
  isVisible,
}: ModalPreviewPdfProps) {
  const [downloading, setDownloading] = useState<boolean>(false);
  const [downloadingText, setDownloadingText] =
    useState<string>("Descargando...");
  const [error, setError] = useState<string | null>(null);
  const [loader, setLoader] = useState<boolean>(true);
  const [rendered, setRendered] = useState<boolean>(true);

  const urlWithParams = useMemo(() => {
    return appendQueryParams(url, {
      opwd: ownerPassword,
      stamp: true,
    });
  }, [url]);

  const onOpenBrowser = async () => {
    const newUrl = appendQueryParams(url, {
      //stamp: true,
    });
    await openBrowserAsync(newUrl, {
      presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
    });
  };

  const onDownload = async () => {
    try {
      const newUrl = appendQueryParams(url, {
        download: true,
      });
      setDownloading(true);
      setDownloadingText("Descargando...");
      downloadFile(newUrl, fileName)
        .then(async (result) => {
          if (result?.exists) {
            setDownloadingText("Descarga completada. Abriendo documento...");

            const available = await Sharing.isAvailableAsync();

            if (!available) {
              throw new Error("Sharing no disponible");
            }

            await Sharing.shareAsync(result.uri, {
              mimeType: "application/pdf",
              dialogTitle: `ABRIR DOCUMENTO / ${fileName}`,
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

  const onRefresh = () => {
    setError(null);
    setLoader(true);
    setRendered(false);
    setTimeout(() => {
      setRendered(true);
    }, 1000);
  };

  useEffect(() => {
    if (!isVisible) {
      setRendered(true);
      setError(null);
    }
  }, [isVisible]);

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
        <CardContent
          className="flex-1 p-0 relative bg-gray-700"
          style={{ height: height / 1.6 }}
        >
          {loader && (
            <View
              className={cn(
                "w-full z-40 bg-white flex-1 h-full",
                rendered && "absolute",
              )}
            >
              <Loading animation="Gears" size={200} />
            </View>
          )}
          {isVisible && rendered && (
            <WebView
              title={title}
              source={{
                uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(urlWithParams)}`,
              }}
              className="bg-gray-700 flex-1 w-full h-full absolute top-0 left-0 right-0 bottom-0"
              onLoadEnd={() => {
                setLoader(false);
              }}
              onError={(event) => {
                const { description, code } = event.nativeEvent;
                console.log(`WebView error:`, event);
                setError(
                  `Ocurrió un error al cargar el documento: ${code} - ${description}`,
                );
              }}
            />
          )}
          <Fragment>
            <Button
              onPress={onOpenBrowser}
              variant="dark"
              className="rounded-none h-10 w-10 absolute top-3 right-4"
              disabled={loader}
            >
              <LucideExternalLink className="text-gray-300" color={"#fefefe"} />
            </Button>
            <Button
              onPress={onDownload}
              variant="dark"
              className="rounded-none h-10 w-10 absolute top-16 right-4"
              disabled={loader}
            >
              <LucideDownloadCloud
                className="text-gray-300"
                color={"#fefefe"}
              />
            </Button>
            <Button
              onPress={onRefresh}
              variant="dark"
              className="rounded-none h-10 w-10 absolute right-4"
              style={{ top: 115 }}
            >
              <LucideRefreshCw className="text-gray-300" color={"#fefefe"} />
            </Button>
          </Fragment>
          {downloading && (
            <View className="absolute bottom-0 right-0 bg-gray-50 rounded-tl-lg px-2 py-1 z-50 border-t border-l border-border">
              <Text className="text-gray-600">{downloadingText}</Text>
            </View>
          )}
          {error && (
            <View className="absolute bottom-0 left-0 w-full p-4 z-50">
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
