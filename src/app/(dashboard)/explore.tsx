import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CardExpedient from "@/components/card-expedient";
import KeyboardAvoidingWrapper from "@/components/keyboard-avoiding-wrapper";
import ModalExpedientForm from "@/components/modal-expedient-form";
import ModalPreviewPdf, {
  PdfPreviewProps,
} from "@/components/modal-preview-pdf";
import Loading from "@/components/shared/loading";
import { ThemedText } from "@/components/themed-text";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InputGroup } from "@/components/ui/input-group";
import { Text } from "@/components/ui/text";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { listExpedients } from "@/services/expedient.service";
import { useAuthStore } from "@/stores/auth.store";
import Expedient from "@/types/expedient.type";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { LucideInfo, LucideSearch, LucideX } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { RefreshControl } from "react-native";

const { height } = Dimensions.get("window");

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
  const [anio, setAnio] = useState<string>(new Date().getFullYear().toString());
  const [nExpediente, setNExpediente] = useState<string>("");
  const [pdfPreviewProps, setPdfPreviewProps] =
    useState<PdfPreviewProps | null>(null);
  const [showModalPreviewPdf, setShowModalPreviewPdf] =
    useState<boolean>(false);

  const fetchExpedientes = useCallback(() => {
    setRefreshing(true);
    listExpedients({
      n_solicitante: user?.id,
      codigo: nExpediente.length > 0 ? parseInt(nExpediente) : undefined,
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
  }, [anio, nExpediente, user?.dni, user?.id]);

  const handleOpenExpedientForm = () => {
    setShowModalExedientForm(true);
  };

  const handleOnPress = async (
    item: Expedient,
    action: "history" | "ticket",
  ) => {
    switch (action) {
      case "history":
        setPdfPreviewProps({
          title: "Hoja de Ruta del Expediente",
          fileName: `HOJA DE RUTA - ${item.document_type?.nom_tipodoc} N° ${item.n_expediente}-${item.ano_eje}.pdf`,
          url: `${process.env.EXPO_PUBLIC_API_URL}/pdf-expedient/history/${item.ano_eje}/${item.n_expediente}`,
        });
        break;
      case "ticket":
        setPdfPreviewProps({
          title: "Ticket del Expediente",
          fileName: `TICKET - ${item.document_type?.nom_tipodoc} N° ${item.n_expediente}-${item.ano_eje}.pdf`,
          url: `${process.env.EXPO_PUBLIC_API_URL}/pdf-expedient/ticket/${item.ano_eje}/${item.n_expediente}`,
        });
        break;
      default:
        setPdfPreviewProps(null);
        break;
    }

    if (action === "history" || action === "ticket") {
      setShowModalPreviewPdf(true);
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
      <KeyboardAvoidingWrapper
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchExpedientes}
          />
        }
        contentClassName="gap-4"
      >
        <View style={styles.container}>
          <View style={styles.titleContainer} className="bg-white">
            <ThemedText type="subtitle">Mis Trámites</ThemedText>
            <ThemedText style={styles.centerText} themeColor="textSecondary">
              Listado de mis trámites registrados. Puedes crear un nuevo{"\n"}
              trámite o consultar el estado de tus trámites anteriores.
            </ThemedText>

            <Button
              onPress={handleOpenExpedientForm}
              style={({ pressed }) => pressed && styles.pressed}
              className="rounded-full"
            >
              <Text>Nuevo Trámite</Text>
            </Button>
          </View>
          <View className="bg-white flex flex-col gap-4 p-6 border-b border-border mb-4">
            <View className="flex flex-row items-center gap-4">
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
                    <View className="flex flex-row items-center gap-2">
                      {nExpediente.length > 0 && (
                        <Pressable
                          onPress={() => setNExpediente("")}
                          style={({ pressed }) => pressed && styles.pressed}
                          className="py-1 pl-1"
                        >
                          <LucideX
                            size={20}
                            className="text-gray-600"
                            style={{ opacity: 0.8 }}
                          />
                        </Pressable>
                      )}
                      <Pressable
                        onPress={() => fetchExpedientes()}
                        style={({ pressed }) => pressed && styles.pressed}
                        className="py-1 pl-2 border-l border-border h-10 items-center justify-center"
                      >
                        <LucideSearch size={20} />
                      </Pressable>
                    </View>
                  }
                />
              </View>
            </View>
            <Alert icon={LucideInfo}>
              <AlertTitle>Importante</AlertTitle>
              <AlertDescription>
                Utilice su número de DNI/RUC/CE como contraseña para abrir los
                documentos PDF de sus trámites descargados.
              </AlertDescription>
            </Alert>
          </View>
          <View className="relative flex-1" style={styles.sectionsWrapper}>
            {refreshing && (
              <Loading animation="Gears" className="right-0" overlay={false} />
            )}
            {!refreshing &&
              expedientes.map((expediente) => (
                <CardExpedient
                  key={expediente.expediente_id.toString()}
                  item={expediente}
                  onPress={handleOnPress}
                />
              ))}
            {expedientes.length === 0 && !refreshing && (
              <View className="flex-1 flex flex-col items-center justify-center py-20">
                <LottieView
                  source={require("@/assets/animations/NotFound.json")}
                  autoPlay
                  loop
                  style={{
                    width: 220,
                    height: 220,
                    alignSelf: "center",
                    marginTop: -20,
                    marginBottom: -20,
                  }}
                />
                <Text className="text-lg text-muted-foreground">
                  No se han encontrado trámites
                </Text>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingWrapper>

      <ModalExpedientForm
        isVisible={showModalExedientForm}
        onClose={() => setShowModalExedientForm(false)}
        onSuccess={() => fetchExpedientes()}
      />

      {pdfPreviewProps && (
        <ModalPreviewPdf
          title={pdfPreviewProps.title || "Vista previa del PDF"}
          fileName={pdfPreviewProps.fileName || "documento.pdf"}
          url={pdfPreviewProps.url}
          onClose={() => setPdfPreviewProps(null)}
          isVisible={showModalPreviewPdf && pdfPreviewProps !== null}
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
    paddingTop: Spacing.six,
    paddingBottom: Spacing.three,
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
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
  sectionsWrapper: {
    gap: Spacing.four,
    paddingTop: Spacing.three,
    minHeight: height / 2,
  },
});
