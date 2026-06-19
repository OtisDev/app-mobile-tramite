import { createAxiosClient } from "@/lib/http";
import { ScheduleTrash } from "@/types";

export function listTakeOutYourTrash() {
    const api = createAxiosClient();

    return api.get<ScheduleTrash[]>(process.env.EXPO_PUBLIC_SACA_TU_BASURA)
        .then(response => response.data);
}