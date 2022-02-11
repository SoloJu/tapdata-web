import { useForm } from '@formily/vue'
import { getComponentByTag } from './utils'

const ElButton = getComponentByTag('el-button')

export const AddDatabaseBtn = {
  functional: true,
  render(h, context) {
    const formRef = useForm()
    const form = formRef?.value
    return h(
      ElButton,
      {
        props: {
          size: 'mini',
          icon: 'el-icon-plus',
          ...context.props
        },
        attrs: context.attrs,
        on: {
          click: () => {
            console.log('AddDatabaseBtn', form.values) // eslint-disable-line
            let href = '/#/connections/create?databaseType=' + form.values.databaseType
            window.open(href, '_blank')
          }
        }
      },
      '新建'
    )
  }
}
