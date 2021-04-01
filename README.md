# custom-json2excel


## 更新内容

### v3.1.1

- 修复ie下载问题

- 修复未指定kepMap导致的filters失效问题

- 增加了`orderedKey`字段，可指定列顺序

## Plugin setup

```
yarn add custom-json2excel
or
npm install custom-json2excel
```

## How to use?

### 方法一:

1、下载 `dist` 文件夹 `index.js`;

2、`script` 标签引入：
 
<script src="xx/index.js"></script>

3、`index.html` 中使用：

```html
const data = [
  ...
];
const json2excel = new CustomJson2excel({ data, keyMap });
json2excel.generate();
```

### 方法二：
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

![20190520174344.png](https://i.loli.net/2019/05/20/5ce276d35737f64374.png)

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

![20190520174449.png](https://i.loli.net/2019/05/20/5ce27712b3c4880090.png)


3、需要按照字段顺序返回表格列时的使用方式：

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
const orderedKey = ["sex","companyName","name"];
const json2excel = new Json2excel({ data, keyMap, orderedKey });
json2excel.generate();

// data会转化成=>
[
  {
    "性别": "男",
    "公司名称": "公司1",
    "姓名": "哈哈",
  },
  {
    "性别": "女",
    "公司名称": "公司2",
    "姓名": "呵呵",
  },
  {
    "性别": "男",
    "公司名称": "公司3",
    "姓名": "嘻嘻",
  },
  {
    "性别": "女",
    "公司名称": "公司4",
    "姓名": "啦啦",
  }
]
```

4、需要过滤字段时的使用方式：

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

![20190520174515.png](https://i.loli.net/2019/05/20/5ce2772bf1a3718069.png)

5、需要表格标题时的使用方式：

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
const json2excel = new Json2excel({ data, keyMap, filters, title });
json2excel.generate();
```

![20190520174536.png](https://i.loli.net/2019/05/20/5ce27741a660624320.png)

6、绑定回调函数的使用方式：

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
const json2excel = new Json2excel({
  data,
  keyMap,
  filters,
  title,
  onStart: () => {
    console.log("开始");
  },
  onSuccess: () => {
    console.log("成功");
  }
});
json2excel.generate();
```

## Props type

| _Prop_    | _Type_   | _Defaults_ | _Required_ | _Description_                                                      |
| :-------- | :------- | :--------- | :--------- | ------------------------------------------------------------------ |
| data      | Array    | []         | ✓          | 转化成表格初始 json 数据                                           |
| orderedKey   | Array    | []         | ×          | 按照key顺序返回列，不在数组中的字段将自动过滤，优先级大于`filters`                                                 |
| filters   | Array    | []         | ×          | 需要过滤的字段数组,适用于需过滤的数据较少                                                 |
| footer    | Array    | []         | ×          | 表格最后一列名称，参数同 title                                     |
| keyMap    | Object   | {}         | ×          | keyMap 映射表，用于自定义表格头部名称                              |
| name      | String   | excel      | ×          | excel 表格名称                                                     |
| title     | Array    | []         | ×          | 表格标题名称 {name:String,colspan:Number} name:名称， colspan:列数 |
| type      | String   | xls        | ×          | 生成的表格类型，可选值(xls、csv)                                   |
| onStart   | Function |            | ×          | 生成 Excel 前的回调函数                                            |
| onSuccess | Function |            | ×          | 生成 Excel 成功的回调函数                                          |
