import i18n from '@tap/i18n'
import { NodeType } from './extends/NodeType'

export class FieldProcessor extends NodeType {
  constructor() {
    super()
  }

  type = 'migrate_field_rename_processor'

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
        title: i18n.t('public_node_name'),
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input'
      },
      fieldsOperation: {
        type: 'object',
        default: {
          prefix: '',
          suffix: '',
          capitalized: ''
        }
      },
      fieldsMapping: {
        type: 'array',
        title: '',
        'x-decorator': 'FormItem',
        'x-component': 'FieldRenameProcessor',
        'x-component-props': {
          nodeId: '{{$values.id}}'
        }
      }
      // loadSchemaButton: {
      //   type: 'void',
      //   title: '',
      //   'x-decorator': 'FormItem',
      //   'x-component': 'Button',
      //   'x-content': '加載模型',
      //   'x-component-props': {
      //     onClick:
      //       '{{useAsyncDataSourceByConfig({service: getCommandAndSetValue, withoutField: true}, $form, {nodeId:$values.id})}}'
      //   }
      // },
      // loadSchemaTree: {
      //   type: 'void',
      //   title: '',
      //   required: true,
      //   'x-decorator': 'FormItem',
      //   'x-component': 'loadSchemaTree'
      // }
    }
  }
}
