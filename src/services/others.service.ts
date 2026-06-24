import { createAxiosClient } from "@/lib/http";
import { Response, ScheduleTrash } from "@/types";

export function listTakeOutYourTrash() {
    const api = createAxiosClient();

    return api.get<ScheduleTrash[]>(process.env.EXPO_PUBLIC_SACA_TU_BASURA)
        .then(response => response.data);
}

export function searchApiPeru(type: 'dni' | 'ruc', dniruc: string) {
    const api = createAxiosClient();
    return api.post<Response<any>>(`${process.env.EXPO_PUBLIC_API_CONSULT_URL}/${type}`, {
        [type === 'dni' ? 'dni' : 'ruc']: dniruc
    }, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_API_CONSULT_TOKEN}`,
        },
    }).then(response => response.data);
}