import { SharedRefType } from "expo";
import { Image, ImageSource } from "expo-image";
import { SFSymbol } from "expo-symbols";
import { StyleSheet } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

interface HeroBackgroundProps {
  source?:
    | ImageSource
    | `sf:${SFSymbol}`
    | (string & {})
    | number
    | ImageSource[]
    | string[]
    | SharedRefType<"image">
    | null;
  scrollY: SharedValue<number>;
}

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function HeroBackground({
  source,
  scrollY,
}: HeroBackgroundProps) {
  const imageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, 220],
            [-80, -80],
            Extrapolation.CLAMP,
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [0, 220],
            [1, 1.15],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const overlayStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, 220],
            [-80, -65],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFill]}>
      <AnimatedImage
        source={source}
        contentFit="cover"
        style={[StyleSheet.absoluteFill, imageStyle]}
      />

      {/* Overlay */}
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.overlay, overlayStyle]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0,0,0,.20)",
  },
});
