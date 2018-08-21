# custom-json2excel

## Plugin setup

```
yarn add custom-json2excel
or
npm install custom-json2excel
```

### How to use?

1、自定义头部无需过滤字段时的使用方式：

```js
import Json2excel from 'custom-json2excel'
const data = [
  { name: '哈哈', age: 1 },
  { name: '呵呵', age: 2 },
  { name: '嘻嘻', age: 3 },
  { name: '啦啦', age: 4 }
]
const keyMap = { name: '姓名', age: '年龄' }
const json2excel = new Json2excel({ data, keyMap })
json2excel.generate()
```

2、需要过滤字段时的使用方式：

```js
import Json2excel from 'custom-json2excel'
const data = [
  { name: '哈哈', age: 1, sex: '男' },
  { name: '呵呵', age: 2, sex: '女' },
  { name: '嘻嘻', age: 3, sex: '男' },
  { name: '啦啦', age: 4, sex: '女' }
]
const filters = ['sex']
const keyMap = { name: '姓名', age: '年龄' }
const json2excel = new Json2excel({ data, keyMap, filters })
json2excel.generate()
```

## 注意点

当 keyMap 为部分，且未在 filters 中添加过滤，则生成的数组对象的 key 会自动排序
列如：

```js
const data = [
  { name: '哈哈', age: 1, sex: '男' },
  { name: '呵呵', age: 2, sex: '女' },
  { name: '嘻嘻', age: 3, sex: '男' },
  { name: '啦啦', age: 4, sex: '女' }
]
const filters = ['sex']
const keyMap = { name: '姓名' } //age未添加
const json2excel = new Json2excel({ data, keyMap, filters })
//========>>>转化后的jsonData
jsonData = [
  { age: 1, 姓名: '哈哈' },
  { age: 2, 姓名: '呵呵' },
  { age: 3, 姓名: '嘻嘻' },
  { age: 4, 姓名: '啦啦' }
]
```

## Props type

| _Prop_  | _Type_ | _Defaults_ | _Required_ | _Description_                         |
| :------ | :----- | :--------- | :--------- | ------------------------------------- |
| data    | Array  | []         | ✓          | 转化成表格初始 json 数据              |
| filters | Array  | []         | ×          | 需要过滤的字段数组                    |
| footer  | String | null       | ×          | 表格页脚名称                          |
| keyMap  | Object | {}         | ×          | keyMap 映射表，用于自定义表格头部名称 |
| name    | String | excel      | ×          | excel 表格名称                        |
| title   | String | null       | ×          | 表格标题名称                          |
| type    | String | xls        | ×          | 生成的表格类型，可选值(xls、csv)      |
