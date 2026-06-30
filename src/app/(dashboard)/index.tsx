import ButtonIcon from "@/components/button-icon";
import HeroCollapsible from "@/components/HeroCollapsible";
import ModalExpedientForm from "@/components/modal-expedient-form";
import ModalTakeOutYourTrash from "@/components/modal-saca-tu-basura";
import { ThemedView } from "@/components/themed-view";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CardCollapsible } from "@/components/ui/card-collapsible";
import { Text } from "@/components/ui/text";
import { BottomTabInset, Spacing } from "@/constants/theme";
import { openBrowserUrl } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { ExternalLink } from "@/types";
import { useRouter } from "expo-router";
import {
  LucideBookOpen,
  LucideClock,
  LucideIcon,
  LucideInfo,
  LucidePlus,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ButtonAction {
  key: string;
  label: string;
  icon?: LucideIcon;
  onPress: () => void;
}

const externalLinks: ExternalLink[] = [
  {
    key: "turismo",
    title: "Turismo",
    description: "Conoce Nuevo Chimbote",
    content:
      "Conoce los rincones más bonitos de Nuevo Chimbote que no puedes perderte cuando vengas de visita.",
    url: "https://www.muninuevochimbote.gob.pe/tudistrito/turismo",
  },
  {
    key: "biblioteca-municipal",
    title: "Biblioteca Municipal",
    description: "Conoce nuestra hermosa y moderna biblioteca municipal.",
    content:
      "La Biblioteca Municipal de Nuevo Chimbote es un espacio dedicado a la promoción de la lectura y el acceso a la información. Contamos con una amplia colección de libros, revistas y recursos digitales para toda la comunidad.",
    url: "https://www.muninuevochimbote.gob.pe/servicios/biblioteca",
  },
  {
    key: "tupa",
    title: "TUPA",
    description: "Conoce nuestro TUPA",
    content:
      "El TUPA (Texto Único de Procedimientos Administrativos) es un documento que contiene información sobre los procedimientos administrativos que se realizan en la Municipalidad Distrital de Nuevo Chimbote.",
    url: "https://tupa.muninuevochimbote.gob.pe/",
  },
  {
    key: "cas",
    title: "Convocatorias CAS",
    description: "Conoce nuestras convocatorias",
    content:
      "Aquí encontrarás todas las convocatorias disponibles de la Municipalidad Distrital de Nuevo Chimbote.",
    url: "https://www.muninuevochimbote.gob.pe/tramites/convocatorias",
  },
];

export default function DashboardHomeScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const router = useRouter();
  const { user, logout, signedIn } = useAuthStore();
  const { width } = useWindowDimensions();
  const [showExpedientForm, setShowExpedientForm] = useState<boolean>(false);
  const [showTakeOutYourTrashModal, setShowTakeOutYourTrashModal] =
    useState<boolean>(false);

  const actions: ButtonAction[] = [
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
      label: "Libro de\nreclamaciones",
      icon: LucideBookOpen,
      onPress: () => {
        openBrowserUrl(
          `https://reclamos.servicios.gob.pe/?institution_id=1311`,
        );
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
            <AlertTitle className="text-base -mt-1">Bienvenido</AlertTitle>
            <AlertDescription className="text-justify break-all">
              {user?.name}, bienvenido a la aplicación de la Municipalidad
              Distrital de Nuevo Chimbote.
            </AlertDescription>
          </Alert>
        </View>
        <View className="w-full gap-6">
          <View>
            <TouchableOpacity className="mx-auto p-2 rounded-full h-24 w-24 bg-primary shadow-sm shadow-black/5 flex items-center justify-center">
              <Text className="text-2xl font-bold text-white">SOS</Text>
            </TouchableOpacity>
          </View>
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

        {externalLinks.map((link) => (
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
    </ThemedView>
  );
}
