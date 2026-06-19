import { api } from "@/lib/http";
import { PaginatedRequest, PaginatedResponse } from "@/types";
import Expedient, { DocumentType } from "@/types/expedient.type";

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
    return api.get<PaginatedResponse<DocumentType>>('/document-types', { 
        params: { 
            per_page: req?.per_page || 300,
            ...req, name: name?.toUpperCase() || "" 
        }
    });
}

export function listExpedients(filters?: ExpedientFilterRequest) {
    return api.get<PaginatedResponse<Expedient>>('/expedients', { params: filters });
}