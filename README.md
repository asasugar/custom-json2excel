# custom-json2excel

## Plugin setup

```
yarn add custom-json2excel
or
npm install custom-json2excel
```

### How to use?

```js
import Json2excel from 'custom-json2excel'
const json = [
  { name: '哈哈', age: 1 },
  { name: '呵呵', age: 2 },
  { name: '嘻嘻', age: 3 },
  { name: '啦啦', age: 4 },
]
const filters = [];
const keyMap = {name:'姓名',age:'年龄'};
const json2excel = new Json2excel({{ data: json ,keyMap}})
json2excel.generate()
```
