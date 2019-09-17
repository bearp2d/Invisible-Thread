import { useEffect } from 'react'
import { useSpring, config } from '@react-spring/core'
import { useGesture } from 'react-use-gesture'
import clamp from 'lodash/clamp'
import { easeQuadInOut, easeCircleInOut, easeSinInOut, easeExpInOut, easeQuadIn, easeQuadOut, easePolyInOut, easeBackInOut, easeCubicInOut } from 'd3-ease'

export default function useYScroll(bounds, props) {
  let lock = false;
  let moveUp = false;
  let stage1 = false;
  let stage2 = false;
  let stage3 = false;
  let back1 = false;
  let back2 = false;
  let back3 = false;
  let formHidden = true;
  const [{ scrollSpring }, setScrollSpring] = useSpring(() => ({ scrollSpring: 0, config: config.default}));
  const [{ positionSpring }, setPositionSpring] = useSpring(() => ({
    positionSpring: [0, 0, 5], config: {
      tension: 190,
      friction: 220,
    }
  }));
  const [{ rotationSpring }, setRotationSpring] = useSpring(() => ({
    rotationSpring: [0, 0, 0], config: {
      tension: 150,
      friction: 220
    }
  }));

  const Stage1 = () => {
    lock = true;
    setPositionSpring({ positionSpring: [0, -5, 20], config: { easing: easeQuadInOut, duration: 4000 } })
    setRotationSpring({ rotationSpring: [-10, 0, 0], config: { easing: easeQuadInOut, duration: 2000 } })
  }
  const Stage2 = () => {
    setPositionSpring({ positionSpring: [0, 0, 5], config: { easing: easeQuadInOut, duration: 2000 } })
    setRotationSpring({ rotationSpring: [-90, 0, 0], config: { easing: easeQuadInOut, duration: 2000 } })
    setTimeout(function () {
      lock = false;
      stage1 = true;
      back1 = true;
    }, 2000)
  }
  const Stage4 = () => {
    // console.log("start rotation")
    lock = true;
    // setPositionSpring({ positionSpring: [0, 10, 0], config: { easing: easeQuadInOut, duration: 2000 } })
    setRotationSpring({ rotationSpring: [40, 0, 0], config: { easing: easeQuadInOut, duration: 2000 } })
  }
  const Stage5 = () => {
    setPositionSpring({ positionSpring: [0, 0, -19], config: { easing: easeQuadInOut, duration: 3000 } })
    setRotationSpring({ rotationSpring: [0, 0, 0], config: { easing: easeQuadInOut, duration: 3000 } })
    setTimeout(function () {
      lock = false;
      stage3 = true;
      back2 = true;
    }, 3000)
  }
  const FormShow = () => {
    var element = document.getElementById('contact-form');
    element.style.opacity = '1';
    formHidden = false;
  }
  const FormHide = () => {
    var element = document.getElementById('contact-form');
    element.style.opacity = '0';
    formHidden = true;
  }
const UpStage1 = () => {
    lock = true;
    back2 = true;
  setPositionSpring({ positionSpring: [0, 23, 5], config: { easing: easeQuadInOut, duration: 4500 } })
  setRotationSpring({ rotationSpring: [-90, 0, 0], config: { easing: easeQuadInOut, duration: 2000 } })
  // setTimeout(function () {
  //   setRotationSpring({ rotationSpring: [-90, 0, 0], config: { easing: easeQuadInOut, duration: 2000 } })
  // }, 2000)
  setTimeout(function () {
    lock = false;
    stage3 = false;
    stage2 = false;
    stage1 = true;
  }, 4500)
}
const UpStage2 = () => {
  lock = true;
  setPositionSpring({ positionSpring: [0, -15, 5], config: { easing: easeQuadInOut, duration: 4000 } })
  setTimeout(function () {
    setPositionSpring({ positionSpring: [0, 0, 5], config: { easing: easeQuadInOut, duration: 3000 } })
    setRotationSpring({ rotationSpring: [0, 0, 0], config: { easing: easeQuadInOut, duration: 3000 } })
  }, 4000)

  setTimeout(function () {
    lock = false;
    stage3 = false;
    stage2 = false;
    stage1 = false;
    back1 = false;
    back2 = false;
    back3 = false;
  }, 4000)
}

  // const Stage3 = () => {
  //   lock = true;
  //   setPositionSpring({ positionSpring: [0, 30, 5], config: { easing: easeQuadInOut, duration: 8000 } })
  //   // setPositionSpring({ positionSpring: [0, 10, 0], config: { easing: easeQuadInOut, duration: 2000 } })
  //   // setRotationSpring({ rotationSpring: [0, 0, 45], config: { easing: easeQuadInOut, duration: 2000 } })
  // }


  const startAnimationDown = () => {
    Stage1()
    setTimeout(Stage2, 2000);
    // setTimeout(Stage3, 4000);
    // setTimeout(Stage4, 10000);
    // setTimeout(Stage5, 12000);
    // setTimeout(Stage6, 10000);
  }



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
    if (!lock) {
      scroll = clamp(memo + (py - cy) * 0.05, ...bounds)
      if (startDragPos && Math.abs(startDragPos - cy) > 1) {
        setScrollSpring({ scrollSpring: scroll })
      }
      return scroll
    }
  }
