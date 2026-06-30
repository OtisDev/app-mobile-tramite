import { BottomTabInset, Spacing } from "@/constants/theme";
import { cn } from "@/lib/utils";
import {
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  RefreshControlProps,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface KeyboardAvoidingWrapperProps {
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export default function KeyboardAvoidingWrapper({
  children,
  className,
  contentClassName,
  refreshControl,
  onScroll,
}: KeyboardAvoidingWrapperProps) {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };

  return (
    <KeyboardAvoidingView
      className={cn("flex-1 w-full h-full", className)}
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
        contentContainerClassName={contentClassName}
        keyboardDismissMode="interactive"
        refreshControl={refreshControl}
        onScroll={onScroll}
      >
        {children}
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}
