import ActionBar from "@/components/action-bar";
import KeyboardAvoidingWrapper from "@/components/keyboard-avoiding-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { LucideMail } from "lucide-react-native";
import { View } from "react-native";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  return (
    <>
      <ActionBar goBack={true} title="Recuperar contraseña" />
      <KeyboardAvoidingWrapper>
        <Card className="w-full max-w-md my-auto">
          <CardHeader>
            <CardTitle>Recuperar contraseña</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Text
              className="text-muted-foreground text-justify"
              variant={"small"}
            >
              Ingresa tu correo electrónico y te enviaremos instrucciones para
              recuperar tu contraseña.
            </Text>
            <View className="field">
              <Label className="mb-1">Correo electrónico</Label>
              <Input placeholder="Ingresa tu correo electrónico" />
            </View>
            <Button>
              <LucideMail
                className="mr-2 text-white"
                size={16}
                color={"white"}
              />
              <Text>Enviar</Text>
            </Button>
            <Button variant={"link"} onPress={() => router.push("/register")}>
              <Text>Registrarme</Text>
            </Button>
          </CardContent>
        </Card>
      </KeyboardAvoidingWrapper>
    </>
  );
}
