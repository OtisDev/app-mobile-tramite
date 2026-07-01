import ButtonIcon from "@/components/button-icon";
import HeroCollapsible from "@/components/HeroCollapsible";
import ModalExpedientForm from "@/components/modal-expedient-form";
import ModalTakeOutYourTrash from "@/components/modal-saca-tu-basura";
import StartupDialog from "@/components/startup-dialog";
import { ThemedView } from "@/components/themed-view";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CardCollapsible } from "@/components/ui/card-collapsible";
import CirclePulseButton from "@/components/ui/circle-pulse-button";
import { Text } from "@/components/ui/text";
import { BottomTabInset, Spacing } from "@/constants/theme";
import { openBrowserUrl } from "@/lib/utils";
import { appSettings } from "@/services/config.service";
import { useAppStore } from "@/stores/app.store";
import { useAuthStore } from "@/stores/auth.store";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import {
  LucideBookTemplate,
  LucideClock,
  LucideIcon,
  LucideInfo,
  LucidePlus,
  LucideSiren,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { RefreshControl, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ButtonAction {
  key: string;
  label: string;
  icon?: LucideIcon;
  onPress: () => void;
}

export default function DashboardHomeScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const router = useRouter();
  const { user, logout, signedIn } = useAuthStore();
  const { settings, setSettings } = useAppStore();
  const [loading, setLoading] = useState<boolean>(false);
  const { width } = useWindowDimensions();
  const [showExpedientForm, setShowExpedientForm] = useState<boolean>(false);
  const [showTakeOutYourTrashModal, setShowTakeOutYourTrashModal] =
    useState<boolean>(false);

  const actions: ButtonAction[] = [
    {
      key: "new-tramite",
      label: "Nuevo\ntrámite",
      icon: LucidePlus,
      onPress: () => setShowExpedientForm(true),
    },
    {
      key: "take-out-your-trash",
      label: "Saca tu\nbasura",
      icon: LucideClock,
      onPress: () => setShowTakeOutYourTrashModal(true),
    },
    {
      key: "complaint-book",
      label: "Reportar incidencia",
      icon: LucideBookTemplate,
      onPress: () => {},
    },
  ];

  const groupedActions = useMemo(() => {
    const _groupedActions = [];

    for (let i = 0; i < actions.length; i += 3) {
      _groupedActions.push(actions.slice(i, i + 3));
    }

    return _groupedActions;
  }, [actions]);

  const onLoadSettings = () => {
    setLoading(true);
    appSettings()
      .then((s) => {
        setSettings(s);
      })
      .finally(() => setLoading(false));
  };

  const onSendAlert = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === "granted") {
      const location = await Location.getCurrentPositionAsync();

      console.log(location.coords);
    }
  };

  useEffect(() => {
    if (!signedIn) {
      logout();
      router.replace("/login");
    }
  }, [signedIn]);

  useEffect(() => {
    onLoadSettings();
  }, []);

  return (
    <ThemedView className="flex-1 flex items-center">
      <HeroCollapsible
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onLoadSettings}
            style={{ zIndex: 8888 }}
          />
        }
      >
        <View className="w-full">
          <Alert icon={LucideInfo}>
            <AlertTitle className="text-base -mt-1">Bienvenido</AlertTitle>
            <AlertDescription className="text-justify break-all">
              {user?.name}, bienvenido a la aplicación de la Municipalidad
              Distrital de Nuevo Chimbote.
            </AlertDescription>
          </Alert>
        </View>
        <View className="w-full gap-2">
          <CirclePulseButton
            width={(width - 48 - 32) / 3}
            height={112}
            style={{ alignSelf: "center" }}
            className="gap-2"
            onPress={onSendAlert}
            borderRadius={12}
          >
            <LucideSiren size={36} color="white" />
            <Text className="text-3xl font-extrabold text-white">SOS</Text>
          </CirclePulseButton>

          {groupedActions.map((row, rowIndex) => (
            <View key={rowIndex} className="flex-row justify-between gap-4">
              {row.map((item) => (
                <ButtonIcon
                  key={item.key}
                  onPress={item.onPress}
                  label={item.label}
                  icon={item.icon}
                  style={{
                    width: (width - 48 - 32) / 3,
                  }}
                />
              ))}

              {/* Completa la fila si tiene menos de 3 elementos */}
              {Array.from({ length: 3 - row.length }).map((_, index) => (
                <View
                  key={`empty-${index}`}
                  style={{
                    width: (width - 48 - 32) / 3,
                  }}
                />
              ))}
            </View>
          ))}
        </View>

        <Text className="text-xl font-bold text-gray-800 mt-4">
          Enlaces Externos
        </Text>

        {(settings.external_links || []).map((link) => (
          <CardCollapsible
            title={link.title}
            description={link.description}
            key={link.key}
            defaultExpanded={false}
          >
            <Text className="text-justify">{link.content}</Text>
            <View className="flex-row justify-end mt-2">
              <Button
                variant={"outline"}
                className="rounded-full"
                onPress={() => openBrowserUrl(link.url)}
              >
                <Text>Ver más</Text>
              </Button>
            </View>
          </CardCollapsible>
        ))}
      </HeroCollapsible>

      <ModalExpedientForm
        isVisible={showExpedientForm}
        onClose={() => setShowExpedientForm(false)}
      />

      <ModalTakeOutYourTrash
        isVisible={showTakeOutYourTrashModal}
        onClose={() => setShowTakeOutYourTrashModal(false)}
      />

      <StartupDialog
        defaultVisible={settings.startup_dialog.enabled}
        title={settings.startup_dialog.title}
        message={settings.startup_dialog.message}
        url={settings.startup_dialog.url}
      />
    </ThemedView>
  );
}
