import * as THREE from 'three/src/Three'
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { apply as applyThree, Canvas, useRender, useThree } from 'react-three-fiber'
import { apply as applySpring, useSpring, a, interpolate } from 'react-spring/three'
import './styles.css'
import { Images, Image } from './sceneElements/Images'
import Text from './sceneElements/Text'
import Thread from './sceneElements/Thread'
import Stars from './sceneElements/Stars'
import heart from './images/heart.mp4'
import video1 from './images/small/video1.mp4'
import video2 from './images/small/video2.mp4'
import logo from './images/thisSVG.svg'
import {CSS3DRenderer, CSS3DObject} from "three/examples/jsm/renderers/CSS3DRenderer";
// Import and register postprocessing classes as three-native-elements for both react-three-fiber & react-spring
// They'll be available as native elements <effectComposer /> from then on ...
import { EffectComposer } from './postprocessing/EffectComposer'
import { RenderPass } from './postprocessing/RenderPass'
import { GlitchPass } from './postprocessing/GlitchPass'
import { WaterPass } from './postprocessing/WaterPass'

// applySpring({ EffectComposer, RenderPass, GlitchPass, WaterPass, Logger })
// applyThree({ EffectComposer, RenderPass, GlitchPass, WaterPass, Logger, App })

function App() {
  const [{ top, mouse }, set] = useSpring(() => ({ top: 0, mouse: [0, 0] }));
  const onMouseMove = useCallback(({ clientX: x, clientY: y }) => set({ mouse: [x - window.innerWidth / 2, y - window.innerHeight / 2] }), []);
  const onScroll = useCallback(e => set({ top: e.target.scrollTop }), []);  
  const cam = new THREE.PerspectiveCamera(45, 0, 0.1, 1000);
  cam.position.z = 0;

  return (
    <>
      <Canvas className="canvas" camera={cam}>
        <Scene top={top} mouse={mouse} />        
      </Canvas>
      <div className="scroll-container" onScroll={onScroll} onMouseMove={onMouseMove}>        
        <div style={{ height: '525vh' }} />        
        <video id="video1" loop crossOrigin="anonymous" style={{ display: 'none' }}>
          <source src={heart} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
        </video>
        <video id="video2" loop crossOrigin="anonymous" style={{ display: 'none' }}>
          <source src={video1} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
        </video>
        <video id="video3" loop crossOrigin="anonymous" style={{ display: 'none' }}>
          <source src={video2} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
        </video>
      </div>
    </>
  );
}

export default App;

function newScene(camera){
  var scene, renderer;
  var scene2, renderer2;
  var controls;
  init();
  animate();
  function init() {
    // camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    // camera.position.set( 200, 200, 0 );
    //alert("1");
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf0f0f0 );
    scene2 = new THREE.Scene();
    var material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, wireframeLinewidth: 1, side: THREE.DoubleSide } );
    //
    //var element = document.getElementById( 'text2' );
    for ( var i = 0; i < 1; i ++ ) {
      var element = document.createElement( 'div' );
      element.setAttribute("id", "div3d")
       element.style.zIndex = '-3';
      element.style.width = '70px';
      element.style.height = '70px';
      //element.style.opacity = '0.6';
      element.style.background = new THREE.Color( Math.random() * 0xffffff ).getStyle();
      var object = new CSS3DObject( element );
      object.position.x = Math.random() * 200 - 100;
      object.position.y = i - 160;
      object.position.z = 0;
      object.rotation.x = Math.random();
      object.rotation.y = Math.random();
      object.rotation.z = Math.random();
      object.scale.x = 0.6;
      object.scale.y = 0.6;
      scene2.add( object );
      var geometry = new THREE.PlaneBufferGeometry( 75, 75 );
      var mesh = new THREE.Mesh( geometry, material );
      mesh.position.copy( object.position );
      mesh.rotation.copy( object.rotation );
      mesh.scale.copy( object.scale );
      scene.add( mesh );
    }
    //
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth - 100, window.innerHeight - 100);
    document.body.appendChild( renderer.domElement );
    renderer2 = new CSS3DRenderer();
    renderer2.setSize( window.innerWidth, window.innerHeight );
    renderer2.domElement.style.position = 'absolute';
    renderer2.domElement.style.top = '2vh';
    document.body.appendChild( renderer2.domElement );
    //  controls = new TrackballControls( camera, renderer2.domElement );
  }
  function animate() {
    requestAnimationFrame( animate );
    //controls.update();
    renderer.render( scene, camera );
    renderer2.render( scene2, camera );
  }
}

function Scene({ top, mouse }) {
  const { size } = useThree()
  const scrollMax = size.height * 4.5  

  const { camera } = useThree();

  useRender(() => {    
    const pos = top.getValue();
    if (pos < 900) {      
      camera.rotation.x = THREE.Math.degToRad(-(pos / 10));
    } else {
      camera.rotation.x = THREE.Math.degToRad(-90);
    }

    if (pos < 900) {
      camera.position.y = 0;      
    } else {      
      camera.position.y = -((pos - 900) / 100);
    }        
  })
  newScene(camera);
  return (
    <>
      <a.spotLight intensity={1.2} color="white" position={mouse.interpolate((x, y) => [x / 100, -y / 100, 6.5])} />
      {/* <Effects factor={top.interpolate([0, 150], [1, 0])} /> */}
      <Background color={top.interpolate([0, scrollMax * 0.25, scrollMax * 0.8, scrollMax], ['#27282F', '#247BA0', '#70C1B3', '#f8f3f1'])} />
      <Stars position={top.interpolate(top => [0, -1 + top / 20, 0])} />      
      
      <Images top={top} mouse={mouse} scrollMax={scrollMax} />

      {/* <Text opacity={1} fontSize={210} >
        Invisible Thread
      </Text> */}      
      {/* <Text opacity={1} position={top.interpolate(top => [0, -20 + ((top * 10) / scrollMax) * 2, 0])} fontSize={150}>
        Ipsum
      </Text> */}
    </>
  )
}

const Banner = () => {
  return <div className="contact-us">
    <h1>Contact Us</h1>
    <input />
    <input />
    <input />
    <input />
    <button>Send</button>
  </div>
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
      {/* <renderPass attachArray="passes" args={[scene, camera]} /> */}
      {/* <a.waterPass attachArray="passes" factor={factor} renderToScreen /> */}

      {/* <a.unrealBloomPass attachArray="passes" factor={factor} renderToScreen /> */}
      {/* Effect Passes renderToScreen draws current pass to screen*/}
      {/* <a.glitchPass attachArray="passes" renderToScreen factor={factor} /> */}
    </effectComposer>
  )
})

// /** This component creates a fullscreen colored plane */
function Background({ color }) {
  const { viewport } = useThree()
  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry attach="geometry" args={[1, 1]} />
      <a.meshBasicMaterial attach="material" color={color} depthTest={false} />
    </mesh>
  )
}
