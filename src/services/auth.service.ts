import { http } from "@/lib/http";
import { Response, User } from "@/types";

export function login(usr: string, pwd: string, tipoDoc: number = 1) {
    return http.post<Response<any>>('/solicitante/auth', { 
        user_web: usr, 
        clave_web: pwd,
        tipodoc_id: tipoDoc,
    });
}

export function updateUserInfo(user: User) {
    return http.put<Response<any>>(`/solicitante`, {
        n_solicitante: user.id,
        nombre: user.name,
        nombres: user.firstName,
        apepaterno: user.lastName,
        apematerno: user.secondLastName,
        dniruc: user.dni,
        login: user.username,
        email: user.email,
        telefono: user.phone,
        direccion: user.address,
        tipodoc_id: user.tipoDocId,
        tipo: user.tipo,
    });
}