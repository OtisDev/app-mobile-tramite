import ActionBar from "@/components/action-bar";
import SelectDocumentType from "@/components/shared/select-document-type";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputGroup } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Option } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { LucideSearch, Save } from "lucide-react-native";
import { useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import KeyboardAvoidingWrapper from "../components/keyboard-avoiding-wrapper";

export default function RegisterScreen() {
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [tipoDocumento, setTipoDocumento] = useState<Option>({
    label: "DNI",
    value: "1",
  });

  const allowSearch = useMemo(
    () => tipoDocumento?.value === "1" || tipoDocumento?.value === "4",
    [tipoDocumento],
  );

  const maxLength = useMemo(() => {
    switch (tipoDocumento?.value) {
      case "1":
        return 8;
      case "4":
        return 11;
      default:
        return 20;
    }
  }, [tipoDocumento]);

  const numberPlaceholder = useMemo(() => {
    switch (tipoDocumento?.value) {
      case "1":
        return "00000000";
      case "4":
        return "00000000000";
      default:
        return "XXXXXXXXXX";
    }
  }, [tipoDocumento]);

  const numberLabel = useMemo(() => {
    switch (tipoDocumento?.value) {
      case "1":
        return "N° DNI";
      case "4":
        return "N° RUC";
      case "3":
        return "N° Pasaporte";
      case "2":
        return "N° Carnet de extranjería";
      default:
        return "Número de documento";
    }
  }, [tipoDocumento]);

  return (
    <>
      <ActionBar goBack={true} title="Registro" />
      <KeyboardAvoidingWrapper>
        <Card className="max-full self-center">
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent>
            <SelectDocumentType
              className="mb-4"
              value={tipoDocumento}
              onValueChange={setTipoDocumento}
            />
            <InputGroup
              label={numberLabel}
              placeholder={numberPlaceholder}
              required
              containerClassName="w-full mb-4"
              keyboardType="number-pad"
              maxLength={maxLength}
              suffix={
                allowSearch && (
                  <TouchableOpacity className="pl-2">
                    <LucideSearch size={20} />
                  </TouchableOpacity>
                )
              }
            />
            <View className="field mb-4">
              <Label className="label-control">Nombre</Label>
              <Input
                className="input-control"
                placeholder="Apellidos, Nombres"
              />
            </View>
            <View className="field mb-4">
              <Label className="label-control">Dirección</Label>
              <Input
                className="input-control"
                placeholder="Jr. Principal 123"
              />
            </View>
            <View className="field mb-4">
              <Label className="label-control">Celular</Label>
              <Input
                className="input-control"
                placeholder="999999999"
                keyboardType="phone-pad"
              />
            </View>
            <View className="field mb-4">
              <Label className="label-control">Correo Electrónico</Label>
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
              <Label className="label-control">Contraseña</Label>
              <Input className="input-control" secureTextEntry />
            </View>
            <View className="field mb-4">
              <Label className="label-control">Repetir Contraseña</Label>
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
      </KeyboardAvoidingWrapper>
    </>
  );
}
