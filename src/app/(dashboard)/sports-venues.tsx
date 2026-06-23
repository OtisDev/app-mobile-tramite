import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { findSetting } from "@/services/config.service";
import * as Location from "expo-location";
import LottieView from "lottie-react-native";
import { LucideRefreshCcw } from "lucide-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import WebView from "react-native-webview";

export default function SportsVenuesScreen() {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const getUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === "granted") {
      const location = await Location.getCurrentPositionAsync({});

      console.log(location.coords);
    }
  };

  const getMapUrl = () => {
    try {
      setRefreshing(true);
      findSetting("sports_venues_map_url")
        .then((setting) => {
          if (setting) {
            setMapUrl(setting.value);
            console.log("sports_venues_map_url", setting.value);
          } else {
            setMapUrl(null);
          }
        })
        .finally(() => setRefreshing(false));
    } catch (error) {
      setMapUrl(null);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getMapUrl();
  }, []);

  return (
    <ThemedView className="flex-1 relative bg-gray-100 dark:bg-gray-900">
      {mapUrl && !refreshing && (
        <WebView source={{ uri: mapUrl }} style={StyleSheet.absoluteFill} />
      )}

      {(mapUrl === null || refreshing) && (
        <View className="flex-1 items-center justify-center">
          <LottieView
            source={require("@/assets/animations/NotFound.json")}
            autoPlay
            loop
            style={{
              width: 300,
              height: 300,
              alignSelf: "center",
            }}
          />
          <Text className="text-2xl font-extrabold text-muted-foreground">
            Error
          </Text>
          <Text className="text-muted-foreground text-lg text-center px-4">
            No se pudo cargar el mapa de las lozas deportivas.
          </Text>
        </View>
      )}

      <Button
        variant={"ghost"}
        className="absolute bottom-4 right-4 z-50 bg-white dark:bg-black rounded-full shadow-lg p-4 h-14 w-14"
        onPress={() => getMapUrl()}
        disabled={refreshing}
      >
        <LucideRefreshCcw />
      </Button>
    </ThemedView>
  );
}
