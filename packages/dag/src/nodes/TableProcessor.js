import { NodeType } from './extends/NodeType'

export class TableProcessor extends NodeType {
  constructor() {
    super()
  }

  type = 'table_rename_processor'

  maxInputs = 1 // 最大输入个数
  maxOutputs = 1 // 最大输出个数

  group = 'processor'

  formSchema = {
    type: 'object',
    properties: {
      $inputs: {
        type: 'array',
        display: 'none'
      },
      name: {
        type: 'string',
        title: '节点名称',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input'
      },
      tableNames: {
        type: 'array',
        'x-component': 'TableRename',
        'x-component-props': {
          findParentNode: '{{findParentNode}}',
          listStyle: {
            maxHeight: 'calc((100vh - 120px) * 0.618)'
          }
        }
      }
    }
  }
}
