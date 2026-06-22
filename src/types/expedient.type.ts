export interface DocumentType {
    cod_tipodoc: string;
    nom_tipodoc: string;
    abrev?: string;
}

export default interface Expedient {
    expediente_id: number;
    ano_eje: string;
    n_expediente: number;
    asunto: string;
    idestado: string;
    item_estado: number;
    cod_tipodoc: string;
    siglas_doc: string;
    n_solicitante: number;
    fecha_doc: string;
    idareaini?: string;
    idareafin?: string;
    document_type?: DocumentType;
}