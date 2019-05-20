# custom-json2excel

## Plugin setup

```
yarn add custom-json2excel
or
npm install custom-json2excel
```

### How to use?

1、直接转化 json：

```js
import Json2excel from "custom-json2excel";
const data = [
  {
    name: "哈哈",
    age: 1,
    sex: "男",
    companyName: "公司1",
    companyAddress: "公司地址1"
  },
  {
    name: "呵呵",
    age: 2,
    sex: "女",
    companyName: "公司2",
    companyAddress: "公司地址2"
  },
  {
    name: "嘻嘻",
    age: 3,
    sex: "男",
    companyName: "公司3",
    companyAddress: "公司地址3"
  },
  {
    name: "啦啦",
    age: 4,
    sex: "女",
    companyName: "公司4",
    companyAddress: "公司地址4"
  }
];
const json2excel = new Json2excel({ data });
json2excel.generate();
```

![image](https://github.com/xxj95719/custom-json2excel/blob/master/images/noKepMap.png)

2、自定义头部无需过滤字段时的使用方式：

```js
import Json2excel from "custom-json2excel";
const data = [
  {
    name: "哈哈",
    age: 1,
    sex: "男",
    companyName: "公司1",
    companyAddress: "公司地址1"
  },
  {
    name: "呵呵",
    age: 2,
    sex: "女",
    companyName: "公司2",
    companyAddress: "公司地址2"
  },
  {
    name: "嘻嘻",
    age: 3,
    sex: "男",
    companyName: "公司3",
    companyAddress: "公司地址3"
  },
  {
    name: "啦啦",
    age: 4,
    sex: "女",
    companyName: "公司4",
    companyAddress: "公司地址4"
  }
];
const keyMap = {
  name: "姓名",
  age: "年龄",
  sex: "性别",
  companyName: "公司名称",
  companyAddress: "公司地址"
};
const json2excel = new Json2excel({ data, keyMap });
json2excel.generate();
```

![image](https://github.com/xxj95719/custom-json2excel/blob/master/images/noTitle.png)

3、需要过滤字段时的使用方式：

```js
import Json2excel from "custom-json2excel";
const data = [
  {
    name: "哈哈",
    age: 1,
    sex: "男",
    companyName: "公司1",
    companyAddress: "公司地址1"
  },
  {
    name: "呵呵",
    age: 2,
    sex: "女",
    companyName: "公司2",
    companyAddress: "公司地址2"
  },
  {
    name: "嘻嘻",
    age: 3,
    sex: "男",
    companyName: "公司3",
    companyAddress: "公司地址3"
  },
  {
    name: "啦啦",
    age: 4,
    sex: "女",
    companyName: "公司4",
    companyAddress: "公司地址4"
  }
];
const keyMap = {
  name: "姓名",
  age: "年龄",
  sex: "性别",
  companyName: "公司名称",
  companyAddress: "公司地址"
};
const filters = ["sex"];
const json2excel = new Json2excel({ data, keyMap, filters });
json2excel.generate();
```

![image](https://github.com/xxj95719/custom-json2excel/blob/master/images/filter.png)

4、需要表格标题时的使用方式：

```js
import Json2excel from "custom-json2excel";
const data = [
  {
    name: "哈哈",
    age: 1,
    sex: "男",
    companyName: "公司1",
    companyAddress: "公司地址1"
  },
  {
    name: "呵呵",
    age: 2,
    sex: "女",
    companyName: "公司2",
    companyAddress: "公司地址2"
  },
  {
    name: "嘻嘻",
    age: 3,
    sex: "男",
    companyName: "公司3",
    companyAddress: "公司地址3"
  },
  {
    name: "啦啦",
    age: 4,
    sex: "女",
    companyName: "公司4",
    companyAddress: "公司地址4"
  }
];
const keyMap = {
  name: "姓名",
  age: "年龄",
  sex: "性别",
  companyName: "公司名称",
  companyAddress: "公司地址"
};
const filters = ["sex"];
const title = [
  { name: "个人信息", colspan: 3 },
  { name: "公司信息", colspan: 2 }
];
const json2excel = new Json2excel({ data, title });
json2excel.generate();
```

![image](https://github.com/xxj95719/custom-json2excel/blob/master/images/title.png)

## Props type

| _Prop_    | _Type_   | _Defaults_ | _Required_ | _Description_                                                      |
| :-------- | :------- | :--------- | :--------- | ------------------------------------------------------------------ |
| data      | Array    | []         | ✓          | 转化成表格初始 json 数据                                           |
| filters   | Array    | []         | ×          | 需要过滤的字段数组                                                 |
| footer    | Array    | []         | ×          | 表格最后一列名称，参数同 title                                     |
| keyMap    | Object   | {}         | ×          | keyMap 映射表，用于自定义表格头部名称                              |
| name      | String   | excel      | ×          | excel 表格名称                                                     |
| title     | Array    | []         | ×          | 表格标题名称 {name:String,colspan:Number} name:名称， colspan:列数 |
| type      | String   | xls        | ×          | 生成的表格类型，可选值(xls、csv)                                   |
| onStart   | Function |            | ×          | 生成 Excel 前的回调函数                                            |
| onSuccess | Function |            | ×          | 生成 Excel 成功的回调函数                                          |
