export type AnyObject = Record<string, any>;
export type AnyObjectArray = AnyObject[];
export type VoidFunction = () => void;
export interface ElsExtend {
    name: string;
    colspan: number;
}
export interface Json2ExcelParams {
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
}
//# sourceMappingURL=typing.d.ts.map