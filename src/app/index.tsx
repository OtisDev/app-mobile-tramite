import { useAuthStore } from "@/stores/auth.store";
import { Redirect } from "expo-router";

export default function IndexScreen() {
  const { signedIn } = useAuthStore();

  if (!signedIn) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(dashboard)" />;
}
