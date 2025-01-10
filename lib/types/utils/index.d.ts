import type { ExcelData } from '../typing';
/**
 * 读取文件并解析为 Excel 数据
 * @param rawFile - 文件对象
 * @returns 解析后的 ExcelData 数组的 Promise
 */
export declare function readerData(rawFile: File): Promise<ExcelData[]>;
/**
 * 将 Base64 字符串转换为 Blob 对象
 * @param data - Base64 编码的字符串
 * @param mime - MIME 类型字符串
 * @returns Blob 对象
 */
export declare function base64ToBlob(data: string, mime: string): Blob;
/**
 * 将 String 字符串转换为 Blob 对象
 * @param data - String 类型的字符串
 * @param mime - MIME 类型字符串
 * @returns Blob 对象
 */
export declare function stringToBlob(data: string, mime: string): Blob;
