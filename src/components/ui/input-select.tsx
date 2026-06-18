import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import LottieView from "lottie-react-native";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import Modal from "react-native-modal";

export interface SelectOption {
  value: string | number;
  label: string;
}

interface InputSelectProps {
  label?: string;
  placeholder?: string;
  value?: SelectOption | null;
  onChange?: (item: SelectOption) => void;
  data?: SelectOption[];
  loadOptions?: (search: string) => Promise<SelectOption[]>;
}

export function InputSelect({
  data = [],
  label,
  placeholder = "Seleccione...",
  value,
  onChange,
  loadOptions,
}: InputSelectProps) {
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState<SelectOption[]>(data);

  const fetchItems = async (term: string = "") => {
    try {
      setLoading(true);

      const response = await loadOptions?.(term);

      setItems(response || []);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = async () => {
    setOpen(true);

    if (items.length === 0) {
      await fetchItems("");
    }
  };

  return (
    <>
      {label && <Text className="mb-2 font-medium">{label}</Text>}

      <Pressable
        onPress={handleOpen}
        className="border border-input rounded-lg px-3 py-2 bg-background"
      >
        <Text>{value?.label || placeholder}</Text>
      </Pressable>

      <Modal
        isVisible={open}
        onBackdropPress={() => setOpen(false)}
        style={{ margin: 0 }}
      >
        <View className="bg-background rounded-t-2xl mt-auto max-h-[60%]">
          <View className="p-4 border-b border-border">
            <Text className="text-lg font-semibold mb-4">Seleccionar</Text>

            <Input
              placeholder="Buscar..."
              value={search}
              onChangeText={(text) => {
                setSearch(text);

                fetchItems(text);
              }}
            />
          </View>

          {loading && (
            <View className="py-10">
              <ActivityIndicator />
            </View>
          )}

          {!loading && items.length > 0 && (
            <FlatList
              data={items}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <Pressable
                  className="px-4 py-4 border-b border-border"
                  onPress={() => {
                    onChange?.(item);

                    setOpen(false);
                  }}
                >
                  <Text>{item.label}</Text>
                </Pressable>
              )}
            />
          )}

          {!loading && items.length === 0 && (
            <View className="py-10">
              <LottieView
                source={require("@/assets/animations/NotFound.json")}
                autoPlay
                loop
                style={{
                  width: 150,
                  height: 150,
                  alignSelf: "center",
                }}
              />
              <Text className="text-center text-muted-foreground">
                No se encontraron resultados
              </Text>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
}
