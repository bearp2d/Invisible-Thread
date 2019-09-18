import * as THREE from 'three/src/Three'
import React, { useRef, useMemo } from 'react'
import { useRender } from 'react-three-fiber'
import { a } from 'react-spring/three'
import { GetRandom } from './HelperFuncitons'
import { easeQuadInOut, easeCircleInOut, easeSinInOut, easeExpInOut, easeQuadIn, easeQuadOut, easePolyInOut, easeBackInOut, easeCubicInOut } from 'd3-ease'

// /** This component rotates a bunch of stars */
export default function Stars({ position, scrollSpring, imageLoader }) {

  const vertexShader = `  
  precision highp float;
  attribute vec3 position;
  attribute vec3 normal;
  attribute vec2 uv;
  
  uniform mat4 modelViewMatrix;
  uniform mat4 modelMatrix;
  uniform mat3 normalMatrix;
  uniform mat4 projectionMatrix;
  uniform vec3 cameraPosition;
  uniform float time;
  uniform float offset;
  
  varying vec3 vPosition;
  varying float vDistance;
  varying float vWDistance;
  varying vec3 vCameraPosition;
  // varying vec2 vTexcoords;
  varying vec2 vUv;


  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    vDistance = distance(gl_Position, vec4(0.,0.,0.,0.));
    vPosition = position;
    vWDistance = distance(position, cameraPosition);
    vCameraPosition = cameraPosition;    
  }
  `
  const fragmentShader = `  
  precision highp float;
  uniform float time;
  uniform float offset;
  uniform vec3 color;
  uniform float speed;
  // uniform sampler2D matCap;
  uniform sampler2D texture;
  varying vec3 vPosition;
  varying float vDistance;
  varying float vWDistance;
  varying vec3 vCameraPosition;
  varying vec2 vUv;

  float max4 (vec4 v) {
    return max (max (v.x, v.y), v.z);
  }

  void main(){  
    // gl_FragColor = vec4(1.,0,0,1.);
    // gl_FragColor = vec4(vWDistance / 100. + time / 20., 0., 0., 0.);
    // gl_FragColor = vec4(offset / 40., 0., 0., 0.);
    // gl_FragColor = vec4(-20. + vPosition.x + offset, 0., 0., 0.);
    // gl_FragColor = color;
    // gl_FragColor = vec4(vUv.x, 0., 0., 0.);
    vec4 texColor = texture2D(texture, vUv);
    float c = step(0.25 + offset, texColor.r);
    gl_FragColor = vec4(1., 0., 0., c);
  }
  `

  // vec3 color1 = vec3(69.,91.,105.)/255.;
  // vec3 color2 = vec3(236.,40.,31.)/255.;
  // vec3 color3 = vec3(195.,58.,78.)/255.;

  let group = useRef()
  let theta = 0
  useRender(() => {
    mat.uniforms.time.value = theta += 0.1;
    if (theta > 200) {
      theta = 0;
    }
    let smoothTheta = theta <= 100 ? (theta) : (200 - theta);
    smoothTheta = easePolyInOut(smoothTheta * 0.01, 4.0);
    // mat.uniforms.offset.value = scrollSpring.getValue() / 60;

    console.log(smoothTheta);

    const r = 0.5 * Math.sin(THREE.Math.degToRad((smoothTheta * 100)))
    const s = Math.cos(THREE.Math.degToRad(theta * 2))
    group.current.rotation.set(r, r, r)
    // group.current.scale.set(s, s, s)

    mat.uniforms.offset.value = smoothTheta * 0.5;
  })
  const [geo, mat, coords] = useMemo(() => {
    // const geo = new THREE.SphereBufferGeometry(20, 30, 30)

    const geo = new THREE.BoxBufferGeometry(40, 40, 40);
    // const geo = new THREE.IcosahedronBufferGeometry(30, 3);
    // const geo = new THREE.TorusKnotGeometry(60, 2, 200, 11, 13, 5);
    // const geo = new THREE.TextBufferGeometry("Invisible Thread", { size: 20, font: new THREE.Font() } )

    // new THREE.BoxBufferGeometry(10, 10, 10);


    // const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color('black'), transparent: true, wireframe: true, opacity: 1 })


    const mat = new THREE.RawShaderMaterial({
      uniforms: {
        time: { value: 0 },
        speed: { value: 1 },
        offset: { value: 0 },
        color: { value: new THREE.Color(0x455b69) },
        texture: { type: "t", value: imageLoader.textures[0][1] }
      },
      vertexShader,
      fragmentShader,
      wireframe: true,
      side: THREE.DoubleSide,
      transparent: true,      
    })


    // const coords = new Array(10).fill().map(i => [Math.random() * 800 - 400, Math.random() * 800 - 400, Math.random() * 800 - 400])
    // const coords = new Array(10).fill().map(i => [Math.random() * 80 - 40, Math.random() * 80 - 40, Math.random() * 80 - 40])
    const coords = new Array(1).fill().map(i => [0, 0, 0])

    return [geo, mat, coords]
  }, [])
  return (
    <a.group ref={group} position={position} >
      {coords.map(([p1, p2, p3], i) => (
        <mesh key={i} geometry={geo} material={mat} position={[p1, p2, p3]} />
      ))}
    </a.group>
  )
}