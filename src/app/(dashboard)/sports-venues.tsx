import { ThemedView } from "@/components/themed-view";
import * as Location from "expo-location";
import { useRef } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";

const lozas = [
  {
    id: 1,
    nombre: "Loza Bellamar",
    latitud: -9.1195,
    longitud: -78.5132,
  },
  {
    id: 2,
    nombre: "Loza Casuarinas",
    latitud: -9.122,
    longitud: -78.52,
  },
];

export default function SportsVenuesScreen() {
  const mapRef = useRef<MapView>(null);

  const getUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === "granted") {
      const location = await Location.getCurrentPositionAsync({});

      console.log(location.coords);
    }
  };

  return (
    <ThemedView className="flex-1">
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        mapType="none"
        initialRegion={{
          latitude: -9.1195,
          longitude: -78.5132,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
        />
        {lozas.map((loza) => (
          <Marker
            key={loza.id}
            coordinate={{
              latitude: loza.latitud,
              longitude: loza.longitud,
            }}
            title={loza.nombre}
          />
        ))}
      </MapView>
    </ThemedView>
  );
}
