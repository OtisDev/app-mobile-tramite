import { api, http } from "@/lib/http";
import { useAuthStore } from "@/stores/auth.store";
import { Response, User } from "@/types";

const transformUserData = (user: User) => ({
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
})

export function login(usr: string, pwd: string, tipoDoc: number = 1) {
    return http.post<Response<any>>('/solicitante/auth', { 
        user_web: usr, 
        clave_web: pwd,
        tipodoc_id: tipoDoc,
    });
}

export function updateUserInfo(user: User) {
    return http.put<Response<any>>(`/solicitante`, transformUserData(user));
}

export function updatePassword(currentPassword: string, newPassword: string) {
    const currentUser = useAuthStore.getState().user;

    if (!currentUser) {
        throw new Error("Ninguna usuario está actualmente conectado");
    }

    if(currentUser.pwd_web !== currentPassword) {
        throw new Error("La contraseña actual es incorrecta");
    }

    if(currentUser.pwd_web === newPassword) {
        throw new Error("La nueva contraseña no puede ser igual a la actual");
    }

    return http.put<Response<any>>(`/solicitante`, {
        ...transformUserData(currentUser),
        clave_web: newPassword,
        clave: newPassword,
    });
}

export function refreshToken() {
    return api.post<Response<any>>('/auth/refresh')
    .then(({ data}) => {
        if(data.success) {
            console.log('New token received:', data.data.access_token);
            useAuthStore.getState().setToken(data.data.access_token);
        } else {
            useAuthStore.getState().logout();
        }
    });
}