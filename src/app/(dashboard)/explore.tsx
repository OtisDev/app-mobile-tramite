import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CardExpedient from "@/components/card-expedient";
import ModalExpedientForm from "@/components/modal-expedient-form";
import ModalPreviewPdf, { FilePreview } from "@/components/modal-preview-pdf";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { InputGroup } from "@/components/ui/input-group";
import { Text } from "@/components/ui/text";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { listExpedients } from "@/services/expedient.service";
import { useAuthStore } from "@/stores/auth.store";
import Expedient from "@/types/expedient.type";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { LucideSearch } from "lucide-react-native";
import { useEffect, useState } from "react";
import { RefreshControl } from "react-native";

export default function TabTwoScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();
  const router = useRouter();
  const { user, signedIn, logout } = useAuthStore();
  const [showModalExedientForm, setShowModalExedientForm] =
    useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showModalPreviewPdf, setShowModalPreviewPdf] =
    useState<boolean>(false);

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  const [expedientes, setExpedientes] = useState<Expedient[]>([]);
  const [selectedExpedient, setSelectedExpedient] =
    useState<FilePreview | null>(null);
  const [anio, setAnio] = useState<string>(new Date().getFullYear().toString());
  const [nExpediente, setNExpediente] = useState<string>("");

  const fetchExpedientes = () => {
    setRefreshing(true);
    listExpedients({
      n_solicitante: user?.id,
      codigo: nExpediente ? parseInt(nExpediente) : undefined,
      anio: anio,
      per_page: 20,
      screen: 5,
      dniruc: user?.dni,
    })
      .then((res) => {
        if (res.data.success) {
          setExpedientes(res.data.data);
        } else {
          setExpedientes([]);
        }
      })
      .finally(() => setRefreshing(false));
  };

  const handleOpenExpedientForm = () => {
    setShowModalExedientForm(true);
  };

  const handleOnPress = async (
    item: Expedient,
    action: "history" | "ticket",
  ) => {
    setShowModalPreviewPdf(true);

    switch (action) {
      case "history":
        setSelectedExpedient({
          title: `${item.document_type?.nom_tipodoc} N° ${item.n_expediente}-${item.ano_eje}`,
          url: `${process.env.EXPO_PUBLIC_API_URL}/pdf-expedient/history/${item.ano_eje}/${item.n_expediente}`,
          fileName: `history_${item.n_expediente}-${item.ano_eje}-history.pdf`,
        });
        break;
      case "ticket":
        setSelectedExpedient({
          title: `${item.document_type?.nom_tipodoc} N° ${item.n_expediente}-${item.ano_eje}`,
          url: `${process.env.EXPO_PUBLIC_API_URL}/pdf-expedient/ticket/${item.ano_eje}/${item.n_expediente}`,
          fileName: `ticket_${item.n_expediente}-${item.ano_eje}-ticket.pdf`,
        });
        break;
    }
  };

  useEffect(() => {
    fetchExpedientes();
  }, []);

  useEffect(() => {
    if (!signedIn) {
      logout();
      router.replace("/login");
    }
  }, [signedIn]);

  return (
    <>
      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.background }]}
        contentInset={insets}
        contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchExpedientes}
          />
        }
      >
        <ThemedView style={styles.container}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="subtitle">Mis Trámites</ThemedText>
            <ThemedText style={styles.centerText} themeColor="textSecondary">
              Listado de mis trámites registrados. Puedes crear un nuevo{"\n"}
              trámite o consultar el estado de tus trámites anteriores.
            </ThemedText>

            <Pressable
              onPress={handleOpenExpedientForm}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <ThemedView type="backgroundElement" style={styles.linkButton}>
                <ThemedText type="link">Nuevo Trámite</ThemedText>
              </ThemedView>
            </Pressable>
          </ThemedView>
          <ThemedView className="px-6 mb-6 flex flex-row items-center gap-4">
            <View className="w-32" style={{ minWidth: 100 }}>
              <InputGroup
                value={anio}
                onChangeText={setAnio}
                label="Año"
                keyboardType="number-pad"
              />
            </View>
            <View className="w-52" style={{ minWidth: 200 }}>
              <InputGroup
                label="N° Expediente"
                value={nExpediente}
                onChangeText={setNExpediente}
                placeholder="N° de Expediente"
                keyboardType="number-pad"
                suffix={
                  <Pressable
                    onPress={fetchExpedientes}
                    style={({ pressed }) => pressed && styles.pressed}
                    className="py-1 pl-1"
                  >
                    <LucideSearch size={20} />
                  </Pressable>
                }
              />
            </View>
          </ThemedView>
          <ThemedView className="relative" style={styles.sectionsWrapper}>
            {refreshing && (
              <View className="absolute inset-0 top-0 w-full h-full bg-white/80 z-50 flex items-center justify-center">
                <LottieView
                  source={require("@/assets/animations/Loading.json")}
                  autoPlay
                  loop
                  style={{
                    width: 300,
                    height: 250,
                    alignSelf: "center",
                    margin: "auto",
                  }}
                />
                <Text className="text-primary text-center z-50">
                  Cargando...
                </Text>
              </View>
            )}
            {expedientes.map((expediente) => (
              <CardExpedient
                key={expediente.expediente_id.toString()}
                item={expediente}
                onPress={handleOnPress}
              />
            ))}
          </ThemedView>
        </ThemedView>
      </ScrollView>

      <ModalExpedientForm
        isVisible={showModalExedientForm}
        onClose={() => setShowModalExedientForm(false)}
      />

      {selectedExpedient && (
        <ModalPreviewPdf
          isVisible={showModalPreviewPdf}
          url={selectedExpedient.url}
          title={selectedExpedient.title}
          fileName={selectedExpedient.fileName}
          onClose={() => {
            setSelectedExpedient(null);
            setShowModalPreviewPdf(false);
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
  },
  titleContainer: {
    gap: Spacing.three,
    alignItems: "center",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  centerText: {
    textAlign: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  linkButton: {
    flexDirection: "row",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
    justifyContent: "center",
    gap: Spacing.one,
    alignItems: "center",
  },
  sectionsWrapper: {
    gap: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
});
