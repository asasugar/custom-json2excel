interface IJson2ExcelParam {
  data: object[];
  orderedKey?: string[];
  filters?: string[];
  title?: any[];
  footer?: any[];
  keyMap?: object;
  name?: string;
  type?: string;
  onStart?: () => void;
  onSuccess?: () => void;
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

  constructor({
    data = [],
    orderedKey = [],
    filters = [],
    title = [],
    footer = [],
    keyMap = {},
    name = "excel",
    type = "xls",
    onStart = () => { },
    onSuccess = () => { }
  }: IJson2ExcelParam) {
    this.data = data;
    this.filters = filters;
    this.footer = footer;
    this.orderedKey = orderedKey;
    this.keyMap = keyMap;
    this.name = name;
    this.title = title;
    (this.type = type), (this.onStart = onStart);
    this.onSuccess = onSuccess;
  }

  toChsKeys (json: any[], keyMap: any) {
    return json.map(item => {
      let newItem: { [x: string]: object; } = {};

      if (this.orderedKey.length) {
        // 指定key顺序，适用于需要key按照一定顺序，并且只保留key中存在的字段
        for (let keyItem of this.orderedKey) {
          if (keyMap.hasOwnProperty(keyItem)) {
            newItem[keyMap[keyItem]] = item[keyItem];
          } else {
            newItem[keyItem] = item[keyItem];
          }
        }
      } else if (this.filters.length) {
        // 过滤key，适用于需要过滤的key较少
        for (let filterItem of this.filters) {
          delete item[filterItem];
          for (let key in item) {
            if (keyMap.hasOwnProperty(key)) {
              newItem[keyMap[key]] = item[key];// 替换的数据赋值
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
  generate () {
    if (!this.data.length) {
      return;
    }
    this.onStart();
    let json = this.getProcessedJson(this.data);

    json = this.toChsKeys(json, this.keyMap); // 过滤、按照指定顺序、keyMap操作

    if (this.type == "csv") {
      return this.export(
        this.jsonToCSV(json),
        `${this.name}.${this.type}`,
        "application/csv"
      );
    }
    return this.export(
      this.jsonToXLS(json),
      `${this.name}.${this.type}`,
      "application/vnd.ms-excel"
    );
  }
  download (blob: Blob, filename: string): void {
    // IE浏览器
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      // 其他浏览器
      const anchor = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      anchor.href = url;
      anchor.setAttribute("download", filename);
      anchor.innerHTML = "downloading...";
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      setTimeout(() => {
        anchor.click();
        document.body.removeChild(anchor);
        setTimeout(() => { self.URL.revokeObjectURL(anchor.href); }, 250);
      }, 66);
    }
  }
  export (data: string, filename: string, mime: string) {
    new Promise((resolve) => {
      let blob = this.base64ToBlob(data, mime);
      resolve(this.download(blob, filename));
    })
      .then(() => {
        this.onSuccess();
      })
      .catch(() => { });
  }
  /*
  jsonToXLS
  ---------------
    将json数据转换为XLS文件
  */
  jsonToXLS (data: any[]) {
    let xlsTemp =
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta name=ProgId content=Excel.Sheet> <meta name=Generator content="Microsoft Excel 11"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>${table}</table></body></html>';
    let xlsData = "<thead><tr>";
    //Header
    if (this.title.length) {
      for (let i of this.title) {
        xlsData += `<th colspan=${i.colspan}>${i.name}`;
      }
      xlsData += "<th></tr>";
    }
    //Fields
    for (let key in data[0]) {
      xlsData += "<th>" + key + "</th>";
    }
    xlsData += "</tr></thead>";
    xlsData += "<tbody>";
    //Data
    data.map(function (item: { [x: string]: string; }, index: any) {
      xlsData += "<tbody><tr>";
      for (let key in item) {
        xlsData += "<td>" + item[key] + "</td>";
      }
      xlsData += "</tr></tbody>";
    });
    //Footer
    if (this.footer.length != 0) {
      xlsData += "<tfooter><tr>";
      for (let i of this.footer) {
        xlsData += `<th colspan=${i.colspan}>${i.name}`;
      }
      xlsData += "<th></tr></tr></tfooter>";
    }
    return xlsTemp.replace("${table}", xlsData);
  }
  /*
  jsonToCSV
  ---------------
  将json数据转换为CSV文件
  */
  jsonToCSV (data: any[]) {
    var csvData = "";
    //Header
    if (this.title.length != 0) {
      for (let i of this.title) {
        csvData += `${i.name}`;
      }
      csvData += "\r\n";
    }
    //Fields
    for (let key in data[0]) {
      csvData += key + ",";
    }
    csvData = csvData.slice(0, csvData.length - 1);
    csvData += "\r\n";
    //Data
    data.map(function (item: { [x: string]: string; }) {
      for (let key in item) {
        let escapedCSV = item[key] + ""; // cast Numbers to string
        if (escapedCSV.match(/[,"\n]/)) {
          escapedCSV = '"' + escapedCSV.replace(/\"/g, '""') + '"';
        }
        csvData += escapedCSV + ",";
      }
      csvData = csvData.slice(0, csvData.length - 1);
      csvData += "\r\n";
    });
    //Footer
    if (this.footer.length != 0) {
      for (let i of this.footer) {
        csvData += `${i.name}`;
      }
      csvData += "\r\n";
    }
    return csvData;
  }

  getProcessedJson (data: any[]) {
    let keys = this.getKeys(data);
    let newData: {}[] = [];
    data.map((item: any) => {
      let newItem: any = {};
      for (let label in keys) {
        let property = keys[label];
        newItem[label] = this.getNestedData(property, item);
      }
      newData.push(newItem);
    });

    return newData;
  }
  getKeys (data: any[]) {
    let keys: any = {};
    for (let key in data[0]) {
      keys[key] = key;
    }
    return keys;
  }
  /*
parseExtraData
---------------
将标题和页脚属性解析为csv格式
*/
  parseExtraData (extraData: string | any[], format: string) {
    let parseData = "";
    if (Array.isArray(extraData)) {
      for (var i = 0; i < extraData.length; i++) {
        parseData += format.replace("${data}", extraData[i]);
      }
    } else {
      parseData += format.replace("${data}", extraData);
    }
    return parseData;
  }
  callItemCallback (field: any, itemValue: any) {
    if (typeof field === "object" && typeof field.callback === "function") {
      return field.callback(itemValue);
    }
    return itemValue;
  }
  getNestedData (key: { field: any; }, item: { [x: string]: any; }) {
    const field = typeof key === "object" ? key.field : key;

    let valueFromNestedKey = null;
    let keyNestedSplit = field.split(".");

    valueFromNestedKey = item[keyNestedSplit[0]];
    for (let j = 1; j < keyNestedSplit.length; j++) {
      valueFromNestedKey = valueFromNestedKey[keyNestedSplit[j]];
    }

    valueFromNestedKey = this.callItemCallback(key, valueFromNestedKey);

    valueFromNestedKey =
      valueFromNestedKey === null || valueFromNestedKey === undefined
        ? ""
        : valueFromNestedKey; // 过滤null、undefined的值

    return valueFromNestedKey;
  }
  base64ToBlob (data: string | number | boolean, mime: string) {
    let base64 = window.btoa(window.unescape(encodeURIComponent(data)));
    let bstr = atob(base64);
    let n = bstr.length;
    let u8arr = new Uint8ClampedArray(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
      type: mime
    });
  }
}
