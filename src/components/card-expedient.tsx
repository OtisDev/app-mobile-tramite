import Expedient from "@/types/expedient.type";
import { LucideBookMarked, LucideTicketCheck } from "lucide-react-native";
import { GestureResponderEvent, Pressable, View } from "react-native";
import ExpedientBadgeStatus from "./expedients/badge-status";
import { Button } from "./ui/button";
import { Text } from "./ui/text";

export interface CardExpedientProps {
  item: Expedient;
  onPress?: (
    item: Expedient,
    action: "history" | "ticket",
    e: GestureResponderEvent,
  ) => void;
}

export default function CardExpedient({ item, onPress }: CardExpedientProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-PE", {
      hour12: true,
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Pressable className="p-4 border border-gray-200 rounded-lg flex flex-col gap-2">
      <View className="flex flex-row items-center justify-between">
        <View>
          <Text variant={"small"}>N° Exp.</Text>
          <Text className="font-extrabold">
            {item.n_expediente}-{item.ano_eje}
          </Text>
        </View>
        <View>
          <Text variant={"small"}>Fecha</Text>
          <Text className="font-semibold">{formatDate(item.fecha_doc)}</Text>
        </View>
        <View>
          <ExpedientBadgeStatus
            status={item.item_estado}
            className="rounded-full"
          />
        </View>
      </View>
      <View>
        <Text variant={"small"}>Área de Fin</Text>
        <Text>{item.idareafin || "No especificado"}</Text>
      </View>
      <View>
        <Text variant={"small"}>Asunto</Text>
        <Text>{item.asunto}</Text>
      </View>
      <View>
        <Text variant={"small"}>Siglas de Documento</Text>
        <Text>
          {item.document_type?.abrev || ""} N° {item.siglas_doc}
        </Text>
      </View>
      <View className="flex flex-row items-center justify-end gap-4">
        <Button
          size={"sm"}
          variant={"purple"}
          onPress={(e) => onPress?.(item, "history", e)}
        >
          <LucideBookMarked color="white" size={20} />
          <Text className="text-white">Hoja de Ruta</Text>
        </Button>
        <Button
          variant={"warning"}
          size={"sm"}
          onPress={(e) => onPress?.(item, "ticket", e)}
        >
          <LucideTicketCheck color="white" size={20} />
          <Text className="text-white">Ticket</Text>
        </Button>
      </View>
    </Pressable>
  );
}
