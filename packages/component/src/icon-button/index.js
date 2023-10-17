import { defineComponent, ref } from '@vue/composition-api'
import VIcon from '../base/VIcon'
import './style.scss'

export const IconButton = defineComponent({
  props: {
    iconSize: [Number, String],
    xs: Boolean,
    sm: Boolean,
    md: Boolean,
    lg: Boolean,
    xl: Boolean,
    clickAndRotate: Boolean,
    disabled: Boolean
  },
  setup(props, { attrs, listeners, slots }) {
    return () => {
      return (
        <button
          disabled={props.disabled}
          staticClass="t-button t-button--icon"
          class={{
            't-button--icon-xs': props.xs,
            't-button--icon-sm': props.sm,
            't-button--icon-md': props.md || (!props.xs && !props.sm && !props.lg && !props.xl),
            't-button--icon-lg': props.lg,
            't-button--icon-xl': props.xl,
            't-button__rotating': props.clickAndRotate
          }}
          type="button"
          {...{ props: attrs, on: listeners }}
        >
          <VIcon>{slots.default()}</VIcon>
        </button>
      )
    }
  }
})
