import { useCallback, useEffect } from 'react'
import { useSpring, config } from '@react-spring/core'
import { useGesture } from 'react-use-gesture'
import clamp from 'lodash/clamp'
import { useState } from 'react'

export default function useYScroll(bounds, props) {
  // const [{ y }, set] = useSpring(() => ({ y: 0, config: config.slow }))
  const [{ y }, set] = useSpring(() => ({ y: 0 }))
  
  const fn = useCallback(
    ({ xy: [, cy], previous: [, py], memo = y.getValue() }) => {
      const newY = clamp(memo + cy - py, ...bounds)
      set({ y: newY })      
      return newY
    },
    [bounds, y, set]
  )


  const [offset, setOffset] = useState({last: 0, scroll: 0})

  const fn2 = useCallback(({ xy: [, y] }) => {
    const scroll = clamp(offset.scroll + (y - offset.last), ...bounds)
    setOffset({last: y, scroll: scroll});    
    set({ y: scroll })
  })


  const bind = useGesture({ onWheel: fn2, onDrag: fn }, props)
  useEffect(() => props && props.domTarget && bind(), [props, bind])
  return [y, bind]
}
