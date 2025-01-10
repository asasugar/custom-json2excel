import type { AnyObject, AnyObjectArray, VoidFunction, Json2ExcelParams, ElsExtend } from './typing';
export default class Json2Excel {
    data?: AnyObjectArray;
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
    sheetToJson(rawFile: File): Promise<import("./typing").ExcelData<any>[]>;
    private _getObjLastValue;
    /**
     * 将 JSON 数据中的键名转换为自定义（如果有配置）
     * @param json - 要转换的 JSON 数据
     * @returns 转换后的 JSON 数据
     */
    private _toChsKeys;
    /**
     * 下载文件
     * @param blob - 要下载的 Blob 对象
     * @param filename - 文件名
     */
    private _download;
    /**
     * 导出文件
     * @param data - 文件数据
     * @param filename - 文件名
     * @param mime - 文件类型
     */
    private _export;
    /**
     * 将 JSON 数据转换为 XLS 文件
     * @param data - 要转换的 JSON 数据
     * @returns 转换后的 XLS 文件内容
     */
    private _jsonToXLS;
    /**
     * 将 JSON 数据转换为 CSV 文件
     * @param data - 要转换的 JSON 数据
     * @returns 转换后的 CSV 文件内容
     */
    private _jsonToCSV;
    /**
    * 处理 JSON 数据
    * @param data - 要处理的 JSON 数据
    * @returns 处理后的 JSON 数据
    */
    private _getProcessedJson;
    /**
     * 获取对象数组的键集合
     * @param data 对象数组，每个元素是一个对象
     * @returns 返回一个对象，其属性名来自于数组中第一个对象的键
     */
    private _getKeys;
    /**
     * 获取嵌套数据
     * 该方法用于根据嵌套的键获取对象中深层的值
     * @param key {Object} 包含要访问的字段名称的对象或字段名称本身
     * @param item {Object} 包含嵌套数据的项
     * @returns {any} 返回从嵌套键获取的值，如果值为null或undefined，则返回空字符串
     */
    private _getNestedData;
    /**
     * 调用特定字段的回调函数
     *
     * 此函数用于检查给定的字段对象是否包含一个回调函数，并在存在的情况下调用该回调函数
     * 如果回调函数不存在或字段不是一个对象，则直接返回传入的itemValue值
     *
     * @param field 包含callback属性的字段对象，callback属性是一个函数
     * @param itemValue 要传递给回调函数的值，如果没有回调函数则直接返回这个值
     * @returns 调用回调函数后的结果或直接返回的itemValue
     */
    private _callItemCallback;
}
