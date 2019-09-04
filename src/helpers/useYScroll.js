import { useCallback, useEffect, useState } from 'react'
import { useSpring, config } from '@react-spring/core'
import { useGesture } from 'react-use-gesture'
import clamp from 'lodash/clamp'

export default function useYScroll(bounds, props) {
  // const [{ y }, set] = useSpring(() => ({ y: 0, config: config.slow }))
  const [{ y }, set] = useSpring(() => ({ y: 0 }))  
  
  let lock = false;
  let scroll = 0;
  let wheelLast = 0;
  let last = 0;

  const fn = useCallback(({ xy: [, cy], previous: [, py], memo = y.getValue() }) => {
    // if (!lock) {
    //   scroll = clamp(memo + cy - py, ...bounds)
    //   set({ y: scroll })
    //   return scroll
    // }
  }, [])

  const fn2 = useCallback(({ xy: [, y] }) => {
    if (!lock) {
    scroll = clamp(scroll + (y - last) * 0.5, ...bounds)    
    set({ y: scroll })
    }
    last = y;
  }, [])

  const setLock = e => lock = e;
  const setY = e => {
    console.log(e);
    scroll = e;
    set({ y: e });
  }




  const bind = useGesture({ onWheel: fn2, onDrag: fn }, props)
  useEffect(() => props && props.domTarget && bind(), [props, bind])

  return { y, setLock, setY }
}
