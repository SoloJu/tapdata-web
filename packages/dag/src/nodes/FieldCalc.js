import { NodeType } from './extends/NodeType'

export class FieldCalc extends NodeType {
  constructor(node) {
    super(node)

    if (node.attr) {
      const attr = Object.assign(this.attr, node.attr)
      if (attr.formSchema) this.formSchema = attr.formSchema
      if (attr.linkFormSchema) this.linkFormSchema = attr.linkFormSchema
    }
  }

  attr = {
    maxInputs: 1 // 最大输入个数
  }

  group = 'processor'

  formSchema = {
    type: 'object',
    $inputs: {
      type: 'array',
      display: 'none'
    },
    properties: {
      scripts: {
        type: 'array',
        title: '',
        'x-decorator': 'FormItem',
        'x-component': 'FieldValue',
        'x-reactions':
          '{{useAsyncDataSourceByConfig({service: loadNodeFieldsById, withoutField: true}, $values.$inputs[0])}}'
      }
    }
  }
}
