import { NodeType } from './extends/NodeType'

export class MergeTable extends NodeType {
  constructor() {
    super()
  }

  type = 'merge_table_processor'

  maxOutputs = 1 // 最大输出个数

  group = 'processor'

  formSchema = {
    type: 'object',
    properties: {
      $inputs: {
        type: 'array',
        'x-display': 'hidden',
        'x-reactions': {
          fulfill: {
            run: `
            let mergeList = $values.mergeProperties || []
            let map = mergeList.reduce((obj, item) => ((obj[item.sourceId] = item), obj), {})
            let list = []
            $self.value.forEach(sourceId => {
              let item = map[sourceId]
              if (!item) {
                list.push({
                  sourceId,
                  mergeType: 'updateOrInsert',
                  tablePath: '',
                  joinKeys: []
                })
              } else {
                list.push(item)
              }
            })
            $values.mergeProperties = list
            `
          }
        }
      },
      $outputs: {
        type: 'array',
        'x-display': 'hidden'
      },

      targetNodeFields: {
        type: 'array',
        visible: false,
        'x-reactions': [
          `{{useAsyncDataSourceByConfig({service: loadNodeFieldOptions, withoutField: true, fieldName: 'value'}, $values.$outputs[0])}}`,
          {
            target: `mergeProperties.*.joinKeys.*.target`,
            fulfill: {
              state: {
                loading: '{{$self.loading}}',
                dataSource: '{{$self.value}}'
              }
            }
          }
        ]
      },
      mergeProperties: {
        type: 'array',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'ArrayItems',
        items: {
          type: 'object',
          properties: {
            layout: {
              type: 'void',
              'x-component': 'MergeTableItem',
              'x-component-props': {
                loadFieldsMethod: '{{loadNodeFieldOptions}}'
              },
              properties: {
                sourceId: {
                  type: 'string',
                  'x-hidden': true,
                  'x-decorator': 'FormItem',
                  'x-component': 'PreviewText.Input'
                },
                tableName: {
                  type: 'string',
                  title: '节点名称',
                  'x-decorator': 'FormItem',
                  'x-component': 'PreviewText.Input',
                  'x-reactions': {
                    dependencies: ['.sourceId'],
                    fulfill: {
                      run: '{{ $self.value = findNodeById($deps[0])?.name }}'
                    }
                  }
                },
                mergeType: {
                  type: 'string',
                  title: '写入模式',
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  enum: [
                    { label: '追加写入', value: 'appendWrite' },
                    { label: '更新写入', value: 'updateWrite' },
                    { label: '更新已存在或插入新数据', value: 'updateOrInsert' },
                    { label: '更新进内嵌数组', value: 'updateIntoArray' }
                  ]
                },
                targetPath: {
                  type: 'string',
                  title: '关联后写入路径',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-reactions': {
                    dependencies: ['.mergeType'],
                    fulfill: {
                      state: {
                        visible: '{{ $deps[0] !== "appendWrite" }}',
                        value: `{{ $self.value || ($deps[0] === "updateOrInsert" ? "" : $self.query('.tableName').value()) }}`
                      }
                    }
                  }
                },
                arrayKeys: {
                  type: 'array',
                  title: '内嵌数组匹配条件',
                  'x-decorator': 'FormItem',
                  'x-component': 'FieldSelect',
                  'x-component-props': {
                    'allow-create': true,
                    multiple: true,
                    filterable: true
                  },
                  'x-reactions': [
                    {
                      dependencies: ['.mergeType'],
                      fulfill: {
                        state: {
                          visible: '{{ $deps[0] === "updateIntoArray" }}'
                        },
                        schema: {
                          required: '{{ $deps[0] === "updateIntoArray" }}'
                        }
                      }
                    }
                  ]
                },
                joinKeys: {
                  type: 'array',
                  title: '关联条件',
                  'x-decorator': 'FormItem',
                  'x-component': 'ArrayTable',
                  'x-component-props': {
                    style: {
                      border: '1px solid #f2f2f2'
                    }
                  },
                  'x-reactions': [
                    {
                      dependencies: ['.mergeType'],
                      fulfill: {
                        state: {
                          visible: '{{$deps[0] !== "appendWrite"}}'
                        }
                      }
                    }
                  ],
                  items: {
                    type: 'object',
                    properties: {
                      c1: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          title: '源表字段',
                          align: 'center',
                          asterisk: false
                        },
                        properties: {
                          source: {
                            type: 'string',
                            loading: true,
                            required: true,
                            'x-decorator': 'FormItem',
                            'x-component': 'FieldSelect',
                            'x-component-props': {
                              'allow-create': true,
                              filterable: true
                            }
                          }
                        }
                      },
                      c2: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          title: '目标表字段',
                          align: 'center',
                          asterisk: false
                        },
                        properties: {
                          target: {
                            type: 'string',
                            required: true,
                            'x-decorator': 'FormItem',
                            'x-component': 'FieldSelect',
                            'x-component-props': {
                              'allow-create': true,
                              filterable: true
                            }
                          }
                        }
                      },
                      c3: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          width: 40,
                          title: '',
                          align: 'center'
                        },
                        properties: {
                          remove: {
                            type: 'void',
                            'x-component': 'ArrayTable.Remove'
                          }
                        }
                      }
                    }
                  },
                  properties: {
                    addition: {
                      type: 'void',
                      title: '+',
                      'x-component': 'ArrayTable.Addition'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  allowTarget(target) {
    return target.type === 'table' && target.databaseType === 'mongodb'
  }
}
