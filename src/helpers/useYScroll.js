import { useCallback, useEffect, useState } from 'react'
import { useSpring, config } from '@react-spring/core'
import { useGesture } from 'react-use-gesture'
import clamp from 'lodash/clamp'

export default function useYScroll(bounds, props) {
  // const [{ y }, set] = useSpring(() => ({ y: 0, config: config.slow }))
  const [{ y }, set] = useSpring(() => ({ y: 0, config: config.molasses}));
  
  let lock = false;
  let scroll = 0;  
  let last = 0;
  let startDragPos = undefined;


  const startDrag = ({ xy: [, y]}) => {
    startDragPos = y;
  }

  const endDrag = () => {
    startDragPos = undefined;
  }



  const fn = ({ xy: [, cy], previous: [, py], memo = y.getValue() }) => {
    if (!lock) {
      scroll = clamp(memo + (cy - py) * 0.1, ...bounds)
      console.log(startDragPos, cy);
      
      if (startDragPos && Math.abs(startDragPos - cy) > 1) {
        set({ y: scroll })
      }
      return scroll
    }
  }

  const fn2 = ({ xy: [, y] }) => {
    if (!lock) {
    scroll = clamp(scroll + (y - last) * 0.1, ...bounds)    
    set({ y: scroll })
    }
    last = y;
  }

  const setLock = e => lock = e;
  const setY = e => {    
    scroll = e;
    set({ y: e });
  }




  const bind = useGesture({ onWheel: fn2, onDrag: fn, onDragStart: startDrag, onDragEnd: endDrag }, props)
  useEffect(() => props && props.domTarget && bind(), [props, bind])

  return { y, setLock, setY }
}
