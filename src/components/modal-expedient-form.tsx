import { listDocumentTypes } from "@/services/expedient.service";
import { LucideSave } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import Modal from "react-native-modal";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { InputSelect, SelectOption } from "./ui/input-select";
import { Label } from "./ui/label";
import { Text } from "./ui/text";
import { Textarea } from "./ui/textarea";

export interface ModalExpedientFormProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function ModalExpedientForm({
  isVisible,
  onClose,
}: ModalExpedientFormProps) {
  const searchDocumentTypes = (query: string) => {
    return new Promise<SelectOption[]>((resolve) => {
      listDocumentTypes(query).then(({ data }) => {
        if (data.success && data.data) {
          const filtered = data.data.map((docType) => {
            console.log(docType);
            return {
              label: "",
              value: "",
            } as SelectOption;
          });
          resolve([]);
        } else {
          resolve([]);
        }
      });
    });
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      avoidKeyboard={true}
      className="absolute bottom-0 w-full"
      style={{ margin: 0 }}
    >
      <ScrollView>
        <Card className="rounded-t-2xl rounded-b-none">
          <CardHeader>
            <CardTitle className="text-lg">Nuevo Trámite</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <View className="field">
              <View className="flex flex-row gap-2 items-center">
                <Label className="label-control">Tipo documento</Label>
                <Label className="label-control text-red-500">*</Label>
              </View>
              <InputSelect loadOptions={searchDocumentTypes} />
            </View>
            <View className="field">
              <View className="flex flex-row gap-2 items-center">
                <Label className="label-control">Siglas documento</Label>
                <Label className="label-control text-red-500">*</Label>
              </View>
              <Input />
            </View>
            <View className="field">
              <View className="flex flex-row gap-2 items-center">
                <Label className="label-control">Asunto</Label>
                <Label className="label-control text-red-500">*</Label>
              </View>

              <Textarea multiline={true} />
            </View>
            <View className="field">
              <Label className="label-control">Observación</Label>
              <Textarea multiline={true} />
            </View>
            <View className="field">
              <View className="flex flex-row gap-2 items-center">
                <Label className="label-control">Documento</Label>
                <Label className="label-control text-red-500">*</Label>
              </View>
              <Input />
            </View>
            <View className="flex flex-row justify-between gap-2">
              <Button variant={"secondary"} onPress={onClose}>
                <Text>Cancelar</Text>
              </Button>
              <Button>
                <LucideSave
                  className="mr-2 text-white"
                  size={16}
                  color={"white"}
                />
                <Text>Guardar</Text>
              </Button>
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </Modal>
  );
}
