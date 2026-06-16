import Expedient from "@/types/expedient.type";
import { View } from "react-native";
import { HintRow } from "./hint-row";
import { Text } from "./ui/text";

export interface CardExpedientProps {
  item: Expedient;
}

export default function CardExpedient({ item }: CardExpedientProps) {
  return (
    <View className="mx-6 my-2 p-4 border border-gray-200 rounded-lg flex flex-row gap-4">
      <View className="flex flex-col gap-2 w-full">
        <HintRow
          title="N° Exp."
          hint={
            <Text variant={"small"}>
              {item.n_expediente}-{item.ano_eje}
            </Text>
          }
        />
        <Text>{item.asunto}</Text>
      </View>
    </View>
  );
}
