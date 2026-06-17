import { AnimatedIcon } from "@/components/animated-icon";
import ButtonIcon from "@/components/button-icon";
import { ThemedView } from "@/components/themed-view";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Text } from "@/components/ui/text";
import { BottomTabInset, Spacing } from "@/constants/theme";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "expo-router";
import {
  LucideBook,
  LucideInfo,
  LucideLogOut,
  LucidePlus,
  LucideSearch,
} from "lucide-react-native";
import { FlatList, useWindowDimensions, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

interface ButtonAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onPress: () => void;
}

const colorIcon = "#193067";

export default function DashboardHomeScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { width } = useWindowDimensions();

  const actions: ButtonAction[] = [
    {
      key: "new-tramite",
      label: "Nuevo trámite",
      icon: <LucidePlus size={32} color={colorIcon} />,
      onPress: () => {
        // Handle button press
      },
    },
    {
      key: "search-tramite",
      label: "Buscar trámite",
      icon: (
        <LucideSearch size={32} className="text-primary" color={colorIcon} />
      ),
      onPress: () => {
        // Handle button press
      },
    },
    {
      key: "my-tramites",
      label: "Mis trámites",
      icon: <LucideBook size={32} color={colorIcon} />,
      onPress: () => {
        // Handle button press
      },
    },
    {
      key: "logout",
      label: "Cerrar sesión",
      icon: <LucideLogOut size={32} color={colorIcon} />,
      onPress: () => {
        logout();
        router.replace("/login");
      },
    },
  ];

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
        <Alert icon={LucideInfo} className="mb-4">
          <AlertTitle></AlertTitle>
        </Alert>
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
              >
                {item.icon}
              </ButtonIcon>
            )}
            columnWrapperClassName="gap-4 px-5"
            contentContainerClassName="gap-4"
          />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
