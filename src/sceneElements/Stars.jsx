import * as THREE from 'three/src/Three'
import React, { useRef, useMemo } from 'react'
import { useRender } from 'react-three-fiber'
import { a } from 'react-spring/three'
import { GetRandom } from './HelperFuncitons'

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

  void main(){  
    // gl_FragColor = vec4(1.,0,0,1.);
    // gl_FragColor = vec4(vWDistance / 100. + time / 20., 0., 0., 0.);
    // gl_FragColor = vec4(offset / 40., 0., 0., 0.);
    // gl_FragColor = vec4(-20. + vPosition.x + offset, 0., 0., 0.);
    // gl_FragColor = color;
    // gl_FragColor = vec4(vUv.x, 0., 0., 0.);
    gl_FragColor = texture2D(texture, vUv);
  }
  `

  // vec3 color1 = vec3(69.,91.,105.)/255.;
  // vec3 color2 = vec3(236.,40.,31.)/255.;
  // vec3 color3 = vec3(195.,58.,78.)/255.;

  let group = useRef()
  let theta = 0
  useRender(() => {
    const r = 0.5 * Math.sin(THREE.Math.degToRad((theta += 0.01)))
    const s = Math.cos(THREE.Math.degToRad(theta * 2))
    // group.current.rotation.set(r, r, r)
    // group.current.scale.set(s, s, s)

    mat.uniforms.time.value = theta += 0.1;
    mat.uniforms.offset.value = scrollSpring.getValue();
    if (theta > 40) {
      theta = 0;
    }
  })
  const [geo, mat, coords] = useMemo(() => {
    const geo = new THREE.SphereBufferGeometry(20, 10, 10)

    // const geo = new THREE.BoxBufferGeometry(10, 10, 10);
    // const geo = new THREE.IcosahedronBufferGeometry(20, 1);
    //  new THREE.BoxBufferGeometry(10, 10, 10);


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
      wireframe: false,
      side: THREE.DoubleSide
    })    
    

    // const coords = new Array(100).fill().map(i => [Math.random() * 800 - 400, Math.random() * 800 - 400, Math.random() * 800 - 400])
    const coords = new Array(1).fill().map(i => [0, 0, 0])

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