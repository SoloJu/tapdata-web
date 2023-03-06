import i18n from '@tap/i18n'
import { NodeType } from './extends/NodeType'

export class FieldCalc extends NodeType {
  constructor() {
    super()
  }

  type = 'field_calc_processor'

  maxInputs = 1 // 最大输入个数

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
        title: i18n.global.t('packages_dag_nodes_database_jiedianmingcheng'),
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input'
      },
      scripts: {
        type: 'array',
        title: '',
        'x-decorator': 'FormItem',
        'x-component': 'FieldValue',
        'x-reactions':
          '{{useAsyncDataSourceByConfig({service: loadNodeFieldsById, withoutField: true}, $self.value.length ? $values.id : $values.$inputs[0])}}'
      }
    }
  }
}
