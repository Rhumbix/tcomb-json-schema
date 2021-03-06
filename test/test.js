"use strict";
var assert = require('assert');
var t = require('tcomb');
var { transform, getFormOptions } = require('../index');
var util = require('../util');
var rmbxUtil = require('../src/util')
var assert = require('assert-diff');

var Str = t.Str;
var Num = t.Num;
var Bool = t.Bool;
var Obj = t.Obj;
var Arr = t.Arr;
var Any = t.Any;
var getKind = function (type) {
    return type.meta.kind;
};

//
// setup
//

var ok = function (x) { assert.strictEqual(true, x); };
var ko = function (x) { assert.strictEqual(false, x); };
var eq = assert.strictEqual;

describe('transform', function () {

    it('should transform an empty schema', function () {
        eq(transform({}), Any);
    });

    describe('string schema', function () {

        it('should transform a simple schema', function () {
            eq(transform({type: 'string'}), Str);
        });

        it('should handle enum', function () {
            var Type = transform({
                type: 'string',
                'enum': ["Street", "Avenue", "Boulevard"]
            });
            eq(getKind(Type), 'enums');
            eq(Type.is('a'), false);
            eq(Type.is('Street'), true);
        });

        it('should handle enum objects', function () {
            var Type = transform({
                type: 'string',
                'enum': {st: "Street", ave: "Avenue", blvd: "Boulevard"}
            });
            eq(getKind(Type), 'enums');
            eq(Type.is('a'), false);
            eq(Type.is('st'), true);
        });

        it('should handle minLength', function () {
            var Type = transform({
                type: 'string',
                minLength: 2
            });
            eq(getKind(Type), 'subtype');
            eq(Type.meta.type, Str);
            eq(Type.meta.predicate('a'), false);
            eq(Type.meta.predicate('aa'), true);
        });

        it('should handle maxLength', function () {
            var Type = transform({
                type: 'string',
                maxLength: 2
            });
            eq(getKind(Type), 'subtype');
            eq(Type.meta.type, Str);
            eq(Type.meta.predicate('aa'), true);
            eq(Type.meta.predicate('aaa'), false);
        });

        it('should handle pattern', function () {
            var Type = transform({
                type: 'string',
                pattern: '^h'
            });
            eq(getKind(Type), 'subtype');
            eq(Type.meta.type, Str);
            eq(Type.meta.predicate('hello'), true);
            eq(Type.meta.predicate('aaa'), false);
        });

        it('should handle pattern as regex literal', function () {
            var Type = transform({
                type: 'string',
                pattern: '/^H/i'
            });
            eq(getKind(Type), 'subtype');
            eq(Type.meta.type, Str);
            eq(Type.meta.predicate('hello'), true);
            eq(Type.meta.predicate('aaa'), false);
        });

    });

    describe('number schema', function () {

        it('should transform a simple schema', function () {
            eq(transform({type: 'number'}), Num);
        });

        it('should handle minimum', function () {
            var Type = transform({
                type: 'number',
                minimum: 2
            });
            eq(getKind(Type), 'subtype');
            eq(Type.meta.type, Num);
            eq(Type.meta.predicate(1), false);
            eq(Type.meta.predicate(2), true);
            eq(Type.meta.predicate(3), true);
        });

        it('should handle exclusiveMinimum', function () {
            var Type = transform({
                type: 'number',
                minimum: 2,
                exclusiveMinimum: true
            });
            eq(getKind(Type), 'subtype');
            eq(Type.meta.type, Num);
            eq(Type.meta.predicate(1), false);
            eq(Type.meta.predicate(2), false);
            eq(Type.meta.predicate(3), true);
        });

        it('should handle maximum', function () {
            var Type = transform({
                type: 'number',
                maximum: 2
            });
            eq(getKind(Type), 'subtype');
            eq(Type.meta.type, Num);
            eq(Type.meta.predicate(1), true);
            eq(Type.meta.predicate(2), true);
            eq(Type.meta.predicate(3), false);
        });

        it('should handle exclusiveMaximum', function () {
            var Type = transform({
                type: 'number',
                maximum: 2,
                exclusiveMaximum: true
            });
            eq(getKind(Type), 'subtype');
            eq(Type.meta.type, Num);
            eq(Type.meta.predicate(1), true);
            eq(Type.meta.predicate(2), false);
            eq(Type.meta.predicate(3), false);
        });

        it('should handle integer', function () {
            var Type = transform({
                type: 'number',
                integer: true
            });
            eq(getKind(Type), 'subtype');
            eq(Type.meta.type, Num);
            eq(Type.meta.predicate(1), true);
            eq(Type.meta.predicate(1.1), false);
        });

    });

    describe('integer schema', function () {

        it('should transform a simple schema', function () {
            var Type = transform({
                type: 'integer'
            });
            ok(Type === util.Int);
            eq(Type.is(1), true);
            eq(Type.is(1.1), false);
        });

        it('should handle minimum', function () {
            var Type = transform({
                type: 'integer',
                minimum: 2
            });
            eq(getKind(Type), 'subtype');
            eq(Type.meta.type, util.Int);
            eq(Type.meta.predicate(1), false);
            eq(Type.meta.predicate(2), true);
            eq(Type.meta.predicate(3), true);
        });

        it('should handle exclusiveMinimum', function () {
            var Type = transform({
                type: 'integer',
                minimum: 2,
                exclusiveMinimum: true
            });
            eq(getKind(Type), 'subtype');
            eq(Type.meta.type, util.Int);
            eq(Type.meta.predicate(1), false);
            eq(Type.meta.predicate(2), false);
            eq(Type.meta.predicate(3), true);
        });

        it('should handle maximum', function () {
            var Type = transform({
                type: 'integer',
                maximum: 2
            });
            eq(getKind(Type), 'subtype');
            eq(Type.meta.type, util.Int);
            eq(Type.meta.predicate(1), true);
            eq(Type.meta.predicate(2), true);
            eq(Type.meta.predicate(3), false);
        });

        it('should handle exclusiveMaximum', function () {
            var Type = transform({
                type: 'integer',
                maximum: 2,
                exclusiveMaximum: true
            });
            eq(getKind(Type), 'subtype');
            eq(Type.meta.type, util.Int);
            eq(Type.meta.predicate(1), true);
            eq(Type.meta.predicate(2), false);
            eq(Type.meta.predicate(3), false);
        });

    });

    it('should transform a null schema', function () {
        var Type = transform({type: 'null'});
        ok(Type === util.Null);
        ok(Type.is(null));
        ko(Type.is(undefined));
        ko(Type.is('a'));
    });

    it('should transform a boolean schema', function () {
        eq(transform({type: 'boolean'}), Bool);
    });

    describe('object schema', function () {

        it('should transform a simple schema', function () {
            eq(transform({type: 'object'}), Obj);
        });

        it('should handle optional properties', function () {
            var Type = transform({
                type: 'object',
                properties: {
                    a: {type: 'string'},
                    b: {type: 'number'}
                }
            });
            var a = Type.meta.props.a;
            var b = Type.meta.props.b;
            eq(getKind(a), 'maybe');
            ok(a.meta.type === Str);
            eq(getKind(b), 'maybe');
            ok(b.meta.type === Num);
        });

        it('should handle required properties', function () {
            var Type = transform({
                type: 'object',
                properties: {
                    a: {type: 'string'},
                    b: {type: 'number'}
                },
                required: ['a']
            });
            var a = Type.meta.props.a;
            var b = Type.meta.props.b;
            eq(getKind(a), 'irreducible');
            ok(a === Str);
            eq(getKind(b), 'maybe');
            ok(b.meta.type === Num);
        });

    });

    describe('array schema', function () {

        it('should transform a simple schema', function () {
            eq(transform({type: 'array'}), Arr);
        });

        it('should handle minItems', function () {
            var Type = transform({type: 'array', minItems: 1});
            eq(getKind(Type), 'subtype');
            eq(Type.meta.type, Arr);
            eq(Type.meta.predicate([]), false);
            eq(Type.meta.predicate(['a']), true);
        });

        it('should handle maxItems', function () {
            var Type = transform({type: 'array', maxItems: 2});
            eq(getKind(Type), 'subtype');
            eq(Type.meta.type, Arr);
            eq(Type.meta.predicate(['a', 'b']), true);
            eq(Type.meta.predicate(['a', 'b', 'c']), false);
        });

        it('should handle list items', function () {
            var Type = transform({
                type: 'array',
                items: {
                    type: 'number'
                }
            });
            eq(getKind(Type), 'list');
            ok(Type.meta.type === Num);
        });

        it('should handle minItems with list items', function () {
            var Type = transform({
                "type": "array",
                "minItems": 2,
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string"
                        }
                    },
                    "required": ["name"]
                }
            })
            eq(getKind(Type), 'subtype');
            eq(getKind(Type.meta.type), 'list');
            eq(getKind(Type.meta.type.meta.type), 'struct');
            eq(Type.meta.predicate([]), false);
            eq(Type.meta.predicate([{name: 'name 1'}]), false);
            eq(Type.meta.predicate([{name: 'name 1'}, {name: 'name 2'}]), true);
            eq(Type.meta.predicate([{name: 'name 1'}, {name: 'name 2'}, {name: 'name 3'}]), true);
        })

        it('should handle maxItems with list items', function () {
            var Type = transform({
                "type": "array",
                "maxItems": 2,
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string"
                        }
                    },
                    "required": ["name"]
                }
            })
            eq(getKind(Type), 'subtype');
            eq(getKind(Type.meta.type), 'list');
            eq(getKind(Type.meta.type.meta.type), 'struct');
            eq(Type.meta.predicate([]), true);
            eq(Type.meta.predicate([{name: 'name 1'}]), true);
            eq(Type.meta.predicate([{name: 'name 1'}, {name: 'name 2'}]), true);
            eq(Type.meta.predicate([{name: 'name 1'}, {name: 'name 2'}, {name: 'name 3'}]), false);
        })

        it('should handle tuple items', function () {
            var Type = transform({
                type: 'array',
                items: [
                    {type: 'string'},
                    {type: 'number'}
                ]
            });
            eq(getKind(Type), 'tuple');
            ok(Type.meta.types[0] === Str);
            ok(Type.meta.types[1] === Num);
        });

    });

    it('should handle unions', function () {
        var Type = transform({type: ["number", "string"]});
        eq(getKind(Type), 'union');
        ok(Type.meta.types[0] === Num);
        ok(Type.meta.types[1] === Str);
    });

    describe('registerFormat', function () {

        function isEmail(x) {
            return /(.)+@(.)+/.test(x);
        }

        transform.registerFormat('email', isEmail);

        it('should throw if duplicated formats are registered', function () {
            assert.throws(
                function () {
                    transform.registerFormat('email', isEmail);
                },
                function(err) {
                    if ( (err instanceof Error) && err.message === '[tcomb] [tcomb-json-schema] Duplicated format email') {
                        return true;
                    }
                }
            );
        });

        it('should throw if unknown formats are used', function () {
            assert.throws(
                function () {
                    var Type = transform({
                        type: "string",
                        format: 'unknown'
                    });
                },
                function(err) {
                    if ( (err instanceof Error) && err.message === '[tcomb] [tcomb-json-schema] Missing format unknown, use the (format, predicate) API') {
                        return true;
                    }
                }
            );
        });

        it('should handle format property', function () {
            var Type = transform({
                type: "string",
                format: 'email'
            });
            eq(getKind(Type), 'subtype');
            ok(Type.meta.type === Str);
            ok(Type.meta.predicate === isEmail);
            ok(Type.is('a@b'));
            ko(Type.is(''))
        });

    });

    describe('registerType', function () {

        var Str10 = t.subtype(t.Str, function (s) {
            return s.length <= 10;
        }, 'Str10');

        transform.registerType('string10', Str10);

        it('should throw if duplicated types are registered', function () {
            assert.throws(
                function () {
                    transform.registerType('string10', Str10);
                },
                function(err) {
                    if ( (err instanceof Error) && err.message === '[tcomb] [tcomb-json-schema] Duplicated type string10') {
                        return true;
                    }
                }
            );
        });

        it('should handle type property', function () {
            var Type = transform({
                type: "string10"
            });
            eq(getKind(Type), 'subtype');
            ok(Type.meta.type === Str);
            ok(Type.is('abcdefghij'));
            ko(Type.is('abcdefghijk'))
        });

    });

});

