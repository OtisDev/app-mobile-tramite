import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
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
  labelClassName?: string;
  onPress?: (evt: GestureResponderEvent) => void;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  icon?: LucideIcon;
  iconColor?: string;
  iconSize?: number;
}

export default function ButtonIcon({
  label,
  className,
  labelClassName,
  onPress,
  children,
  style,
  icon: Icon,
  iconColor = "#ffffff", //"#193067",
  iconSize = 32,
}: ButtonIconProps) {
  const handleOnPress = (evt: GestureResponderEvent) => onPress?.(evt);

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={handleOnPress}
      style={style}
      className={cn(
        "flex flex-col gap-2 items-center bg-primary p-4 rounded-lg cursor-pointer shadow-sm shadow-black/80",
        className,
      )}
    >
      {!children && Icon ? (
        <Icon size={iconSize} color={iconColor} />
      ) : (
        children
      )}
      <Text
        className={cn(
          "text-center text-white uppercase text-sm",
          labelClassName,
        )}
        numberOfLines={2}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
