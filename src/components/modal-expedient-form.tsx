import { cn } from "@/lib/utils";
import { listDocumentTypes } from "@/services/expedient.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { File } from "expo-file-system";
import { LucideSave } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import Modal from "react-native-modal";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import FilePicker from "./ui/file-picker";
import { InputGroup } from "./ui/input-group";
import { InputSelect, SelectOption } from "./ui/input-select";
import { Label } from "./ui/label";
import { Text } from "./ui/text";
import { Textarea } from "./ui/textarea";

export interface ModalExpedientFormProps {
  isVisible: boolean;
  onClose: () => void;
}

const ExpedientFormSchema = z.object({
  expediente_id: z.number().min(0, "El ID del expediente es requerido"),
  ano_eje: z.string().min(2025, "El año es requerido"),
  n_expediente: z.number().min(0, "El número de expediente es requerido"),
  asunto: z.string().min(1, "El asunto es requerido"),
  cod_tipodoc: z.string().min(1, "El tipo de documento es requerido"),
  siglas_doc: z.string().min(1, "Las siglas del documento son requeridas"),
  observacion: z.string().nullable().optional(),
  folios: z.number().min(1, "El número de folios es requerido"),
  fecha_doc: z.string(),
  documento: z
    .instanceof(File, {
      when: (file) => file !== null,
      message: "El documento es requerido",
    })
    .nonoptional(),
});

type ExpedientForm = z.infer<typeof ExpedientFormSchema>;

export default function ModalExpedientForm({
  isVisible,
  onClose,
}: ModalExpedientFormProps) {
  const [documentTypes, setDocumentTypes] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    setError,
    resetDefaultValues,
  } = useForm<ExpedientForm>({
    resolver: zodResolver(ExpedientFormSchema),
    defaultValues: {
      expediente_id: 0,
      ano_eje: new Date().getFullYear().toString(),
      n_expediente: 0,
      cod_tipodoc: "",
      siglas_doc: "",
      asunto: "",
      observacion: null,
      folios: 1,
      fecha_doc: new Date().toISOString().split("T")[0],
      documento: {} as File,
    },
  });

  const loadDocumentTypes = () => {
    listDocumentTypes().then(({ data }) => {
      if (data.success && data.data) {
        const filtered = data.data.map((docType) => {
          return {
            label: docType.nom_tipodoc,
            value: docType.cod_tipodoc,
          } as SelectOption;
        });
        setDocumentTypes(filtered);
      } else {
        setDocumentTypes([]);
      }
    });
  };

  const onSubmit = (data: ExpedientForm) => {
    if (file === null || file === undefined) {
      setError("documento", {
        type: "manual",
        message: "El documento es requerido",
      });
      return;
    }

    console.log("Form data:", data);
  };

  useEffect(() => {
    if (isVisible) {
      loadDocumentTypes();
    } else {
      reset();
    }
  }, [isVisible]);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      avoidKeyboard={true}
      className="absolute bottom-0 w-full"
      style={{ margin: 0 }}
    >
      <ScrollView>
        <Card className="rounded-t-2xl rounded-b-none">
          <CardHeader>
            <CardTitle className="text-lg">Nuevo Trámite</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Controller
              control={control}
              name="cod_tipodoc"
              render={({ field }) => (
                <View className="field">
                  <View className="flex flex-row gap-2 items-center">
                    <Label
                      className={cn(
                        "label-control",
                        errors.cod_tipodoc && "text-destructive",
                      )}
                    >
                      Tipo documento
                    </Label>
                    <Label className="label-control text-red-500">*</Label>
                  </View>
                  <InputSelect
                    data={documentTypes}
                    value={documentTypes.find(
                      (option) => option.value === field.value,
                    )}
                    onChange={(option) => field.onChange(option.value)}
                    error={errors.cod_tipodoc?.message}
                  />
                </View>
              )}
            />
            <View className="flex flex-row justify-between gap-4">
              <Controller
                control={control}
                name="fecha_doc"
                render={({ field }) => (
                  <InputGroup
                    label="Fecha documento"
                    required
                    value={field.value}
                    onChangeText={field.onChange}
                    error={errors.fecha_doc?.message}
                    containerClassName="w-[48%]"
                    placeholder="YYYY-MM-DD"
                  />
                )}
              />
              <Controller
                control={control}
                name="folios"
                render={({ field }) => (
                  <InputGroup
                    label="Folios"
                    required
                    value={field.value?.toString()}
                    onChangeText={field.onChange}
                    error={errors.folios?.message}
                    containerClassName="w-[48%]"
                    keyboardType="numeric"
                  />
                )}
              />
            </View>
            <Controller
              control={control}
              name="siglas_doc"
              render={({ field }) => (
                <InputGroup
                  label="Siglas documento"
                  required
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.siglas_doc?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="asunto"
              render={({ field }) => (
                <View className="field">
                  <View className="flex flex-row gap-2 items-center">
                    <Label
                      className={cn(
                        "label-control",
                        errors.asunto && "text-destructive",
                      )}
                    >
                      Asunto
                    </Label>
                    <Label className="label-control text-red-500">*</Label>
                  </View>
                  <Textarea
                    multiline={true}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    aria-disabled={field.disabled}
                    className={cn(errors.asunto && "border-destructive")}
                  />
                  {errors.asunto && (
                    <Text className="text-xs text-destructive">
                      {errors.asunto.message}
                    </Text>
                  )}
                </View>
              )}
            />
            <Controller
              control={control}
              name="observacion"
              render={({ field }) => (
                <View className="field">
                  <Label className="label-control">Observación</Label>
                  <Textarea
                    multiline={true}
                    value={field.value || ""}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    aria-disabled={field.disabled}
                    className={cn(errors.observacion && "border-destructive")}
                  />
                  {errors.observacion && (
                    <Text className="text-xs text-destructive">
                      {errors.observacion.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <View className="field">
              <View className="flex flex-row gap-2 items-center">
                <Text
                  className={cn(
                    "label-control text-sm",
                    errors.documento && "text-destructive",
                  )}
                >
                  Documento
                </Text>
                <Label className="label-control text-red-500">*</Label>
              </View>
              <FilePicker
                type={["application/pdf"]}
                onSelected={(files) => {
                  if (files.length > 0) {
                    console.log("Selected file:", files[0].uri);
                  }
                }}
              />
              {errors.documento && (
                <Text className="text-xs text-destructive">
                  {errors.documento.message}
                </Text>
              )}
            </View>
          </CardContent>
          <CardFooter className="flex flex-row justify-between gap-2">
            <Button variant={"secondary"} onPress={onClose}>
              <Text>Cancelar</Text>
            </Button>
            <Button
              disabled={isSubmitting || loading}
              onPress={handleSubmit(onSubmit)}
            >
              <LucideSave
                className="mr-2 text-white"
                size={16}
                color={"white"}
              />
              <Text>Guardar</Text>
            </Button>
          </CardFooter>
        </Card>
      </ScrollView>
    </Modal>
  );
}
