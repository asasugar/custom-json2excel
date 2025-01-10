import { isFunction, isObject, isNullOrUnDef, isBase64 } from './utils/is';
import { readerData, base64ToBlob, stringToBlob } from './utils/index';
import type { AnyObject, AnyObjectArray, VoidFunction, Json2ExcelParams, ElsExtend } from './typing';

export default class Json2Excel {
  // 可选的json数组，用于存储要导出的数据
  data?: AnyObjectArray;
  // 可选的作用域对象，用于解析数据中的嵌套字段
  scope?: AnyObject;
  // 可选的有序键数组，用于指定导出数据的列顺序
  orderedKey?: string[];
  // 可选的过滤器数组，用于指定要排除的列
  filters?: string[];
  // 可选的标题行配置
  title?: ElsExtend[];
  // 可选的页脚行配置
  footer?: ElsExtend[];
  // 可选的键映射对象，用于自定义列名
  keyMap?: AnyObject;
  // 导出文件的名称
  name?: string;
  // 导出文件的类型，默认为 'xls'
  type?: 'xls' | 'csv';
  // 导出开始时的回调函数
  onStart?: VoidFunction;
  // 导出成功时的回调函数
  onSuccess?: VoidFunction;
  // 导出失败时的回调函数
  onError?: (err?: any) => void;

  constructor({
    data = [],
    scope = {},
    orderedKey = [],
    filters = [],
    title = [],
    footer = [],
    keyMap = {},
    name = 'excel',
    type = 'xls',
    onStart = () => { },
    onSuccess = () => { },
    onError = (err) => { console.log(err); },
  }: Json2ExcelParams) {
    // 初始化实例属性
    this.data = data;
    this.scope = scope;
    this.filters = filters;
    this.footer = footer;
    this.orderedKey = orderedKey;
    this.keyMap = keyMap;
    this.name = name;
    this.title = title;
    this.type = type;
    this.onStart = onStart;
    this.onSuccess = onSuccess;
    this.onError = onError;
  }

  // 生成 Excel 或 CSV 文件
  public generate () {
    // 如果数据为空，则调用 onError 回调函数并返回
    if (!this.data || !this.data.length) {
      this.onError && this.onError();
      return;
    }
    // 调用 onStart 回调函数
    this.onStart && this.onStart();
    // 处理数据，应用过滤器、键映射等
    let json = this._getProcessedJson(this.data);

    // 将键名转换为自定义（如果有配置）
    json = this._toChsKeys(json);
    // 如果导出类型为 CSV
    if (this.type == 'csv') {
      return this._export(
        this._jsonToCSV(json),
        `${this.name}.${this.type}`,
        'application/csv'
      );
    }
    // 导出 Excel 文件
    return this._export(
      this._jsonToXLS(json),
      `${this.name}.${this.type}`,
      'application/vnd.ms-excel'
    );
  }

  // 将工作表数据转换为 JSON
  public async sheetToJson (rawFile: File) {
    return await readerData(rawFile);
  }

  // 获取对象的最后一个值
  private _getObjLastValue (obj?: any, scope?: any): unknown {
    // 如果 scope 是对象，则递归获取最后一个值
    if (isObject(scope)) {
      let k = Object.keys(scope)[0];
      let v = Object.values(scope)[0];
      return this._getObjLastValue(obj[k], v);
    }
    // 返回 obj 中 scope 对应的值
    return obj[scope];
  }

