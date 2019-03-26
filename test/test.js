"use strict";
var assert = require('assert');
var t = require('tcomb');
var { transform, getFormOptions } = require('../index');
var util = require('../util');

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

    it('should throw if a reserved type is register', function () {
      assert.throws(
        function () {
          transform.registerType('string', Str10);
        },
        function(err) {
          if ( (err instanceof Error) && err.message === '[tcomb] [tcomb-json-schema] Reserved type string') {
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

const recursivelyIterateProperties = (jsonObject, hasFlags = []) => {
  Object.values(jsonObject).forEach((value) => {
      if (value.fields || value.properties || (value.items && value.items.properties)) {
          let prop
          if (value.fields) {
              prop = value.fields
          } else {
              prop = value.items && value.items.properties ? value.items.properties : value.properties
          }
          return recursivelyIterateProperties(prop, hasFlags)
      } else {
          hasFlags.push((value.editable === true || value.editable === false) && (value.viewable === true || value.viewable == false))
      }
  })
  return hasFlags
}

// Check if all fields and subfields have viewable and editable flags set
const checkFlags = (object) => {
  const hasFlags = recursivelyIterateProperties(object)
  return hasFlags.every((flag) => flag === true)
}

const permissions = {
  "editable": true,
  "viewable": true,
  "Subcontractor Use": {
      "Lower Tier Sub": {"editable": false},
      "Description of Work": {"editable": false},
      "Equipment": {"editable": false},
      "Project Name": {"editable": false},
      "Material": {"editable": false},
      "Subcontractor's Job #": {"editable": false},
      "labor": {"editable": false},
      "subcontractor's signature": {"editable": false},
      "Location": {"editable": false},
      "Work Performed On": {"editable": false},
      "Tag Created On": {"editable": false}
  }
}

const fields = {
  "Subcontractor Use":{
    "fields": {
      "Comment": {"hidden": true, "ui:component": "comment", "date": {}, "comment": {}, "commenter": {}},
      "Description of Work": {"ui:component": "textarea"},
      "Equipment": {"item": {}, "ui:component": "table", "ui:custom-table": {}, "ui:multi-select": "equipment", "ui:summary_view": {}},
      "Equipment comment": {"hidden": "true", "ui:component": "comment", "date": {}, "comment": {}, "commenter": {}},
      "GC's Reference #": {"editable": true},
      "Labor comment": {"hidden": "true", "ui:component": "comment", "date": {}, "comment": {}, "commenter": {}},
      "Lower Tier Sub": {"item": {}, "ui:component": "table", "ui:summary_view": {}, "note": {}, "material": {}},
      "Material comment": {"hidden": "true", "ui:component": "comment", "date": {}, "comment": {}, "commenter": {}},
      "Tag Created On": {"editable": true, "ui:component": "date"},
      "Work Performed On": {"ui:component": "date"},
      "labor": {"item": {}, "ui:component": "table", "ui:custom-table": {}, "ui:multi-select": "employee", "ui:summary_view": {}},
      "subcontractor's signature": {"order": [], "ui:component": "signature-advanced", "date": {}, "name": {}, "signature": {}}
    },
    "order": ["Tag Created On",
        "Work Performed On",
        "Project Name",
        "Location",
        "GC's Reference #",
        "Subcontractor's Job #",
        "Owners/Rep #",
        "Status",
        "Description of Work",
        "Photos",
        "Comment",
        "labor",
        "Labor comment",
        "Equipment",
        "Equipment comment",
        "Material",
        "Material comment",
        "Lower Tier Sub",
        "Additional Notes",
        "subcontractor's signature"]
}}

describe('Test function getFormOptions', () => {
  it('Test with a nested object', () => {
    const properties = {
      "properties": {
        "Subcontractor Use": {
          "properties": {
            "Additional Notes": {"type": "string"},
            "Comment": {"type": "object", "properties": {
              "comment": {"type": "string"},
              "commenter": {"type": "string"},
              "date": {"type": "string"}
            }},
            "Description of Work": {"type": "string"},
            "Equipment": {"type": "array", "items": {
              "properties": {
                "equipment": {"type": "object", "properties": {
                  "caltrans_id": {"type": "string"},
                  "category": {"type": "string"},
                  "description": {"type": "string"},
                  "equipment_id": {"type": "string"},
                  "id": {"type": "integer"},
                  "idle_time_price": {"type": "integer"},
                  "over_time_price": {"type": "integer"},
                  "running_time_price": {"type": "integer"},
                  "status": {"type": "string"}
                }},
                "hours": {"type": "object"},
                "note": {"type": "string"},
                "quantity": {"type": "number"}
              }
            }},
            "Equipment comment": {"type": "object"},
            "GC's Reference #": {"type": "string"},
            "Labor comment": {"type": "object"},
            "Location": {"type": "string"},
            "Lower Tier Sub": {"type": "array"},
            "Material": {"type": "array"},
            "Material comment": {"type": "object"},
            "Owners/Rep #": {"type": "string"},
            "Project Name": {"type": "string"},
            "Status": {"type": "string"},
            "Subcontractor's Job #": {"type": "string"},
            "Tag Created On": {"type": "string"},
            "Work Performed On": {"type": "string"},
            "labor": {
              "type": "array",
              "require": ["employee"],
              "items": {
                "type": "object",
                "properties": {
                  "note": {"type": "string"},
                  "hours": {"type": "object", "properties": {"dt": {"type": "number"}, "ot": {"type": "number"}, "st": {"type": "number"}}},
                  "external subcontractor": {"type": "boolean"},
                  "employee": {
                    "type": "object",
                    "properties": {
                      "first_name": {"type": "string"},
                      "last_name": {"type": "string"},
                      "user_id": {"type": "integer"},
                      "company_supplied_id": {"type": "string"},
                      "classification": {"type": "string"},
                      "is_active": {"type": "boolean"},
                      "company": {"type": "integer"},
                      "fullsize": {"type": "string"},
                      "thumbnail": {"type": "string"},
                      "trade": {"type": "string"},
                      "phone": {"type": "string"},
                      "email": {"type": "string"},
                      "user_role": {"type": "string"},
                      "id": {"type": "integer"},
                      "employee_id": {"type": "integer"},
                    },
                  },
                },
              },
            },
          "subcontractor's signature": {"type": "object"}
          }
        }
      }
    }
    const object = getFormOptions(properties, fields, permissions)
    ok(checkFlags(object) === true)
    ok(Object.keys(object).length > 0)
  });

  it('Test with a small object', () => {
    const properties = {
      "properties": {
        "Hours": {
          "type": "object",
          "properties": {
            "st": {
              "type": "number"
            },
            "overtime hours": {
              "type": "object",
              "properties": {
                "ot": {
                  "type": "number"
                },
                "pot": {
                  "type": "number"
                }
              }
            }
          }
        }
      }
    }
    const object = getFormOptions(properties, fields, permissions)
    ok(checkFlags(object) === true)
    ok(Object.keys(object).length > 0)
  })
})