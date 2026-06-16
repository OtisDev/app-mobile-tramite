import ActionBar from "@/components/action-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Option,
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
import { LucideSearch, Save } from "lucide-react-native";
import { useMemo, useState } from "react";
import { View } from "react-native";
import KeyboardAvoidingWrapper from "../components/keyboard-avoiding-wrapper";

export default function RegisterScreen() {
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [tipoDocumento, setTipoDocumento] = useState<Option>({
    label: "DNI",
    value: "DNI",
  });

  const allowSearch = useMemo(
    () => tipoDocumento?.value === "DNI" || tipoDocumento?.value === "RUC",
    [tipoDocumento],
  );

  const maxLength = useMemo(() => {
    switch (tipoDocumento?.value) {
      case "DNI":
        return 8;
      case "RUC":
        return 11;
      default:
        return 20;
    }
  }, [tipoDocumento]);

  const numberPlaceholder = useMemo(() => {
    switch (tipoDocumento?.value) {
      case "DNI":
        return "00000000";
      case "RUC":
        return "00000000000";
      default:
        return "XXXXXXXXXX";
    }
  }, [tipoDocumento]);

  const numberLabel = useMemo(() => {
    switch (tipoDocumento?.value) {
      case "DNI":
        return "N° DNI";
      case "RUC":
        return "N° RUC";
      case "P":
        return "N° Pasaporte";
      case "CE":
        return "N° Carnet de extranjería";
      default:
        return "Número de documento";
    }
  }, [tipoDocumento]);

  return (
    <>
      <ActionBar goBack={true} />
      <KeyboardAvoidingWrapper>
        <Card className="max-w-md self-center">
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="field mb-4">
              <Label className="label-control">Tipo de documento</Label>
              <Select value={tipoDocumento} onValueChange={setTipoDocumento}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Natural</SelectLabel>
                    <SelectItem value="P" label="PASAPORTE" />
                    <SelectItem
                      value="DNI"
                      label="DOCUMENTO NACIONAL DE IDENTIDAD"
                    />
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
              <Label className="label-control">{numberLabel}</Label>
              <View className="flex flex-row gap-2">
                <Input
                  className="input-control"
                  placeholder={numberPlaceholder}
                  keyboardType="number-pad"
                  style={{ width: allowSearch ? "80%" : "100%" }}
                  maxLength={maxLength}
                />
                {allowSearch && (
                  <Button variant={"outline"} style={{ width: "18%" }}>
                    <LucideSearch size={20} />
                  </Button>
                )}
              </View>
            </View>
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
