import { Image } from "expo-image";
import { useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
  Easing,
  Keyframe,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const INITIAL_SCALE_FACTOR = Dimensions.get("screen").height / 90;
const DURATION = 600;

interface AnimatedIconProps {
  /**
   * Valor del scroll del Hero.
   * Si no se envía, el logo mantiene su tamaño normal.
   */
  scrollY?: SharedValue<number>;
}

export function AnimatedSplashOverlay() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const splashKeyframe = new Keyframe({
    0: {
      transform: [{ scale: INITIAL_SCALE_FACTOR }],
      opacity: 1,
    },
    20: {
      opacity: 1,
    },
    70: {
      opacity: 0,
      easing: Easing.elastic(0.7),
    },
    100: {
      opacity: 0,
      transform: [{ scale: 1 }],
      easing: Easing.elastic(0.7),
    },
  });

  return (
    <Animated.View
      entering={splashKeyframe.duration(DURATION).withCallback((finished) => {
        "worklet";

        if (finished) {
          scheduleOnRN(setVisible, false);
        }
      })}
      style={styles.backgroundSolidColor}
    />
  );
}

const keyframe = new Keyframe({
  0: {
    transform: [{ scale: INITIAL_SCALE_FACTOR }],
  },
  100: {
    transform: [{ scale: 1 }],
    easing: Easing.elastic(0.7),
  },
});

const logoKeyframe = new Keyframe({
  0: {
    transform: [{ scale: 1.3 }],
    opacity: 0,
  },
  40: {
    transform: [{ scale: 1.3 }],
    opacity: 0,
    easing: Easing.elastic(0.7),
  },
  100: {
    opacity: 1,
    transform: [{ scale: 1 }],
    easing: Easing.elastic(0.7),
  },
});

const glowKeyframe = new Keyframe({
  0: {
    transform: [{ rotateZ: "0deg" }],
  },
  100: {
    transform: [{ rotateZ: "7200deg" }],
  },
});

export function AnimatedIcon({ scrollY }: AnimatedIconProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const progress = scrollY ? scrollY.value : 0;

    const size = interpolate(progress, [0, 300], [128, 48], "clamp");

    const glow = interpolate(progress, [0, 300], [201, 76], "clamp");

    const logoWidth = interpolate(progress, [0, 300], [76, 30], "clamp");

    const logoHeight = interpolate(progress, [0, 300], [90, 36], "clamp");

    return {
      width: size,
      height: size,
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    const progress = scrollY ? scrollY.value : 0;

    return {
      width: interpolate(progress, [0, 300], [201, 76], "clamp"),
      height: interpolate(progress, [0, 300], [201, 76], "clamp"),
    };
  });

  const logoStyle = useAnimatedStyle(() => {
    const progress = scrollY ? scrollY.value : 0;

    return {
      width: interpolate(progress, [0, 300], [76, 30], "clamp"),
      height: interpolate(progress, [0, 300], [90, 36], "clamp"),
    };
  });

  return (
    <Animated.View style={[styles.iconContainer, animatedStyle]}>
      <Animated.View
        entering={glowKeyframe.duration(60 * 1000 * 4)}
        style={[styles.glow, glowStyle]}
      >
        <Image
          source={require("@/assets/images/logo-glow.png")}
          style={StyleSheet.absoluteFill}
          contentFit="contain"
        />
      </Animated.View>

      <Animated.View
        entering={keyframe.duration(DURATION)}
        style={[styles.background, animatedStyle]}
      />

      <Animated.View
        entering={logoKeyframe.duration(DURATION)}
        style={styles.imageContainer}
      >
        <Animated.Image
          source={require("@/assets/images/logo-mdnch.png")}
          style={logoStyle}
          className={"object-cover"}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },

  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  glow: {
    position: "absolute",
  },

  background: {
    position: "absolute",
    borderRadius: 999,
    overflow: "hidden",

    experimental_backgroundImage: "linear-gradient(180deg,#FFFFFF, #B8C4D7)",
    backgroundColor: "#FFFFFF",
  },

  backgroundSolidColor: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#FFFFFF",
    zIndex: 1000,
  },
});
