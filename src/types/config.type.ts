import { KeyValuePair } from "./response.type";

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

export interface CitizenSecurity {
    phone_numbers: string[];
    others_phone_numbers: KeyValuePair<string, string>[];
    email?: string;
}

export interface AppConfig {
    external_links: ExternalLink[];
    citizen_security: CitizenSecurity;
    sports_venues_map_url?: string;
    startup_dialog?: {
        enabled: boolean;
        title?: string;
        message?: string;
        url?: string;
    }
}