describe('getFormOptions', function () {
    it('basic single level struct with varying ui:components, logic:listeners, and mobile_layout; one "editable: false" property', function () {
        const linear_tracking_schema = {
            "description": "",
            "type": "object",
            "properties": {
                "Date Completed": {"type": "string"},
                "Crew Code": {"type": "object"},
                "End Location": {"type": "integer"},
                "Start Location": {"type": "integer"},
                "Length": {"type": "number"},
                "Note": {"type": "string"},
            },
            "required": ["Date Completed", "Start Location", "End Location"]
        }

        const linear_tracking_ui_schema = {
            "fields": {
                "Date Completed": {"ui:component": "date"},
                "Crew Code": {"ui:component": "costcode-selector"},
                "End Location": {"ui:component": "masked-length"},
                "Start Location": {"ui:component": "masked-length"},
                "Note": {"ui:component": "textarea"},
            },
            "logic:listener": {
                "trigger": "onChange",
                "function": "eval",
                "eval": 'value["Start Location"]&&value["End Location"]&&(Math.abs(value["Start Location"]-value["End Location"]))',
                "output_key": "/Length",
            },
            "order": ["Date Completed", "Crew Code", "Start Location", "End Location", "Length", "Note"],
            "mobile_layout": {
                "list_item": {
                    "primary": {
                        "key": "",
                        "template": "<%= (value['Start Location'] ? value['Start Location'].toString().slice(0,-2) + '+' + value['Start Location'].toString().slice(-2) : '') + ' - ' + (value['End Location'] ? value['End Location'].toString().slice(0,-2) + '+' + value['End Location'].toString().slice(-2) : '') %>",
                    },
                    "secondary": {"key": "/Note"},
                    "tertiary": {"key": "/Date Completed", "template": "<%= formatDate(value) %>"},
                }
            }
        }

        const permissions = {
            "editable": true,
            "viewable": true,
            "properties": {
                "Length": {"editable": false}
            }
        }

        const linear_tracking_ui_schema_output = {
            "editable": true,
            "viewable": true,
            "fields": {
                "Date Completed": {"ui:component": "date", "editable": true, "viewable": true},
                "Crew Code": {"ui:component": "costcode-selector", "editable": true, "viewable": true},
                "End Location": {"ui:component": "masked-length", "editable": true, "viewable": true},
                "Start Location": {"ui:component": "masked-length", "editable": true, "viewable": true},
                "Length": {"editable": false, "viewable": true},
                "Note": {"ui:component": "textarea", "editable": true, "viewable": true},
            },
            "logic:listener": {
                "trigger": "onChange",
                "function": "eval",
                "eval": 'value["Start Location"]&&value["End Location"]&&(Math.abs(value["Start Location"]-value["End Location"]))',
                "output_key": "/Length",
            },
            "order": ["Date Completed", "Crew Code", "Start Location", "End Location", "Length", "Note"],
            "mobile_layout": {
                "list_item": {
                    "primary": {
                        "key": "",
                        "template": "<%= (value['Start Location'] ? value['Start Location'].toString().slice(0,-2) + '+' + value['Start Location'].toString().slice(-2) : '') + ' - ' + (value['End Location'] ? value['End Location'].toString().slice(0,-2) + '+' + value['End Location'].toString().slice(-2) : '') %>",
                    },
                    "secondary": {"key": "/Note"},
                    "tertiary": {"key": "/Date Completed", "template": "<%= formatDate(value) %>"},
                }
            }
        }

        const new_ui_schema = getFormOptions(linear_tracking_schema, linear_tracking_ui_schema, permissions)
        assert.deepEqual(new_ui_schema, linear_tracking_ui_schema_output)
    })

    it('multiple nested structs with varying ui:components, one "editable: false" property; and a optional/missing ui_schema(in the nested struct)', function () {
        const linear_tracking_schema = {
            "description": "",
            "type": "object",
            "properties": {
                "Date Completed": {"type": "string"},
                "labor": {
                    "type": "object",
                    "properties":{
                        "Crew Code": {"type": "object"},
                        "hours":{
                            "type": "object",
                            "properties":{
                                "st": { "type": "integer" },
                                "ot": { "type": "integer" },
                                "dt": { "type": "integer" }
                            }
                        }
                    }
                },
                "Crew Code": {"type": "object"},
                "End Location": {"type": "integer"},
                "Start Location": {"type": "integer"},
                "Length": {"type": "number"},
                "Note": {"type": "string"},
            },
            "required": ["Date Completed", "Start Location", "End Location"]
        }

        const linear_tracking_ui_schema = {
            "fields": {
                "Date Completed": {"ui:component": "date"},
                "labor": {
                    "fields":{
                        "Crew Code": {"ui:component": "costcode-selector"}
                    }
                },
                "Crew Code": {"ui:component": "costcode-selector"},
                "End Location": {"ui:component": "masked-length"},
                "Start Location": {"ui:component": "masked-length"},
                "Note": {"ui:component": "textarea"},
            },
            "logic:listener": {
                "trigger": "onChange",
                "function": "eval",
                "eval": 'value["Start Location"]&&value["End Location"]&&(Math.abs(value["Start Location"]-value["End Location"]))',
                "output_key": "/Length",
            },
            "order": ["Date Completed", "Crew Code", "Start Location", "End Location", "Length", "Note"],
            "mobile_layout": {
                "list_item": {
                    "primary": {
                        "key": "",
                        "template": "<%= (value['Start Location'] ? value['Start Location'].toString().slice(0,-2) + '+' + value['Start Location'].toString().slice(-2) : '') + ' - ' + (value['End Location'] ? value['End Location'].toString().slice(0,-2) + '+' + value['End Location'].toString().slice(-2) : '') %>",
                    },
                    "secondary": {"key": "/Note"},
                    "tertiary": {"key": "/Date Completed", "template": "<%= formatDate(value) %>"},
                }
            }
        }

        const permissions = {
            "editable": true,
            "viewable": true,
            "properties": {
                "Length": {"editable": false}
            }
        }

        const linear_tracking_ui_schema_output = {
            "editable": true,
            "viewable": true,
            "fields": {
                "Date Completed": {"ui:component": "date", "editable": true, "viewable": true},
                "labor": {
                    "editable": true,
                    "viewable": true,
                    "fields":{
                        "Crew Code": {"ui:component": "costcode-selector", "editable": true, "viewable": true},
                        "hours":{
                            "editable": true,
                            "viewable": true,
                            "fields": {
                                "st": { "viewable": true, "editable": true},
                                "ot": { "viewable": true, "editable": true},
                                "dt": { "viewable": true, "editable": true}
                            }
                        }
                    }
                },
                "Crew Code": {"ui:component": "costcode-selector", "editable": true, "viewable": true},
                "End Location": {"ui:component": "masked-length", "editable": true, "viewable": true},
                "Start Location": {"ui:component": "masked-length", "editable": true, "viewable": true},
                "Length": {"editable": false, "viewable": true},
                "Note": {"ui:component": "textarea", "editable": true, "viewable": true},
                "Crew Code": {"ui:component": "costcode-selector", "editable": true, "viewable": true},
                "End Location": {"ui:component": "masked-length", "editable": true, "viewable": true},
                "Start Location": {"ui:component": "masked-length", "editable": true, "viewable": true},
                "Length": {"editable": false, "viewable": true},
                "Note": {"ui:component": "textarea", "editable": true, "viewable": true},
            },
            "logic:listener": {
                "trigger": "onChange",
                "function": "eval",
                "eval": 'value["Start Location"]&&value["End Location"]&&(Math.abs(value["Start Location"]-value["End Location"]))',
                "output_key": "/Length",
            },
            "order": ["Date Completed", "Crew Code", "Start Location", "End Location", "Length", "Note"],
            "mobile_layout": {
                "list_item": {
                    "primary": {
                        "key": "",
                        "template": "<%= (value['Start Location'] ? value['Start Location'].toString().slice(0,-2) + '+' + value['Start Location'].toString().slice(-2) : '') + ' - ' + (value['End Location'] ? value['End Location'].toString().slice(0,-2) + '+' + value['End Location'].toString().slice(-2) : '') %>",
                    },
                    "secondary": {"key": "/Note"},
                    "tertiary": {"key": "/Date Completed", "template": "<%= formatDate(value) %>"},
                }
            }
        }

        const new_ui_schema = getFormOptions(linear_tracking_schema, linear_tracking_ui_schema, permissions)
        assert.deepEqual(new_ui_schema, linear_tracking_ui_schema_output)
    })

    it('false at the struct level can never be overriden from something within it; multiple nested structs', function () {
        const linear_tracking_schema = {
            "type": "object",
            "properties": {
                "labor": {
                    "type": "object",
                    "properties":{
                        "Crew Code": {"type": "object"},
                        "hours":{
                            "type": "object",
                            "properties":{
                                "st": { "type": "integer" },
                                "ot": { "type": "integer" },
                                "dt": { "type": "integer" }
                            }
                        }
                    }
                },
                "Length": {"type": "number"}
            }
        }

        const linear_tracking_ui_schema = {
            "fields": {
                "labor": {
                    "fields":{
                        "Crew Code": {"ui:component": "costcode-selector"}
                    }
                },
                "Length": {"editable": true, "viewable": true}, // this shouldn't override anything

            }
        }

        const permissions = {
            "editable": false,
            "viewable": false,
            "properties": {
                "Length": { "editable": true, "viewable": true },
                "labor": {
                    "properties":{
                        "st": { "editable": true, "viewable": true }
                    }
                }
            }
        }

        const linear_tracking_ui_schema_output = {
            "editable": false,
            "viewable": false,
            "fields": {
                "labor": {
                    "editable": false,
                    "viewable": false,
                    "fields":{
                        "Crew Code": {"ui:component": "costcode-selector", "editable": false, "viewable": false},
                        "hours":{
                            "editable": false,
                            "viewable": false,
                            "fields": {
                                "st": { "viewable": false, "editable": false},
                                "ot": { "viewable": false, "editable": false},
                                "dt": { "viewable": false, "editable": false}
                            }
                        }
                    }
                },
                "Length": {"editable": false, "viewable": false},
            }
        }

        const new_ui_schema = getFormOptions(linear_tracking_schema, linear_tracking_ui_schema, permissions)
        assert.deepEqual(new_ui_schema, linear_tracking_ui_schema_output)
    })

    it('false at an inner struct level can never be overriden from something within it; multiple nested structs', function () {
        const linear_tracking_schema = {
            "type": "object",
            "properties": {
                "labor": {
                    "type": "object",
                    "properties":{
                        "Crew Code": {"type": "object"},
                        "hours":{
                            "type": "object",
                            "properties":{
                                "st": { "type": "integer" },
                                "ot": { "type": "integer" },
                                "dt": { "type": "integer" }
                            }
                        }
                    }
                },
                "Length": {"type": "number"}
            }
        }

        const linear_tracking_ui_schema = {
            "fields": {
                "labor": {
                    "fields":{
                        "Crew Code": {"ui:component": "costcode-selector"}
                    }
                },
                "Length": {"editable": true, "viewable": true},

            }
        }

        const permissions = {
            "editable": true,
            "viewable": true,
            "properties": {
                "labor": {
                    "editable": false,
                    "viewable": false,
                    "properties":{
                        "st": { "editable": true, "viewable": true }
                    }
                }
            }
        }

        const linear_tracking_ui_schema_output = {
            "editable": true,
            "viewable": true,
            "fields": {
                "labor": {
                    "editable": false,
                    "viewable": false,
                    "fields":{
                        "Crew Code": {"ui:component": "costcode-selector", "editable": false, "viewable": false},
                        "hours":{
                            "editable": false,
                            "viewable": false,
                            "fields": {
                                "st": { "viewable": false, "editable": false},
                                "ot": { "viewable": false, "editable": false},
                                "dt": { "viewable": false, "editable": false}
                            }
                        }
                    }
                },
                "Length": {"editable": true, "viewable": true},
            }
        }

        const new_ui_schema = getFormOptions(linear_tracking_schema, linear_tracking_ui_schema, permissions)
        assert.deepEqual(new_ui_schema, linear_tracking_ui_schema_output)
    })

    it('type: arrays', function () {
        const linear_tracking_schema = {
            "type": "object",
            "properties": {
                "labor": {
                    "type": "array",
                    "items":{
                        "type": "object",
                        "properties":{
                            "Crew Code": {"type": "object"},
                            "hours":{
                                "type": "object",
                                "properties":{
                                    "st": { "type": "integer" },
                                    "ot": { "type": "integer" },
                                    "dt": { "type": "integer" }
                                }
                            }
                        }
                    }
                },
                "Length": {"type": "number"}
            }
        }

        const linear_tracking_ui_schema = {
            "fields": {
                "labor": {
                    "item":{
                        "fields":{
                            "Crew Code": {"ui:component": "costcode-selector"}
                        }
                    }
                }
            }
        }

        const permissions = {
            "editable": true,
            "viewable": true,
            "properties": {
                "labor": {
                    "items":{
                        "properties":{
                            "hours":{
                                "properties":{
                                    "st": { "editable": false, "viewable": false }
                                }
                            }
                        }
                    }
                }
            }
        }

        const linear_tracking_ui_schema_output = {
            "editable": true,
            "viewable": true,
            "fields": {
                "labor": {
                    "editable": true,
                    "viewable": true,
                    "item":{
                        "editable": true,
                        "viewable": true,
                        "fields":{
                            "Crew Code": {"ui:component": "costcode-selector", "editable": true, "viewable": true},
                            "hours":{
                                "editable": true,
                                "viewable": true,
                                "fields": {
                                    "st": { "viewable": false, "editable": false},
                                    "ot": { "viewable": true, "editable": true},
                                    "dt": { "viewable": true, "editable": true}
                                }
                            }
                        }
                    }
                },
                "Length": {"editable": true, "viewable": true},
            }
        }

        const new_ui_schema = getFormOptions(linear_tracking_schema, linear_tracking_ui_schema, permissions)
        assert.deepEqual(new_ui_schema, linear_tracking_ui_schema_output)
    })

    it('type: arrays; all false check', function () {
        const linear_tracking_schema = {
            "type": "object",
            "properties": {
                "labor": {
                    "type": "array",
                    "items":{
                        "type": "object",
                        "properties": {
                            "Crew Code": {"type": "object"},
                            "hours":{
                                "type": "object",
                                "properties":{
                                    "st": { "type": "integer" },
                                    "ot": { "type": "integer" },
                                    "dt": { "type": "integer" }
                                }
                            }
                        }
                    }
                },
                "Length": {"type": "number"}
            }
        }

        const linear_tracking_ui_schema = {
            "fields": {
                "labor": {
                    "item":{
                        "fields":{
                            "Crew Code": {"ui:component": "costcode-selector"}
                        }
                    }
                }
            }
        }

        const permissions = {
            "editable": false,
            "viewable": false,
            "properties": {
                "Length": { "editable": true, "viewable": true },
                "labor": {
                    "items":{
                        "properties":{
                            "hours":{
                                "properties":{
                                    "st": { "editable": true, "viewable": true }
                                }
                            }
                        }
                    }
                }
            }
        }

        const linear_tracking_ui_schema_output = {
            "editable": false,
            "viewable": false,
            "fields": {
                "labor": {
                    "editable": false,
                    "viewable": false,
                    "item":{
                        "editable": false,
                        "viewable": false,
                        "fields": {
                            "Crew Code": {"ui:component": "costcode-selector", "editable": false, "viewable": false},
                            "hours":{
                                "editable": false,
                                "viewable": false,
                                "fields": {
                                    "st": { "viewable": false, "editable": false},
                                    "ot": { "viewable": false, "editable": false},
                                    "dt": { "viewable": false, "editable": false}
                                }
                            }
                        }
                    }
                },
                "Length": {"editable": false, "viewable": false},
            }
        }

        const new_ui_schema = getFormOptions(linear_tracking_schema, linear_tracking_ui_schema, permissions)
        assert.deepEqual(new_ui_schema, linear_tracking_ui_schema_output)
    })


    it('type: arrays; top level true along with "Length"; array and everything within is false', function () {
        const linear_tracking_schema = {
            "type": "object",
            "properties": {
                "labor": {
                    "type": "array",
                    "items":{
                        "type": "object",
                        "properties": {
                            "Crew Code": {"type": "object"},
                            "hours":{
                                "type": "object",
                                "properties":{
                                    "st": { "type": "integer" },
                                    "ot": { "type": "integer" },
                                    "dt": { "type": "integer" }
                                }
                            }
                        }
                    }
                },
                "Length": {"type": "number"}
            }
        }

        const linear_tracking_ui_schema = {
            "fields": {
                "labor": {
                    "item":{
                        "fields":{
                            "Crew Code": {"ui:component": "costcode-selector"}
                        }
                    }
                }
            }
        }

        const permissions = {
            "editable": true,
            "viewable": true,
            "properties": {
                "labor": {
                    "editable": false,
                    "viewable": false,
                }
            }
        }

        const linear_tracking_ui_schema_output = {
            "editable": true,
            "viewable": true,
            "fields": {
                "labor": {
                    "editable": false,
                    "viewable": false,
                    "item":{
                        "editable": false,
                        "viewable": false,
                        "fields": {
                            "Crew Code": {"ui:component": "costcode-selector", "editable": false, "viewable": false},
                            "hours":{
                                "editable": false,
                                "viewable": false,
                                "fields": {
                                    "st": { "viewable": false, "editable": false},
                                    "ot": { "viewable": false, "editable": false},
                                    "dt": { "viewable": false, "editable": false}
                                }
                            }
                        }
                    }
                },
                "Length": {"editable": true, "viewable": true},
            }
        }

        const new_ui_schema = getFormOptions(linear_tracking_schema, linear_tracking_ui_schema, permissions)
        assert.deepEqual(new_ui_schema, linear_tracking_ui_schema_output)
    })
})

describe('utils', function () {
    it('isNumeric allows integers', function () {
var rmbxUtil = require('../src/util')
        assert.equal(true, rmbxUtil.isInteger(1))
        assert.equal(true, rmbxUtil.isInteger("1"))
        assert.equal(false, rmbxUtil.isInteger(" "))
    })

    it('isNumeric allows floats', function () {
        assert.equal(true, rmbxUtil.isNumber(1))
        assert.equal(true, rmbxUtil.isNumber(1.1))
        assert.equal(true, rmbxUtil.isNumber("1.1"))
        assert.equal(false, rmbxUtil.isNumber(" "))
    })
})

//Test for no "fields" property within array