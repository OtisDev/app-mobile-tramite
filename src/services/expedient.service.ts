import { api } from "@/lib/http";
import { PaginatedRequest, PaginatedResponse } from "@/types";
import Expedient from "@/types/expedient.type";

export interface ExpedientFilterRequest extends PaginatedRequest {
    anio?: string;
    dniruc?: string;
    codigo?: number;
    asunto?: string;
    estado?: string;
    n_solicitante?: number;
    screen?: number;
}

export function listDocumentTypes(name?: string, req?: PaginatedRequest) {
    return api.get<PaginatedResponse<DocumentType[]>>('/document-types', { params: { ...req, name } });
}

export function listExpedients(filters?: ExpedientFilterRequest) {
    return api.get<PaginatedResponse<Expedient[]>>('/expedients', { params: filters });
}