import { updatePassword } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideAlertTriangle, LucideSave } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import Modal from "react-native-modal";
import { z } from "zod";
import Loading from "./shared/loading";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { InputGroup } from "./ui/input-group";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    control,
    reset,
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
    try {
      if (data.newPassword !== data.confirmNewPassword) {
        setError("La nueva contraseña y su confirmación no coinciden");
        return;
      }

      setLoading(true);

      updatePassword(data.currentPassword, data.newPassword)
        .then(() => {
          setLoading(false);
          onClose();
        })
        .finally(() => setLoading(false));
    } catch (err) {
      setLoading(false);
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado",
      );
    }
  };

  useEffect(() => {
    if (!isVisible) {
      setError(null);
      reset();
    }
  }, [isVisible]);

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
        <CardContent className="relative flex flex-col gap-4">
          {loading && (
            <Loading
              message="Actualizando contraseña..."
              animation="Gears"
              size={150}
              className="z-50 mx-6"
            />
          )}
          {error && (
            <Alert
              icon={LucideAlertTriangle}
              variant="destructive"
              className="bg-red-100 border-destructive"
            >
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Controller
            control={control}
            name="currentPassword"
            render={({ field }) => (
              <InputGroup
                label="Contraseña actual"
                secureTextEntry={!showPassword}
                required
                value={field.value}
                onChangeText={field.onChange}
                error={errors.currentPassword?.message}
                upperCase={false}
              />
            )}
          />
          <Controller
            control={control}
            name="newPassword"
            render={({ field }) => (
              <InputGroup
                label="Nueva contraseña"
                secureTextEntry={!showPassword}
                required
                value={field.value}
                onChangeText={field.onChange}
                error={errors.newPassword?.message}
                upperCase={false}
              />
            )}
          />
          <Controller
            control={control}
            name="confirmNewPassword"
            render={({ field }) => (
              <InputGroup
                label="Confirmar nueva contraseña"
                secureTextEntry={!showPassword}
                required
                value={field.value}
                onChangeText={field.onChange}
                error={errors.confirmNewPassword?.message}
                upperCase={false}
              />
            )}
          />
          <View className="flex flex-row items-center gap-2">
            <Switch
              checked={showPassword}
              onCheckedChange={setShowPassword}
              nativeID="show-passwords"
              id="show-passwords"
            />
            <Label
              htmlFor="show-passwords"
              nativeID="show-passwords"
              onPress={() => setShowPassword(!showPassword)}
            >
              Mostrar contraseñas
            </Label>
          </View>
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
