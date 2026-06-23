import { api } from "@/lib/http";
import { Response, Setting } from "@/types";

interface TableFilter {
    group?: string;
    internal_key?: string;
    q?: string;
}

export function mapToSetting(setting: any): Setting
{
    return {
        name: setting.internal_key,
        group: setting.group_of,
        value: setting.content_typed,
        meta: setting.meta || {},
    };
}

export function listOfTable(table: string, filters?: TableFilter)
{
    return api.get(`/tabla/${table}`, { params: filters });
}

export function showOfTable(table: string, filters?: TableFilter)
{
    return api.get<Response<any>>(`/tabla/${table}/show`, { params: filters });
}

export function findSetting(name: string): Promise<Setting | null>
{
    return showOfTable('settings', { internal_key: name, group: 'mobile-app' }).then((response) => {
        if(response.data.success && response.data.data) {
            return mapToSetting(response.data.data);
        } else {
            return null;
        }
    });
}
