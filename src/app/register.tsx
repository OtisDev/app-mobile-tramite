import ActionBar from "@/components/action-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { BottomTabInset, Spacing } from "@/constants/theme";
import { Save } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background items-center justify-center"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ActionBar title="Registro de Usuario" goBack />
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        contentInset={insets}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
        keyboardDismissMode="interactive"
        className="w-full max-w-md self-center px-4"
      >
        <Card className="w-full max-w-md self-center">
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="field mb-4">
              <Text className="label-control">Tipo de documento</Text>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Natural</SelectLabel>
                    <SelectItem value="P" label="PASAPORTE" />
                    <SelectItem value="DNI" label="DNI" />
                    <SelectItem value="CE" label="CARNET DE EXTRANJERÍA" />
                    <SelectLabel>Jurídica</SelectLabel>
                    <SelectItem
                      value="RUC"
                      label="REGISTRO ÚNICO DE CONTRIBUYENTE"
                    />
                  </SelectGroup>
                </SelectContent>
              </Select>
            </View>
            <View className="field mb-4">
              <Text className="label-control">DNI</Text>
              <Input
                className="input-control"
                placeholder="00000000"
                keyboardType="number-pad"
              />
            </View>
            <View className="field mb-4">
              <Text className="label-control">Nombre</Text>
              <Input
                className="input-control"
                placeholder="Apellidos, Nombres"
              />
            </View>
            <View className="field mb-4">
              <Text className="label-control">Dirección</Text>
              <Input
                className="input-control"
                placeholder="Jr. Principal 123"
              />
            </View>
            <View className="field mb-4">
              <Text className="label-control">Celular</Text>
              <Input
                className="input-control"
                placeholder="999999999"
                keyboardType="phone-pad"
              />
            </View>
            <View className="field mb-4">
              <Text className="label-control">Correo Electrónico</Text>
              <Input
                className="input-control"
                placeholder="me@ejemplo.com"
                keyboardType="email-address"
              />
            </View>
            <Text className="text-lg font-semibold my-4">
              Información de usuario
            </Text>
            <Text className="text-gray-500 text-xs">
              El nombre de usuario será su número de documento (DNI, PASAPORTE,
              CARNET DE EXTRANJERÍA, RUC, etc.) que registró en el formulario.
            </Text>
            <View className="field mb-4 mt-3">
              <Text className="label-control">Contraseña</Text>
              <Input className="input-control" secureTextEntry />
            </View>
            <View className="field mb-4">
              <Text className="label-control">Repetir Contraseña</Text>
              <Input className="input-control" secureTextEntry />
            </View>
            <View className="flex flex-row items-center gap-2 mb-4">
              <Switch
                id="terms"
                nativeID="terms"
                checked={acceptTerms}
                onCheckedChange={setAcceptTerms}
              />
              <Label htmlFor="terms" nativeID="terms">
                Acepto los términos y condiciones
              </Label>
            </View>
            <Button>
              <Save className="mr-2" color={"white"} size={20} />
              <Text>Registrar</Text>
            </Button>
          </CardContent>
        </Card>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}
