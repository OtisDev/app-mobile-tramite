import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import { Pressable } from "react-native";
import { Text } from "./text";

export interface FilePickerProps {
  multiple?: boolean;
  placeholder?: string;
  type?: string | string[];
  onSelected?: (files: DocumentPicker.DocumentPickerAsset[]) => void;
  onSelectedResult?: (file: DocumentPicker.DocumentPickerResult) => void;
}

export default function FilePicker({
  placeholder = "Seleccione archivo",
  type,
  multiple = false,
  onSelected,
  onSelectedResult,
}: FilePickerProps) {
  const [fileName, setFileName] = useState<string>(placeholder);
  const onSelectFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      base64: true,
      multiple: multiple,
      type: type ? (Array.isArray(type) ? type : [type]) : [],
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

  return (
    <Pressable
      onPress={onSelectFile}
      className="px-4 py-2 border border-border rounded-xl h-10"
    >
      <Text>{fileName}</Text>
    </Pressable>
  );
}
