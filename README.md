# imicros-flow-map
[Moleculer](https://github.com/moleculerjs/moleculer) service for transformation JSON to JSON with [JSONata](https://docs.jsonata.org/overview.html)

## Installation
```
$ npm install imicros-flow-map --save
```

## Dependencies
Required mixins (or a similar mixin with the same notation) for the Moleculer sevice:
- [imciros-minio](https://github.com/al66/imicros-minio)

# Usage

## Usage map
```js
const { map } = require("imicros-flow-map");

// JSON template
const template = "{ 'my favorite': $.elements[id=2].name }";

// data
const data = {
    elements: [{
      id: 1,
      name: "banana"
    },{
      id: 2,
      name: "pear"
    },{
      id: 3,
      name: "apple"
    }]
};

let result = map(template, data);
/*
{
  "my favorite": "pear"
}
*/

```

## Usage JasonMap service
```js
const { ServiceBroker } = require("moleculer");
const { MinioMixin } = require("imicros-minio");
const { JsonMap } = require("imicros-map");

broker = new ServiceBroker({
    logger: console
});
broker.createService(JsonMap, Object.assign({ 
    mixins: [MinioMixin()]
}));
broker.start();
```
## Actions template service
- map { name, data } => result  
- map { template, data } => result  



