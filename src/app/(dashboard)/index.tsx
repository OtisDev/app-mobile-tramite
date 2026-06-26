import ButtonIcon from "@/components/button-icon";
import HeroCollapsible from "@/components/HeroCollapsible";
import ModalChangePassword from "@/components/modal-change-password";
import ModalExpedientForm from "@/components/modal-expedient-form";
import ModalTakeOutYourTrash from "@/components/modal-saca-tu-basura";
import ModalUserInfo from "@/components/modal-user-info";
import { ThemedView } from "@/components/themed-view";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CardCollapsible } from "@/components/ui/card-collapsible";
import { Text } from "@/components/ui/text";
import { BottomTabInset, Spacing } from "@/constants/theme";
import { openBrowserUrl } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "expo-router";
import {
  LucideAsterisk,
  LucideBookOpen,
  LucideClock,
  LucideEdit3,
  LucideIcon,
  LucideInfo,
  LucideLogOut,
  LucidePlus,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { useWindowDimensions, View } from "react-native";
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
      key: "take-out-your-trash",
      label: "Saca tu\nbasura",
      icon: LucideClock,
      onPress: () => {
        setShowTakeOutYourTrashModal(true);
      },
    },
    {
      key: "complaint-book",
      label: "LIBRO DE RECLAMACIONES",
      icon: LucideBookOpen,
      onPress: () => {
        openBrowserUrl(
          `https://reclamos.servicios.gob.pe/?institution_id=1311`,
        );
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

  const groupedActions = useMemo(() => {
    const _groupedActions = [];

    for (let i = 0; i < actions.length; i += 3) {
      _groupedActions.push(actions.slice(i, i + 3));
    }

    return _groupedActions;
  }, [actions]);

  useEffect(() => {
    if (!signedIn) {
      logout();
      router.replace("/login");
    }
  }, [signedIn]);

  return (
    <ThemedView className="flex-1 flex items-center">
      <HeroCollapsible>
        <View className="w-full">
          <Alert icon={LucideInfo}>
            <AlertTitle>Bienvenido</AlertTitle>
            <AlertDescription className="text-justify break-all">
              {user?.name}, bienvenido a la aplicación de la Municipalidad
              Distrital de Nuevo Chimbote.
            </AlertDescription>
          </Alert>
        </View>
        <View className="w-full gap-6">
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
        <CardCollapsible title="Turismo" description="Conoce Nuevo Chimbote">
          <Text>
            Conoce los rincones más bonitos de Nuevo Chimbote que no puedes
            perderte cuando vengas de visita.
          </Text>
          <View className="flex-row justify-end mt-2">
            <Button
              variant={"outline"}
              className="rounded-full"
              onPress={() =>
                openBrowserUrl(
                  `https://www.muninuevochimbote.gob.pe/tudistrito/turismo`,
                )
              }
            >
              <Text>Ver más</Text>
            </Button>
          </View>
        </CardCollapsible>

        <CardCollapsible
          title="Biblioteca Municipal"
          description="Conoce nuestra hermosa y moderna biblioteca municipal."
        >
          <Text>
            La Biblioteca Municipal de Nuevo Chimbote es un espacio dedicado a
            la promoción de la lectura y el acceso a la información. Contamos
            con una amplia colección de libros, revistas y recursos digitales
            para toda la comunidad.
          </Text>
          <View className="flex-row justify-end mt-2">
            <Button
              variant={"outline"}
              className="rounded-full"
              onPress={() =>
                openBrowserUrl(
                  `https://www.muninuevochimbote.gob.pe/servicios/biblioteca`,
                )
              }
            >
              <Text>Ver más</Text>
            </Button>
          </View>
        </CardCollapsible>
      </HeroCollapsible>

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
