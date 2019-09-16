import * as THREE from 'three/src/Three'
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { apply as applyThree, Canvas, useRender, useThree } from 'react-three-fiber'
import { apply as applySpring, useSpring, a } from 'react-spring/three'
import { a as aDom } from '@react-spring/web'
import './styles.css'
import { Images, Image } from './sceneElements/Images'
import Stars from './sceneElements/Stars'
import heart from './images/heart.mp4'
import video1 from './images/small/video1.mp4'
import video2 from './images/small/video2.mp4'
import Logo from './sceneElements/Logo'

import ContactFormElement from './sceneElements/ContactFormElement'

import useYScroll from './helpers/useYScroll'

import ContactForm from './sceneElements/ContactForm'
import { Vector3, Camera, SpotLight } from 'three/src/Three';
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
  const cameraControl = useYScroll([0, 50], { domTarget: window })
  return (
    <>
      {
        loaded === true ?
          <>
            <Canvas className="canvas" onMouseMove={onMouseMove}>
              <Scene mouse={mouse} cameraControl={cameraControl} imageLoader={imageLoader} />
            </Canvas>
            <aDom.div className="bar" style={{ height: cameraControl.scrollSpring.interpolate([0, 50], ['0%', '100%']) }} />

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


function Scene({ imageLoader, mouse, cameraControl: { positionSpring, scrollSpring, setScroll, rotationSpring, setRotation, setScrollDown } }) {
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
    const [posX, posY, posZ] = positionSpring.getValue();
    const [rotX, rotY, rotZ] = rotationSpring.getValue();
    // const posY = positionY.getValue();
    // const posZ = positionZ.getValue();
    // const rot = rotation.getValue();

    // if (pos > 1 && pos < 2) {
    //   setRot(-90);
    //   setY(2);
    // }
    // console.log(rot, pos);

    setScrollDown();

    // if (pos < 0.5) {
    //   setScrollDown(true);
    // } else if (pos > 4.5) {
    //   setScrollDown(false);
    // }

    // if (pos > 1 && pos < 5) {
    //   if ()
    //   setScrollDown(true);
    // }

    // console.log(mouse.interpolate((x, y) => [x / 100, -y / 100, 6.5]).getValue());     

    camera.rotation.x = THREE.Math.degToRad(rotX);
    camera.rotation.y = THREE.Math.degToRad(rotY);
    camera.rotation.z = THREE.Math.degToRad(rotZ);
    camera.position.x = posX;
    camera.position.y = -posY;
    camera.position.z = posZ;
    // console.log(posX, posY, posZ);
    // console.log(scrollSpring.getValue());

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
          context.font = `${fontSize}px -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif`
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

  return (
    <>
      {/* <a.spotLight intensity={1} distance={500} penumbra={0.0} angle={THREE.Math.degToRad(45)} color="white" position={mouse.interpolate((x, y) => [x / 100, -y / 100, 6.5])} /> */}
      {/* <SpotLight  */}
      <a.pointLight intensity={1} color="white" position={mouse.interpolate((x, y) => [x / 100, -y / 100, 6.5])} />
      <Effects factor={scrollSpring.interpolate([0, 150], [1, 0])} />

      <Logo top={scrollSpring} />
      <Stars2 position={[0, 0, -50]} depthTest={false} scrollSpring={scrollSpring} />

      <Images top={scrollSpring} mouse={mouse} scrollMax={scrollMax} snap={snap} imageLoader={imageLoader} />
      {/* <Stars position={[0, 0, 0]} /> */}

      {/*<mesh castShadow receiveShadow position={[0, -10, 0]} >*/}
      {/*  <boxGeometry attach="geometry" args={[2, 2, 2]} />*/}
      {/*  <meshStandardMaterial attach="material" />*/}
      {/*</mesh>*/}

      {/* <Thing  position={mouse.interpolate((x, y) => [x / 100, -y / 100, 6.5])}/> */}
      {/*<Background color={mouse.interpolate([0, 0, -50], ['#27282F', '#247BA0', '#70C1B3', '#f8f3f1'])} />*/}

      <ContactForm/>
      <Text opacity={1} position={[0,-4.3,0]} fontSize={20}>
        SCROLL TO EXPLORE
      </Text>
      {/* <Text opacity={1} position={top.interpolate(top => [0, -20 + ((top * 10) / scrollMax) * 2, 0])} fontSize={150}>
        Ipsum
      </Text> */}
    </>
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
function Stars2({ position }) {
  let group = useRef()
  let theta = 0
  useRender(() => {
    const r = 5 * Math.sin(THREE.Math.degToRad((theta += 0.005)))
    const s = Math.cos(THREE.Math.degToRad(theta * 2))
    group.current.rotation.set(r, r, r)
    group.current.scale.set(s, s, s)
  })
  const [geo, mat, coords] = useMemo(() => {
    const geo = new THREE.SphereBufferGeometry(0.4, 2, 2)
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color('peachpuff'), transparent: true })
    const coords = new Array(1000).fill().map(i => [Math.random() * 800 - 400, Math.random() * 800 - 400, Math.random() * 800 - 400])
    return [geo, mat, coords]
  }, [])
  return (
      <a.group ref={group} position={position}>
        {coords.map(([p1, p2, p3], i) => (
            <mesh key={i} geometry={geo} material={mat} position={[p1, p2, p3]} />
        ))}
      </a.group>
  )
}