import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
    <SafeAreaView edges={["top"]} className="w-full">
      <View className="flex flex-row items-center gap-2 px-4 py-2 z-50 h-16 w-full bg-white">
        {goBack && (
          <TouchableOpacity
            onPress={handleGoBack}
            className="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center"
          >
            <ChevronLeft className="mr-2 text-gray-800" size={24} />
          </TouchableOpacity>
        )}
        <Text className="text-lg font-semibold text-gray-800">
          {title || "STD - MDNCH"}
        </Text>
      </View>
    </SafeAreaView>
  );
}
