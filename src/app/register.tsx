import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { ScrollView, TextInput, View } from "react-native";

export default function RegisterScreen() {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="bg-background h-full sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6 mt-safe"
      keyboardDismissMode="interactive"
    >
      <Card className="w-full max-w-md self-center">
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="field mb-4">
            <Text className="label-control">Tipo de documento</Text>
            <TextInput className="input-control" placeholder="DNI" />
          </View>
          <View className="field mb-4">
            <Text className="label-control">DNI</Text>
            <TextInput className="input-control" placeholder="DNI" />
          </View>
          <View className="field mb-4">
            <Text className="label-control">Nombre</Text>
            <TextInput className="input-control" placeholder="Nombre" />
          </View>
          <View className="field mb-4">
            <Text className="label-control">Dirección</Text>
            <TextInput className="input-control" placeholder="Dirección" />
          </View>
          <Button>
            <Text>Registrar</Text>
          </Button>
        </CardContent>
      </Card>
    </ScrollView>
  );
}
