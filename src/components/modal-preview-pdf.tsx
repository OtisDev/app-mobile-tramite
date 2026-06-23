import {
  openBrowserAsync,
  WebBrowserPresentationStyle,
} from "expo-web-browser";
import { LucideDownloadCloud } from "lucide-react-native";
import { Dimensions, View } from "react-native";
import Modal from "react-native-modal";
import { WebView } from "react-native-webview";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Text } from "./ui/text";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

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
  const onClickDownload = async () => {
    await openBrowserAsync(url, {
      presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
    });
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
          </CardHeader>
        )}
        <CardContent className="flex-1 p-0 relative">
          {isVisible && (
            <WebView
              source={{
                uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`,
              }}
              style={{
                flex: 1,
                height: height / 1.6,
              }}
              className="flex-1 bg-green-500 w-full h-full absolute top-0 left-0 right-0 bottom-0"
            />
          )}
          <View className="absolute top-20 right-2 flex items-center justify-center w-full pb-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onPress={onClickDownload}
                  variant="dark"
                  className="rounded-none h-10 w-10"
                >
                  <LucideDownloadCloud
                    className="text-gray-300"
                    color={"#fefefe"}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <Text>Descargar</Text>
              </TooltipContent>
            </Tooltip>
          </View>
        </CardContent>
      </Card>
    </Modal>
  );
}
