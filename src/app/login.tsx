import KeyboardAvoidingWrapper from "@/components/keyboard-avoiding-wrapper";
import SelectDocumentType from "@/components/shared/select-document-type";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InputGroup } from "@/components/ui/input-group";
import { Option } from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { BottomTabInset, Spacing } from "@/constants/theme";
import "@/global.css";
import { login } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { LucideEye, LucideEyeOff } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LoginScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const [tipoDocumento, setTipoDocumento] = useState<Option>({
    label: "DOCUMENTO NACIONAL DE IDENTIDAD",
    value: "1",
  });
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [secureText, setSecureText] = useState<boolean>(true);
  const { setUser, setToken, setSignedIn } = useAuthStore();
  const router = useRouter();

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

  const handleLogin = () => {
    if (userName.trim() === "" || password.trim() === "") {
      setError("Por favor, ingresa tu número de documento y contraseña.");
      return;
    }

    setError(null);
    setLoading(true);
    const tipoDocId = parseInt(tipoDocumento?.value || "1");
    login(userName, password, tipoDocId)
      .then((response) => {
        if (response.data.success) {
          const userData = response.data.data;
          setUser({
            id: userData.n_solicitante,
            name: userData.nombre,
            firstName: userData.nombres,
            lastName: userData.apepaterno,
            secondLastName: userData.apematerno,
            dni: userData.dniruc,
            username: userData.login,
            email: userData.email,
            phone: userData.telefono,
            tipoDocId: userData.tipodoc_id,
            tipo: userData.tipo,
            address: userData.direccion,
            pwd: userData.clave,
            pwd_web: userData.clave_web,
          });
          setToken(userData.guest_token.token);
          setSignedIn(true);
          router.replace("/(dashboard)");
        } else {
          setError(response.data.message || "Error al iniciar sesión");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log("Login failed:", error.response?.data || error.message);
        setError(
          error.response?.data?.message ||
            error.message ||
            "Error al iniciar sesión",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <KeyboardAvoidingWrapper>
      <Card className="w-full self-center my-auto">
        <CardContent className="flex flex-col items-center relative w-full">
          {loading && (
            <View className="absolute w-full h-full flex flex-col flex-1 items-center justify-center z-50 bg-background/80">
              <LottieView
                source={require("@/assets/animations/BiometricSignIn.json")}
                autoPlay
                loop
                style={{
                  width: 150,
                  height: 150,
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
          {error && (
            <Text className="bg-red-200 text-red-600 text-sm px-4 py-2 w-full border border-red-300 text-center mb-4 rounded-md">
              {error}
            </Text>
          )}
          <SelectDocumentType
            className="mb-4"
            selectClassName="z-40"
            value={tipoDocumento}
            onValueChange={setTipoDocumento}
          />
          <InputGroup
            label={numberLabel}
            placeholder={numberPlaceholder}
            maxLength={maxLength}
            required
            containerClassName="w-full mb-4"
            value={userName}
            onChangeText={(text) => setUserName(text)}
            keyboardType="number-pad"
          />
          <InputGroup
            label="Contraseña"
            placeholder="Contraseña"
            required
            containerClassName="w-full mb-4"
            secureTextEntry={secureText}
            suffix={
              <TouchableOpacity className="pl-2">
                {secureText ? (
                  <LucideEye size={24} onPress={() => setSecureText(false)} />
                ) : (
                  <LucideEyeOff size={24} onPress={() => setSecureText(true)} />
                )}
              </TouchableOpacity>
            }
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <Button
            className="mb-4 w-full"
            onPress={handleLogin}
            disabled={loading}
          >
            <Text>Iniciar sesión</Text>
          </Button>
          <Button variant={"link"} onPress={() => router.push("/register")}>
            <Text>Registrarme</Text>
          </Button>
          <Button
            variant={"link"}
            onPress={() => router.push("/forgot-password")}
          >
            <Text>¿Olvidaste tu contraseña?</Text>
          </Button>
        </CardContent>
      </Card>
    </KeyboardAvoidingWrapper>
  );
}
