const schemaInput = {
  "type": "object",
  "properties": {
    "Subcontractor Use": {
      "type": "object",
      "required": [
        "Project Name",
        "Tag Created On",
        "Work Performed On",
        "Description of Work",
        "Location"
      ],
      "properties": {
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
                  },
                  "pdt": {
                    "type": "number"
                  },
                  "pot": {
                    "type": "number"
                  }
                }
              },
              "employee": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "integer"
                  },
                  "email": {
                    "type": "string"
                  },
                  "phone": {
                    "type": "string"
                  },
                  "trade": {
                    "type": "string"
                  },
                  "company": {
                    "type": "integer"
                  },
                  "user_id": {
                    "type": "integer"
                  },
                  "dt_price": {
                    "type": "integer"
                  },
                  "fullsize": {
                    "type": "string"
                  },
                  "ot_price": {
                    "type": "integer"
                  },
                  "st_price": {
                    "type": "integer"
                  },
                  "is_active": {
                    "type": "boolean"
                  },
                  "last_name": {
                    "type": "string"
                  },
                  "pdt_price": {
                    "type": "integer"
                  },
                  "pot_price": {
                    "type": "integer"
                  },
                  "thumbnail": {
                    "type": "string"
                  },
                  "user_role": {
                    "type": "string"
                  },
                  "first_name": {
                    "type": "string"
                  },
                  "employee_id": {
                    "type": "integer"
                  },
                  "classification": {
                    "type": "string"
                  },
                  "company_supplied_id": {
                    "type": "string"
                  }
                }
              },
              "external subcontractor": {
                "type": "boolean"
              }
            }
          }
        },
        "Status": {
          "enum": [
            "Haven't Started",
            "In Progress",
            "Complete"
          ],
          "type": "string"
        },
        "Comment": {
          "type": "object",
          "properties": {
            "date": {
              "type": "string"
            },
            "comment": {
              "type": "string"
            },
            "commenter": {
              "type": "string"
            }
          }
        },
        "Location": {
          "type": "string"
        },
        "Material": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "note": {
                "type": "string"
              },
              "material": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "group": {
                    "type": "string"
                  },
                  "units": {
                    "type": "string"
                  },
                  "unit_price": {
                    "type": "integer"
                  },
                  "description": {
                    "type": "string"
                  },
                  "part_number": {
                    "type": "string"
                  }
                }
              },
              "quantity": {
                "type": "number"
              }
            }
          }
        },
        "Equipment": {
          "type": "array",
          "items": {
            "type": "object",
            "required": [
              "quantity"
            ],
            "properties": {
              "note": {
                "type": "string"
              },
              "hours": {
                "type": "object",
                "properties": {
                  "idle": {
                    "type": "number"
                  },
                  "over": {
                    "type": "number"
                  },
                  "running": {
                    "type": "number"
                  }
                }
              },
              "quantity": {
                "type": "number"
              },
              "equipment": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "integer"
                  },
                  "status": {
                    "type": "string"
                  },
                  "category": {
                    "type": "string"
                  },
                  "caltrans_id": {
                    "type": "string"
                  },
                  "description": {
                    "type": "string"
                  },
                  "equipment_id": {
                    "type": "string"
                  },
                  "idle_time_price": {
                    "type": "integer"
                  },
                  "over_time_price": {
                    "type": "integer"
                  },
                  "running_time_price": {
                    "type": "integer"
                  }
                }
              }
            }
          }
        },
        "Owners/Rep #": {
          "type": "string"
        },
        "Project Name": {
          "type": "string"
        },
        "Labor comment": {
          "type": "object",
          "properties": {
            "date": {
              "type": "string"
            },
            "comment": {
              "type": "string"
            },
            "commenter": {
              "type": "string"
            }
          }
        },
        "Lower Tier Sub": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "note": {
                "type": "string"
              },
              "material": {
                "type": "string"
              },
              "equipment": {
                "type": "string"
              },
              "total hours": {
                "type": "string"
              },
              "total labor": {
                "type": "string"
              },
              "company name": {
                "type": "string"
              }
            }
          }
        },
        "Tag Created On": {
          "type": "string"
        },
        "Additional Notes": {
          "type": "string"
        },
        "GC's Reference #": {
          "type": "string"
        },
        "Material comment": {
          "type": "object",
          "properties": {
            "date": {
              "type": "string"
            },
            "comment": {
              "type": "string"
            },
            "commenter": {
              "type": "string"
            }
          }
        },
        "Equipment comment": {
          "type": "object",
          "properties": {
            "date": {
              "type": "string"
            },
            "comment": {
              "type": "string"
            },
            "commenter": {
              "type": "string"
            }
          }
        },
        "Work Performed On": {
          "type": "string"
        },
        "Description of Work": {
          "type": "string"
        },
        "Subcontractor's Job #": {
          "type": "string"
        },
        "subcontractor's signature": {
          "type": "object",
          "properties": {
            "date": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "signature": {
              "type": "string"
            }
          }
        }
      }
    }
  },
  "description": "custom work order"
}

