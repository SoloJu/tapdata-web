import { useViewport, useDesigner, usePrefix } from '../../../hooks'
import { Insertion } from './Insertion'
import { Selection } from './Selection'
import { FreeSelection } from './FreeSelection'
import { Cover } from './Cover'
import { DashedBox } from './DashedBox'
import './styles.scss'
import { defineComponent, ref } from 'vue'

export const AuxToolWidget = defineComponent({
  setup: (props) => {
    const engine = useDesigner()
    const viewportRef = useViewport()
    const prefix = usePrefix('auxtool')
    const root = ref(null)

    engine.value.subscribeWith('viewport:scroll', () => {
      if (viewportRef.value.isIframe && root.value) {
        root.value.style.transform = `perspective(1px) translate3d(${-viewportRef.value.scrollX}px,${-viewportRef.value
          .scrollY}px,0)`
      }
    })

    return () => {
      if (!viewportRef.value) return null
      return (
        <div ref={root} class={prefix}>
          <Insertion />
          <DashedBox />
          <Selection />
          <Cover />
          <FreeSelection />
        </div>
      )
    }
  },
})
