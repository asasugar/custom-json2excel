interface IJson2ExcelParam {
    exportFields: boolean;
    fields: boolean;
    data: object[];
    filters: string[];
    title: any[];
    footer: any[];
    keyMap: object;
    name: string;
    type: string;
    onStart: () => void;
    onSuccess: () => void;
}
export default class Json2Excel {
    exportFields: boolean;
    fields: boolean;
    data: object[];
    filters: string[];
    title: any[];
    footer: any[];
    keyMap: object;
    name: string;
    type: string;
    onStart: () => void;
    onSuccess: () => void;
    constructor({ exportFields, fields, data, filters, title, footer, keyMap, name, type, onStart, onSuccess }: IJson2ExcelParam);
    downloadFields(): boolean;
    toChsKeys(json: any[], keyMap: any): any[];
    generate(): void;
    download(blob: Blob, filename: string): void;
    export(data: string, filename: string, mime: string): void;
    jsonToXLS(data: any[]): string;
    jsonToCSV(data: any[]): string;
    getProcessedJson(data: any[], header: boolean): {}[];
    getKeys(data: any[], header: any): any;
    parseExtraData(extraData: string | any[], format: string): string;
    callItemCallback(field: any, itemValue: any): any;
    getNestedData(key: {
        field: any;
    }, item: {
        [x: string]: any;
    }): any;
    base64ToBlob(data: string | number | boolean, mime: string): Blob;
}
export {};