const uiSchemaInput = {
  "fields": {
    "Subcontractor Use": {
      "order": [
        "Tag Created On",
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
        "subcontractor's signature"
      ],
      "fields": {
        "labor": {
          "item": {
            "order": [
              "employee",
              "external subcontractor",
              "note",
              "hours"
            ],
            "fields": {
              "note": {
                "ui:component": "textarea"
              },
              "hours": {
                "order": [
                  "st",
                  "ot",
                  "dt",
                  "pot",
                  "pdt"
                ]
              },
              "employee": {
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
                  "user_role",
                  "st_price",
                  "ot_price",
                  "dt_price",
                  "pot_price",
                  "pdt_price"
                ],
                "fields": {
                  "dt_price": {
                    "ui:component": "currency"
                  },
                  "ot_price": {
                    "ui:component": "currency"
                  },
                  "st_price": {
                    "ui:component": "currency"
                  },
                  "pdt_price": {
                    "ui:component": "currency"
                  },
                  "pot_price": {
                    "ui:component": "currency"
                  }
                },
                "ui:component": "employee-selector",
                "ui:temporary-pricing": "premium"
              }
            }
          },
          "ui:component": "table",
          "ui:custom-table": {
            "colDefs": [
              {
                "field": "/employee",
                "headerName": "Employee"
              },
              {
                "field": "/employee/trade",
                "headerName": "Trade"
              },
              {
                "field": "/employee/classification",
                "headerName": "Classification"
              },
              {
                "field": "/hours/st",
                "aggFunc": "sum",
                "headerName": "ST"
              },
              {
                "field": "/hours/ot",
                "aggFunc": "sum",
                "headerName": "OT"
              },
              {
                "field": "/hours/dt",
                "aggFunc": "sum",
                "headerName": "DT"
              },
              {
                "field": "/hours/pot",
                "aggFunc": "sum",
                "headerName": "POT"
              },
              {
                "field": "/hours/pdt",
                "aggFunc": "sum",
                "headerName": "PDT"
              },
              {
                "field": "/employee/st_price",
                "headerName": "ST Rate"
              },
              {
                "field": "/employee/ot_price",
                "headerName": "OT Rate"
              },
              {
                "field": "/employee/dt_price",
                "headerName": "DT Rate"
              },
              {
                "field": "/employee/pot_price",
                "headerName": "POT Rate"
              },
              {
                "field": "/employee/pdt_price",
                "headerName": "PDT Rate"
              },
              {
                "aggFunc": "sum",
                "dataType": "integer",
                "headerName": "Total",
                "valueGetter": "(data.hours && data.hours.st || 0) * (data.employee && data.employee.st_price || 0) / 100 + (data.hours && data.hours.ot || 0) * (data.employee && data.employee.ot_price || 0 ) / 100 + (data.hours && data.hours.dt || 0) * (data.employee && data.employee.dt_price || 0) / 100 + (data.hours && data.hours.pot || 0) * (data.employee && data.employee.pot_price || 0 ) / 100 + (data.hours && data.hours.pdt || 0) * (data.employee && data.employee.pdt_price || 0) / 100",
                "componentType": "currency"
              }
            ],
            "tableSettings": {
              "groupIncludeTotalFooter": true
            }
          },
          "ui:multi-select": "employee",
          "ui:summary_view": {
            "icon": "labor",
            "primary": [
              "/employee/last_name",
              "/employee/first_name"
            ],
            "tertiary": [
              "/hours/st",
              "/hours/ot",
              "/hours/dt"
            ],
            "secondary": [
              "/employee/classification",
              "/employee/trade"
            ]
          }
        },
        "Comment": {
          "ui:component": "comment"
        },
        "Material": {
          "item": {
            "order": [
              "material",
              "quantity",
              "note"
            ],
            "fields": {
              "note": {
                "ui:component": "textarea"
              },
              "material": {
                "order": [
                  "group",
                  "description",
                  "part_number",
                  "units",
                  "name",
                  "unit_price"
                ],
                "fields": {
                  "unit_price": {
                    "ui:component": "currency"
                  }
                },
                "ui:component": "material-selector"
              }
            }
          },
          "ui:component": "table",
          "ui:custom-table": {
            "colDefs": [
              {
                "field": "/material",
                "headerName": "Materials"
              },
              {
                "field": "/material/description",
                "headerName": "Description"
              },
              {
                "field": "/material/units",
                "headerName": "Units"
              },
              {
                "field": "/material/part_number",
                "headerName": "Part #"
              },
              {
                "field": "/quantity",
                "headerName": "Quantity"
              },
              {
                "field": "/material/unit_price",
                "headerName": "Unit Price"
              },
              {
                "aggFunc": "sum",
                "dataType": "integer",
                "headerName": "Total",
                "valueGetter": "(data.quantity || 0) * (data.material && data.material.unit_price || 0) / 100",
                "componentType": "currency"
              }
            ],
            "tableSettings": {
              "groupIncludeTotalFooter": true
            }
          },
          "ui:multi-select": "material",
          "ui:summary_view": {
            "icon": "material",
            "primary": [
              "/material/group",
              "/material/name"
            ],
            "tertiary": [
              "/quantity"
            ],
            "secondary": [
              "/material/description"
            ]
          }
        },
        "Equipment": {
          "item": {
            "order": [
              "equipment",
              "quantity",
              "note",
              "hours"
            ],
            "fields": {
              "note": {
                "ui:component": "textarea"
              },
              "hours": {
                "order": [
                  "running",
                  "idle",
                  "over"
                ]
              },
              "equipment": {
                "order": [
                  "caltrans_id",
                  "category",
                  "description",
                  "equipment_id",
                  "id",
                  "status",
                  "running_time_price",
                  "idle_time_price",
                  "over_time_price"
                ],
                "fields": {
                  "idle_time_price": {
                    "ui:component": "currency"
                  },
                  "over_time_price": {
                    "ui:component": "currency"
                  },
                  "running_time_price": {
                    "ui:component": "currency"
                  }
                },
                "ui:component": "equipment-selector",
                "ui:temporary-pricing": true
              }
            }
          },
          "ui:component": "table",
          "ui:custom-table": {
            "colDefs": [
              {
                "field": "/equipment",
                "headerName": "Equipment"
              },
              {
                "field": "/equipment/caltrans_id",
                "headerName": "Caltrans ID"
              },
              {
                "field": "/equipment/category",
                "headerName": "Type"
              },
              {
                "field": "/equipment/description",
                "headerName": "Description"
              },
              {
                "field": "/quantity",
                "headerName": "Quantity"
              },
              {
                "field": "/hours/running",
                "aggFunc": "sum",
                "headerName": "Running"
              },
              {
                "field": "/hours/idle",
                "aggFunc": "sum",
                "headerName": "Idle"
              },
              {
                "field": "/hours/over",
                "aggFunc": "sum",
                "headerName": "Overtime"
              },
              {
                "field": "/equipment/running_time_price",
                "headerName": "Running Rate"
              },
              {
                "field": "/equipment/idle_time_price",
                "headerName": "Idle Rate"
              },
              {
                "field": "/equipment/over_time_price",
                "headerName": "Overtime Rate"
              },
              {
                "aggFunc": "sum",
                "dataType": "integer",
                "headerName": "Total",
                "valueGetter": "(data.hours && data.hours.running || 0) * (data.equipment && data.equipment.running_time_price || 0) / 100 + (data.hours && data.hours.idle || 0) * (data.equipment && data.equipment.idle_time_price || 0 ) / 100 + (data.hours && data.hours.over || 0) * (data.equipment && data.equipment.over_time_price || 0) / 100",
                "componentType": "currency"
              }
            ],
            "tableSettings": {
              "groupIncludeTotalFooter": true
            }
          },
          "ui:multi-select": "equipment",
          "ui:summary_view": {
            "icon": "equipment",
            "primary": [
              "/equipment/description"
            ],
            "tertiary": [
              "/quantity",
              "/hours/running",
              "/hours/idle"
            ],
            "secondary": [
              "/equipment/equipment_id",
              "/equipment/category"
            ]
          }
        },
        "Project Name": {
          "ui:component": "auto-fill: Project Name"
        },
        "Labor comment": {
          "ui:component": "comment"
        },
        "Lower Tier Sub": {
          "item": {
            "order": [
              "company name",
              "total labor",
              "total hours",
              "note",
              "equipment",
              "material"
            ]
          },
          "ui:component": "table",
          "ui:summary_view": {
            "icon": "labor",
            "primary": [
              "/company name"
            ],
            "tertiary": [
              "/total labor",
              "/total hours"
            ],
            "secondary": []
          }
        },
        "Tag Created On": {
          "ui:component": "date"
        },
        "Material comment": {
          "ui:component": "comment"
        },
        "Equipment comment": {
          "ui:component": "comment"
        },
        "Work Performed On": {
          "ui:component": "date"
        },
        "Description of Work": {
          "ui:component": "textarea"
        },
        "Subcontractor's Job #": {
          "ui:component": "auto-fill: Subcontractor's Job #"
        },
        "subcontractor's signature": {
          "order": [
            "name",
            "date",
            "signature"
          ],
          "ui:component": "signature-advanced"
        }
      }
    }
  },
  "mobile_layout": {
    "list_item": {
      "primary": {
        "key": "/Subcontractor Use/Project Name"
      },
      "tertiary": {
        "key": "/Subcontractor Use/Tag Created On",
        "template": "<%= formatDate(value) %>"
      },
      "secondary": {
        "key": "/Subcontractor Use/Description of Work"
      },
      "quaternary": {
        "key": "/Subcontractor Use/labor hours total",
        "template": "<%= value && value + ' hours' %>"
      }
    }
  }
}

