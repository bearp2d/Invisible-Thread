import * as THREE from 'three/src/Three'
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { apply as applyThree, Canvas, useRender, useThree } from 'react-three-fiber'
import { apply as applySpring, useSpring, a } from 'react-spring/three'
import { a as aDom } from '@react-spring/web'
import './styles.css'
import { Images } from './sceneElements/Images'
import Stars from './sceneElements/Stars'
import Logo from './sceneElements/Logo'

import ContactFormElement from './sceneElements/ContactFormElement'
import useYScroll from './helpers/useYScroll'
import ContactForm from './sceneElements/ContactForm'
import ImageLoader from './helpers/ImageLoader'
import data from './data'

import { EffectComposer } from './postprocessing/EffectComposer'
import { RenderPass } from './postprocessing/RenderPass'
import { GlitchPass } from './postprocessing/GlitchPass'
import { WaterPass } from './postprocessing/WaterPass'

applySpring({ EffectComposer, RenderPass, GlitchPass, WaterPass })
applyThree({ EffectComposer, RenderPass, GlitchPass, WaterPass })

function App() {
  const [{ mouse }, set] = useSpring(() => ({ mouse: [0, 0] }));
  const onMouseMove = useCallback(({ clientX: x, clientY: y }) => set({ mouse: [x - window.innerWidth / 2, y - window.innerHeight / 2] }), []);
  const [loaded, setLoaded] = useState(false);
  const imageLoader = useMemo(() => new ImageLoader(data, setLoaded), [data])
  const cameraControl = useYScroll([0, 100], { domTarget: window })
  return (
    <>
      {
        loaded === true ?
          <>
            <Canvas className="canvas" onMouseMove={onMouseMove}>
              <Scene mouse={mouse} cameraControl={cameraControl} imageLoader={imageLoader} />
            </Canvas>
            <aDom.div className="bar" style={{ height: cameraControl.scrollSpring.interpolate([0, 100], ['0%', '100%']) }} />
            {/* <Logo id="logoSm"/> */}
            <ContactFormElement />
          </>
          :
          <Loading />
      }
      {/* <video id="video1" loop crossOrigin="anonymous" style={{ display: 'none' }}>
        <source src={heart} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
      </video>
      <video id="video2" loop crossOrigin="anonymous" style={{ display: 'none' }}>
        <source src={video1} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
      </video>
      <video id="video3" loop crossOrigin="anonymous" style={{ display: 'none' }}>
        <source src={video2} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
      </video> */}
    </>
  );
}
export default App;


function Loading() {

  return <>
    <h1 style={{ color: 'white', margin: 'auto', fontSize: '20vh' }}>Loading...</h1>
  </>
}


function Scene({ imageLoader, mouse, cameraControl: { getPosition, scrollSpring, setScroll, getRotation, updateScroll } }) {
  const { size, camera, scene } = useThree()
  const scrollMax = size.height * 5.5
  const [snapped, setSnapped] = useState(false);

  const snap = useCallback((snapTo, newY) => {
    if (snapTo) {
      setScroll(-(newY + 2.5));
      setSnapped(true);
    } else {
      setScroll(scrollSpring.getValue() - 2);
      setSnapped(false);
    }
  }, [setScroll])

  useRender(() => {
    const [posX, posY, posZ] = getPosition();
    const [rotX, rotY, rotZ] = getRotation();
    // const posY = positionY.getValue();
    // const posZ = positionZ.getValue();
    // const rot = rotation.getValue();

    // if (pos > 1 && pos < 2) {
    //   setRot(-90);
    //   setY(2);
    // }
    // console.log(rot, pos);

    updateScroll();
    camera.rotation.x = THREE.Math.degToRad(rotX);
    camera.rotation.y = THREE.Math.degToRad(rotY);
    camera.rotation.z = THREE.Math.degToRad(rotZ);
    camera.position.x = posX;
    camera.position.y = -posY;
    camera.position.z = posZ;
    //Set mouse hover offset
    const mousePos = mouse.getValue();
    let cameraOffset = new THREE.Vector3(
      (mousePos[0] * 10) / 50000 - camera.position.x,
      camera.position.y,
      (mousePos[1] * 10) / 50000 - camera.position.z)
    // if (posY > 1) {
    // camera.position.lerp(cameraOffset, 0.8);
    // }
  })
  return (
    <>
      <a.pointLight intensity={1} color="white" position={mouse.interpolate((x, y) => [x / 100, -y / 100, 6.5])} />
      {/* <Effects factor={scrollSpring.interpolate([0, 150], [1, 0])} /> */}
      <Logo />
      <Stars position={[0, 0, -50]} depthTest={false} scrollSpring={scrollSpring} imageLoader={imageLoader} />
      <Images top={scrollSpring} mouse={mouse} scrollMax={scrollMax} snap={snap} imageLoader={imageLoader} opacity={.5} />
      <ContactForm />
      {/* <Text opacity={1} position={[0,-4.3,0]} fontSize={14}>
        SCROLL TO EXPLORE
      </Text> */}
    </>
  )
}


/** This renders text via canvas and projects it as a sprite */
function Text({ children, position, opacity, color = 'white', fontSize = 410 }) {
  const {
    size: { width, height },
    viewport: { width: viewportWidth, height: viewportHeight }
  } = useThree()
  const scale = viewportWidth > viewportHeight ? viewportWidth : viewportHeight
  const canvas = useMemo(
    () => {
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 2048
      const context = canvas.getContext('2d')
      context.font = `${fontSize}vmin -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif`
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.fillStyle = color
      context.fillText(children, 1024, 1024 - 410 / 2)
      return canvas
    },
    [children, width, height]
  )
  return (
    <a.sprite scale={[scale, scale, 1]} position={position}>
      <a.spriteMaterial attach="material" transparent opacity={opacity}>
        <canvasTexture attach="map" image={canvas} premultiplyAlpha onUpdate={s => (s.needsUpdate = true)} />
      </a.spriteMaterial>
    </a.sprite>
  )
}


// /** This component creates a glitch effect */
const Effects = React.memo(({ factor }) => {
  const { gl, scene, camera, size } = useThree()
  const composer = useRef()

  useEffect(() => void composer.current.setSize(size.width, size.height), [size])
  // This takes over as the main render-loop (when 2nd arg is set to true)
  useRender(() => composer.current.render(), true)
  return (
    <effectComposer ref={composer} args={[gl]}>
      {/* Main Pass that renders the Scene */}
      <renderPass attachArray="passes" args={[scene, camera]} />
      {/*<a.waterPass attachArray="passes" factor={1} renderToScreen />*/}

      {/*<a.unrealBloomPass attachArray="passes" factor={1} renderToScreen />*/}
      {/* Effect Passes renderToScreen draws current pass to screen*/}
      <a.glitchPass attachArray="passes" renderToScreen factor={factor} />
    </effectComposer>
  )
})