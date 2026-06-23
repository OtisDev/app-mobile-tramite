import { cn } from "@/lib/utils";
import * as DocumentPicker from "expo-document-picker";
import { LucideX } from "lucide-react-native";
import { Fragment, useState } from "react";
import { Pressable, View } from "react-native";
import { Text } from "./text";

export interface FilePickerProps {
  multiple?: boolean;
  placeholder?: string;
  types?: string | string[];
  error?: string;
  className?: string;
  containerClassName?: string;
  onSelected?: (files: DocumentPicker.DocumentPickerAsset[]) => void;
  onSelectedResult?: (file: DocumentPicker.DocumentPickerResult) => void;
}

export default function FilePicker({
  placeholder = "Seleccione archivo",
  types = ["application/pdf"],
  multiple = false,
  className,
  containerClassName,
  error,
  onSelected,
  onSelectedResult,
}: FilePickerProps) {
  const [fileName, setFileName] = useState<string>(placeholder);
  const onSelectFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      base64: true,
      multiple: multiple,
      type: types ? (Array.isArray(types) ? types : [types]) : [],
    });

    if (!result.canceled) {
      const fileNames = result.assets.map((file) => file.name).join(", ");
      setFileName(fileNames);
      onSelected?.(result.assets);
      onSelectedResult?.(result);
    } else {
      setFileName(placeholder);
    }
  };

  const onClearFile = () => {
    setFileName(placeholder);
    onSelected?.([]);
    onSelectedResult?.({ canceled: true, assets: [] } as any);
  };

  return (
    <Fragment>
      <View
        className={cn(
          "flex-row items-center border border-border rounded-lg",
          error && "border-destructive",
          containerClassName,
        )}
      >
        <Pressable
          onPress={onSelectFile}
          className={cn("px-4 py-2 h-10 w-[92%]", className)}
          style={({ pressed }) => pressed && { opacity: 0.7 }}
        >
          <Text className={cn("truncate", error && "text-destructive")}>
            {fileName}
          </Text>
        </Pressable>
        {placeholder !== fileName && (
          <Pressable
            onPress={onClearFile}
            className="px-3 py-2 h-10 justify-center items-center rounded-r-lg"
          >
            {({ pressed }) => (
              <LucideX
                size={20}
                className={
                  pressed
                    ? "text-red-500"
                    : error
                      ? "text-destructive"
                      : "text-muted-foreground"
                }
                style={{
                  opacity: pressed ? 0.7 : 1,
                }}
              />
            )}
          </Pressable>
        )}
      </View>

      {error && <Text className="text-xs text-destructive">{error}</Text>}
    </Fragment>
  );
}
