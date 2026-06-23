import { listTakeOutYourTrash } from "@/services/others.service";
import { ScheduleTrash } from "@/types";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import Modal from "react-native-modal";
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
  const [selectedZone, setSelectedZone] = useState<SelectOption | null>(null);
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
    setSelectedZone(null);
    setZones([]);

    const filtered = takeOutYourTrashData
      .filter((item) => item.tipo === selectedType.value)
      .map((item) => ({ label: item.nombre, value: item.id.toString() }));
    const filteredZones = [...filtered];
    setZones(filteredZones);
  };

  const onChangeZone = (zone: SelectOption) => {
    setSelectedZone(zone);
    const filtered = takeOutYourTrashData.filter(
      (item) => item.id.toString() === zone.value,
    );
    setFilteredData(filtered);
  };

  const handleOnClose = () => {
    onClose?.();
    setSelectedZone(null);
    setFilteredData([]);
    setTypes([]);
    setZones([]);
  };

  useEffect(() => {
    if (isVisible) {
      fetchTakeOutYourTrashData();
    }
  }, [isVisible]);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={handleOnClose}
      className="absolute bottom-0 w-full"
      style={{ margin: 0 }}
    >
      <Card className="rounded-t-2xl rounded-b-none">
        <CardHeader>
          <CardTitle className="text-lg">Saca tu basura</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="flex flex-col gap-4">
            <Text>Consulta el horario de recolección de tu zona</Text>
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
              <InputSelect
                data={zones}
                onChange={onChangeZone}
                value={selectedZone}
              />
            </View>
          </View>
          <FlatList
            className="mt-6 mb-6"
            data={filteredData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View className="flex flex-col px-5 py-6 border border-green-500 bg-green-100 rounded-xl">
                <Text className="font-semibold mb-3 text-green-600 uppercase text-center">
                  Horario de Recolección
                </Text>
                <View className="flex flex-row items-center justify-between">
                  <View className="flex flex-col">
                    <Text variant="small" className="text-muted-foreground">
                      {item.tipo}
                    </Text>
                    <Text className="font-semibold mb-3 text-green-600">
                      {item.nombre}
                    </Text>
                  </View>
                  <View>
                    <LottieView
                      source={require("@/assets/animations/OnTimeTruck.json")}
                      autoPlay
                      loop
                      style={{
                        width: 95,
                        height: 100,
                        alignSelf: "center",
                        margin: "auto",
                        marginTop: -40,
                        marginBottom: -30,
                        transform: [{ scaleX: -1 }],
                      }}
                    />
                  </View>
                </View>
                <Text variant="small" className="text-muted-foreground">
                  Horarios
                </Text>
                {item.turnos.map((turno, index) => (
                  <View
                    key={index}
                    className="flex flex-row items-center justify-between gap-2"
                  >
                    <Text>{turno.dias}</Text>
                    <Text className="text-right">{turno.turno}</Text>
                  </View>
                ))}
              </View>
            )}
            ListEmptyComponent={() => (
              <View className="p-4 flex flex-col gap-4 border border-blue-300 bg-blue-100 items-center justify-center rounded-xl">
                <LottieView
                  source={require("@/assets/animations/TimerIcons.json")}
                  style={{ width: 120, height: 120, margin: "auto" }}
                  autoPlay
                  loop
                />
                <Text className="text-blue-600 text-center">
                  Selecciona un tipo de zona y una zona para ver los horarios de
                  recolección de basura.
                </Text>
              </View>
            )}
          />
        </CardContent>
      </Card>
    </Modal>
  );
}
