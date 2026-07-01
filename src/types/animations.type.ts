import AlarmAnimation from "@/assets/animations/Alarm.json";
import BiometricSignInAnimation from "@/assets/animations/BiometricSignIn.json";
import EmergencyCallAnimation from "@/assets/animations/EmergencyCall.json";
import GearsAnimation from "@/assets/animations/Gears.json";
import HealAnimation from "@/assets/animations/Heal.json";
import LoadingAnimation from "@/assets/animations/Loading.json";
import NotFoundAnimation from "@/assets/animations/NotFound.json";
import OnTimeTruckAnimation from "@/assets/animations/OnTimeTruck.json";
import PoliceCarAnimation from "@/assets/animations/PoliceCar.json";
import TimerIconsAnimation from "@/assets/animations/TimerIcons.json";

export const animations = {
    Alarm: AlarmAnimation,
    EmergencyCall: EmergencyCallAnimation,
    Heal: HealAnimation,
    Gears: GearsAnimation,
    BiometricSignIn: BiometricSignInAnimation,
    Loading: LoadingAnimation,
    NotFound: NotFoundAnimation,
    OnTimeTruck: OnTimeTruckAnimation,
    TimerIcons: TimerIconsAnimation,
    PoliceCar: PoliceCarAnimation,
} as const;

export type AnimationName = keyof typeof animations;

export {
    AlarmAnimation, BiometricSignInAnimation, EmergencyCallAnimation, GearsAnimation, HealAnimation, LoadingAnimation,
    NotFoundAnimation,
    OnTimeTruckAnimation, PoliceCarAnimation, TimerIconsAnimation
};

