import { useCallback, useEffect } from 'react'
import { useSpring, config } from '@react-spring/core'
import { useGesture } from 'react-use-gesture'
import clamp from 'lodash/clamp'
import { useState } from 'react'

export default function useYScroll(bounds, props) {
  // const [{ y }, set] = useSpring(() => ({ y: 0, config: config.slow }))
  const [{ y }, set] = useSpring(() => ({ y: 0 }))
  const [control, setControl] = useState({last: 0, scroll: 0, lock: false})  

  const [hoo, setHoo] = useState(0);
  
  // const fn = useCallback(
  //   ({ xy: [, cy], previous: [, py], memo = y.getValue() }) => {
  //     const newY = clamp(memo + cy - py, ...bounds)
  //     set({ y: newY })
  //     console.log(newY);
  //     setHoo(hoo + 1);
  //     // setControl({...control, scroll: newY});
  //     return newY
  //   },
  //   [bounds, y, set]
  // )

  const fn = ({ xy: [, cy], previous: [, py], memo = y.getValue() }) => {
      const newY = clamp(memo + cy - py, ...bounds)
      console.log(newY);
      set({ y: newY })
      setHoo(hoo + 1);
      // setControl({...control, scroll: newY});
      return newY
    }    

  

  const fn2 = useCallback(({ xy: [, y] }) => {
    const scroll = clamp(control.scroll + (y - control.last), ...bounds)
    // setControl({last: y, scroll: scroll});
    // set({ y: scroll })
  }, [])


  const setLock = useCallback(e => setControl({...control, lock: e}));  
  const setY = useCallback(e => {    
    set({y: e})
  }, [y, set]);


  const bind = useGesture({ onWheel: fn2, onDrag: fn }, props)
  useEffect(() => props && props.domTarget && bind(), [props, bind])
  
  
  
  return {y, setLock, setY}
}
