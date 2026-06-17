import { BottomTabInset, Spacing } from "@/constants/theme";
import { KeyboardAvoidingView, Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface KeyboardAvoidingWrapperProps {
  children: React.ReactNode;
}

export default function KeyboardAvoidingWrapper({
  children,
}: KeyboardAvoidingWrapperProps) {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 w-full h-full"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        contentInset={insets}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
        contentContainerClassName="px-4"
        keyboardDismissMode="interactive"
      >
        {children}
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}
