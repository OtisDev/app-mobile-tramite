import { http } from "@/lib/http";
import { Response } from "@/types";

export function login(usr: string, pwd: string, tipoDoc: number = 1) {
    return http.post<Response<any>>('/solicitante/auth', { 
        user_web: usr, 
        clave_web: pwd,
        tipodoc_id: tipoDoc,
    });
}