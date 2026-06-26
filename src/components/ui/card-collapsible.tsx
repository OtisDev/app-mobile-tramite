import { ChevronDown } from "lucide-react-native";
import { ReactNode, useState } from "react";
import { LayoutAnimation, Pressable, View } from "react-native";

import { Text } from "@/components/ui/text";

interface CardCollapsibleProps {
  title: string;
  description?: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  onChangeExpanded?: (expanded: boolean) => void;
}

export function CardCollapsible({
  title,
  description,
  children,
  defaultExpanded = false,
  onChangeExpanded,
}: CardCollapsibleProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const value = !expanded;

    setExpanded(value);
    onChangeExpanded?.(value);
  };

  return (
    <View className="overflow-hidden border border-border bg-card shadow-sm rounded-xl">
      <Pressable
        onPress={toggle}
        android_ripple={{ color: "#E5E7EB" }}
        className="flex-row items-center justify-between px-4 py-4"
      >
        <View className="flex-1 pr-3">
          <Text className="text-base font-semibold">{title}</Text>

          {!!description && (
            <Text className="mt-1 text-sm text-muted-foreground">
              {description}
            </Text>
          )}
        </View>

        <View className={`${expanded ? "rotate-180" : "rotate-0"}`}>
          <ChevronDown size={20} className="text-muted-foreground" />
        </View>
      </Pressable>

      {expanded && (
        <>
          <View className="h-px bg-border" />

          <View className="p-4">{children}</View>
        </>
      )}
    </View>
  );
}
