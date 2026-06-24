import { ReactNode } from "react";
import { TextInputProps, View } from "react-native";

import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface InputGroupProps extends TextInputProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;

  prefix?: ReactNode;
  suffix?: ReactNode;

  className?: string;
  containerClassName?: string;
}

export function InputGroup({
  label,
  description,
  error,
  required,

  prefix,
  suffix,

  containerClassName,
  className,

  ...props
}: InputGroupProps) {
  return (
    <View className={cn("gap-2 z-10", containerClassName)}>
      {label && (
        <Text
          className={cn(
            "text-sm font-medium text-foreground",
            error && "text-destructive",
          )}
        >
          {label}
          {required && <Text className="text-destructive"> *</Text>}
        </Text>
      )}

      <View
        className={cn(
          "flex-row items-center rounded-md border border-input bg-background px-3",
          error && "border-destructive",
        )}
      >
        {prefix && <View className="mr-2">{prefix}</View>}

        <Input
          className={cn("flex-1 border-0 bg-transparent px-0", className)}
          {...props}
        />

        {suffix && <View className="ml-2">{suffix}</View>}
      </View>

      {description && !error && (
        <Text className="text-xs text-muted-foreground">{description}</Text>
      )}

      {error && <Text className="text-xs text-destructive">{error}</Text>}
    </View>
  );
}
