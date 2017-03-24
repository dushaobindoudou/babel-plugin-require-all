# babel-plugin-require-all

convert the referenced directory to all files under the reference directory

### Use in javascript source code

#### requireAll('dir','splitDir')

###### dir: 需要引用的资源目录
###### splitDir: 生成后需要去掉的目录

#### Demo

```js
//转换前的代码
const imgs = requireAll('./imgs');// ./imas/a.png ./imgs/b.png


//转换后的代码
const $imgs_a = require('./imgs/a.png');
const $imgs_b = require('./imgs/b.png');
const imgs = {
    $imgs_a:$imgs_a,
    $imgs_b:$imgs_b
}


//转换前的代码
const imgs = requireAll('./imgs','./imgs');// ./imas/a.png ./imgs/b.png


//转换后的代码
const $a = require('./imgs/a.png');
const $b = require('./imgs/b.png');
const imgs = {
    $a:$a,
    $b:$b
}

```

## Installation

```sh
npm install --save-dev babel-plugin-require-all
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["require-all"]
}
```

### Via CLI

```sh
babel --plugins require-all script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["require-all"]
});
```
