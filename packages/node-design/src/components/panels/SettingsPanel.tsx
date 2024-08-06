import { observer } from '@formily/reactive-vue'
import { TextWidget } from '../widgets'
import { useCurrentNode, usePrefix, useWorkbench } from '../../hooks'
import { defineComponent, ref, watchEffect } from 'vue'
import { requestIdle } from '@tap/shared'

export const SettingsPanel = observer(
  defineComponent({
    props: ['title', 'extra'],
    setup(props, { slots }) {
      // const prefixRef = usePrefix('settings-panel')
      const prefix = usePrefix('settings-panel')
      const workbenchRef = useWorkbench()
      const innerVisible = ref(true)
      const pinning = ref(false)
      const visible = ref(true)

      watchEffect(() => {
        if (visible.value || workbenchRef.value.type === 'DESIGNABLE') {
          if (!innerVisible.value) {
            requestIdle(() => {
              requestAnimationFrame(() => {
                innerVisible.value = true
              })
            })
          }
        }
      })

      return () => {
        if (workbenchRef.value.type !== 'DESIGNABLE') {
          if (innerVisible.value) innerVisible.value = false
          return null
        }
        if (!visible.value) {
          if (innerVisible.value) innerVisible.value = false
          return (
            <div
              class={prefixRef.value + '-opener'}
              onClick={() => {
                visible.value = true
              }}
            >
              <IconWidget infer="Setting" size={'20px'} />
            </div>
          )
        }

        return (
          <div class={prefix}>
            <div class={prefix + '-header'}>
              <div class={prefix + '-header-title'}>
                <TextWidget>{props.title}</TextWidget>
              </div>
              <div class={prefix + '-header-actions'}>
                <div class={prefix + '-header-extra'}>{slots.extra?.()}</div>
              </div>
            </div>
            <div class={prefix + '-body'}>{innerVisible.value && slots.default?.()}</div>
          </div>
        )
      }
    },
  }),
)