let colors = ['#E1FFFC', '#E4E6F6', '#E9CDE0', '#DEB6C6', '#91707B'];
  let r = 0;
  let g = 0;
  let b = 0;
  let color = "";
  const fn2 = ({ xy: [, y] }) => {
    if(b < 253 && last < y) {
      // b += 1;
      // g += 1;
      // r += 1;
    }else if(b > 2 && last > y){
      // b -= 1;
      // g -= 1;
      // r -= 1;
    }
      color = r.toString() + g.toString() + b.toString();
    document.getElementsByClassName('canvas')[0].style.backgroundColor ='rgb(' + r +  ',' + g + ',' + b + ')';
    // element2.style.backgroundColor = 'white';
    // console.log("stage1: ", stage1);
    // console.log("stage2: ", stage2);
    // console.log("stage3: ", stage3);
    // console.log("back1: ", back1)
    // console.log("back2: ", back2)
    // console.log("back3: ", back3)
    // console.log("up: ", last > y);
    // console.log("down: ", last < y);
    // console.log("neither: ", last === y);
    // console.log("lock: ", lock);
    if(last > y && back1 && !stage3 && stage1){
      FormHide();
    }
    if(last < y && stage2){
      FormShow();
    }
    if (!lock && !stage1 && last < y) {
      // scroll = clamp(scroll + (y - last) * 0.05, ...bounds)
      // setScrollSpring({ scrollSpring: scroll })
      Stage1();
      setTimeout(Stage2, 3800);
      //setTimeout(FormShow, 5000);
    }else if(!lock && stage2 && last < y && !back2 && last !== y){
      Stage4();
      setTimeout(Stage5, 2000);
    }else if(stage1 && stage2 && stage3 && last > y && !lock){
    UpStage1();
      //setTimeout(FormHide, 5000);
    }else if(back1 && !lock && !stage2 && stage1 && last > y){
      UpStage2();
    }else if(!lock && stage1 && !stage2){
      scroll = clamp(scroll + (y - last) * 0.05, ...bounds)
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

  const setRotation = e => {
    // rotation = e;
    setRotationSpring({ rotationSpring: e });
  }

  // const getPos = () => {
  //   return [positionX, positionY, positionZ]
  // }

  useEffect(() => {
   // startAnimationDown();
  }, )

  const setScrollDown = e => {
    const pos = scrollSpring.getValue();
    const max = 5
    // if (pos > 1 && pos < max) {
    //   if (moveUp) {
    //     setScrollSpring(0)
    //     setRotationSpring({ rotationSpring: 0 })
    //   } else {
    //     setScrollSpring(max + max * 0.1)
    //     setRotationSpring({ rotationSpring : -90 })
    //   }
    // }
    // setPositionSpring({ positionSpring: [0, pos, 5]})

    if (pos > max) {
      moveUp = true;
    }
    if (pos < 1) {
      moveUp = false;
    }
if(!lock) {
  if (pos > 1 && pos <= 4.5) {
    back1 = true;
  } else if (pos > 4.5 && pos <= 5) {

    setPositionSpring({
      positionSpring: [0, 0, 5], config: {
        mass: 20,
        velocity: 0,
        tension: 80,
        friction: 300
      }
    })
  } else if (pos > 5 && pos < 55) {
    back1 = false;
    back2 = false;
    setPositionSpring({positionSpring: [0, pos, 5]})
  } else if (pos >= 55 && !lock && !stage2 && stage1 && !back2) {
    stage2 = true;
  }
}
   // console.log(lock)
   console.log(pos);

    //lock = (pos > 1 && pos < max);
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

  return { positionSpring, scrollSpring, setScroll, rotationSpring, setRotation, setScrollDown }
}
