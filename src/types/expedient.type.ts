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
}