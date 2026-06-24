import BiometricSignInAnimation from "@/assets/animations/BiometricSignIn.json";
import GearsAnimation from "@/assets/animations/Gears.json";
import LoadingAnimation from "@/assets/animations/Loading.json";
import NotFoundAnimation from "@/assets/animations/NotFound.json";
import OnTimeTruckAnimation from "@/assets/animations/OnTimeTruck.json";
import TimerIconsAnimation from "@/assets/animations/TimerIcons.json";

export const animations = {
    Gears: GearsAnimation,
    BiometricSignIn: BiometricSignInAnimation,
    Loading: LoadingAnimation,
    NotFound: NotFoundAnimation,
    OnTimeTruck: OnTimeTruckAnimation,
    TimerIcons: TimerIconsAnimation,
} as const;

export type AnimationName = keyof typeof animations;

export {
    BiometricSignInAnimation,
    GearsAnimation,
    LoadingAnimation,
    NotFoundAnimation,
    OnTimeTruckAnimation,
    TimerIconsAnimation
};

