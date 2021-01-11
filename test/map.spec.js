"use strict";

const { map } = require("../index");

describe("Test map", () => {

    it("it should return template object",() => {
        let template = {
            "key A": 1,
            "key B": "String",
            "key C": [1,2,3,4],
            "key D": ["1","2","3","4"]
        };
        let data = {};
        let result = map(template,data);
        expect(result).toEqual(template);
    });

    it("it should replace keys",() => {
        let template = {
            "{{a}}": 1,
            "key {{b}}": "String",
            "{{keys.c}}": [1,2,3,4],
            "key {{keys.d}}": ["1","2","3","4"]
        };
        let data = {
            a: "key A",
            b: "B",
            keys: {
                c: "key C",
                d: "D"
            }
        };
        let result = map(template,data);
        expect(result).toEqual({
            "key A": 1,
            "key B": "String",
            "key C": [1,2,3,4],
            "key D": ["1","2","3","4"]
        });
    });
  
    it("it should replace values",() => {
        let template = {
            "key A": "{{number}}",
            "key B": "{{string}}",
            "key C": "{{values.arrays.numbers}}",
            "key D": "{{values.arrays.strings}}"
        };
        let data = {
            number: 5,
            string: "hello",
            values: {
                arrays: {
                    numbers: [1,2,3,4],
                    strings: ["1","2","3","4"]
                }
            }
        };
        let result = map(template,data);
        expect(result).toEqual({
            "key A": 5,
            "key B": "hello",
            "key C": [1,2,3,4],
            "key D": ["1","2","3","4"]
        });
    });
  
    it("it should work with arrays",() => {
        let template = ["{{number}}","{{string}}","{{values.arrays.numbers}}","{{values.arrays.strings}}"];
        let data = {
            number: 5,
            string: "hello",
            values: {
                arrays: {
                    numbers: [1,2,3,4],
                    strings: ["1","2","3","4"]
                }
            }
        };
        let result = map(template,data);
        expect(result).toEqual([
            5,
            "hello",
            [1,2,3,4],
            ["1","2","3","4"]
        ]);
    });
  
    it("it should return objects",() => {
        let template = {
            "key A": "{{values.arrays}}",
            "key B": "{{values.object}}"
        };
        let date = Date.now();
        let data = {
            values: {
                arrays: {
                    numbers: [1,2,3,4],
                    strings: ["1","2","3","4"]
                },
                object: {
                    a: {
                        x: 1
                    },
                    b: {
                        y: date
                    }
                }
            }
        };
        let result = map(template,data);
        expect(result).toEqual({
            "key A": {
                numbers: [1,2,3,4],
                strings: ["1","2","3","4"]
            },
            "key B": {
                a: {
                    x: 1
                },
                b: {
                    y: date
                }
            }
        });
    });
  
});