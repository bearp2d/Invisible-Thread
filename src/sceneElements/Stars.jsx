import * as THREE from 'three/src/Three'
import React, { useRef, useMemo } from 'react'
import { useRender } from 'react-three-fiber'
import { a } from 'react-spring/three'
export default function Stars({ position, imageLoader }) {

  const vertexShader = `  
  precision highp float;
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
  `
  const fragmentShader = `
  precision highp float;
  uniform float offset;
  uniform sampler2D texture;
  varying vec2 vUv;
  void main(){
    vec2 uvOS = vUv / vec2(4., 4.) + vec2(offset / 4., 0.);
    vec4 texColor = texture2D(texture, uvOS);
    float c = step(0.55, texColor.r);
    gl_FragColor = vec4(texColor.rgb, texColor.r - .5);
  }
  `
  let group = useRef()
  let theta = 0
  useRender(() => {
    theta += 0.0006;
    if (theta >= 2) {
      theta = 0;
    }
    let smoothTheta = theta <= 1 ? (theta) : (2 - theta);
    mat.uniforms.offset.value = smoothTheta;
  })
  const [geo, mat, coords] = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(300, 3);
    const mat =
      new THREE.RawShaderMaterial({
        uniforms: {
          time: { value: 0 },
          speed: { value: 1 },
          offset: { value: 0 },
          color: { value: new THREE.Color(0x00ff00) },
          texture: { type: "t", value: imageLoader.textures[0][1] }
        },
        vertexShader,
        vertexColors: THREE.VertexColors,
        fragmentShader,
        wireframe: true,
        side: THREE.DoubleSide,
        transparent: true,
      })
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