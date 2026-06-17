import { cn } from "@/lib/utils";
import {
  GestureResponderEvent,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Text } from "./ui/text";

export interface ButtonIconProps {
  label: string;
  className?: string;
  onPress?: (evt: GestureResponderEvent) => void;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function ButtonIcon({
  label,
  className,
  onPress,
  children,
  style,
}: ButtonIconProps) {
  const handleOnPress = (evt: GestureResponderEvent) => onPress?.(evt);

  return (
    <TouchableOpacity
      onPress={handleOnPress}
      style={style}
      className={cn(
        "flex flex-col gap-2 items-center border border-primary p-4 rounded-lg cursor-pointer",
        className,
      )}
    >
      {children}
      <Text className="text-center text-primary uppercase text-sm">
        {label}
      </Text>
    </TouchableOpacity>
  );
}
