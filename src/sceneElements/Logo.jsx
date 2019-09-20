import * as THREE from 'three/src/Three'
import React, { useMemo } from 'react'
import { a } from 'react-spring/three'
import { useThree } from 'react-three-fiber'
// import { Vector3 } from 'three/src/Three';
// import { Image } from './Images'
// import logo from '../images/thisSVG.svg'
// import logoPngBlk from '../images/ToResize/logo_whiteSmall.png'
const Logo = ({ imageLoader }) => {
  const { viewport } = useThree();
  // const texture = useMemo(() => new THREE.TextureLoader().load(logoPngBlk), [logoPngBlk])

  return (
    <>
      <a.mesh
        position={[0, 0, 0]}
        scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry attach="geometry" args={[1, 1]} />
        <a.meshBasicMaterial attach="material" color={'black'} depthTest={true} />
      </a.mesh>

      <a.mesh
        position={[0, 0, 1]}
        scale={[viewport.width * 0.5, viewport.width * 0.5, 1]}>
        {/* <planeBufferGeometry attach="geometry" args={[5, 5]} /> */}
        <planeGeometry attach="geometry" args={[1, 1]} />
        {/* <a.meshBasicMaterial attach="material" args={texture} /> */}
        {/* <a.meshBasicMaterial attach="material" color={'blue'} depthTest={false} /> */}
        <a.meshLambertMaterial attach="material" transparent opacity={1} depthTest={true}>
          <primitive attach="map" object={imageLoader.logo} />
        </a.meshLambertMaterial>
      </a.mesh>
    </>
  )
}

export default Logo;