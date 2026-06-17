import Expedient from "@/types/expedient.type";
import { View } from "react-native";
import ExpedientBadgeStatus from "./expedients/badge-status";
import { Label } from "./ui/label";
import { Text } from "./ui/text";

export interface CardExpedientProps {
  item: Expedient;
}

export default function CardExpedient({ item }: CardExpedientProps) {
  return (
    <View className="mx-6 my-2 p-4 border border-gray-200 rounded-lg flex flex-row gap-4">
      <View className="flex flex-col gap-2 w-full">
        <View className="flex flex-row justify-between">
          <View>
            <Label>Exp. N°</Label>
            <Text>
              {item.n_expediente}-{item.ano_eje}
            </Text>
          </View>
          <View>
            <ExpedientBadgeStatus
              status={item.item_estado}
              className="w-4 h-4 rounded-full"
            />
          </View>
        </View>
        <Text>{item.asunto}</Text>
      </View>
    </View>
  );
}
