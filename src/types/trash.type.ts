export interface ScheduleTrashTurn {
    turno: string;
    dias: string;
}

export interface ScheduleTrash {
    id: number;
    nombre: string;
    tipo: string;
    turnos: ScheduleTrashTurn[];
}