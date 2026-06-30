export interface Setting {
    name: string;
    group: string;
    value: any;
    meta: Record<string, any>;
}

export interface ExternalLink {
    key: string;
    title: string;
    description?: string;
    content?: string;
    url: string;
}