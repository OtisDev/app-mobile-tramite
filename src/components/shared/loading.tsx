import { cn } from "@/lib/utils";
import { AnimationName, animations } from "@/types";
import LottieView from "lottie-react-native";
import React, { useMemo } from "react";
import { View } from "react-native";
import { Text } from "../ui/text";

export interface LoadingProps {
  animation?: AnimationName;
  message?: string;
  size?:
    | number
    | {
        width: number;
        height: number;
      };
  className?: string;
  animationStyle?: Omit<
    React.ComponentProps<typeof LottieView>["style"],
    "width" | "height"
  >;
  messageClassName?: string;
}

export default function Loading({
  animation = "Loading",
  message = "Cargando...",
  size = 300,
  className,
  animationStyle,
  messageClassName,
}: LoadingProps) {
  const animationSize = useMemo(() => {
    if (typeof size === "number") {
      return { width: size, height: size };
    }
    return size;
  }, [size]);

  return (
    <View className={cn("absolute w-full h-full bg-white/80 z-50", className)}>
      <View className="flex flex-col m-auto">
        <LottieView
          source={animations[animation]}
          autoPlay
          loop
          style={{
            ...animationSize,
            alignSelf: "center",
            marginLeft: "auto",
            marginRight: "auto",
            ...animationStyle,
          }}
        />
        {message && (
          <Text
            className={cn(
              "text-muted-foreground text-center",
              messageClassName,
            )}
          >
            {message}
          </Text>
        )}
      </View>
    </View>
  );
}
