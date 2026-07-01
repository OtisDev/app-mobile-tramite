import { cn } from "@/lib/utils";
import { Image } from "expo-image";
import { LucideX } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Dimensions, Pressable, View } from "react-native";
import Animated from "react-native-reanimated";
import { Text } from "./ui/text";

const { height: screenHeight, width: screenWidth } = Dimensions.get("screen");

export interface StartupDialogProps {
  defaultVisible?: boolean;
  title?: string;
  message?: string;
  url?: string;
  onClose?: () => void;
}

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function StartupDialog({
  title,
  message,
  url,
  onClose,
  defaultVisible = false,
}: StartupDialogProps) {
  const [isVisible, setIsVisible] = useState<boolean>(defaultVisible);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const containerClassName = useMemo(() => {
    return cn(
      "absolute inset-0 w-full h-full flex items-center justify-center bg-black/50 px-4",
      isVisible ? "" : "hidden",
    );
  }, [isVisible]);

  return (
    <View className={containerClassName} style={{ zIndex: 9999 }}>
      <View
        className={cn(
          "relative rounded-lg shadow-lg",
          title && message && "bg-white dark:bg-gray-800 p-6",
        )}
      >
        {title && <Text className="text-xl font-bold mb-2">{title}</Text>}
        {message && <Text className="text-base mb-4">{message}</Text>}
        {url && (
          <View
            className="rounded-lg"
            style={{
              minHeight: screenHeight * 0.3,
              width: "100%",
            }}
          >
            <AnimatedImage
              source={{ uri: url }}
              className="w-full h-full rounded-lg object-contain"
              style={{
                minHeight: screenHeight * 0.35,
                width: screenWidth * 0.93,
                borderRadius: 12,
              }}
            />
          </View>
        )}
        <Pressable
          onPress={handleClose}
          className="w-fit absolute -top-2 -right-2 p-2 rounded-full bg-gray-100 shadow-sm shadow-black/5 z-50"
          style={({ pressed }) => ({
            opacity: pressed ? 0.6 : 1,
          })}
        >
          {({ pressed }) => (
            <LucideX size={24} color={pressed ? "#6B7280" : "#000"} />
          )}
        </Pressable>
      </View>
    </View>
  );
}
