import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { BottomTabInset, Spacing } from "@/constants/theme";
import "@/global.css";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LoginScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace("/(dashboard)");
    }, 2000);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background w-full h-full"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="bg-background h-full sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6 mt-safe"
        keyboardDismissMode="interactive"
        contentInset={insets}
        style={{
          paddingBottom: insets.bottom,
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
      >
        <Card className="w-full max-w-md self-center my-auto">
          <CardContent className="flex flex-col items-center relative w-full">
            {loading && (
              <View className="absolute w-full h-full flex flex-col flex-1 items-center justify-center z-50 bg-background/80">
                <LottieView
                  source={require("@/assets/animations/BiometricSignIn.json")}
                  autoPlay
                  loop
                  style={{
                    width: 200,
                    height: 200,
                    alignSelf: "center",
                  }}
                />
                <Text className="text-center">Iniciando sesión...</Text>
              </View>
            )}
            <Image
              source={require("@/assets/images/logo-mdnch.png")}
              className="object-contain z-10"
              style={{
                width: 150,
                height: 200,
                alignSelf: "center",
                marginBottom: 20,
              }}
            />
            <ThemedView className="field mb-4">
              <Text className="label-control">DNI</Text>
              <Input
                placeholder="DNI"
                value={userName}
                onChangeText={setUserName}
                keyboardType="number-pad"
              />
            </ThemedView>
            <ThemedView className="field mb-4">
              <Text className="label-control">Contraseña</Text>
              <Input
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </ThemedView>
            <Button
              className="mb-4 w-full"
              onPress={handleLogin}
              disabled={loading}
            >
              <Text>Iniciar sesión</Text>
            </Button>
            <Button variant={"link"} onPress={() => router.push("/register")}>
              <Text>Crear cuenta</Text>
            </Button>
            <Button
              variant={"link"}
              onPress={() => router.push("/forgot-password")}
            >
              <Text>¿Olvidaste tu contraseña?</Text>
            </Button>
          </CardContent>
        </Card>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}
