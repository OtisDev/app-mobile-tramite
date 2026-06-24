import ActionBar from "@/components/action-bar";
import Loading from "@/components/shared/loading";
import SelectDocumentType from "@/components/shared/select-document-type";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { storeUser } from "@/services/auth.service";
import { searchApiPeru } from "@/services/others.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { LucideSearch, Save } from "lucide-react-native";
import { Fragment, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";
import KeyboardAvoidingWrapper from "../components/keyboard-avoiding-wrapper";

const UserSchema = z
  .object({
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
    phone: z.string().min(1, "El número de celular es requerido").optional(),
    address: z.string().min(1, "La dirección es requerida"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
  })
  .superRefine((data, ctx) => {
    if (data.documentType.value === "1") {
      if (!data.firstName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["firstName"],
          message: "El nombre es requerido",
        });
      }

      if (!data.lastName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["lastName"],
          message: "El apellido paterno es requerido",
        });
      }

      if (!data.secondLastName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["secondLastName"],
          message: "El apellido materno es requerido",
        });
      }
    }
    if (data.documentType.value === "4") {
      if (!data.name?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["name"],
          message: "El nombre es requerido",
        });
      }
    }
  });

export type UserForm = z.infer<typeof UserSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [secureText, setSecureText] = useState<boolean>(true);
  const [searching, setSearching] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
    reset,
  } = useForm<UserForm>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      documentType: {
        label: "DOCUMENTO NACIONAL DE IDENTIDAD",
        value: "1",
      },
      address: "",
      dni: "",
      email: "",
      firstName: "",
      id: 0,
      lastName: "",
      name: "",
      phone: "",
      secondLastName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const allowSearch = useMemo(
    () =>
      watch("documentType")?.value === "1" ||
      watch("documentType")?.value === "4",
    [watch("documentType")?.value],
  );

  const maxLength = useMemo(() => {
    switch (watch("documentType")?.value) {
      case "1":
        return 8;
      case "4":
        return 11;
      default:
        return 20;
    }
  }, [watch("documentType")?.value]);

  const numberPlaceholder = useMemo(() => {
    switch (watch("documentType")?.value) {
      case "1":
        return "00000000";
      case "4":
        return "00000000000";
      default:
        return "XXXXXXXXXX";
    }
  }, [watch("documentType")?.value]);

  const numberLabel = useMemo(() => {
    switch (watch("documentType")?.value) {
      case "1":
        return "N° DNI";
      case "4":
        return "N° RUC";
      case "3":
        return "N° Pasaporte";
      case "2":
        return "N° Carnet de extranjería";
      default:
        return "Número de documento";
    }
  }, [watch("documentType")?.value]);

  const onSearchApi = (dniruc: string) => {
    const documentType = watch("documentType");
    const type = documentType?.value === "1" ? "dni" : "ruc";

    if (dniruc.trim().length === 0) {
      setError("dni", {
        type: "manual",
        message: `El número de ${type === "dni" ? "DNI" : "RUC"} es requerido`,
      });
      return;
    }

    if (dniruc.trim().length !== 8 && type === "dni") {
      setError("dni", {
        type: "manual",
        message: "El número de DNI debe tener 8 dígitos",
      });
      return;
    }

    if (dniruc.trim().length !== 11 && type === "ruc") {
      setError("dni", {
        type: "manual",
        message: "El número de RUC debe tener 11 dígitos",
      });
      return;
    }

    setSearching(true);
    searchApiPeru(type, dniruc)
      .then((data) => {
        if (data.success) {
          if (type === "dni") {
            reset({
              id: 0,
              documentType,
              dni: data.data.numero,
              firstName: data.data.nombres,
              lastName: data.data.apellido_paterno,
              secondLastName: data.data.apellido_materno,
              name: data.data.nombre_completo,
              address: data.data.direccion,
            });
          } else if (type === "ruc") {
            console.log("RUC Data:", data.data);
            reset({
              id: 0,
              documentType,
              dni: data.data.ruc,
              name: data.data.nombre_o_razon_social,
              address: data.data.direccion_completa || "",
            });
          }
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: data.message,
          });
        }
      })
      .finally(() => setSearching(false));
  };

  const onSubmit = (data: UserForm) => {
    if (watch("password") !== watch("confirmPassword")) {
      setError("confirmPassword", {
        type: "manual",
        message: "Las contraseñas no coinciden",
      });
      return;
    }

    if (!acceptTerms) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Debe aceptar los términos y condiciones",
      });
      return;
    }

    const documentType = watch("documentType");

    setSaving(true);
    storeUser({
      ...data,
      tipo: documentType.value === "4" ? "J" : "N",
    })
      .then((response) => {
        if (response.success) {
          Toast.show({
            type: "success",
            text1: "Éxito",
            text2: response.message || "Usuario registrado correctamente",
          });

          reset();
          router.replace("/login");
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2:
              response.message || "Ocurrió un error al registrar el usuario",
          });
        }
      })
      .finally(() => setSaving(false));
  };

  return (
    <>
      <ActionBar goBack={true} title="Registro" />
      <KeyboardAvoidingWrapper>
        <Card className="max-full self-center">
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            {saving && (
              <Loading
                message="Actualizando información..."
                animation="Gears"
                size={150}
                className="z-50 mx-6"
              />
            )}
            <Controller
              name="documentType"
              control={control}
              render={({ field }) => (
                <SelectDocumentType
                  className="mb-4"
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    reset({
                      documentType: value,
                    });
                  }}
                  inModal
                  error={errors.documentType?.value?.message}
                />
              )}
            />
            <Controller
              name="dni"
              control={control}
              render={({ field }) => (
                <InputGroup
                  label={numberLabel}
                  placeholder={numberPlaceholder}
                  required
                  containerClassName="w-full mb-4"
                  keyboardType="number-pad"
                  maxLength={maxLength}
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.dni?.message}
                  suffix={
                    allowSearch && (
                      <TouchableOpacity
                        className="pl-2"
                        onPress={() => onSearchApi(field.value)}
                        disabled={searching}
                      >
                        <LucideSearch size={20} />
                      </TouchableOpacity>
                    )
                  }
                />
              )}
            />
            {watch("documentType")?.value !== "4" && (
              <Fragment>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <InputGroup
                      label="Nombres"
                      placeholder="Nombres"
                      required
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      value={field.value}
                      containerClassName="mb-4"
                      error={errors.firstName?.message}
                    />
                  )}
                />
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <InputGroup
                      label="Apellido Paterno"
                      placeholder="Apellido Paterno"
                      required
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      value={field.value}
                      containerClassName="mb-4"
                      error={errors.lastName?.message}
                    />
                  )}
                />
                <Controller
                  name="secondLastName"
                  control={control}
                  render={({ field }) => (
                    <InputGroup
                      label="Apellido Materno"
                      placeholder="Apellido Materno"
                      required
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      value={field.value}
                      containerClassName="mb-4"
                      error={errors.secondLastName?.message}
                    />
                  )}
                />
              </Fragment>
            )}
            {watch("documentType")?.value === "4" && (
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <InputGroup
                    label="Razón Social"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.name?.message}
                    placeholder="Comercial S.A.C."
                    containerClassName="mb-4"
                  />
                )}
              />
            )}
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <InputGroup
                  label="Dirección"
                  placeholder="Jr. Principal 123"
                  required
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  value={field.value}
                  containerClassName="mb-4"
                  error={errors.address?.message}
                />
              )}
            />
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <InputGroup
                  label="Celular"
                  placeholder="999999999"
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  value={field.value}
                  containerClassName="mb-4"
                  error={errors.phone?.message}
                  keyboardType="phone-pad"
                  required
                  maxLength={20}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <InputGroup
                  label="Correo Electrónico"
                  placeholder="me@ejemplo.com"
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  value={field.value}
                  containerClassName="mb-4"
                  error={errors.email?.message}
                  keyboardType="email-address"
                  required
                />
              )}
            />
            <Text className="text-lg font-semibold my-4">
              Información de usuario
            </Text>
            <Text className="text-gray-500 text-xs mb-6">
              El nombre de usuario será su número de documento (DNI, PASAPORTE,
              CARNET DE EXTRANJERÍA, RUC, etc.) que registró en el formulario.
            </Text>
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <InputGroup
                  label="Contraseña"
                  placeholder="Contraseña"
                  required
                  containerClassName="w-full mb-4"
                  secureTextEntry={secureText}
                  upperCase={false}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  value={field.value}
                  error={errors.password?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <InputGroup
                  label="Repetir Contraseña"
                  placeholder="Repetir Contraseña"
                  required
                  containerClassName="w-full mb-4"
                  secureTextEntry={secureText}
                  upperCase={false}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  value={field.value}
                  error={errors.confirmPassword?.message}
                />
              )}
            />
            <View className="flex flex-row items-center gap-2 mb-4">
              <Switch
                id="secureText"
                nativeID="secureText"
                checked={!secureText}
                onCheckedChange={setSecureText}
              />
              <Label
                htmlFor="secureText"
                nativeID="secureText"
                onPress={() => setSecureText(!secureText)}
              >
                Mostrar contraseña
              </Label>
            </View>
            <View className="flex flex-row items-center gap-2 mb-6">
              <Switch
                id="terms"
                nativeID="terms"
                checked={acceptTerms}
                onCheckedChange={setAcceptTerms}
              />
              <Label
                htmlFor="terms"
                nativeID="terms"
                onPress={() => setAcceptTerms(!acceptTerms)}
              >
                Acepto los términos y condiciones
              </Label>
            </View>
            <Button
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting || saving}
            >
              <Save className="mr-2" color={"white"} size={20} />
              <Text>Registrar</Text>
            </Button>
          </CardContent>
        </Card>
      </KeyboardAvoidingWrapper>
    </>
  );
}
