import { AnimatedIcon } from "@/components/animated-icon";
import CardExpedient from "@/components/card-expedient";
import ExpedientFormModal from "@/components/expedients/form";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import Expedient from "@/types/expedient.type";
import LottieView from "lottie-react-native";
import { LucideSearch } from "lucide-react-native";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardHomeScreen() {
  const [showExpedientForm, setShowExpedientForm] = useState<boolean>(false);
  const [year, setYear] = useState<string | undefined>(
    new Date().getFullYear().toString(),
  );
  const [number, setNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<Expedient[]>([]);

  const onPressConsult = () => {
    setLoading(true);
    setSearchResult([
      {
        expediente_id: 1,
        ano_eje: "2026",
        n_expediente: 123,
        asunto: "Asunto del expediente 1",
      },
      {
        expediente_id: 2,
        ano_eje: "2026",
        n_expediente: 123,
        asunto: "Asunto del expediente 2",
      },
      {
        expediente_id: 3,
        ano_eje: "2026",
        n_expediente: 123,
        asunto: "Asunto del expediente 3",
      },
      {
        expediente_id: 4,
        ano_eje: "2026",
        n_expediente: 123,
        asunto: "Asunto del expediente 4",
      },
      {
        expediente_id: 5,
        ano_eje: "2026",
        n_expediente: 123,
        asunto: "Asunto del expediente 5",
      },
      {
        expediente_id: 6,
        ano_eje: "2026",
        n_expediente: 123,
        asunto: "Asunto del expediente 6",
      },
      {
        expediente_id: 7,
        ano_eje: "2026",
        n_expediente: 123,
        asunto: "Asunto del expediente 7",
      },
      {
        expediente_id: 8,
        ano_eje: "2026",
        n_expediente: 123,
        asunto: "Asunto del expediente 8",
      },
      {
        expediente_id: 9,
        ano_eje: "2026",
        n_expediente: 123,
        asunto: "Asunto del expediente 9",
      },
      {
        expediente_id: 10,
        ano_eje: "2026",
        n_expediente: 123,
        asunto: "Asunto del expediente 10",
      },
      {
        expediente_id: 11,
        ano_eje: "2026",
        n_expediente: 123,
        asunto: "Asunto del expediente 11",
      },
      {
        expediente_id: 12,
        ano_eje: "2026",
        n_expediente: 123,
        asunto: "Asunto del expediente 12",
      },
      {
        expediente_id: 13,
        ano_eje: "2026",
        n_expediente: 123,
        asunto: "Asunto del expediente 13",
      },
    ]);
  };

  const onPressNew = () => {
    setShowExpedientForm(true);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.heroSection}>
          <AnimatedIcon />
          <View className="flex items-center gap-1">
            <Text variant={"h3"} className="uppercase">
              Municipalidad Distrital
            </Text>
            <Text variant={"small"} className="uppercase">
              de
            </Text>
            <Text variant={"h1"} className="text-primary uppercase">
              Nuevo Chimbote
            </Text>
          </View>
        </View>
        <View className="flex-1 w-full mt-6">
          <View className="flex flex-row gap-4 items-center mb-4 px-6">
            <View className="flex flex-col items-start" style={{ width: 100 }}>
              <View className="flex flex-row gap-2 items-start">
                <Label>Año</Label>
                <Label className="text-red-500">*</Label>
              </View>
              <Input
                value={year}
                onChangeText={setYear}
                className="w-full"
                keyboardType="number-pad"
              />
            </View>
            <View className="flex flex-col items-start" style={{ width: 120 }}>
              <View className="flex flex-row gap-2 items-start">
                <Label>Número</Label>
                <Label className="text-red-500">*</Label>
              </View>
              <Input
                value={number}
                onChangeText={setNumber}
                className="w-full"
                keyboardType="number-pad"
              />
            </View>
            <View className="flex flex-col justify-end">
              <Button
                onPress={onPressConsult}
                variant={"outline"}
                className="mt-4"
              >
                <LucideSearch size={24} />
              </Button>
            </View>
          </View>
          {searchResult.length === 0 && (
            <View>
              <LottieView
                source={require("@/assets/animations/NotFound.json")}
                autoPlay
                loop
                style={{
                  width: 200,
                  height: 300,
                  alignSelf: "center",
                }}
              />
            </View>
          )}
          {searchResult.length > 0 && (
            <FlatList
              data={searchResult}
              keyExtractor={(item) => item.expediente_id.toString()}
              renderItem={({ item }) => <CardExpedient item={item} />}
            />
          )}
        </View>
      </SafeAreaView>

      <ExpedientFormModal
        isVisible={showExpedientForm}
        onClose={() => setShowExpedientForm(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  safeArea: {
    flex: 1,
    //paddingHorizontal: Spacing.four,
    alignItems: "center",
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    //flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: "center",
  },
  code: {
    textTransform: "uppercase",
  },
});
