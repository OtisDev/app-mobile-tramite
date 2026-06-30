import { SharedRefType } from "expo";
import { Image, ImageSource } from "expo-image";
import { SFSymbol } from "expo-symbols";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

interface HeroLogoProps {
  scrollY: SharedValue<number>;
  source?:
    | ImageSource
    | `sf:${SFSymbol}`
    | (string & {})
    | number
    | ImageSource[]
    | string[]
    | SharedRefType<"image">
    | null;
}

const AnimatedImage = Animated.createAnimatedComponent(Image);
const { width: screenWidth } = Dimensions.get("screen");

export default function HeroLogo({ scrollY, source }: HeroLogoProps) {
  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, 220],
            [0, -10],
            Extrapolation.CLAMP,
          ),
        },
      ],
      left: interpolate(
        scrollY.value,
        [0, 220],
        [0, screenWidth - 160],
        Extrapolation.CLAMP,
      ),
    };
  });

  const logoStyle = useAnimatedStyle(() => {
    const size = interpolate(
      scrollY.value,
      [0, 220],
      [150, 90],
      Extrapolation.CLAMP,
    );

    return {
      width: size,
      height: size,
    };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View
        style={[styles.circle, logoStyle]}
        className="rounded-full bg-white p-1"
      >
        <AnimatedImage
          source={source}
          contentFit="contain"
          style={styles.image}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 10,
    alignItems: "center",
    zIndex: 20,
  },

  circle: {
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 12,
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
  },
});
