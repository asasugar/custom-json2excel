import { utils, read } from 'xlsx';
import { parse, ParseResult } from 'papaparse';
import type { WorkSheet, WorkBook } from 'xlsx';
import type { AnyObject, ExcelData } from '../typing';

/**
 * 获取工作表的标题行
 * @param sheet - 工作表对象
 * @returns 标题行数组
 */
function getHeaderRow (sheet: WorkSheet) {
  // 如果工作表或其引用不存在，则返回空数组
  if (!sheet || !sheet['!ref']) return [];
  const headers: string[] = [];
  // 解码工作表的引用范围
  const range = utils.decode_range(sheet['!ref']);
  const R = range.s.r;
  // 遍历范围内的每一列
  for (let C = range.s.c; C <= range.e.c; ++C) {
    // 获取当前列的第一个单元格
    const cell = sheet[utils.encode_cell({ c: C, r: R })];
    // 设置默认的标题为 "UNKNOWN" 加上列索引
    let hdr = 'UNKNOWN ' + C;
    // 如果单元格存在且有类型，则格式化单元格内容作为标题
    if (cell && cell.t) hdr = utils.format_cell(cell);
    headers.push(hdr);
  }
  // 返回标题行数组
  return headers;
}

/**
 * 从工作簿中获取 Excel 数据
 * @param workbook - 工作簿对象
 * @returns ExcelData 数组
 */
function getExcelData (workbook: WorkBook) {
  const excelData: ExcelData[] = [];
  // 遍历工作簿中的每个工作表
  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    // 获取工作表的标题行
    const header: string[] = getHeaderRow(worksheet);
    // 将工作表转换为 JSON 数据
    let results = utils.sheet_to_json(worksheet, {
      raw: true,
    }) as AnyObject[];
    // 将标题行、结果数据和元数据添加到 ExcelData 数组中
    excelData.push({
      header,
      results,
      meta: {
        sheetName
      }
    });
  }
  return excelData;
}

/**
 * 从 Csv 中获取 Excel 数据
 * @param csv - csv对象
 * @returns ExcelData 数组
 */
function getCsvData (csv: ParseResult<any>) {
  // 获取 CSV 数据的标题行
  const header = csv.meta.fields ?? [];
  // 获取 CSV 数据的结果行
  const results = csv.data.filter((item) => {
    return Object.keys(item as AnyObject).length === header.length;
  });
  const excelData = [{
    header,
    results,
    meta: {
      sheetName: `Sheet1`
    }
  }];
  return excelData;
}

/**
 * 读取文件并解析为 Excel 数据
 * @param rawFile - 文件对象
 * @returns 解析后的 ExcelData 数组的 Promise
 */
export function readerData (rawFile: File): Promise<ExcelData[]> {
  return new Promise((resolve, reject) => {
    if (!(rawFile instanceof File)) {
      reject(new Error('RawFile must be file'));
    }
    let reader = new FileReader();
    if (rawFile.type === 'application/vnd.ms-excel' || rawFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      reader.onload = async e => {
        try {
          const data = e.target?.result;
          // 如果没有数据，则抛出错误
          if (!data) {
            reject(new Error('No data'));
          }
          // 如果文件类型是 Excel
          // 处理Excel文件
          // 使用 xlsx 库的 read 方法读取文件数据为工作簿对象
          const workbook = read(data, { type: 'array', cellDates: true });
          // 从工作簿中获取 Excel 数据
          const excelData = getExcelData(workbook);
          resolve(excelData);

        } catch (error) {
          reject(error);
        }
      };
      // 以 ArrayBuffer 格式读取文件
      reader.readAsArrayBuffer(rawFile);
    } else if (rawFile.type === 'text/csv') {
      reader.onload = async e => {
        try {
          const data = e.target?.result;
          // 如果没有数据，则抛出错误
          if (!data) {
            reject(new Error('No data'));
          }
          // 处理CSV文件
          // 如果数据不是字符串类型，则抛出错误，因为会乱码
          if (typeof data !== 'string') {
            reject(new Error('Invalid data type'));
          }
          // 使用 papaparse 库的 parse 方法解析 CSV 数据
          const csv = parse<any>(data as string, { header: true });
          // 从工作簿中获取 Excel 数据
          const excelData = getCsvData(csv);
          resolve(excelData);
        } catch (error) {
          reject(error);
        }
      };
      // 以文本格式读取文件
      reader.readAsText(rawFile);
    }
  });
}


/**
 * 将 Base64 字符串转换为 Blob 对象
 * @param data - Base64 编码的字符串
 * @param mime - MIME 类型字符串
 * @returns Blob 对象
 */
export function base64ToBlob (data: string, mime: string) {
  try {
    // 确保输入是一个有效的 Base64 编码字符串
    if (typeof data !== 'string') {
      throw new Error('Input data must be a string');
    }
    // 解码 Base64 字符串为二进制字符串
    let binaryString = window.btoa(data);

    // 将二进制字符串转换为 Uint8Array
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    // 创建并返回 Blob 对象
    return new Blob([bytes], { type: mime });
  } catch (error) {
    // 重新抛出异常以便调用者处理
    console.error('Error converting Base64 to Blob:', error);
    throw error;
  }
}

/**
 * 将 String 字符串转换为 Blob 对象
 * @param data - String 类型的字符串
 * @param mime - MIME 类型字符串
 * @returns Blob 对象
 */
export function stringToBlob (data: string, mime: string): Blob {
  try {
    // 确保输入是一个有效的字符串
    if (typeof data !== 'string') {
      throw new Error('Input data must be a string');
    }
    // 使用 TextEncoder 将字符串编码为 Uint8Array
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(data);

    // 创建 Blob 对象
    return new Blob([uint8Array], { type: mime });
  } catch (error) {
    console.error('Error converting string to Blob:', error);
    throw error; // 重新抛出异常以便调用者处理
  }
}