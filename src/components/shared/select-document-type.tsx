import { cn } from "@/lib/utils";
import { Fragment, useState } from "react";
import { View } from "react-native";
import { InputSelect } from "../ui/input-select";
import {
  Option,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Text } from "../ui/text";

export interface DocumentTypeItem {
  label: string;
  items: Option[];
}

export interface SelectDocumentTypeProps {
  value?: Option;
  className?: string;
  selectClassName?: string;
  data?: DocumentTypeItem[];
  onValueChange?: (option: Option) => void;
  description?: string;
  error?: string;
  inModal?: boolean;
}

export const DEFAULT_DOCUMENT_TYPES: DocumentTypeItem[] = [
  {
    label: "Natural",
    items: [
      { label: "DOCUMENTO NACIONAL DE IDENTIDAD", value: "1" },
      { label: "CARNET DE EXTRANJERÍA", value: "2" },
      { label: "PASAPORTE", value: "3" },
    ],
  },
  {
    label: "Jurídica",
    items: [
      { label: "REGISTRO ÚNICO DE CONTRIBUYENTE", value: "4" },
      //{ label: "OTRO", value: "8" },
    ],
  },
];

export default function SelectDocumentType({
  value,
  className,
  selectClassName,
  data = DEFAULT_DOCUMENT_TYPES,
  onValueChange,
  error,
  description,
  inModal = false,
}: SelectDocumentTypeProps) {
  const [selectedDocumentType, setSelectedDocumentType] = useState<Option>(
    value || {
      label: "DOCUMENTO NACIONAL DE IDENTIDAD",
      value: "1",
    },
  );

  const handleOnChange = (option: Option) => {
    setSelectedDocumentType(option);
    onValueChange?.(option);
  };

  return (
    <View className={cn("field", className)}>
      <View className="flex flex-row gap-2 items-center">
        <Text className="label-control text-sm">Tipo documento</Text>
        <Text className="label-control text-sm text-red-500">*</Text>
      </View>
      {!inModal && (
        <Select
          className={cn("w-full", selectClassName)}
          value={selectedDocumentType}
          onValueChange={handleOnChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el tipo de documento" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {data?.map((group) => {
                return (
                  <Fragment key={group.label}>
                    <SelectLabel>{group.label}</SelectLabel>
                    {group.items
                      .filter((option) => option !== undefined)
                      .map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option?.value}
                          label={option.label}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                  </Fragment>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
      {inModal && (
        <InputSelect
          data={data
            .flatMap((group) => group.items)
            .filter((option) => option !== undefined)}
          placeholder="Seleccione"
          value={selectedDocumentType}
          onChange={(selected) => handleOnChange(selected as Option)}
          searchable={false}
        />
      )}

      {description && !error && (
        <Text className="text-xs text-muted-foreground">{description}</Text>
      )}

      {error && <Text className="text-xs text-destructive">{error}</Text>}
    </View>
  );
}
