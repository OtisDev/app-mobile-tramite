import { listTakeOutYourTrash } from "@/services/others.service";
import { ScheduleTrash } from "@/types";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import Modal from "react-native-modal";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { InputSelect, SelectOption } from "./ui/input-select";
import { Text } from "./ui/text";

export interface ModalTakeOutYourTrashProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function ModalTakeOutYourTrash({
  isVisible,
  onClose,
}: ModalTakeOutYourTrashProps) {
  const [takeOutYourTrashData, setTakeOutYourTrashData] = useState<
    ScheduleTrash[]
  >([]);
  const [filteredData, setFilteredData] = useState<ScheduleTrash[]>([]);
  const [types, setTypes] = useState<SelectOption[]>([]);
  const [zones, setZones] = useState<SelectOption[]>([]);
  const fetchTakeOutYourTrashData = () => {
    listTakeOutYourTrash().then((data) => {
      setTakeOutYourTrashData(data);
      const _types = data
        .map((item) => item.tipo)
        .sort((a, b) => a.localeCompare(b))
        .reduce((acc: string[], tipo) => {
          if (!acc.includes(tipo)) {
            acc.push(tipo);
          }
          return acc;
        }, [])
        .map((tipo) => ({ label: tipo, value: tipo }));
      setTypes(_types);
    });
  };

  const onChangeType = (selectedType: SelectOption) => {
    const filtered = takeOutYourTrashData
      .filter((item) => item.tipo === selectedType.value)
      .map((item) => ({ label: item.nombre, value: item.id.toString() }));
    setZones(filtered);
  };

  useEffect(() => {
    if (isVisible) {
      fetchTakeOutYourTrashData();
    }
  }, [isVisible]);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      className="absolute bottom-0 w-full"
      style={{ margin: 0 }}
    >
      <Card className="rounded-t-2xl rounded-b-none">
        <CardHeader>
          <CardTitle className="text-lg">Saca tu basura</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="flex flex-col gap-4">
            <View className="w-full flex flex-col gap-2">
              <Text className="text-sm font-medium">Tipo Zona</Text>
              <InputSelect
                data={types}
                searchable={false}
                onChange={onChangeType}
              />
            </View>
            <View className="w-full flex flex-col gap-2">
              <Text className="text-sm font-medium">Zona</Text>
              <InputSelect data={zones} searchable={false} />
            </View>
            <Button>
              <Text className="text-sm font-medium">Buscar</Text>
            </Button>
          </View>
          <FlatList
            className="max-h-[50%]"
            data={filteredData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View className="p-4 border-b border-border">
                <Text variant="small" className="text-muted-foreground">
                  {item.tipo}
                </Text>
                <Text className="font-semibold">{item.nombre}</Text>
              </View>
            )}
          />
        </CardContent>
      </Card>
    </Modal>
  );
}
