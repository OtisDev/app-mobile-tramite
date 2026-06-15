import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { ThemedView } from "./themed-view";
import { Text } from "./ui/text";

export interface ActionBarProps {
  title?: string;
  goBack?: boolean;
}

export default function ActionBar({ title, goBack }: ActionBarProps) {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <ThemedView className="flex flex-row items-center gap-2 px-4 py-2 z-50 h-16 w-full">
      {goBack && (
        <TouchableOpacity onPress={handleGoBack}>
          <ChevronLeft className="mr-2" size={24} />
        </TouchableOpacity>
      )}
      <Text className="text-lg font-semibold text-gray-800 dark:text-white">
        {title || "STD - MDNCH"}
      </Text>
    </ThemedView>
  );
}
