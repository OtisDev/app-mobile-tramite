import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HERO_HEIGHT = 320;
const HERO_MIN_HEIGHT = 180;

export interface HeroCollapsibleProps {
  heroHeight?: number;
  heroMinHeight?: number;
  hero?: (scrollY: SharedValue<number>) => ReactNode;
  heroClassName?: string;
  children?: ReactNode;
  contentClassName?: string;
}

export default function HeroCollapsible({
  heroHeight = HERO_HEIGHT,
  heroMinHeight = HERO_MIN_HEIGHT,
  hero,
  heroClassName,
  children,
  contentClassName,
}: HeroCollapsibleProps) {
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll(event) {
      scrollY.value = event.contentOffset.y;
    },
  });

  const heroStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollY.value,
        [0, 220],
        [heroHeight, heroMinHeight],
        Extrapolation.CLAMP,
      ),
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      paddingTop: heroHeight,
    };
  });

  return (
    <>
      <Animated.View
        style={[
          heroStyle,
          {
            zIndex: 100,
          },
        ]}
        className={cn(
          "absolute top-0 left-0 right-0 bottom-0 overflow-hidden",
          heroClassName,
        )}
      >
        {hero?.(scrollY)}
      </Animated.View>

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 40,
        }}
        contentContainerClassName={cn("px-6 pt-6 gap-4", contentClassName)}
      >
        <Animated.View style={contentStyle}>{children}</Animated.View>
      </Animated.ScrollView>
    </>
  );
}
