import { defineComponent, ref } from 'vue'
import { observer } from '@formily/reactive-vue'
import { RecursionField, useField, useForm } from '@tap/form'
import { useStore } from 'vuex'

export const PdkProperties = observer(
  defineComponent({
    setup() {
      const store = useStore()
      const form = useForm()
      const field = useField()
      const schema = ref({})
      const pdkHash = form.value.values.attrs.pdkHash
      // const gridField = form.value.query('grid').take()
      // console.log('gridField', gridField) // eslint-disable-line
      if (pdkHash) {
        const properties = store.state.dataflow.pdkPropertiesMap[pdkHash]
        schema.value = properties
      }

      /*if (!schema.value && gridField) {
        const filterIndex = gridField.componentProps.filterIndex || []
        filterIndex.push(2)
        console.log('PdkProperties.filterIndex', filterIndex) // eslint-disable-line
        // gridField.component[1].filterIndex = filterIndex
        gridField.setComponentProps({
          filterIndex: [2]
        })
      }*/

      return () => {
        return schema.value ? (
          <RecursionField basePath={field.value.address} schema={schema.value} onlyRenderProperties />
        ) : null
      }
    },
  }),
)
