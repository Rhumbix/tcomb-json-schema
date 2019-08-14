const assert = require('assert');

import { Listener } from '../index'

describe('listeners', () => {
    describe('should run this test', () => {
        const schema = {
            "description": "",
            "type": "object",
            "properties": {
                "Date Completed": {
                    "type": "string"
                },
                "Crew Code":{
                    "type": "object"
                },
                "End Station": {
                    "type": "integer"
                },
                "Start Station": {
                    "type": "integer"
                },
                "Length": {
                    "type": "number"
                },
                "Note": {
                    "type": "string"
                }
            },
            "required": ["Crew Code","Date Completed","Start Station","End Station"]
        }

        const ui_schema = {
            "listener":{
                "trigger": "onChange",
                "function": "eval",
                "eval":"value[\"Start Station\"]&&value[\"End Station\"]&&(Math.abs(value[\"Start Station\"]-value[\"End Station\"]))",
                "output_key": "/Length"
            },
            "fields": {
                "Date Completed": {
                  "ui:component": "date"
                },
                "Crew Code":{
                  "ui:component": "costcode-selector"
                },
                "End Station": {
                  "ui:component": "masked-length"
                },
                "Start Station": {
                  "ui:component": "masked-length"
                },
                "Length":{
                    "ui:component": "display"
                },
                "Note":{
                  "ui:component": "textarea"
                }
            },
            "order": ["Date Completed","Crew Code","Start Station","End Station", "Length", "Note"],
            "mobile_layout":{
                "list_item":{
                    "primary": {
                        "key": "",
                        "template": "<%= (value['Start Station'] ? value['Start Station'].toString().slice(0,-2) + '+' + value['Start Station'].toString().slice(-2) : '') + ' - ' + (value['End Station'] ? value['End Station'].toString().slice(0,-2) + '+' + value['End Station'].toString().slice(-2) : '') %>"
                      },
                    "secondary": {
                        "key": "/Note"
                    },
                    "tertiary": {
                        "key": "/Date Completed",
                        "template": "<%= formatDate(value) %>"
                    }
                }
            }
        }

        it("retrieves listeners from ui_schema and correctly assigns onChange key path", function(){
            const listener = new Listener(schema, ui_schema, null)
            assert.equal(listener.listeners[""][0], ui_schema.listener)
        })

        it("update calls getComponent and updates the component's state", function(){
            const listener = new Listener(schema, ui_schema, null)
            const store = {"End Station": 500,
                           "Start Station": 200}
            const path = "/Start Station"

            function MockComponent(type){
                this.state = {};
                this.onChange = function(value){
                    this.state["value"] = value
                };
            }
            var mockedComponent = new MockComponent()
            const formRef = {
                getComponent: ()=> mockedComponent
            }

            listener.formRef = formRef
            listener.update(store, path)
            assert.equal(mockedComponent.state.value, 300)
        })
    })
})