import * as THREE from 'three/src/Three'
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { apply as applySpring, useSpring, a, interpolate } from 'react-spring/three'
import data from '../data'


// /** This component creates a bunch of parallaxed images */
export function Images({ top, mouse, scrollMax }) {
  return data.map(([url, x, y, factor, z, scale], index) => (
    <Image
      key={index}
      url={url}
      scale={scale}
      opacity={top.interpolate([0, 500], [0, 1])}
      position={interpolate([top, mouse], (top, mouse) => [
        (-mouse[0] * factor) / 50000 + x,
        (mouse[1] * factor) / 50000 + y * 1.15 + ((top * factor) / scrollMax) * 2,
        z + top / 2000
      ])}
    />
  ))
}

/** This component loads an image and projects it onto a plane */
export function Image({ url, opacity, scale, ...props }) {
  const texture = useMemo(() => new THREE.TextureLoader().load(url), [url])
  // let video = document.getElementById('video3');
  // video.play();
  // const texture = useMemo(() => new THREE.VideoTexture(video))
  
  const [hovered, setHover] = useState(false)
  const hover = useCallback(() => setHover(true), [])
  const unhover = useCallback(() => setHover(false), [])
  const { factor } = useSpring({ factor: hovered ? 1.1 : 1 })
  return (
    <a.mesh {...props} onHover={hover} onUnhover={unhover} scale={factor.interpolate(f => [scale * f, scale * f, 1])}>
      <planeBufferGeometry attach="geometry" args={[5, 5]} />
      <a.meshLambertMaterial attach="material" transparent opacity={opacity}>
        <primitive attach="map" object={texture} />
      </a.meshLambertMaterial>
    </a.mesh>
  )
}
