import * as THREE from 'three/src/Three'
import { useCallback, useEffect, useState } from 'react'
import { useSpring, config } from '@react-spring/core'
import { useGesture } from 'react-use-gesture'
import clamp from 'lodash/clamp'

export default function useYScroll(bounds, props) {
  // const [{ y }, set] = useSpring(() => ({ y: 0, config: config.slow }))
  const [{ y }, setYSpring] = useSpring(() => ({ y: 0, config: config.molasses }));
  const [{ rotation }, setRotationSpring] = useSpring(() => ({ rotation: 0, config: config.molasses }));  
  
  let scroll = 0;
  let last = 0;
  let startDragPos = undefined;

  const startDrag = ({ xy: [, y] }) => {
    startDragPos = y;
  }

  const endDrag = () => {
    startDragPos = undefined;
  }

  const fn = ({ xy: [, cy], previous: [, py], memo = y.getValue() }) => {    
    if (!(rotation > -90 && rotation < 0)) {
      scroll = clamp(memo + (cy - py) * 0.1, ...bounds)
      if (startDragPos && Math.abs(startDragPos - cy) > 1) {
        setYSpring({ y: scroll })
      }
      return scroll
    }
  }

  const fn2 = ({ xy: [, y] }) => {    
    if (!(rotation > -90 && rotation < 0)) {
      scroll = clamp(scroll + (y - last) * 0.1, ...bounds)
      setYSpring({ y: scroll })
    }
    last = y;
  }

  const setY = e => {
    scroll = e;
    setYSpring({ y: e });
  }

  const setRot = e => {
    setRotationSpring({ rotation: e });    
  }
  

  // const [{ rotation }, set] = useSpring(() => ({ rotation: 0, config: config.slow }));
    // camera.rotation.x = THREE.Math.degToRad(-90);

  // if (pos < vh(2)) {
  //   set({ rotation: 0 });
  //   // set({ rotation: -(pos / (vh(100) * 0.9)) });
  // } else {
  //   set({ rotation: -90 });
  // }
  // camera.rotation.x = THREE.Math.degToRad(rotationValue);

  // setLock((rotationValue > -90 && rotationValue < 0))


  // if (pos < vh(2)) {
  //   camera.position.y = 0;
  // } else {
  //   camera.position.y = -pos;
  // }

  const bind = useGesture({ onWheel: fn2, onDrag: fn, onDragStart: startDrag, onDragEnd: endDrag }, props)
  useEffect(() => props && props.domTarget && bind(), [props, bind])

  return { y, setY, rotation, setRot }
}
