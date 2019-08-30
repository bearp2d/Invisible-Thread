import * as THREE from 'three/src/Three'
import React, {useMemo} from 'react'
import { apply as applySpring, useSpring, a, interpolate, config } from 'react-spring/three'
// import { Vector3 } from 'three/src/Three';
import { Image } from './Images'
// import logo from '../images/thisSVG.svg'
import logoPngBlk from '../images/logo_black.png'

let Logo = () => {
  const texture = useMemo(() => new THREE.TextureLoader().load(logoPngBlk), [logoPngBlk])

  return (
    <a.mesh
      position={[0, 0, -5]}      
      scale={[2, 1, 1]}>
      {/* <planeBufferGeometry attach="geometry" args={[5, 5]} /> */}
      <planeGeometry attach="geometry" args={[1, 1, 1]} />
      {/* <a.meshBasicMaterial attach="material" args={texture} /> */}
      <a.meshLambertMaterial attach="material" transparent opacity={1}>
        <primitive attach="map" object={texture} />
      </a.meshLambertMaterial>
    </a.mesh>
  )
}

export default Logo;