# imicros-flow-map
Transform JSON to JSON

## Installation
```
$ npm install imicros-flow-map --save
```

## Usage
```js
const { map } = require("imicros-flow-map");

// JSON template
const template = {
    "This is a key": "this is a string value",
    "numbers": {
        "template": 10,
        "data": "{{number}}"
    },
    "booleans": {
        "template": false,
        "data": "{{boolean}}"
    },
    "deep" : {
        "level A": {
            "level B": {
                "x": "{{arrays.number}}",
                "y": "{{arrays.string}}",
                "z": "{{arrays.object}}"
            }
        },
        "{{keys.a}}": "deep key"
    },
    "array": ["{{number}}", "{{arrays.number}}"],
    "path": "{{keys}}",
    "{{keys.a}}": "any",
    "{{keys.b}}": "missing key",
    "missing value": "{{any}}"
};

// data
const data = {
    keys: {
        a: "test"
    },
    number: 10,
    boolean: true,
    arrays: {
        number: [1,2,3,4,5,],
        string: ["hello", "world"],
        object: [
          { a: 1, b: "v", c: "3" },
          { a: 2, b: "s", c: "4" }
        ]
    }
};

let result = map(template, data);
/*
{
  'This is a key': 'this is a string value',
  numbers: { template: 10, data: 10 },
  booleans: { template: false, data: true },
  deep: {
    'level A': {
      'level B': {
        x: [ 1, 2, 3, 4, 5 ],
        y: [ 'hello', 'world' ],
        z: [ { a: 1, b: 'v', c: '3' }, { a: 2, b: 's', c: '4' } ]
      }
    },
    test: 'deep key'
  },
  array: [ 10, [ 1, 2, 3, 4, 5 ] ],
  path: { a: 'test' },
  test: 'any',
  '{{keys.b}}': 'missing key',
  'missing value': '{{any}}'
}
*/

```

