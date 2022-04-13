import { TObject, TArray, IJson2ExcelParam, IElsExtend } from './typing';
export default class Json2Excel {
    data: TArray;
    scope?: TObject;
    orderedKey?: string[];
    filters?: string[];
    title?: IElsExtend[];
    footer?: IElsExtend[];
    keyMap?: TObject;
    name?: string;
    type?: 'xls' | 'csv';
    onStart?: () => void;
    onSuccess?: () => void;
    onError?: (err?: any) => void;
    constructor({ data, scope, orderedKey, filters, title, footer, keyMap, name, type, onStart, onSuccess, onError, }: IJson2ExcelParam);
    generate(): void;
    private isObject;
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