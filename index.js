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

function addPermissions(permissions, key, type) {
  return permissions[key] && permissions[key][type] !== undefined ? permissions[key][type] : permissions[type]
}

function getFormOptions(properties, fieldsData = {}, permissions, newOptions = {}, first = false) {
  Object.entries(properties).forEach((data) => {
      const [key, value] = data
      if (first) {
          newOptions[key] = {
              fields: [],
              order: fieldsData[key] ? fieldsData[key].order : []
          }
      } else {
          // If field doesn't exist, create it
          if (!fieldsData[key]) {
              fieldsData[key] = {}
          }
          if (!fieldsData[key]["ui:component"] || fieldsData[key]["ui:component"].includes('auto-fill')) {
              fieldsData[key]["ui:component"] = 'string'
          }
          newOptions[key] = {
              ...fieldsData[key]
          }
      }
      // Add permissions
      newOptions[key] = {
          ...newOptions[key],
          editable: addPermissions(permissions, key, 'editable'),
          viewable: addPermissions(permissions, key, 'viewable')
      }
      if (value.properties || (value.items && value.items.properties)) {
          const prop = value.items && value.items.properties ? value.items.properties : value.properties
          const opt = newOptions[key].fields ? newOptions[key].fields : newOptions[key]
          let fields = {}
          if (fieldsData[key]) {
              fields = fieldsData[key].fields ? fieldsData[key].fields : fieldsData[key]
          }
          const newPermissions = {
              ...permissions[key],
              editable: addPermissions(permissions, key, 'editable'),
              viewable: addPermissions(permissions, key, 'viewable')
          }
          return getFormOptions(prop, fields, newPermissions, opt)
      }
  })
  return newOptions
}

module.exports = {
  transform,
  getFormOptions
};
