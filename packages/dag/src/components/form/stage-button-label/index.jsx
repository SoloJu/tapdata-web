import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { observer } from '@formily/reactive-vue'

import StageButton from '@tap/business/src/components/StageButton'
import { FormItem, useForm } from '@tap/form'

import './style.scss'

export const StageButtonLabel = observer(
  defineComponent({
    props: ['value', 'disabled', 'connectionId', 'title', 'target'],
    setup(props, { emit, root, attrs, refs, slots }) {
      const store = useStore()
      const { taskId, activeNodeId } = store.state?.dataflow || {}

      const formRef = useForm()

      const trigger = () => {
        const field = formRef.value.query(props.target).take()
        field?.setComponentProps({
          reloadTime: Date.now()
        })
      }

      return () => {
        const label = (
          <div class="inline-flex align-center stage-button-label">
            <span class="mr-2">{props.title}</span>
            <StageButton
              connection-id={props.connectionId}
              task-id={taskId}
              node-id={activeNodeId}
              on={{ complete: trigger }}
            ></StageButton>
          </div>
        )

        return (
          <FormItem.BaseItem label={label} attrs={attrs}>
            {slots.default?.()}
          </FormItem.BaseItem>
        )
      }
    }
  })
)
