interface IJson2ExcelParam {
    data: object[];
    orderedKey: string[];
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
    data: object[];
    orderedKey: string[];
    filters: string[];
    title: any[];
    footer: any[];
    keyMap: object;
    name: string;
    type: string;
    onStart: () => void;
    onSuccess: () => void;
    constructor({ data, orderedKey, filters, title, footer, keyMap, name, type, onStart, onSuccess }: IJson2ExcelParam);
    toChsKeys(json: any[], keyMap: any): {
        [x: string]: object;
    }[];
    generate(): void;
    download(blob: Blob, filename: string): void;
    export(data: string, filename: string, mime: string): void;
    jsonToXLS(data: any[]): string;
    jsonToCSV(data: any[]): string;
    getProcessedJson(data: any[]): {}[];
    getKeys(data: any[]): any;
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
