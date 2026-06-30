import KeyboardAvoidingWrapper from "@/components/keyboard-avoiding-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { BottomTabInset, Spacing } from "@/constants/theme";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DashboardEmergencyNumbersScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };

  return (
    <KeyboardAvoidingWrapper contentClassName="gap-4 p-6">
      <View>
        <Text className="text-2xl text-center py-6">Números de Emergencia</Text>
      </View>
      <Card>
        <CardHeader>
          <CardTitle>Serenazgo</CardTitle>
        </CardHeader>
        <CardContent>
          <Text>+51 935 912 001</Text>
          <Text>+51 927 420 002</Text>
          <Text>+51 916 140 004</Text>
          <Text>+51 927 640 006</Text>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Otros Números</CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </KeyboardAvoidingWrapper>
  );
}
