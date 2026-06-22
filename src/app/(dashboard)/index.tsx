import { AnimatedIcon } from "@/components/animated-icon";
import ButtonIcon from "@/components/button-icon";
import ModalChangePassword from "@/components/modal-change-password";
import ModalExpedientForm from "@/components/modal-expedient-form";
import ModalTakeOutYourTrash from "@/components/modal-saca-tu-basura";
import ModalUserInfo from "@/components/modal-user-info";
import { ThemedView } from "@/components/themed-view";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Text } from "@/components/ui/text";
import { BottomTabInset, Spacing } from "@/constants/theme";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "expo-router";
import {
  LucideAsterisk,
  LucideClock,
  LucideEdit3,
  LucideIcon,
  LucideInfo,
  LucideLogOut,
  LucidePlus,
  LucideSearch,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { FlatList, useWindowDimensions, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

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
  const { width } = useWindowDimensions();
  const [showUserInfoModal, setShowUserInfoModal] = useState<boolean>(false);
  const [showChangePasswordModal, setShowChangePasswordModal] =
    useState<boolean>(false);
  const [showExpedientForm, setShowExpedientForm] = useState<boolean>(false);
  const [showTakeOutYourTrashModal, setShowTakeOutYourTrashModal] =
    useState<boolean>(false);

  const actions: ButtonAction[] = [
    {
      key: "update-info",
      label: "Actualizar información",
      icon: LucideEdit3,
      onPress: () => {
        setShowUserInfoModal(true);
      },
    },
    {
      key: "change-password",
      label: "Cambiar contraseña",
      icon: LucideAsterisk,
      onPress: () => {
        setShowChangePasswordModal(true);
      },
    },
    {
      key: "new-tramite",
      label: "Nuevo\ntrámite",
      icon: LucidePlus,
      onPress: () => {
        setShowExpedientForm(true);
      },
    },
    {
      key: "search-tramite",
      label: "Consultar\ntrámite",
      icon: LucideSearch,
      onPress: () => {
        router.push("/(dashboard)/explore");
      },
    },
    {
      key: "take-out-your-trash",
      label: "Saca tu\nbasura",
      icon: LucideClock,
      onPress: () => {
        setShowTakeOutYourTrashModal(true);
      },
    },
    {
      key: "logout",
      label: "Cerrar\nsesión",
      icon: LucideLogOut,
      onPress: () => {
        logout();
        router.replace("/login");
      },
    },
  ];

  useEffect(() => {
    if (!signedIn) {
      logout();
      router.replace("/login");
    }
  }, [signedIn]);

  return (
    <ThemedView className="flex-1 flex items-center">
      <SafeAreaView
        edges={["top"]}
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
      >
        <View className="gap-4 items-center justify-center my-6">
          <AnimatedIcon />
          <View className="flex items-center gap-1 my-4">
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
        <View className="w-full px-6">
          <Alert icon={LucideInfo} className="mb-4">
            <AlertTitle>Bienvenido</AlertTitle>
            <AlertDescription className="text-justify break-all">
              {user?.name}, bienvenido a la aplicación de la Municipalidad
              Distrital de Nuevo Chimbote.
            </AlertDescription>
          </Alert>
        </View>
        <View className="flex-1 w-full mt-6">
          <FlatList
            data={actions}
            numColumns={3}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => (
              <ButtonIcon
                onPress={item.onPress}
                label={item.label}
                style={{
                  width: (width - Spacing.four * 2 - Spacing.four * 2) / 3,
                }}
                icon={item.icon}
              ></ButtonIcon>
            )}
            columnWrapperClassName="gap-6 px-6"
            contentContainerClassName="gap-6"
          />
        </View>
      </SafeAreaView>

      <ModalExpedientForm
        isVisible={showExpedientForm}
        onClose={() => setShowExpedientForm(false)}
      />

      <ModalUserInfo
        isVisible={showUserInfoModal}
        onClose={() => setShowUserInfoModal(false)}
      />

      <ModalChangePassword
        isVisible={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />

      <ModalTakeOutYourTrash
        isVisible={showTakeOutYourTrashModal}
        onClose={() => setShowTakeOutYourTrashModal(false)}
      />
    </ThemedView>
  );
}