const uiSchemaOutput = {
  "fields": {
    "viewable": true,
    "editable": true,
    "Subcontractor Use": {
      "viewable": true,
      "editable": true,
      "order": [
        "Tag Created On",
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
        "subcontractor's signature"
      ],
      "fields": {
        "labor": {
          "item": {
            "viewable": true,
            "editable": true,
            "order": [
              "employee",
              "external subcontractor",
              "note",
              "hours"
            ],
            "fields": {
              "note": {
                "viewable": true,
                "editable": true,
                "ui:component": "textarea"
              },
              "external subcontractor": {
                "viewable": true,
                "editable": true
              },
              "hours": {
                "viewable": true,
                "editable": true,
                "properties": {
                  "dt": {
                    "viewable": true,
                    "editable": true
                  },
                  "ot": {
                    "viewable": true,
                    "editable": true
                  },
                  "st": {
                    "viewable": true,
                    "editable": true
                  },
                  "pdt": {
                    "viewable": true,
                    "editable": true
                  },
                  "pot": {
                    "viewable": true,
                    "editable": true
                  }
                },
                "order": [
                  "st",
                  "ot",
                  "dt",
                  "pot",
                  "pdt"
                ]
              },
              "employee": {
                "viewable": true,
                "editable": true,
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
                  "user_role",
                  "st_price",
                  "ot_price",
                  "dt_price",
                  "pot_price",
                  "pdt_price"
                ],
                "fields": {
                  "id": {
                    "viewable": true,
                    "editable": true
                  },
                  "email": {
                    "viewable": true,
                    "editable": true
                  },
                  "phone": {
                    "viewable": true,
                    "editable": true
                  },
                  "trade": {
                    "viewable": true,
                    "editable": true
                  },
                  "company": {
                    "viewable": true,
                    "editable": true
                  },
                  "user_id": {
                    "viewable": true,
                    "editable": true
                  },
                  "dt_price": {
                    "viewable": true,
                    "editable": true
                  },
                  "fullsize": {
                    "viewable": true,
                    "editable": true
                  },
                  "ot_price": {
                    "viewable": true,
                    "editable": true
                  },
                  "st_price": {
                    "viewable": true,
                    "editable": true
                  },
                  "is_active": {
                    "viewable": true,
                    "editable": true
                  },
                  "last_name": {
                    "viewable": true,
                    "editable": true
                  },
                  "pdt_price": {
                    "viewable": true,
                    "editable": true
                  },
                  "pot_price": {
                    "viewable": true,
                    "editable": true
                  },
                  "thumbnail": {
                    "viewable": true,
                    "editable": true
                  },
                  "user_role": {
                    "viewable": true,
                    "editable": true
                  },
                  "first_name": {
                    "viewable": true,
                    "editable": true
                  },
                  "employee_id": {
                    "viewable": true,
                    "editable": true
                  },
                  "classification": {
                    "viewable": true,
                    "editable": true
                  },
                  "company_supplied_id": {
                    "viewable": true,
                    "editable": true
                  }
                  "dt_price": {
                    "viewable": true,
                    "editable": true,
                    "ui:component": "currency"
                  },
                  "ot_price": {
                    "viewable": true,
                    "editable": true,
                    "ui:component": "currency"
                  },
                  "st_price": {
                    "viewable": true,
                    "editable": true,
                    "ui:component": "currency"
                  },
                  "pdt_price": {
                    "viewable": true,
                    "editable": true,
                    "ui:component": "currency"
                  },
                  "pot_price": {
                    "viewable": true,
                    "editable": true,
                    "ui:component": "currency"
                  }
                },
                "ui:component": "employee-selector",
                "ui:temporary-pricing": "premium"
              }
            }
          },
          "ui:component": "table",
          "ui:custom-table": {
            "colDefs": [
              {
                "field": "/employee",
                "headerName": "Employee"
              },
              {
                "field": "/employee/trade",
                "headerName": "Trade"
              },
              {
                "field": "/employee/classification",
                "headerName": "Classification"
              },
              {
                "field": "/hours/st",
                "aggFunc": "sum",
                "headerName": "ST"
              },
              {
                "field": "/hours/ot",
                "aggFunc": "sum",
                "headerName": "OT"
              },
              {
                "field": "/hours/dt",
                "aggFunc": "sum",
                "headerName": "DT"
              },
              {
                "field": "/hours/pot",
                "aggFunc": "sum",
                "headerName": "POT"
              },
              {
                "field": "/hours/pdt",
                "aggFunc": "sum",
                "headerName": "PDT"
              },
              {
                "field": "/employee/st_price",
                "headerName": "ST Rate"
              },
              {
                "field": "/employee/ot_price",
                "headerName": "OT Rate"
              },
              {
                "field": "/employee/dt_price",
                "headerName": "DT Rate"
              },
              {
                "field": "/employee/pot_price",
                "headerName": "POT Rate"
              },
              {
                "field": "/employee/pdt_price",
                "headerName": "PDT Rate"
              },
              {
                "aggFunc": "sum",
                "dataType": "integer",
                "headerName": "Total",
                "valueGetter": "(data.hours && data.hours.st || 0) * (data.employee && data.employee.st_price || 0) / 100 + (data.hours && data.hours.ot || 0) * (data.employee && data.employee.ot_price || 0 ) / 100 + (data.hours && data.hours.dt || 0) * (data.employee && data.employee.dt_price || 0) / 100 + (data.hours && data.hours.pot || 0) * (data.employee && data.employee.pot_price || 0 ) / 100 + (data.hours && data.hours.pdt || 0) * (data.employee && data.employee.pdt_price || 0) / 100",
                "componentType": "currency"
              }
            ],
            "tableSettings": {
              "groupIncludeTotalFooter": true
            }
          },
          "ui:multi-select": "employee",
          "ui:summary_view": {
            "icon": "labor",
            "primary": [
              "/employee/last_name",
              "/employee/first_name"
            ],
            "tertiary": [
              "/hours/st",
              "/hours/ot",
              "/hours/dt"
            ],
            "secondary": [
              "/employee/classification",
              "/employee/trade"
            ]
          }
        },
        "Status": {
          "viewable": true,
          "editable": true
        },
        "Comment": {
          "viewable": false,
          "editable": false,
          "ui:component": "comment"
        },
        "Location": {
          "viewable": true,
          "editable": true
        },
        "Material": {
          "item": {
            "viewable": true,
            "editable": true,
            "order": [
              "material",
              "quantity",
              "note"
            ],
            "fields": {
              "note": {
                "viewable": true,
                "editable": true,
                "ui:component": "textarea"
              },
              "quantity": {
                "viewable": true,
                "editable": true
              },
              "material": {
                "viewable": true,
                "editable": true,
                "order": [
                  "group",
                  "description",
                  "part_number",
                  "units",
                  "name",
                  "unit_price"
                ],
                "fields": {
                  "name": {
                    "viewable": true,
                    "editable": true
                  },
                  "group": {
                    "viewable": true,
                    "editable": true
                  },
                  "units": {
                    "viewable": true,
                    "editable": true
                  },
                  "unit_price": {
                    "viewable": true,
                    "editable": true
                  },
                  "description": {
                    "viewable": true,
                    "editable": true
                  },
                  "part_number": {
                    "viewable": true,
                    "editable": true
                  }
                  "unit_price": {
                    "viewable": true,
                    "editable": true,
                    "ui:component": "currency"
                  }
                },
                "ui:component": "material-selector"
              }
            }
          },
          "ui:component": "table",
          "ui:custom-table": {
            "colDefs": [
              {
                "field": "/material",
                "headerName": "Materials"
              },
              {
                "field": "/material/description",
                "headerName": "Description"
              },
              {
                "field": "/material/units",
                "headerName": "Units"
              },
              {
                "field": "/material/part_number",
                "headerName": "Part #"
              },
              {
                "field": "/quantity",
                "headerName": "Quantity"
              },
              {
                "field": "/material/unit_price",
                "headerName": "Unit Price"
              },
              {
                "aggFunc": "sum",
                "dataType": "integer",
                "headerName": "Total",
                "valueGetter": "(data.quantity || 0) * (data.material && data.material.unit_price || 0) / 100",
                "componentType": "currency"
              }
            ],
            "tableSettings": {
              "groupIncludeTotalFooter": true
            }
          },
          "ui:multi-select": "material",
          "ui:summary_view": {
            "icon": "material",
            "primary": [
              "/material/group",
              "/material/name"
            ],
            "tertiary": [
              "/quantity"
            ],
            "secondary": [
              "/material/description"
            ]
          }
        },
        "Equipment": {
          "item": {
            "viewable": true,
            "editable": true,
            "order": [
              "equipment",
              "quantity",
              "note",
              "hours"
            ],
            "fields": {
              "note": {
                "viewable": true,
                "editable": true,
                "ui:component": "textarea"
              },
              "hours": {
                "viewable": true,
                "editable": true,
                "order": [
                  "running",
                  "idle",
                  "over"
                ]
              },
              "equipment": {
                "viewable": true,
                "editable": true,
                "order": [
                  "caltrans_id",
                  "category",
                  "description",
                  "equipment_id",
                  "id",
                  "status",
                  "running_time_price",
                  "idle_time_price",
                  "over_time_price"
                ],
                "fields": {
                  "id": {
                    "viewable": true,
                    "editable": true
                  },
                  "status": {
                    "viewable": true,
                    "editable": true
                  },
                  "category": {
                    "viewable": true,
                    "editable": true
                  },
                  "caltrans_id": {
                    "viewable": true,
                    "editable": true
                  },
                  "description": {
                    "viewable": true,
                    "editable": true
                  },
                  "equipment_id": {
                    "viewable": true,
                    "editable": true
                  },
                  "idle_time_price": {
                    "viewable": true,
                    "editable": true,
                    "ui:component": "currency"
                  },
                  "over_time_price": {
                    "viewable": true,
                    "editable": true,
                    "ui:component": "currency"
                  },
                  "running_time_price": {
                    "viewable": true,
                    "editable": true,
                    "ui:component": "currency"
                  }
                },
                "ui:component": "equipment-selector",
                "ui:temporary-pricing": true
              }
            }
          },
          "ui:component": "table",
          "ui:custom-table": {
            "colDefs": [
              {
                "field": "/equipment",
                "headerName": "Equipment"
              },
              {
                "field": "/equipment/caltrans_id",
                "headerName": "Caltrans ID"
              },
              {
                "field": "/equipment/category",
                "headerName": "Type"
              },
              {
                "field": "/equipment/description",
                "headerName": "Description"
              },
              {
                "field": "/quantity",
                "headerName": "Quantity"
              },
              {
                "field": "/hours/running",
                "aggFunc": "sum",
                "headerName": "Running"
              },
              {
                "field": "/hours/idle",
                "aggFunc": "sum",
                "headerName": "Idle"
              },
              {
                "field": "/hours/over",
                "aggFunc": "sum",
                "headerName": "Overtime"
              },
              {
                "field": "/equipment/running_time_price",
                "headerName": "Running Rate"
              },
              {
                "field": "/equipment/idle_time_price",
                "headerName": "Idle Rate"
              },
              {
                "field": "/equipment/over_time_price",
                "headerName": "Overtime Rate"
              },
              {
                "aggFunc": "sum",
                "dataType": "integer",
                "headerName": "Total",
                "valueGetter": "(data.hours && data.hours.running || 0) * (data.equipment && data.equipment.running_time_price || 0) / 100 + (data.hours && data.hours.idle || 0) * (data.equipment && data.equipment.idle_time_price || 0 ) / 100 + (data.hours && data.hours.over || 0) * (data.equipment && data.equipment.over_time_price || 0) / 100",
                "componentType": "currency"
              }
            ],
            "tableSettings": {
              "groupIncludeTotalFooter": true
            }
          },
          "ui:multi-select": "equipment",
          "ui:summary_view": {
            "icon": "equipment",
            "primary": [
              "/equipment/description"
            ],
            "tertiary": [
              "/quantity",
              "/hours/running",
              "/hours/idle"
            ],
            "secondary": [
              "/equipment/equipment_id",
              "/equipment/category"
            ]
          }
        },
        "Owners/Rep #":{
          "viewable": true,
          "editable": true
        },
        "Project Name": {
          "viewable": true,
          "editable": true,
          "ui:component": "auto-fill: Project Name"
        },
        "Labor comment": {
          "viewable": false,
          "editable": false,
          "ui:component": "comment"
        },
        "Lower Tier Sub": {
          "item": {
            "viewable": true,
            "editable": true,
            "order": [
              "company name",
              "total labor",
              "total hours",
              "note",
              "equipment",
              "material"
            ],
            "properties": {
              "note": {
                "viewable": true,
                "editable": true
              },
              "material": {
                "viewable": true,
                "editable": true
              },
              "equipment": {
                "viewable": true,
                "editable": true
              },
              "total hours": {
                "viewable": true,
                "editable": true
              },
              "total labor": {
                "viewable": true,
                "editable": true
              },
              "company name": {
                "viewable": true,
                "editable": true
            }
          },
          "ui:component": "table",
          "ui:summary_view": {
            "icon": "labor",
            "primary": [
              "/company name"
            ],
            "tertiary": [
              "/total labor",
              "/total hours"
            ],
            "secondary": []
          }
        },
        "Tag Created On": {
          "editable": false,
          "viewable": true,
          "ui:component": "date"
        },
        "Additional Notes": {
          "viewable": true,
          "editable": true
        },
        "Material comment": {
          "viewable": false,
          "editable": false,
          "ui:component": "comment",
          "properties": {
            "date": {
              "viewable": true,
              "editable": true
            },
            "comment": {
              "viewable": true,
              "editable": true
            },
            "commenter": {
              "viewable": true,
              "editable": true
            }
          }
        },
        "Equipment comment": {
          "viewable": false,
          "editable": false,
          "ui:component": "comment",
          "properties": {
            "date": {
              "viewable": true,
              "editable": true
            },
            "comment": {
              "viewable": true,
              "editable": true
            },
            "commenter": {
              "viewable": true,
              "editable": true
            }
          }
        },
        "Work Performed On": {
          "viewable": true,
          "editable": true,
          "ui:component": "date"
        },
        "Description of Work": {
          "viewable": true,
          "editable": true,
          "ui:component": "textarea"
        },
        "Subcontractor's Job #": {
          "viewable": true,
          "editable": true,
          "ui:component": "auto-fill: Subcontractor's Job #"
        },
        "subcontractor's signature": {
          "order": [
            "name",
            "date",
            "signature"
          ],
          "viewable": true,
          "editable": true,
          "ui:component": "signature-advanced",
          "properties": {
            "date": {
              "viewable": true,
              "editable": true
            },
            "name": {
              "viewable": true,
              "editable": true
            },
            "signature": {
              "viewable": true,
              "editable": true
            }
          }
        }
      }
    }
  },
  "mobile_layout": {
    "list_item": {
      "primary": {
        "key": "/Subcontractor Use/Project Name"
      },
      "tertiary": {
        "key": "/Subcontractor Use/Tag Created On",
        "template": "<%= formatDate(value) %>"
      },
      "secondary": {
        "key": "/Subcontractor Use/Description of Work"
      },
      "quaternary": {
        "key": "/Subcontractor Use/labor hours total",
        "template": "<%= value && value + ' hours' %>"
      }
    }
  }
}

module.exports = {
  schemaInput,
  uiSchemaInput,
  uiSchemaOutput
}