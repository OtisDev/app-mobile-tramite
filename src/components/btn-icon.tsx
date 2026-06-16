import { cn } from "@/lib/utils";
import { GestureResponderEvent, TouchableOpacity, View } from "react-native";
import { Label } from "./ui/label";

export interface BtnIconProps {
  label: string;
  icon?: React.ReactNode;
  className?: string;
  onPress?: (evt: GestureResponderEvent) => void;
}

export default function BtnIcon({
  label,
  icon,
  className,
  onPress,
}: BtnIconProps) {
  const handleOnPress = (evt: GestureResponderEvent) => onPress?.(evt);

  return (
    <TouchableOpacity
      onPress={handleOnPress}
      className={cn(
        "flex flex-col gap-2 items-center border p-4 rounded-lg cursor-pointer",
        className,
      )}
    >
      {icon && <View>{icon}</View>}
      <Label>{label}</Label>
    </TouchableOpacity>
  );
}
