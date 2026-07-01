import { BottomTabInset, Spacing } from "@/constants/theme";
import { ReactNode, useRef } from "react";
import {
  Animated,
  RefreshControlProps,
  StatusBar,
  StyleSheet,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnimatedIcon } from "./animated-icon";
import { Text } from "./ui/text";

interface HeroCollapsibleProps {
  children?: ReactNode;
  refreshControl?: React.ReactElement<RefreshControlProps> | undefined;
}

interface HeroHeaderProps {
  scrollY: Animated.Value;
}

const HERO_MAX_HEIGHT = 420;
const HERO_MIN_HEIGHT = 260;

export function DefaultHeroCollapsibleHeader({ scrollY }: HeroHeaderProps) {
  const logoSize = scrollY.interpolate({
    inputRange: [0, HERO_MAX_HEIGHT - HERO_MIN_HEIGHT],
    outputRange: [140, 64],
    extrapolate: "clamp",
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, HERO_MAX_HEIGHT - HERO_MIN_HEIGHT],
    outputRange: [1, 0.8],
    extrapolate: "clamp",
  });

  const translateY = scrollY.interpolate({
    inputRange: [0, HERO_MAX_HEIGHT - HERO_MIN_HEIGHT],
    outputRange: [0, -20],
    extrapolate: "clamp",
  });

  return (
    <View style={{ flex: 1 }} className="w-full">
      {/* Fondo */}
      <Animated.Image
        source={{
          uri: "https://i.imgur.com/sKmvAad.jpeg",
        }}
        resizeMode="cover"
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [
              {
                scale: 1.15,
              },
            ],
          },
        ]}
      />

      {/* Oscurecer imagen */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "rgba(0,0,0,.5)",
          },
        ]}
      />

      <Animated.View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          transform: [{ translateY }],
        }}
      >
        <Animated.View
          style={{
            transform: [
              {
                scale: logoSize.interpolate({
                  inputRange: [64, 140],
                  outputRange: [0.5, 1],
                }),
              },
              {
                translateY: logoSize.interpolate({
                  inputRange: [64, 140],
                  outputRange: [80, 0],
                }),
              },
            ],
          }}
        >
          <AnimatedIcon />
        </Animated.View>

        <Animated.View
          style={{
            alignItems: "center",
            marginTop: 16,
            transform: [{ scale: titleScale }],
          }}
          className="w-full"
        >
          <Text
            variant="h3"
            className="text-white uppercase w-full text-center"
          >
            Municipalidad Distrital
          </Text>

          <Text
            variant="small"
            className="text-white uppercase text-center w-full"
          >
            de
          </Text>

          <Text
            variant="h1"
            className="text-yellow-400 uppercase w-full text-center"
          >
            Nuevo Chimbote
          </Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

export default function HeroCollapsible({
  children,
  refreshControl,
}: HeroCollapsibleProps) {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const scrollY = useRef(new Animated.Value(0)).current;

  const heroHeight = scrollY.interpolate({
    inputRange: [0, HERO_MAX_HEIGHT - HERO_MIN_HEIGHT],
    outputRange: [HERO_MAX_HEIGHT, HERO_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle={"light-content"} />
      <Animated.View
        style={[
          styles.hero,
          {
            height: heroHeight,
          },
        ]}
      >
        <DefaultHeroCollapsibleHeader scrollY={scrollY} />
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: insets.top + HERO_MAX_HEIGHT,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
        contentContainerClassName={"gap-6"}
        className="p-6 gap-6"
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: scrollY,
                },
              },
            },
          ],
          {
            useNativeDriver: false,
          },
        )}
        refreshControl={refreshControl}
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  hero: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    overflow: "hidden",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});
