const _ = require('lodash')
const jsonpointer = require('jsonpointer')

class Listener{
    constructor(schema, ui_schema, formRef){
        this.schema = Object.assign({}, schema)
        this.ui_schema = Object.assign({}, ui_schema)
        this.formRef = formRef
        this.listeners = this._getListeners()
    }

    _getListeners() {
        let acc = {}
        this._getListenersFromUISchema(this.ui_schema, '', acc)
        return acc
    }

    _getListenersFromUISchema(ui_schema, path, acc) {
        const listeners = ui_schema["listener"] || ui_schema["logic:listener"]
        if(listeners){
            acc[path] = []
            if (_.isArray(listeners)) {
                acc[path] = acc[path].concat(listeners)
            }
            else{
                acc[path].push(listeners)
            }
        }

        if(ui_schema["fields"]) {
            _.each(ui_schema["fields"], function (value, key) {
                this._getListenersFromUISchema(value, path + '/' + key, acc)
            }.bind(this))
        }
    }

    // Value is the entire store
    // Path is a json pointer to what changed
    update(value, path) {
        let form = Object.assign({}, value)
        // Remove integers from path which are array element pointers and
        // unncessary for the path listeners.
        let jsonPointerPath =
            _.reduce(path,
                function (acc, piece) {
                    return _.isString(piece) ? `${acc}/${piece}` : acc;
                },
                '')
        _.each(this.listeners, (listenerInfo, key) => {
            // We want to check for the current key, but also any parents that are listening
            if (_.startsWith(jsonPointerPath, key)) {
                const formSubSection = jsonpointer.get(form, key)
                const {schema, ui_schema} = this._getSchemaAtPath(key)
                _.each(listenerInfo, (val) => this._fireListenerLogicAndSetState(val, formSubSection, schema, ui_schema))
            }
        })
    }

    updateAll(value) {
        let form = Object.assign({}, value)
        _.each(this.listeners, (listenerInfo, key) => {
            const formSubSection = jsonpointer.get(form, key)
            const {schema, ui_schema} = this._getSchemaAtPath(key)
            _.each(listenerInfo, (val) => this._fireListenerLogicAndSetState(val, formSubSection, schema, ui_schema))
        })
    }

    _fireListenerLogicAndSetState = (val, storeSubSection, schema, ui_schema) => {
        let output = null
        if(val["function"] == "list_adder") {
            output = this.listNumberAdder(storeSubSection, schema, ui_schema)
        } else if(val["function"] == "sub_list_adder") {
            const subListPath = val["sub_list_path"]
            output = this.subListNumberAdder(storeSubSection, subListPath)
        } else if(val["function"] == "eval") {
            output = this.evalForm(storeSubSection, val["eval"])
        }
        this._updateComponentStateInsideForm(val.output_key, output)
    }

    _updateComponentStateInsideForm = (outputKey, output) => {
        var path = outputKey.replace(/\//g, '.').substr(1)
        const component = this.formRef.getComponent(path)
        if (output && (output != component.state.value)) {
            component.onChange(output)
        }
    }

    _getSchemaAtPath(path) {
        let newPath = path.split("/")
        let schema = Object.assign({}, this.schema)
        let ui_schema = Object.assign({}, this.ui_schema)
        // Pop off the first "" which indicates the entire document
        let pathPiece = newPath.shift()
        while (newPath.length > 0) {
            pathPiece = newPath.shift()
            if (schema.type == "array") {
                schema = schema["items"]["properties"][pathPiece]
                ui_schema = ui_schema["item"]["fields"][pathPiece]
            }
            else if (schema.type == "object") {
                schema = schema["properties"][pathPiece]
                ui_schema = ui_schema["fields"][pathPiece]
            }
            else {
                schema = schema[pathPiece]
                ui_schema = ui_schema[pathPiece]
            }
        }
        return { schema: schema, ui_schema: ui_schema }
    }

    // Logic functions run by listeners
    evalForm(value, func) {
        if(!value) return null
        let output = eval(func)
        return !_.isNil(output) && output.toString()
    }

    listNumberAdder = (val, schema, ui) => {
        if (!val) { return 0 }
        var func = function (acc, val, schema, ui) {
            if (!schema) { return acc }
            if (schema.type == "integer" || schema.type == "number") { // not object
                const number = _.toNumber(val)
                return _.isFinite(number) ? acc + number : acc
            }
            // This might not be great doing explicit negative checks in the long run with more components.
            // May want to add an explicit tag to a component for an adder?
            else if (schema.type == "object" && !(ui["ui:component"])) {
                return acc + _.reduce(val, function (innerAcc, subVal, subKey) {
                    return func(innerAcc, subVal, schema.properties[subKey], ui[subKey])
                }, 0)
            }
            else if (schema.type == "array") {
                return acc + _.reduce(val, (innerAcc, subVal, subKey) => {
                    return func(innerAcc, subVal, schema.items, ui.item.fields)
                }, 0)
            }
            else {
                return acc
            }
        }
        return func(0, val, schema, ui).toString()
    }

    subListNumberAdder = (values, subListPath) => {
        let totalHours = 0
        _.each(values, function(val) {
            const subVal = jsonpointer.get(val, subListPath)
            if (subVal) {totalHours += _.toNumber(subVal)}
        })
        return totalHours
    }
}

module.exports = {
    Listener
}