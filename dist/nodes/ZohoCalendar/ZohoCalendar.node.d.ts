import { type IExecuteFunctions, type ILoadOptionsFunctions, type INodeExecutionData, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
export declare class ZohoCalendar implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getListCalendar(this: ILoadOptionsFunctions): Promise<{
                name: string;
                value: string;
            }[]>;
            getListEvent(this: ILoadOptionsFunctions): Promise<{
                name: string;
                value: string;
            }[]>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
