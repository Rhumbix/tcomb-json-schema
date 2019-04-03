'use strict';

var t = require('tcomb');
var fcomb = require('fcomb');
var util = require('./util');

var SchemaType = t.enums.of('null string number integer boolean object array', 'SchemaType');

function and(f, g) {
    return f ? fcomb.and(f, g) : g;
}

var types = {

    string: function (s) {
    if (s.hasOwnProperty('enum')) {
      // Special case where we pass in 'enum' as a custom component
      // to override the base enum
      if (registerComponents.hasOwnProperty('enum')){
        return registerComponents['enum'](s['enum'])
      }
      else{
        if (t.Array.is(s['enum'])) {
          return t.enums.of(s['enum']);
        } else {
          return t.enums(s['enum']);
        }
      }
    }
    var predicate;
    if (s.hasOwnProperty('minLength')) {
        predicate = and(predicate, fcomb.minLength(s.minLength));
    }
    if (s.hasOwnProperty('maxLength')) {
        predicate = and(predicate, fcomb.maxLength(s.maxLength));
    }
    if (s.hasOwnProperty('pattern')) {
        var patternMatch = /^\/(.+)\/([gimuy]*)$/.exec(s.pattern);
        if (patternMatch === null) {
        predicate = and(predicate, fcomb.regexp(new RegExp(s.pattern)));
        } else {
        predicate = and(predicate, fcomb.regexp(new RegExp(patternMatch[1], patternMatch[2])));
        }
    }
    if (s.hasOwnProperty('format')) {
        t.assert(formats.hasOwnProperty(s.format), '[tcomb-json-schema] Missing format ' + s.format + ', use the (format, predicate) API');
        predicate = and(predicate, formats[s.format]);
    }
    // Use custom string type if it exists
    if(registerTypes.hasOwnProperty('string')){
      return predicate ? t.subtype(registerTypes['string'], predicate) : registerTypes['string'];
    }else{
        return predicate ? t.subtype(t.String, predicate) : t.String;
    }
    },

    number: function (s) {
    var predicate;
    if (s.hasOwnProperty('minimum')) {
        predicate = s.exclusiveMinimum ?
        and(predicate, fcomb.gt(s.minimum)) :
        and(predicate, fcomb.gte(s.minimum));
    }
    if (s.hasOwnProperty('maximum')) {
        predicate = s.exclusiveMaximum ?
        and(predicate, fcomb.lt(s.maximum)) :
        and(predicate, fcomb.lte(s.maximum));
    }
    if (s.hasOwnProperty('integer') && s.integer) {
        predicate = and(predicate, util.isInteger);
    }
    return predicate ? t.subtype(t.Number, predicate) : t.Number;
    },

    integer: function (s) {
    var predicate;
    if (s.hasOwnProperty('minimum')) {
        predicate = s.exclusiveMinimum ?
        and(predicate, fcomb.gt(s.minimum)) :
        and(predicate, fcomb.gte(s.minimum));
    }
    if (s.hasOwnProperty('maximum')) {
        predicate = s.exclusiveMaximum ?
        and(predicate, fcomb.lt(s.maximum)) :
        and(predicate, fcomb.lte(s.maximum));
    }
    return predicate ? t.subtype(util.Int, predicate) : util.Int;
    },

    boolean: function () {
    return t.Boolean;
    },

    object: function (s, ui) {
    var props = {};
    var hasProperties = false;
    var required = {};
    if (s.required) {
        s.required.forEach(function (k) {
        required[k] = true;
        });
    }
    for (var k in s.properties) {
        if (s.properties.hasOwnProperty(k)) {
        hasProperties = true;
        var type = transform(s.properties[k], ui.fields && ui.fields.hasOwnProperty(k) ? ui.fields[k] : {});
        props[k] = required[k] || type === t.Boolean ? type : t.maybe(type);
        }
    }
    return hasProperties ? t.struct(props, s.description) : t.Object;
    },

    customStruct: function (s, ui) {
    var props = {};
    var hasProperties = false;
    var required = {};
    if (s.required) {
        s.required.forEach(function (k) {
        required[k] = true;
        });
    }
    for (var k in s.properties) {
        if (s.properties.hasOwnProperty(k)) {
        hasProperties = true;
        var type = transform(s.properties[k], ui.fields && ui.fields.hasOwnProperty(k) ? ui.fields[k] : {});
        props[k] = required[k] || type === t.Boolean ? type : t.maybe(type);
        }
    }
    return hasProperties ? registerComponents['selector'](props, s.description) : t.Object;
    },

    array: function (s, ui) {
    var type = t.Array;
    if (s.hasOwnProperty('items')) {
        var items = s.items;
        if (t.Object.is(items)) {
        type = t.list(transform(s.items, ui.item));
        } else {
        return t.tuple(items.map(transform)); // todo: need to bind ui as second arg? we aren't using tuples atm
        }
    }
    var predicate;
    if (s.hasOwnProperty('minItems')) {
        predicate = and(predicate, fcomb.minLength(s.minItems));
    }
    if (s.hasOwnProperty('maxItems')) {
        predicate = and(predicate, fcomb.maxLength(s.maxItems));
    }
    return predicate ? t.subtype(type, predicate) : type;
    },

    customArray: function (s, ui) {
    var type = registerComponents['table'] //t.Array;
    if (s.hasOwnProperty('items')) {
        var items = s.items;
        if (t.Object.is(items)) {
        type = registerComponents['table'](transform(s.items, ui.item));
        } else {
        return t.tuple(items.map(transform)); // todo: need to bind ui as second arg? we aren't using tuples atm
        }
    }
    var predicate;
    if (s.hasOwnProperty('minItems')) {
        predicate = and(predicate, fcomb.minLength(s.minItems));
    }
    if (s.hasOwnProperty('maxItems')) {
        predicate = and(predicate, fcomb.maxLength(s.maxItems));
    }
    return predicate ? t.subtype(type, predicate) : type;
    },

    'null': function () {
    return util.Null;
    }

};

