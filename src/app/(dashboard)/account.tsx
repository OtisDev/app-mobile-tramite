import KeyboardAvoidingWrapper from "@/components/keyboard-avoiding-wrapper";
import Loading from "@/components/shared/loading";
import SelectDocumentType from "@/components/shared/select-document-type";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { InputGroup } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { Spacing } from "@/constants/theme";
import {
    ChangePasswordForm,
    ChangePasswordSchema,
    UserForm,
    UserSchema,
} from "@/schemas";
import { updatePassword, updateUser } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { LucideAlertTriangle, LucideSave } from "lucide-react-native";
import { Fragment, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import Toast from "react-native-toast-message";

export default function DashboardAccountScreen() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPassword, setLoadingPassword] = useState<boolean>(false);
  const [errorPassword, setErrorPassword] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
    updateUser({
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

  const {
    control: controlPwd,
    reset: resetPwd,
    handleSubmit: handleSubmitPwd,
    formState: { errors: errorsPwd, isSubmitting: isSubmittingPwd },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmitPassword = (data: ChangePasswordForm) => {
    try {
      if (data.newPassword !== data.confirmNewPassword) {
        setErrorPassword("La nueva contraseña y su confirmación no coinciden");
        return;
      }

      setLoadingPassword(true);

      updatePassword(data.currentPassword, data.newPassword)
        .then(({ data }) => {
          setLoadingPassword(false);
          if (data.success) {
            resetPwd();
          }
        })
        .finally(() => setLoadingPassword(false));
    } catch (err) {
      setLoadingPassword(false);
      setErrorPassword(
        err instanceof Error ? err.message : "Ocurrió un error inesperado",
      );
    }
  };

  const proxyAvatar = useMemo(() => {
    if (user?.tipoDocId === 1) {
      return `https://backend-consultas.muninuevochimbote.gob.pe/api/photos/${user?.dni}`;
    } else {
      return `https://ui-avatars.com/api/?name=${user?.name}`;
    }
  }, [user?.dni, user?.tipoDocId, user?.name]);

  return (
    <KeyboardAvoidingWrapper contentClassName="p-6">
      <View style={{ padding: Spacing.four, alignItems: "center" }}>
        <View
          className="rounded-full shadow-md border border-border p-1 bg-white"
          style={{ width: 132, height: 132 }}
        >
          <Image
            source={{ uri: proxyAvatar }}
            style={{ width: "100%", height: "100%", borderRadius: 999 }}
          />
        </View>
      </View>

      <Card className="rounded-2xl mb-6">
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
          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting || loading}
          >
            <LucideSave className="mr-2" color="white" size={20} />
            <Text>Actualizar</Text>
          </Button>
        </CardFooter>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Cambiar contraseña</CardTitle>
        </CardHeader>
        <CardContent className="relative flex flex-col gap-4">
          {loadingPassword && (
            <Loading
              message="Actualizando contraseña..."
              animation="Gears"
              size={150}
              className="z-50 mx-6"
            />
          )}
          {errorPassword && (
            <Alert
              icon={LucideAlertTriangle}
              variant="destructive"
              className="bg-red-100 border-destructive"
            >
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorPassword}</AlertDescription>
            </Alert>
          )}
          <Controller
            control={controlPwd}
            name="currentPassword"
            render={({ field }) => (
              <InputGroup
                label="Contraseña actual"
                secureTextEntry={!showPassword}
                required
                value={field.value}
                onChangeText={field.onChange}
                error={errorsPwd.currentPassword?.message}
                upperCase={false}
              />
            )}
          />
          <Controller
            control={controlPwd}
            name="newPassword"
            render={({ field }) => (
              <InputGroup
                label="Nueva contraseña"
                secureTextEntry={!showPassword}
                required
                value={field.value}
                onChangeText={field.onChange}
                error={errorsPwd.newPassword?.message}
                upperCase={false}
              />
            )}
          />
          <Controller
            control={controlPwd}
            name="confirmNewPassword"
            render={({ field }) => (
              <InputGroup
                label="Confirmar nueva contraseña"
                secureTextEntry={!showPassword}
                required
                value={field.value}
                onChangeText={field.onChange}
                error={errorsPwd.confirmNewPassword?.message}
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
          <Button
            onPress={handleSubmitPwd(onSubmitPassword)}
            disabled={isSubmittingPwd || loadingPassword}
          >
            <LucideSave className="mr-2" color="white" size={20} />
            <Text>Actualizar</Text>
          </Button>
        </CardFooter>
      </Card>
    </KeyboardAvoidingWrapper>
  );
}
