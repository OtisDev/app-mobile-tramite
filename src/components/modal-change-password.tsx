import { zodResolver } from "@hookform/resolvers/zod";
import { LucideSave } from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { InputGroup } from "./ui/input-group";
import { Text } from "./ui/text";

export interface ModalChangePasswordProps {
  isVisible: boolean;
  onClose: () => void;
}

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "La contraseña actual es requerida"),
  newPassword: z
    .string()
    .min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
  confirmNewPassword: z
    .string()
    .min(
      8,
      "La confirmación de la nueva contraseña debe tener al menos 8 caracteres",
    ),
});

type ChangePasswordForm = z.infer<typeof ChangePasswordSchema>;

export default function ModalChangePassword({
  isVisible,
  onClose,
}: ModalChangePasswordProps) {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = (data: ChangePasswordForm) => {
    setLoading(true);
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={{ margin: 0 }}
      className="absolute bottom-0 w-full"
    >
      <Card className="rounded-t-2xl rounded-b-none">
        <CardHeader>
          <CardTitle className="text-lg">Cambiar contraseña</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Controller
            control={control}
            name="currentPassword"
            render={({ field }) => (
              <InputGroup
                label="Contraseña actual"
                secureTextEntry
                required
                value={field.value}
                onChangeText={field.onChange}
                error={errors.currentPassword?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="newPassword"
            render={({ field }) => (
              <InputGroup
                label="Nueva contraseña"
                secureTextEntry
                required
                value={field.value}
                onChangeText={field.onChange}
                error={errors.newPassword?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="confirmNewPassword"
            render={({ field }) => (
              <InputGroup
                label="Confirmar nueva contraseña"
                secureTextEntry
                required
                value={field.value}
                onChangeText={field.onChange}
                error={errors.confirmNewPassword?.message}
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
    </Modal>
  );
}