var registerTypes = {};
var registerComponents = {};

function transform(s, ui) {
    ui = ui || {}
    t.assert(t.Object.is(s));
    // Checking for ui:component within s as opposed to just ui, is kept for backwards compatability.
    if(ui.hasOwnProperty('ui:component') || s.hasOwnProperty('ui:component')){
    var uiType = ui.hasOwnProperty('ui:component') ? ui['ui:component'] : s['ui:component']
    if(registerComponents.hasOwnProperty(uiType)){
        if(uiType === 'table'){
        return types['customArray'](s, ui);
        }
        else if(uiType === 'selector'){
        return types['customStruct'](s, ui);
        }
        return registerComponents[uiType];
    }
    }
    if (!s.hasOwnProperty('type')) {
    return t.Any;
    }
    var type = s.type;
    if (SchemaType.is(type)) {
    return types[type](s, ui);
    }
    if (t.Array.is(type)) {
    return t.union(type.map(function (type) {
        return types[type](s, ui);
    }));
    }

    if (registerTypes.hasOwnProperty(type)) {
    return registerTypes[type];
    }

    t.fail('[tcomb-json-schema] Unsupported json schema ' + t.stringify(s));
}

var formats = {};

transform.registerFormat = function registerFormat(format, predicate) {
    t.assert(!formats.hasOwnProperty(format), '[tcomb-json-schema] Duplicated format ' + format);
    formats[format] = predicate;
};

transform.resetFormats = function resetFormats() {
    formats = {};
};

transform.registerType = function registerType(typeName, type) {
    t.assert(!registerTypes.hasOwnProperty(typeName), '[tcomb-json-schema] Duplicated type ' + typeName);
    registerTypes[typeName] = type;
};

transform.registerComponent = function registerComponent(componentName, type) {
    registerComponents[componentName] = type;
};

transform.resetTypes = function resetTypes() {
    registerTypes = {};
};

// Each component in Tcomb is encapsulated and knows nothing about its parent or children, rightfully so.
// This means we can't and shouldn't dig through to parent Structs to find permissions but rather set every
// permission for every component here. If there is just a single 'editable/viewable: true' at the top level object,
// this goes through each field and duplicates those permissions to each.

// If a struct is set to false for either permission no child can override that even if the permission
// definition does. So a top level editable: false makes the whole document uneditable even if a single
// field is set to editable: true.
function getFormOptions(schema, ui_schema = {}, permissions = {}, objViewable = false, objEditable = false){
    if(schema.type == "object"){
        objViewable = permissions.viewable || objViewable
        objEditable = permissions.editable || objEditable
        if(!schema.properties){
            return Object.assign({}, {...ui_schema, viewable: objViewable, editable: objEditable})
        }
        return Object.assign(
            {},
            ui_schema,
            {fields: Object.keys(schema.properties).reduce(
                (map, propertyKey) => {
                    const permission = permissions.properties ? permissions.properties[propertyKey] || {} : {}
                    map[propertyKey] = {
                        ...getFormOptions(schema.properties[propertyKey],
                                          ui_schema.fields ? ui_schema.fields[propertyKey] : {},
                                          permission,
                                          objViewable,
                                          objEditable)
                    }
            return map
        }, {})
    })
  }

  let viewable = objViewable === false ? false : ('viewable' in permissions ? permissions.viewable : true)
  let editable = objEditable === false ? false : ('editable' in permissions ? permissions.editable : true)
  return Object.assign({}, {...ui_schema, editable: editable, viewable: viewable})
}

module.exports = {
  transform,
  getFormOptions
}