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
