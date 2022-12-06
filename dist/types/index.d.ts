import type { AnyObject, AnyObjectArray, VoidFunction, Json2ExcelParams, ElsExtend } from './typing';
export default class Json2Excel {
    data: AnyObjectArray;
    scope?: AnyObject;
    orderedKey?: string[];
    filters?: string[];
    title?: ElsExtend[];
    footer?: ElsExtend[];
    keyMap?: AnyObject;
    name?: string;
    type?: 'xls' | 'csv';
    onStart?: VoidFunction;
    onSuccess?: VoidFunction;
    onError?: (err?: any) => void;
    constructor({ data, scope, orderedKey, filters, title, footer, keyMap, name, type, onStart, onSuccess, onError, }: Json2ExcelParams);
    generate(): void;
    private getObjLastValue;
    private toChsKeys;
    private download;
    private export;
    private jsonToXLS;
    private jsonToCSV;
    private getProcessedJson;
    private getKeys;
    private getNestedData;
    private callItemCallback;
    private base64ToBlob;
}
//# sourceMappingURL=index.d.ts.map