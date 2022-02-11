import { on, off, appendHtml } from '@daas/shared'

const EVENT = {
  mouse: {
    start: 'mousedown',
    move: 'mousemove',
    stop: 'mouseup'
  },
  touch: {
    start: 'touchstart',
    move: 'touchmove',
    stop: 'touchend'
  }
}

export default {
  inserted(el, binding) {
    // 事件名
    let eventsFor = EVENT.mouse
    let $drag, width, height
    const { item, onStart, onMove, onStop, onDrop, box = [], domHtml, getDragDom, container } = binding.value
    const [t = 0, r = 0, b = 0, l = 0] = box

    const moveAt = (posX, posY) => {
      let left = posX - width / 2
      let top = posY - height / 2

      left = Math.max(left, l)
      left = Math.min(left, document.documentElement.clientWidth - width - r)
      top = Math.max(top, t)
      top = Math.min(top, document.documentElement.clientHeight - height - b)

      $drag.style.position = 'fixed'
      $drag.style.left = left + 'px'
      $drag.style.top = top + 'px'
    }

    const handleStart = (el._handleStart = async event => {
      if (event.type === 'touchstart') {
        eventsFor = EVENT.touch
      } else {
        eventsFor = EVENT.mouse
      }
      el._eventsFor = eventsFor
      if (event.button === 0) {
        onStart?.(item)
        $drag = domHtml ? appendHtml(document.body, domHtml.replace(/\n/g, '').trim()) : await getDragDom()
        document.body.classList.add('cursor-grabbing')
        const rect = $drag.getBoundingClientRect()
        width = rect.width
        height = rect.height
        let posX = event.touches ? event.touches[0].pageX : event.pageX
        let posY = event.touches ? event.touches[0].pageY : event.pageY
        moveAt(posX, posY)
        on(document.documentElement, eventsFor.move, handleMove, {
          capture: false,
          passive: false
        })
        on(document.documentElement, eventsFor.stop, handleStop)
      }
    })

    const handleMove = (el._handleMove = async event => {
      event.preventDefault()
      let posX = event.touches ? event.touches[0].pageX : event.pageX
      let posY = event.touches ? event.touches[0].pageY : event.pageY
      moveAt(posX, posY)
      onMove?.(item, [posX, posY], $drag)
    })

    const handleStop = (el._handleStop = event => {
      let posX = event.touches ? event.touches[0].pageX : event.pageX
      let posY = event.touches ? event.touches[0].pageY : event.pageY

      document.body.classList.remove('cursor-grabbing')
      onStop?.(item, [posX, posY])

      if ($drag) {
        const { width, height } = $drag.getBoundingClientRect()
        domHtml && $drag.remove()
        $drag = null

        if (container) {
          const $con = document.querySelector(container)
          const $elemBelow = document.elementFromPoint(posX, posY)
          if ($con && $con.contains($elemBelow)) {
            onDrop?.(item, [posX, posY], { width, height })
          }
        }
      }

      off(document.documentElement, eventsFor.move, handleMove)
      off(document.documentElement, eventsFor.stop, handleStop)
    })

    on(el, 'mousedown', handleStart)
    on(el, 'touchstart', handleStart)
  },

  unbind(el) {
    const { _eventsFor } = el
    off(el, 'mousedown', el._handleStart)
    off(el, 'touchstart', el._handleStart)
    if (!_eventsFor) return
    off(el, _eventsFor.move, el._handleMove)
    off(el, _eventsFor.stop, el._handleStop)

    delete el._eventsFor
    delete el._handleStart
    delete el._handleMove
    delete el._handleStop
  }
}
