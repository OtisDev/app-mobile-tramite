import React, { Fragment } from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface CirclePulseButtonProps {
  width: number;
  height: number;
  borderRadius?: number;
  color?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  style?:
    | Omit<StyleProp<ViewStyle>, "width" | "height" | "borderRadius">
    | undefined;
  className?: string;
  disabled?: boolean;
}

export default function CirclePulseButton({
  width,
  height,
  borderRadius,
  color = "#ef4444", //"#D32F2F",
  onPress,
  children,
  style,
  className,
  disabled = false,
}: CirclePulseButtonProps) {
  const pulse = useSharedValue(0);

  React.useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, {
        duration: 1800,
        easing: Easing.out(Easing.ease),
      }),
      -1,
      false,
    );
  }, []);

  const pulseStyle1 = useAnimatedStyle(() => ({
    transform: [
      {
        scale: 0.1 + pulse.value * 1.5,
      },
    ],
    opacity: 0.35 * (1 - pulse.value),
  }));

  const pulseStyle2 = useAnimatedStyle(() => ({
    transform: [
      {
        scale: pulse.value * 2,
      },
    ],
    opacity: 0.2 * (1 - pulse.value),
  }));

  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          width: width * 1.5,
          height: height * 1.5,
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
      className={className}
      disabled={disabled}
    >
      {({ pressed }) => (
        <Fragment>
          <Animated.View
            style={[
              {
                position: "absolute",
                width: width,
                height: height,
                backgroundColor: color,
                borderRadius,
              },
              pulseStyle1,
            ]}
          />

          <Animated.View
            style={[
              {
                position: "absolute",
                width: width,
                height: height,
                backgroundColor: color,
                borderRadius,
              },
              pulseStyle2,
            ]}
          />

          <Animated.View
            style={[
              {
                width: width,
                height: height,
                backgroundColor: color,
                justifyContent: "center",
                alignItems: "center",
                elevation: 8,
                shadowColor: color,
                shadowOpacity: 0.35,
                shadowRadius: 10,
                borderRadius,
              },
              pressed && {
                transform: [{ scale: 0.95 }],
                shadowOpacity: 0.2,
                shadowRadius: 5,
                opacity: 0.7,
              },
            ]}
            className={"gap-2"}
          >
            {children}
          </Animated.View>
        </Fragment>
      )}
    </Pressable>
  );
}
