import { TObject, TArray, IJson2ExcelParam, IElsExtend } from './typing';

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

  constructor({
    data = [],
    orderedKey = [],
    filters = [],
    title = [],
    footer = [],
    keyMap = {},
    name = 'excel',
    type = 'xls',
    onStart = () => {},
    onSuccess = () => {},
  }: IJson2ExcelParam<T>) {
    this.data = data;
    this.filters = filters;
    this.footer = footer;
    this.orderedKey = orderedKey;
    this.keyMap = keyMap;
    this.name = name;
    this.title = title;
    this.type = type;
    this.onStart = onStart;
    this.onSuccess = onSuccess;
  }

  public generate() {
    if (!this.data || !this.data.length) {
      return;
    }
    this.onStart && this.onStart();
    let json = this.getProcessedJson(this.data);

    // 过滤、按照指定顺序、keyMap操作
    if (this.keyMap && Object.keys(this.keyMap).length) {
      json = this.toChsKeys(json, this.keyMap);
    }

    if (this.type == 'csv') {
      return this.export(
        this.jsonToCSV(json),
        `${this.name}.${this.type}`,
        'application/csv'
      );
    }
    return this.export(
      this.jsonToXLS(json),
      `${this.name}.${this.type}`,
      'application/vnd.ms-excel'
    );
  }

  private toChsKeys(json: TArray, keyMap: TObject): TArray {
    return json.map((item) => {
      let newItem: TObject = {};

      if (this.orderedKey && this.orderedKey.length) {
        // 指定key顺序，适用于需要key按照一定顺序，并且只保留key中存在的字段
        for (let keyItem of this.orderedKey) {
          if (keyMap.hasOwnProperty(keyItem)) {
            newItem[keyMap[keyItem]] = item[keyItem];
          } else {
            newItem[keyItem] = item[keyItem];
          }
        }
      } else if (this.filters && this.filters.length) {
        // 过滤key，适用于需要过滤的key较少
        for (let filterItem of this.filters) {
          delete item[filterItem];
          for (let key in item) {
            if (keyMap.hasOwnProperty(key)) {
              // 替换的数据赋值
              newItem[keyMap[key]] = item[key];
            } else {
              newItem[key] = item[key];
            }
          }
        }
      } else {
        // 不需要过滤key或者指定key
        for (let key in item) {
          if (keyMap.hasOwnProperty(key)) {
            newItem[keyMap[key]] = item[key];
          } else {
            newItem[key] = item[key];
          }
        }
      }
      return newItem;
    });
  }

  private download(blob: Blob, filename: string) {
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

  private export(data: string, filename: string, mime: string) {
    new Promise((resolve) => {
      let blob = this.base64ToBlob(data, mime);
      resolve(this.download(blob, filename));
    })
      .then(() => {
        this.onSuccess && this.onSuccess();
      })
      .catch(() => {});
  }

  /*
  jsonToXLS
  ---------------
  将json数据转换为XLS文件
  */
  private jsonToXLS(data: TArray) {
    let xlsTemp =
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta name=ProgId content=Excel.Sheet> <meta name=Generator content="Microsoft Excel 11"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>${table}</table></body></html>';
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
    data.map(function (item, index) {
      xlsData += '<tbody><tr>';
      for (let key in item) {
        xlsData += '<td>' + item[key] + '</td>';
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

  /*
  jsonToCSV
  ---------------
  将json数据转换为CSV文件
  */
  private jsonToCSV(data: TArray) {
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
    data.map(function (item) {
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

  private getProcessedJson(data: TArray) {
    let keys = this.getKeys(data);
    let newData: TArray = [];
    data.map((item: TObject) => {
      let newItem: TObject = {};
      for (let label in keys) {
        let property = keys[label];
        newItem[label] = this.getNestedData(property, item);
      }
      newData.push(newItem);
    });

    return newData;
  }

  private getKeys(data: TArray): TObject {
    let keys: TObject = {};
    for (let key in data[0]) {
      keys[key] = key;
    }
    return keys;
  }

  private getNestedData(key: { field: any }, item: { [x: string]: any }) {
    const field = typeof key === 'object' ? key.field : key;

    let valueFromNestedKey = null;
    let keyNestedSplit = `${field}`.split('.');

    valueFromNestedKey = item[keyNestedSplit[0]];
    for (let j = 1; j < keyNestedSplit.length; j++) {
      valueFromNestedKey = valueFromNestedKey[keyNestedSplit[j]];
    }

    valueFromNestedKey = this.callItemCallback(key, valueFromNestedKey);

    valueFromNestedKey =
      valueFromNestedKey === null || valueFromNestedKey === undefined
        ? ''
        : valueFromNestedKey; // 过滤null、undefined的值

    return valueFromNestedKey;
  }

  private callItemCallback(
    field: { field?: any; callback?: any },
    itemValue: any
  ) {
    if (typeof field === 'object' && typeof field.callback === 'function') {
      return field.callback(itemValue);
    }
    return itemValue;
  }

  private base64ToBlob(data: string | number | boolean, mime: string) {
    let base64 = window.btoa(window.unescape(encodeURIComponent(data)));
    let bstr = atob(base64);
    let n = bstr.length;
    let u8arr = new Uint8ClampedArray(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
      type: mime,
    });
  }
}
