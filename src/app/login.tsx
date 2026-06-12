import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import "@/global.css";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, TextInput } from "react-native";

export default function LoginScreen() {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="bg-background h-full sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6 mt-safe"
      keyboardDismissMode="interactive"
    >
      <Card className="w-full max-w-md self-center my-auto">
        <CardContent className="flex flex-col">
          <Image
            source={require("@/assets/images/logo-mdnch.png")}
            className="object-contain"
            style={{
              width: 150,
              height: 200,
              alignSelf: "center",
              marginBottom: 20,
            }}
          />
          <ThemedView className="field mb-4">
            <Text className="label-control">DNI</Text>
            <TextInput
              className="input-control"
              placeholder="DNI"
              value={userName}
              onChangeText={setUserName}
            />
          </ThemedView>
          <ThemedView className="field mb-4">
            <Text className="label-control">Contraseña</Text>
            <TextInput
              className="input-control"
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </ThemedView>
          <Button className="mb-4">
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
    </ScrollView>
  );
}
