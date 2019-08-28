import { useCallback, useEffect } from 'react'
import { useSpring, config } from '@react-spring/core'
import { useGesture } from 'react-use-gesture'
import clamp from 'lodash/clamp'

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

  const fn2 = useCallback(({xy}) => {
    console.log(xy);
    
    set({ y: xy[1] })
  })


  const bind = useGesture({ onWheel: fn2, onDrag: fn }, props)
  useEffect(() => props && props.domTarget && bind(), [props, bind])
  return [y, bind]
}
