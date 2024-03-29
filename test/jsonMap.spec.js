"use strict";

const { ServiceBroker } = require("moleculer");
const { JsonMap } = require("../index");

const timestamp = Date.now();

const globalStore ={};

// mock imicros-minio mixin
const Store = (/*options*/) => { return {
    methods: {
        async putString ({ ctx = null, objectName = null, value = null } = {}) {
            if ( !ctx || !objectName ) return false;
            
            let internal = Buffer.from(ctx.meta.acl.ownerId + "~" + objectName).toString("base64");
            
            this.store[internal] = value;
            return true;
        },
        async getString ({ ctx = null, objectName }) {
            if ( !ctx || !objectName ) throw new Error("missing parameter");

            let internal = Buffer.from(ctx.meta.acl.ownerId + "~" + objectName).toString("base64");
            
            return this.store[internal];            
        }   
    },
    created () {
        this.store = globalStore;
    }
};};

describe("Test template service", () => {

    let broker, service;
    beforeAll(() => {
    });
    
    afterAll(() => {
    });
    
    describe("Test create service", () => {

        it("it should start the broker", async () => {
            broker = new ServiceBroker({
                logger: console,
                logLevel: "debug" // "info" //"debug"
            });
            service = await broker.createService(JsonMap, Object.assign({ 
                name: "jsonMap",
                mixins: [Store()]
            }));
            await broker.start();
            expect(service).toBeDefined();
        });

    });
    
    describe("Test map", () => {

        let opts;
        
        beforeEach(() => {
            opts = { 
                meta: { 
                    acl: {
                        accessToken: "this is the access token",
                        ownerId: `g1-${timestamp}`,
                        unrestricted: true
                    }, 
                    user: { 
                        id: `1-${timestamp}` , 
                        email: `1-${timestamp}@host.com` }
                } 
            };
        });

        it("it should render a simple map from object", async () => {
            let params = {
                name: "path/to/template/hello.map",
                data:  {
                    a: "key A",
                    value: "B"
                }
            };
            let internal = Buffer.from(opts.meta.acl.ownerId + "~" + params.name).toString("base64");
            globalStore[internal] =  "{ a: value }";

            return broker.call("jsonMap.map", params, opts).then(res => {
                expect(res).toBeDefined();
                expect(res).toEqual({
                    "key A": "B"
                });
            });
                
        });
        
        it("it should render a simple map from parameter", async () => {
            let params = {
                template: "{ a: value }",
                data:  {
                    a: "key A",
                    value: "B"
                }
            };
            return broker.call("jsonMap.map", params, opts).then(res => {
                expect(res).toBeDefined();
                expect(res).toEqual({
                    "key A": "B"
                });
            });
                
        });
        
        it("it should render complex map from object", async () => {
            let params = {
                name: "path/to/template/hello.map",
                data:  {
                    a: "key A",
                    b: "B",
                    keys: {
                        c: "key C",
                        d: "D"
                    }
                }
            };
            let internal = Buffer.from(opts.meta.acl.ownerId + "~" + params.name).toString("base64");
            globalStore[internal] =  "{ a: 1, 'key ' & b: 'String', keys.c: [1,2,3,4], 'key ' & keys.d: ['1','2','3','4'] }";

            return broker.call("jsonMap.map", params, opts).then(res => {
                expect(res).toBeDefined();
                expect(res).toEqual({
                    "key A": 1,
                    "key B": "String",
                    "key C": [1,2,3,4],
                    "key D": ["1","2","3","4"]
                });
            });
                
        });

        it("it should render a complex map from parameter", async () => {
            let params = {
                template: `{
                    a: x,
                    "deep": {
                        "b": sub.y
                    }
                }`,
                data:  {
                    "a": "Key A",
                    "x": "value x",
                    "sub": {
                        "y": "value y"
                    }
                }
            };
            return broker.call("jsonMap.map", params, opts).then(res => {
                expect(res).toBeDefined();
                expect(res).toEqual({
                    "Key A": "value x",
                    deep: {
                        "b": "value y"
                    }
                });
            });
                
        });
        
        it("it should create a uuid", async () => {
            let params = {
                template: `{ 'id': $uuid() }`,
                data:  {}
            };
            return broker.call("jsonMap.map", params, opts).then(res => {
                expect(res).toBeDefined();
                expect(res.id).toBeDefined();
                expect(res.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
            });
                
        });
        
    });
        
    describe("Test stop broker", () => {
        it("should stop the broker", async () => {
            expect.assertions(1);
            await broker.stop();
            expect(broker).toBeDefined();
        });
    });    
    
});