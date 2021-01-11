/**
 * @license MIT, imicros.de (c) 2021 Andreas Leinen
 */
"use strict";

// Handlebars like {{ object.path }}
const REGEX = new RegExp("{{([a-zA-Z.-_0-9]+)}}", "g");
const CONTROL = "{{";

// get value by path from object
function get(obj, path, defaultValue = undefined) {
    if (Object(obj) !== obj) return defaultValue; 
    if (!path || typeof path !== "string" ) return null;
    let i;
    path = path.split(".");
    for (i = 0; i < path.length; i++) {
        if (!obj[path[i]]) {obj = null; break;}
        obj = obj[path[i]];
    }
    return obj || defaultValue;
}

// replace place holders by values
function replace(input, data) {
    // nothing to do
    if (input.indexOf(CONTROL) === -1) return input;
    let match, val;
    let replaced = input.replace(REGEX, function(original, path) {
        match = original;
        val = get(data,path,original); 
        return val;
    });
    // if place holder only, return object, otherwise return string
    return input === match ? val : ( replaced || input );
}

// walk through the template
function walk(part,data) {
    switch (typeof part) {
        case "object":
            if (Array.isArray(part)) {
                return part.map(item => {
                    return walk(item,data);
                });
            } else {
                let obj = {};
                for (let key in part) {
                    obj[walk(key,data)] = walk(part[key],data);
                }
                return obj;
            }
        case "string":
            return replace(part,data);
        default:
            return part;
    }
}

// map template with data 
function map(template,data) {
    // walk through the template
    return walk(template, data);
}

module.exports = map;
