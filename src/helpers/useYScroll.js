import * as THREE from 'three/src/Three'
import { useCallback, useEffect, useState } from 'react'
import { useSpring, config } from '@react-spring/core'
import { useGesture } from 'react-use-gesture'
import clamp from 'lodash/clamp'

export default function useYScroll(bounds, props) {
  // const [{ y }, set] = useSpring(() => ({ y: 0, config: config.slow }))
  const [{ ySpring }, setYSpring] = useSpring(() => ({ ySpring: 0, config: config.molasses }));
  const [{ rotation }, setRotationSpring] = useSpring(() => ({ rotation: 0, config: {
    friction: 120
  }}));
  let scroll = 0;
  let last = 0;
  let startDragPos = undefined;
  let lock = false;

  let moveUp = false;

  const startDrag = ({ xy: [, y] }) => {
    startDragPos = y;
  }

  const endDrag = () => {
    startDragPos = undefined;
  }

  const fn = ({ xy: [, cy], previous: [, py], memo = ySpring.getValue() }) => {    
    if (!lock) {
      scroll = clamp(memo + (py - cy) * 0.05, ...bounds)
      if (startDragPos && Math.abs(startDragPos - cy) > 1) {
        setYSpring({ ySpring: scroll })
      }
      return scroll
    }
  }

  const fn2 = ({ xy: [, y] }) => {    
    if (!lock) {
      scroll = clamp(scroll + (y - last) * 0.05, ...bounds)
      setYSpring({ ySpring: scroll })
    }
    last = y;
  }

  const setY = e => {
    scroll = e;
    setYSpring({ ySpring: e });
  }

  const setRot = e => {
    setRotationSpring({ rotation: e });
  }

  const setScrollDown = e => {
    const pos = ySpring.getValue();
    const max = 5
    if (pos > 1 && pos < max) {
      if (moveUp) {
        setY(0)
        setRotationSpring({ rotation: 0 })
      } else {
        setY(max + max * 0.1)
        setRotationSpring({ rotation: -90 })
      }
    }

    if (pos > max) {
      moveUp = true;
    }
    if (pos < 1) {
      moveUp = false;
    }
    lock = (pos > 1 && pos < max);  
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

  return { ySpring, setY, rotation, setRot, setScrollDown }
}