  /**
   * 将 JSON 数据中的键名转换为自定义（如果有配置）
   * @param json - 要转换的 JSON 数据
   * @returns 转换后的 JSON 数据
   */
  private _toChsKeys (json: AnyObjectArray): AnyObjectArray {
    return json.map((item) => {
      let newItem: AnyObject = {};

      // step 1: 指定key顺序，适用于需要key按照一定顺序，并且只保留key中存在的字段
      if (this.orderedKey && this.orderedKey.length) {
        for (let keyItem of this.orderedKey) {
          newItem[keyItem] = item[keyItem];
        }
      }

      // step 2: 判断是否需要额外过滤数据（正常情况指定了orderedKey的话，可不需要配置该字段就支持过滤）
      if (this.filters && this.filters.length) {
        for (let filterItem of this.filters) {
          delete newItem[filterItem];
        }
      }

      // step 3: 判断scope，获取深层次数据展示
      if (this.scope && Object.keys(this.scope).length) {
        let scopeItem = Object.keys(newItem).length ? newItem : item;
        for (let key in scopeItem) {
          if (this.scope.hasOwnProperty(key)) {
            newItem[key] = this._getObjLastValue(
              scopeItem[key],
              this.scope[key]
            );
          } else {
            newItem[key] = scopeItem[key];
          }
        }
      }

      // step 4: keyMap 映射表，自定义表格列名称
      if (this.keyMap && Object.keys(this.keyMap).length) {
        let keyMapItem = Object.keys(newItem).length ? newItem : item;
        for (let key in keyMapItem) {
          if (this.keyMap.hasOwnProperty(key)) {
            newItem[this.keyMap[key]] = keyMapItem[key];
            delete keyMapItem[key];
          }
        }
      }

      return Object.keys(newItem).length ? newItem : item;
    });
  }

