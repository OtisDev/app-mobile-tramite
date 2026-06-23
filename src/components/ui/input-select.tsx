import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import LottieView from "lottie-react-native";
import { LucideCheck, LucideSearch, LucideX } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { InputGroup } from "./input-group";

export interface SelectOption {
  value: string | number;
  label: string;
}

interface InputSelectProps {
  placeholder?: string;
  value?: SelectOption | null;
  onChange?: (item: SelectOption) => void;
  data?: SelectOption[];
  loadOptions?: (search: string) => Promise<SelectOption[]>;
  searchable?: boolean;
  title?: string;
  description?: string;
  error?: string;
}

export function InputSelect({
  data = [],
  placeholder = "Seleccione...",
  value,
  onChange,
  loadOptions,
  searchable = true,
  title = "Seleccionar",
  description,
  error,
}: InputSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<SelectOption[]>(data);
  const [proxyValue, setProxyValue] = useState(value);

  useEffect(() => {
    setItems(data);
  }, [data]);

  useEffect(() => {
    setProxyValue(value);
  }, [value]);

  const fetchItems = async (term: string = "") => {
    try {
      setLoading(true);

      if (loadOptions) {
        const response = await loadOptions(term);
        setItems(response || []);
      } else {
        const filtered = data.filter((item) =>
          item.label.toLowerCase().includes(term.toLowerCase()),
        );
        setItems(filtered);
      }
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
      <Pressable
        onPress={handleOpen}
        className={cn(
          "border border-input rounded-lg px-3 py-2 bg-background",
          error && "border-destructive",
        )}
      >
        <Text className={cn(error && "text-destructive")}>
          {proxyValue?.label || placeholder}
        </Text>
      </Pressable>

      {description && !error && (
        <Text className="text-xs text-muted-foreground">{description}</Text>
      )}

      {error && <Text className="text-xs text-destructive">{error}</Text>}

      <Modal
        isVisible={open}
        onBackdropPress={() => setOpen(false)}
        style={{ margin: 0 }}
      >
        <View className="bg-background rounded-t-2xl mt-auto max-h-[60%]">
          <View className="px-6 py-4 border-b border-border">
            <Text className={cn("text-lg font-semibold", searchable && "mb-4")}>
              {title}
            </Text>

            {searchable && (
              <InputGroup
                placeholder="Buscar..."
                onChangeText={(text) => {
                  setSearch(text);
                  fetchItems(text);
                }}
                value={search}
                prefix={<LucideSearch size={22} color="#9ca3af" />}
                suffix={
                  search.length > 0 && (
                    <TouchableOpacity
                      onPress={() => {
                        setSearch("");
                        fetchItems("");
                      }}
                      className="pt-1 pb-1 pl-1 pr-0.5 cursor-pointer"
                    >
                      <LucideX size={22} color="#9ca3af" />
                    </TouchableOpacity>
                  )
                }
              />
            )}
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
                  className="px-6 py-4 border-b border-border flex flex-row justify-between items-center"
                  onPress={() => {
                    onChange?.(item);
                    setProxyValue(item);
                    setOpen(false);
                  }}
                >
                  <Text>{item.label}</Text>
                  {proxyValue?.value === item.value && (
                    <LucideCheck size={20} color="#4ade80" />
                  )}
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
