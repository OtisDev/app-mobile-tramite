import KeyboardAvoidingWrapper from "@/components/keyboard-avoiding-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useAppStore } from "@/stores/app.store";
import { EmergencyCallAnimation } from "@/types";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import LottieView from "lottie-react-native";
import { LucideMail, LucidePhoneCall } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

export default function DashboardEmergencyNumbersScreen() {
  const { settings } = useAppStore();

  const handleCallPress = (phoneNumber: string) => {
    const phoneUrl = `tel:${phoneNumber.trim()}`;
    Linking.openURL(phoneUrl).catch((error) => {
      console.error("Error al abrir la aplicación de teléfono:", error);
    });
  };

  const handleEmailPress = (email: string) => {
    const emailUrl = `mailto:${email.trim()}`;
    Linking.openURL(emailUrl).catch((error) => {
      console.error("Error al abrir la aplicación de correo:", error);
    });
  };

  return (
    <KeyboardAvoidingWrapper>
      <View className="relative pt-6" style={{ height: 360 }}>
        <Image
          source={require("@/assets/images/cover-emergency.png")}
          className="w-full h-full absolute"
          contentFit="cover"
          style={StyleSheet.absoluteFill}
        />
        <View className="mx-auto">
          <LottieView
            autoPlay
            loop
            source={EmergencyCallAnimation}
            style={{ width: 120, height: 120 }}
          />
        </View>
        <Text className="text-2xl text-center font-semibold text-white uppercase">
          Números de Emergencia
        </Text>
        <Text className="text-center text-white">
          Contacta a los servicios de emergencia en caso de necesidad
        </Text>
        <View className="h-10 mb-12"></View>
      </View>
      <View className="p-6 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Serenazgo</CardTitle>
          </CardHeader>
          <CardContent className="gap-2">
            {settings.citizen_security.phone_numbers.map((number, index) => (
              <View
                key={index}
                className="flex-row items-center justify-between gap-2 p-2 rounded-lg w-full"
              >
                <View className="flex flex-row items-center gap-2 p-2 rounded-lg">
                  <LucidePhoneCall size={24} color="#456799" />
                  <Text className="text-base text-left text-gray-800">
                    {number}
                  </Text>
                </View>
                <View>
                  <Button
                    variant={"success"}
                    onPress={() => handleCallPress(number)}
                    size={"sm"}
                    className="rounded-full"
                  >
                    <LucidePhoneCall size={16} color="white" />
                    <Text className="text-sm">Llamar</Text>
                  </Button>
                </View>
              </View>
            ))}
            <Button
              variant={"outline"}
              className={"flex-row items-center gap-2 p-2 rounded-full"}
              onPress={() =>
                handleEmailPress(settings?.citizen_security?.email || "")
              }
            >
              <LucideMail size={24} color="#456799" />
              <Text className="text-gray-700">
                {settings.citizen_security.email}
              </Text>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Otros Números</CardTitle>
          </CardHeader>
          <CardContent className="relative gap-2 items-center justify-center">
            {settings.citizen_security.others_phone_numbers.map(
              (item, index) => (
                <View
                  key={index}
                  className="flex-row items-center justify-between gap-2 p-2 rounded-lg w-full"
                >
                  <View>
                    <Text className="text-left text-sm font-semibold text-muted-foreground">
                      {item.text}
                    </Text>
                    <Text className="text-lg text-left">{item.value}</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Button
                      variant={"success"}
                      onPress={() => handleCallPress(item.value)}
                      size={"sm"}
                      className="rounded-full"
                    >
                      <LucidePhoneCall size={16} color="white" />
                      <Text className="text-sm">Llamar</Text>
                    </Button>
                  </View>
                </View>
              ),
            )}
          </CardContent>
        </Card>
      </View>
    </KeyboardAvoidingWrapper>
  );
}
