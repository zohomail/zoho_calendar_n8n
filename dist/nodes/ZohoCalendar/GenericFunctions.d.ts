import type { IExecuteFunctions, IHookFunctions, IDataObject, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';
export declare function throwOnErrorStatus(this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions, responseData: {
    error?: Array<{
        description: string;
        message: string;
    }>;
}): void;
export declare function zohoCalendarApiRequest(this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject, uri?: string): Promise<any>;
export declare function getPicklistCalendarOptions(this: ILoadOptionsFunctions): Promise<{
    name: string;
    value: string;
}[]>;
export declare function getPicklistEventOptions(this: ILoadOptionsFunctions, targetField: string): Promise<{
    name: string;
    value: string;
}[]>;
export declare function getDateAndTime(date: any): any;
export declare function datesplit(date: any): string;
export declare function getAttendeesList(attendees: any): string;
export declare function getEventDetails(this: IExecuteFunctions, calendar: any, event: any): Promise<any>;
export declare function getDomain(domain: string): string | undefined;
