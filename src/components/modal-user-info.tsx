import { updateUserInfo } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideSave } from "lucide-react-native";
import { Fragment, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView } from "react-native";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";
import { z } from "zod";
import Loading from "./shared/loading";
import SelectDocumentType from "./shared/select-document-type";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { InputGroup } from "./ui/input-group";
import { Text } from "./ui/text";

export interface ModalUserInfoProps {
  isVisible: boolean;
  onClose: () => void;
}

const UserSchema = z.object({
  documentType: z.object({
    label: z.string(),
    value: z.string(),
  }),
  id: z.number().min(0),
  name: z.string(),
  dni: z
    .string()
    .min(1, "El número de documento es requerido")
    .max(20, "El número de documento no puede exceder los 20 caracteres"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  secondLastName: z.string().optional(),
  email: z.string().email("Correo electrónico no válido").optional(),
  phone: z.string().optional(),
  address: z.string().min(1, "La dirección es requerida"),
});

export type UserForm = z.infer<typeof UserSchema>;

export default function ModalUserInfo({
  isVisible,
  onClose,
}: ModalUserInfoProps) {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserForm>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      documentType: {
        label: "DOCUMENTO NACIONAL DE IDENTIDAD",
        value: user?.tipoDocId?.toString() || "1",
      },
      address: user?.address || "",
      dni: user?.dni || "",
      email: user?.email || "",
      firstName: user?.firstName || "",
      id: user?.id || 0,
      lastName: user?.lastName || "",
      name: user?.name || "",
      phone: user?.phone || "",
      secondLastName: user?.secondLastName || "",
    },
  });

  const onSubmit = (data: UserForm) => {
    setLoading(true);
    updateUserInfo({
      id: data.id,
      name: data.name,
      username: user?.username || "",
      firstName: data.firstName,
      lastName: data.lastName,
      secondLastName: data.secondLastName,
      dni: data.dni,
      email: data.email,
      phone: data.phone,
      address: data.address,
      tipoDocId: parseInt(data.documentType.value),
      tipo: parseInt(data.documentType.value) === 4 ? "J" : "N",
    } as User)
      .then(({ data }) => {
        if (data.success) {
          Toast.show({
            type: "success",
            text1: "Información actualizada",
            text2:
              data.message ||
              "La información del usuario ha sido actualizada correctamente.",
          });
          onClose();
        } else {
          Toast.show({
            type: "error",
            text1: "Error al actualizar información",
            text2:
              data.message ||
              "No se pudo actualizar la información del usuario.",
          });
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      avoidKeyboard={true}
      className="absolute bottom-0 w-full z-20"
      style={{ margin: 0, zIndex: 20 }}
    >
      <ScrollView>
        <Card className="rounded-t-2xl rounded-b-none">
          <CardHeader>
            <CardTitle className="text-lg">Información del Usuario</CardTitle>
          </CardHeader>
          <CardContent className="relative flex flex-col gap-4 ">
            {loading && (
              <Loading
                message="Actualizando información..."
                animation="Gears"
                size={150}
                className="z-50 mx-6"
              />
            )}
            <Controller
              control={control}
              name="documentType"
              render={({ field }) => (
                <SelectDocumentType
                  selectClassName="z-50"
                  value={field.value}
                  onValueChange={field.onChange}
                  inModal={true}
                  error={errors.documentType?.value?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="dni"
              render={({ field }) => (
                <InputGroup
                  label="Número de documento"
                  keyboardType="number-pad"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.dni?.message}
                  required
                />
              )}
            />

            {control._formValues.documentType?.value !== "4" && (
              <Fragment>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field }) => (
                    <InputGroup
                      label="Nombres"
                      value={field.value || ""}
                      required
                      onChangeText={field.onChange}
                      error={errors.firstName?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field }) => (
                    <InputGroup
                      label="Apellido Paterno"
                      value={field.value || ""}
                      required
                      onChangeText={field.onChange}
                      error={errors.lastName?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="secondLastName"
                  render={({ field }) => (
                    <InputGroup
                      label="Apellido Materno"
                      value={field.value || ""}
                      required
                      onChangeText={field.onChange}
                      error={errors.secondLastName?.message}
                    />
                  )}
                />
              </Fragment>
            )}

            {control._formValues.documentType?.value === "4" && (
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <InputGroup
                    label="Razón Social"
                    value={field.value || ""}
                    onChangeText={field.onChange}
                    error={errors.name?.message}
                  />
                )}
              />
            )}

            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <InputGroup
                  label="Correo electrónico"
                  value={field.value || ""}
                  onChangeText={field.onChange}
                  keyboardType="email-address"
                  error={errors.email?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <InputGroup
                  label="Celular"
                  keyboardType="number-pad"
                  value={field.value || ""}
                  onChangeText={field.onChange}
                  error={errors.phone?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="address"
              render={({ field }) => (
                <InputGroup
                  label="Dirección"
                  value={field.value || ""}
                  onChangeText={field.onChange}
                  required
                  error={errors.address?.message}
                />
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-row justify-between gap-2">
            <Button variant="outline" onPress={onClose}>
              <Text>Cancelar</Text>
            </Button>
            <Button
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting || loading}
            >
              <LucideSave className="mr-2" color="white" size={20} />
              <Text>Actualizar</Text>
            </Button>
          </CardFooter>
        </Card>
      </ScrollView>
    </Modal>
  );
}
