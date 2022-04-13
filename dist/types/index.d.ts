import { TObject, IJson2ExcelParam, IElsExtend } from './typing';
export default class Json2Excel<T> {
    data: T[];
    orderedKey?: string[];
    filters?: string[];
    title?: IElsExtend[];
    footer?: IElsExtend[];
    keyMap?: TObject;
    name?: string;
    type?: 'xls' | 'csv';
    onStart?: () => void;
    onSuccess?: () => void;
    constructor({ data, orderedKey, filters, title, footer, keyMap, name, type, onStart, onSuccess, }: IJson2ExcelParam<T>);
    generate(): void;
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