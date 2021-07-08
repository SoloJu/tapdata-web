// https://github.com/vueComponent/ant-design-vue/blob/next/components/space/index.tsx

import { defineComponent } from 'vue-demi'
import { h } from '@formily/vue'

import { stylePrefix } from './configs'

const spaceSize = {
  small: 8,
  middle: 16,
  large: 24
}

export const Space = defineComponent({
  name: 'ElSpace',
  props: ['size', 'direction', 'align'],
  setup(props, { slots }) {
    return () => {
      const { align, size = 'small', direction = 'horizontal' } = props

      const prefixCls = `${stylePrefix}-space`
      const children = slots.default?.()
      let items = []
      if (Array.isArray(children)) {
        if (children.length === 1) {
          if (children[0]['tag']?.endsWith('Fragment')) {
            // Fragment hack
            items = children[0]['componentOptions']?.children
          } else {
            items = children
          }
        } else {
          items = children
        }
      }
      const len = items.length

      if (len === 0) {
        return null
      }

      const mergedAlign =
        align === undefined && direction === 'horizontal' ? 'center' : align

      const someSpaceClass = {
        [prefixCls]: true,
        [`${prefixCls}-${direction}`]: true,
        [`${prefixCls}-align-${mergedAlign}`]: mergedAlign
      }

      const itemClassName = `${prefixCls}-item`
      const marginDirection = 'marginRight' // directionConfig === 'rtl' ? 'marginLeft' : 'marginRight';

      const renderItems = items.map((child, i) =>
        h(
          'div',
          {
            class: itemClassName,
            key: `${itemClassName}-${i}`,
            style:
              i === len - 1
                ? {}
                : {
                    [direction === 'vertical'
                      ? 'marginBottom'
                      : marginDirection]:
                      typeof size === 'string'
                        ? `${spaceSize[size]}px`
                        : `${size}px`
                  }
          },
          { default: () => [child] }
        )
      )

      return h('div', { class: someSpaceClass }, { default: () => renderItems })
    }
  }
})
