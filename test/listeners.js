const assert = require('assert');

import { Listener } from '../index'

describe('listeners', function() {
    var mockedComponentSpy = []
    function MockComponent(type){
        this.state = {};
        this.onChange = function(value){
            mockedComponentSpy.push(value)
            this.state["value"] = value
        };
    }
    var mockedComponent = new MockComponent()
    const formRef = {
        getComponent: ()=> mockedComponent
    }

    afterEach(function(){
        mockedComponent.state = {}
        mockedComponentSpy = []
    })

    describe('eval', function() {
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
            const store = {
                "End Station": 500,
                "Start Station": 200
            }
            const path = ["Start Station"]

            listener.formRef = formRef
            listener.update(store, path)
            assert.equal(mockedComponent.state.value, 300)
        })
    })

    describe('multiple listeners', function(){
        const schema = {
            "type": "object",
            "properties": {
                "Subcontractor Use": {
                    "required": [
                        "Project Name",
                        "Tag Created On",
                        "Work Performed On",
                        "Description of Work",
                        "Location"
                    ],
                    "type": "object",
                        "properties": {
                            "Status": {
                                "enum": [
                                    "Haven't Started",
                                    "In Progress",
                                    "Complete"
                                ],
                                "type": "string"
                            },
                            "Description of Work": {
                                "type": "string"
                            },
                            "Project Name": {
                                "type": "string"
                            },
                            "labor hours total": {
                                "type": "number"
                            },
                            "Total ST hours": {
                                "type": "number"
                            },
                            "Total OT hours": {
                                "type": "number"
                            },
                            "Total DT hours": {
                                "type": "number"
                            },
                            "labor": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                    "note": {
                                        "type": "string"
                                    },
                                    "hours": {
                                        "type": "object",
                                        "properties": {
                                            "dt": {
                                                "type": "number"
                                            },
                                            "ot": {
                                                "type": "number"
                                            },
                                            "st": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "external subcontractor": {
                                        "type": "boolean"
                                    },
                                    "employee": {
                                        "type": "object",
                                        "properties": {
                                            "first_name": {
                                                "type": "string"
                                            },
                                            "last_name": {
                                                "type": "string"
                                            },
                                            "user_id": {
                                                "type": "integer"
                                            },
                                            "company_supplied_id": {
                                                "type": "string"
                                            },
                                            "classification": {
                                                "type": "string"
                                            },
                                            "is_active": {
                                                "type": "boolean"
                                            },
                                            "company": {
                                                "type": "integer"
                                            },
                                            "fullsize": {
                                                "type": "string"
                                            },
                                            "thumbnail": {
                                                "type": "string"
                                            },
                                            "trade": {
                                                "type": "string"
                                            },
                                            "phone": {
                                                "type": "string"
                                            },
                                            "email": {
                                                "type": "string"
                                            },
                                            "user_role": {
                                                "type": "string"
                                            },
                                            "id": {
                                                "type": "integer"
                                            },
                                            "employee_id": {
                                                "type": "integer"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "Comment": {
                            "type": "object",
                            "properties": {
                                "comment": {
                                    "type": "string"
                                },
                                "commenter": {
                                    "type": "string"
                                },
                                "date": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            },
            "description": "custom work order"
        }

        const ui_schema =
            {
                "mobile_layout": {
                    "list_item": {
                        "primary": {
                            "key": "/Subcontractor Use/Project Name"
                        },
                        "secondary": {
                            "key": "/Subcontractor Use/Description of Work"
                        },
                        "tertiary": {
                            "key": "/Subcontractor Use/Tag Created On",
                            "template": "<%= formatDate(value) %>"
                        },
                        "quaternary": {
                            "key": "/Subcontractor Use/labor hours total",
                            "template": "<%= value && value + ' hours' %>"
                        }
                    }
                },
                "fields": {
                    "Subcontractor Use": {
                        "fields": {
                            "Description of Work": {
                                "ui:component": "textarea"
                            },
                            "labor hours total": {
                                "hidden": "true"
                            },
                            "Total ST hours": {
                                "hidden": "true"
                            },
                            "Total OT hours": {
                                "hidden": "true"
                            },
                            "Total DT hours": {
                                "hidden": "true"
                            },
                            "labor": {
                                "ui:component": "table",
                                "logic:listener": [
                                    {
                                        "trigger": "onChange",
                                        "function": "list_adder",
                                        "output_key": "/Subcontractor Use/labor hours total"
                                    },
                                    {
                                        "trigger": "onChange",
                                        "function": "sub_list_adder",
                                        "sub_list_path": "/hours/st",
                                        "output_key": "/Subcontractor Use/Total ST hours"
                                    },
                                    {
                                        "trigger": "onChange",
                                        "function": "sub_list_adder",
                                        "sub_list_path": "/hours/ot",
                                        "output_key": "/Subcontractor Use/Total OT hours"
                                    },
                                    {
                                        "trigger": "onChange",
                                        "function": "sub_list_adder",
                                        "sub_list_path": "/hours/dt",
                                        "output_key": "/Subcontractor Use/Total DT hours"
                                    }
                                ],
                                "ui:multi-select": "employee",
                                "ui:summary_view": {
                                    "primary": [
                                        "/employee/last_name",
                                        "/employee/first_name"
                                    ],
                                    "secondary": [
                                        "/employee/classification",
                                        "/employee/trade"
                                    ],
                                    "tertiary": [
                                        "/hours/st",
                                        "/hours/ot",
                                        "/hours/dt"
                                    ],
                                    "icon": "labor"
                                },
                                "item": {
                                    "fields": {
                                        "hours": {
                                            "order": [
                                                "st",
                                                "ot",
                                                "dt"
                                            ]
                                        },
                                        "employee": {
                                            "ui:component": "employee-selector",
                                            "order": [
                                                "first_name",
                                                "last_name",
                                                "classification",
                                                "company",
                                                "company_supplied_id",
                                                "email",
                                                "employee_id",
                                                "fullsize",
                                                "id",
                                                "is_active",
                                                "phone",
                                                "thumbnail",
                                                "trade",
                                                "user_id",
                                                "user_role"
                                            ]
                                        },
                                        "note": {
                                            "ui:component": "textarea"
                                        }
                                    },
                                    "order": [
                                        "employee",
                                        "external subcontractor",
                                        "note",
                                        "hours"
                                    ]
                                }
                            },
                            "Work Performed On": {
                                "ui:component": "date"
                            },
                            "Tag Created On": {
                                "ui:component": "date",
                                "editable": false
                            },
                            "Project Name": {
                                "ui:component": "auto-fill: Project Name"
                            },
                            "Comment": {
                                "hidden": "true",
                                "ui:component": "comment"
                            },
                            "Labor comment": {
                                "hidden": "true",
                                "ui:component": "comment"
                            },
                            "Equipment comment": {
                                "hidden": "true",
                                "ui:component": "comment"
                            },
                            "Material comment": {
                                "hidden": "true",
                                "ui:component": "comment"
                            }
                        },
                        "order": [
                            "Tag Created On",
                            "Work Performed On",
                            "Project Name",
                            "Location",
                            "Status",
                            "Description of Work",
                            "Photos",
                            "Comment",
                            "labor",
                            "labor hours total",
                            "Total ST hours",
                            "Total OT hours",
                            "Total DT hours"
                        ]
                    }
                }
            }

            const store = {
                "Subcontractor Use":{
                    "Description of Work": "laid some cement, etc.",
                    "labor": [
                        {
                            "hours":{
                                "st":5,
                                "ot":null,
                                "dt":null
                            },
                            "employee":{
                                "first_name": "joe",
                                "last_name": "shmoe",
                                "classification": "electrician"
                            },
                            "note": null
                        },
                        {
                            "hours":{
                                "st":5,
                                "ot":2,
                                "dt":null
                            },
                            "employee":{
                                "first_name": "joe",
                                "last_name": "shmoe",
                                "classification": "electrician"
                            },
                            "note": null
                        }
                    ]
                }
            }
        it("fire correctly", function(){
            const listener = new Listener(schema, ui_schema)
            const path = ["Subcontractor Use","labor",1,"hours","st"]

            listener.formRef = formRef
            listener.update(store, path)

            // onChange gets called 3 times
            assert.equal(mockedComponentSpy.length, 3)
        })
    })
})