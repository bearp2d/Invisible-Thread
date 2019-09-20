import { useEffect, useState } from 'react'
import { useSpring, config } from '@react-spring/core'
import { useGesture } from 'react-use-gesture'
import clamp from 'lodash/clamp'
import { easeQuadInOut, easeCircleInOut, easeSinInOut, easeExpInOut, easeQuadIn, easeQuadOut, easePolyInOut, easeBackInOut, easeCubicInOut } from 'd3-ease'

export default function useYScroll(bounds, props) {
  let position = [0, 0, 5];
  let rotation = [0, 0, 0];
  let formPosition = [0, -50, 5];
  // let formPosition = [0, 0, 0];

  const [{ scrollSpring }, setScrollSpring] = useSpring(() => ({ scrollSpring: 0, config: config.molasses }));


  let scrollDirection = -1;
  let lock = false;
  let scroll = 0;
  let last = 0;
  let startDragPos = undefined;
  const startDrag = ({ xy: [, y] }) => {
    startDragPos = y;
  }

  const endDrag = () => {
    startDragPos = undefined;
  }

  const fn = ({ xy: [, cy], previous: [, py], memo = scrollSpring.getValue() }) => {
    // if (!lock) {
    scroll = clamp(memo + (py - cy) * 0.05, ...bounds)
    if (startDragPos && Math.abs(startDragPos - cy) > 1) {
      setScrollSpring({ scrollSpring: scroll })
    }
    return scroll
    // }
  }

  const fn2 = ({ xy: [, y] }) => {

    // if (last > y && back1 && !stage3 && stage1) {
    //   FormHide();
    // }
    // if (last < y && stage2) {
    //   FormShow();
    // }


    if (!lock) {
      // let scrollChange = (y - last) * 0.01;
      scroll = clamp(scroll + (y - last) * 0.03, ...bounds)
      setScrollSpring({ scrollSpring: scroll })
      // Stage3();
      // setTimeout(Stage4, 10000);
      // setTimeout(Stage5, 12000);
    }
    last = y;
  }

  const setScroll = e => {
    scroll = e;
    setScrollSpring({ scrollSpring: scroll })
  }

  const getRotation = () => {
    return rotation;
  }

  const getPosition = () => {
    return position;
  }

  const getFormPosition = () => {
    return formPosition;
  }

  const updateScroll = e => {
    const pos = scrollSpring.getValue();
    if (pos >= 0 && pos <= 20) {
      let e = easeQuadInOut(pos / 20);
      position = [0, e * -5, e * 15 + 5];
      rotation = [e * -10, 0, 0];
    } else if (pos > 20 && pos <= 40) {
      let e = easeQuadInOut((pos - 20) / 20);
      position = [0, -5 + e * 5, 15 + 5 - e * 15];
      rotation = [-10 + e * -80, 0, 0];

    } else if (pos > 40 && pos <= 90) {
      let e = (pos - 40) / 50;
      position = [0, e * 40, 5];
      rotation = [-90, 0, 0];

    } else if (pos > 90 && pos <= 100) {
      let e = easeQuadOut((pos - 90) / 10);
      position = [0, 40 + e * 5, 5];
      rotation = [-90, 0, 0];
    }

    if (scroll >= 0 && scroll < 40) {
      if (scrollDirection === 1) {
        setScrollSpring({ scrollSpring: scroll -= 0.125 })
      } else if (scrollDirection === 0) {
        setScrollSpring({ scrollSpring: scroll += 0.125 })
      }
    }
    if (scroll <= 0.1) {
      setScrollSpring({ scrollSpring: 0 })
      scrollDirection = -1;
    }

    if (scroll >= 40) {
      scrollDirection = -1;
    }

    if (scrollDirection === -1 && scroll > 1 && scroll < 20) {
      scrollDirection = 0;
    }

    if (scrollDirection === -1 && scroll > 20 && scroll < 40) {
      scrollDirection = 1;
    }

  }

  const bind = useGesture({ onWheel: fn2, onDrag: fn, onDragStart: startDrag, onDragEnd: endDrag }, props)
  useEffect(() => props && props.domTarget && bind(), [props, bind])

  return { getPosition, scrollSpring, setScroll, getRotation, updateScroll, getFormPosition }
}
