export interface Setting {
    name: string;
    group: string;
    value: any;
    meta: Record<string, any>;
}