  /**
   * 下载文件
   * @param blob - 要下载的 Blob 对象
   * @param filename - 文件名
   */
  private _download (blob: Blob, filename: string) {
    // IE浏览器
    if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
      (window.navigator as any).msSaveOrOpenBlob(blob, filename);
    } else {
      // 其他浏览器
      const anchor = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      anchor.href = url;
      anchor.setAttribute('download', filename);
      anchor.innerHTML = 'downloading...';
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      setTimeout(() => {
        anchor.click();
        document.body.removeChild(anchor);
        setTimeout(() => {
          self.URL.revokeObjectURL(anchor.href);
        }, 250);
      }, 66);
    }
  }

  /**
   * 导出文件
   * @param data - 文件数据
   * @param filename - 文件名
   * @param mime - 文件类型
   */
  private _export (data: string, filename: string, mime: string) {
    new Promise((resolve) => {
      let blob: Blob;
      if (isBase64(data)) {
        blob = base64ToBlob(data, mime);
      } else {
        console.log('33333');
        blob = stringToBlob(data, mime);
      }
      resolve(this._download(blob, filename));
    })
      .then(() => {
        this.onSuccess && this.onSuccess();
      })
      .catch((err) => {
        this.onError && this.onError(err);
      });
  }

  /**
   * 将 JSON 数据转换为 XLS 文件
   * @param data - 要转换的 JSON 数据
   * @returns 转换后的 XLS 文件内容
   */
  private _jsonToXLS (data: AnyObjectArray) {
    let xlsTemp =
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta name=ProgId content=Excel.Sheet> <meta name=Generator content="Microsoft Excel 11"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><style type="text/css">td{mso-number-format:\@;}</style></head><body><table>${table}</table></body></html>';
    let xlsData = '<thead><tr>';
    //Header
    if (this.title && this.title.length) {
      for (let i of this.title) {
        xlsData += `<th colspan=${i.colspan}>${i.name}`;
      }
      xlsData += '<th></tr>';
    }
    //Fields
    for (let key in data[0]) {
      xlsData += '<th>' + key + '</th>';
    }
    xlsData += '</tr></thead>';
    xlsData += '<tbody>';
    //Data
    data.map((item) => {
      xlsData += '<tbody><tr>';
      for (let key in item) {
        xlsData += `<td>${item[key]}</td>`;
      }
      xlsData += '</tr></tbody>';
    });
    //Footer
    if (this.footer && this.footer.length) {
      xlsData += '<tfooter><tr>';
      for (let i of this.footer) {
        xlsData += `<th colspan=${i.colspan}>${i.name}`;
      }
      xlsData += '<th></tr></tr></tfooter>';
    }
    return xlsTemp.replace('${table}', xlsData);
  }

  /**
   * 将 JSON 数据转换为 CSV 文件
   * @param data - 要转换的 JSON 数据
   * @returns 转换后的 CSV 文件内容
   */
  private _jsonToCSV (data: AnyObjectArray) {
    var csvData = '';
    //Header
    if (this.title && this.title.length) {
      for (let i of this.title) {
        csvData += `${i.name}`;
      }
      csvData += '\r\n';
    }
    //Fields
    for (let key in data[0]) {
      csvData += key + ',';
    }
    csvData = csvData.slice(0, csvData.length - 1);
    csvData += '\r\n';
    //Data
    data.map((item) => {
      for (let key in item) {
        let escapedCSV = item[key] + ''; // cast Numbers to string
        if (escapedCSV.match(/[,"\n]/)) {
          escapedCSV = '"' + escapedCSV.replace(/\"/g, '""') + '"';
        }
        csvData += escapedCSV + ',';
      }
      csvData = csvData.slice(0, csvData.length - 1);
      csvData += '\r\n';
    });
    //Footer
    if (this.footer && this.footer.length) {
      for (let i of this.footer) {
        csvData += `${i.name}`;
      }
      csvData += '\r\n';
    }
    return csvData;
  }

  /**
  * 处理 JSON 数据
  * @param data - 要处理的 JSON 数据
  * @returns 处理后的 JSON 数据
  */
  private _getProcessedJson (data: AnyObjectArray) {
    let keys = this._getKeys(data);
    let newData: AnyObjectArray = [];
    data.map((item: AnyObject) => {
      let newItem: AnyObject = {};
      for (let label in keys) {
        let property = keys[label];
        newItem[label] = this._getNestedData(property, item);
      }
      newData.push(newItem);
    });

    return newData;
  }
  /**
   * 获取对象数组的键集合
   * @param data 对象数组，每个元素是一个对象
   * @returns 返回一个对象，其属性名来自于数组中第一个对象的键
   */
  private _getKeys (data: AnyObjectArray): AnyObject {
    let keys: AnyObject = {};
    for (let key in data[0]) {
      keys[key] = key;
    }
    return keys;
  }

  /**
   * 获取嵌套数据
   * 该方法用于根据嵌套的键获取对象中深层的值
   * @param key {Object} 包含要访问的字段名称的对象或字段名称本身
   * @param item {Object} 包含嵌套数据的项
   * @returns {any} 返回从嵌套键获取的值，如果值为null或undefined，则返回空字符串
   */
  private _getNestedData (key: { field: any; }, item: { [x: string]: any; }) {
    // 提取字段名称，如果key是对象，则使用其field属性，否则直接使用key
    const field = isObject(key) ? key.field : key;
    // 初始化从嵌套键获取的值
    let valueFromNestedKey = null;
    // 分割字段名称以处理嵌套结构
    let keyNestedSplit = `${field}`.split('.');

    // 从item中获取嵌套键的值
    valueFromNestedKey = item[keyNestedSplit[0]];
    // 遍历分割的键以获取深层嵌套的值
    for (let j = 1; j < keyNestedSplit.length; j++) {
      valueFromNestedKey = valueFromNestedKey[keyNestedSplit[j]];
    }
    // 调用回调函数处理获取的值
    valueFromNestedKey = this._callItemCallback(key, valueFromNestedKey);

    // 将null或undefined的值替换为空字符串
    valueFromNestedKey =
      isNullOrUnDef(valueFromNestedKey)
        ? ''
        : valueFromNestedKey; // 过滤null、undefined的值

    // 返回处理后的值
    return valueFromNestedKey;
  }
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
  private _callItemCallback (
    field: { field?: any; callback?: any; },
    itemValue: any
  ) {
    if (isObject(field) && isFunction(field.callback)) {
      return field.callback(itemValue);
    }
    return itemValue;
  }
}
