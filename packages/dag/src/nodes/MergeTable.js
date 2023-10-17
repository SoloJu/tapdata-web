import i18n from '@tap/i18n'
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
        'x-display': 'hidden'
      },
      $outputs: {
        type: 'array',
        'x-display': 'hidden'
      },

      tabs: {
        type: 'void',
        'x-component': 'FormTab',
        'x-component-props': {
          class: 'config-tabs',
          formTab: '{{formTab}}'
        },
        properties: {
          tab1: {
            type: 'void',
            'x-component': 'FormTab.TabPane',
            'x-component-props': {
              label: i18n.t('public_basic_settings')
            },
            properties: {
              externalStorageId: {
                title: i18n.t('packages_dag_nodes_aggregate_waicunpeizhi'), //外存配置
                type: 'string',
                'x-visible': '{{$isDaas}}',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-reactions': [
                  '{{useAsyncDataSourceByConfig({service: loadExternalStorage, withoutField: true})}}',
                  {
                    fulfill: {
                      state: {
                        value: '{{$self.value || $self.dataSource?.find(item => item.isDefault)?.value }}'
                      }
                    }
                  }
                ]
              },

              name: {
                type: 'string',
                title: i18n.t('public_node_name'),
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input'
              },

              mergeMode: {
                type: 'string',
                title: i18n.t('packages_dag_mergeMode'),
                default: 'main_table_first',
                enum: [
                  {
                    label: i18n.t('packages_dag_main_table_first'),
                    value: 'main_table_first'
                  },
                  {
                    label: i18n.t('packages_dag_sub_table_first'),
                    value: 'sub_table_first'
                  }
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Radio.Group'
              },

              mergeProperties: {
                title: i18n.t('packages_dag_nodes_mergetable_zhucongpeizhi'),
                type: 'array',
                required: true,
                'x-decorator': 'FormItem',
                'x-decorator-props': {},
                'x-component': 'MergeTableTree',
                'x-component-props': {
                  treeWidth: 200,
                  findNodeById: '{{findNodeById}}',
                  loadFieldsMethod: '{{loadNodeFieldOptions}}'
                },
                items: {
                  type: 'object',
                  properties: {
                    itemsWrap: {
                      type: 'void',
                      'x-component': 'FormContent',
                      properties: {
                        id: {
                          type: 'string',
                          'x-display': 'hidden'
                        },
                        mergeType: {
                          type: 'string',
                          title: i18n.t('packages_dag_nodes_mergetable_shujuxierumo'),
                          'x-decorator': 'FormItem',
                          'x-component': 'Select',
                          enum: [
                            {
                              label: i18n.t('packages_dag_editor_cell_link_writeMode_update'),
                              value: 'updateWrite'
                            },
                            {
                              label: i18n.t('packages_dag_editor_cell_link_writeMode_upsert'),
                              value: 'updateOrInsert'
                            },
                            {
                              label: i18n.t('packages_dag_nodes_mergetable_gengxinjinneiqian'),
                              value: 'updateIntoArray'
                            }
                          ]
                        },
                        wrap: {
                          type: 'void',
                          'x-component': 'FormContent',
                          properties: {
                            targetPath: {
                              type: 'string',
                              title: i18n.t('packages_dag_nodes_mergetable_guanlianhouxieru'),
                              'x-decorator': 'FormItem',
                              'x-component': 'Input',
                              'x-reactions': [
                                {
                                  dependencies: ['.mergeType', '.id'],
                                  fulfill: {
                                    state: {
                                      value: `{{ !$self.value && $self.value !== '' && ($deps[0] === "updateWrite" || $deps[0] === "updateIntoArray") ? findNodeById($deps[1]) ? findNodeById($deps[1]).name:undefined : $self.value }}`
                                    }
                                  }
                                },
                                {
                                  effects: ['onFieldInputValueChange'],
                                  fulfill: {
                                    run: `{{
                                  const arr = $self.value.split('.')
                                  if (arr.length > 3) {
                                    $self.value = arr.slice(0,3).join('.')
                                    $self.description = '${i18n.t(
                                      'packages_dag_nodes_mergetable_const_zuiduozhichiliangceng'
                                    )}'
                                  } else {
                                    $self.description = ''
                                  }
                                }}`
                                  }
                                }
                              ]
                            },
                            arrayKeys: {
                              type: 'array',
                              title: i18n.t('packages_dag_nodes_mergetable_neiqianshuzupi'),
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
                                    }
                                  }
                                }
                              ]
                            },
                            joinKeys: {
                              type: 'array',
                              title: i18n.t('packages_dag_nodes_mergetable_guanliantiaojian'),
                              'x-decorator': 'FormItem',
                              'x-component': 'ArrayTable',
                              items: {
                                type: 'object',
                                properties: {
                                  c1: {
                                    type: 'void',
                                    'x-component': 'ArrayTable.Column',
                                    'x-component-props': {
                                      title: i18n.t('packages_dag_nodes_mergetable_dangqianbiaoziduan'),
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
                                      title: i18n.t('packages_dag_nodes_mergetable_mubiaobiaoziduan'),
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
              },

              schemaPreview: {
                type: 'void',
                'x-component': 'SchemaPreview'
              }
            }
          }
        }
      }
    }
  }

  allowTarget(target) {
    return !!target.attrs?.capabilities?.find(({ id }) => id === 'master_slave_merge')
  }
}
