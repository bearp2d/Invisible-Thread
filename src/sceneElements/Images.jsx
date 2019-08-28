import * as THREE from 'three/src/Three'
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { apply as applySpring, useSpring, a, interpolate } from 'react-spring/three'
import data from '../data'
import { Mesh, Vector3, Material, BufferGeometry, BoxBufferGeometry } from 'three/src/Three';
import { GetRandom } from './HelperFuncitons'

//Image object
export function Images({ top, mouse, scrollMax }) {
  //Load images from data.js  

  const imageList = useMemo(() => data.map(([url, animation], i) => {    
    // let x = i % 2 == 0 ? 1 : -1;    

    let degree = GetRandom(0, 360);
    let radius = 1;
    let x = radius * Math.sin(degree);
    let y = -8 - (i * 4);
    let z = radius * Math.cos(degree);

    let startPosition = [x, y, z]
    return [url, animation, startPosition, 10];
  }), [data])
  

  return imageList.map(([url, animation, [x, y, z], factor], index) => (
    <Image
      rotation={new THREE.Euler(THREE.Math.degToRad(-90))}
      key={index}
      url={url}
      scale={1}      
      // opacity={top.interpolate([0, 500], [0, 1])}
      opacity={1}
      position={new Vector3(x, y, z)}
    />
  ))
}

/** This component loads an image and projects it onto a plane */
export function Image({ url, opacity, scale, ...props }) {
  const texture = useMemo(() => new THREE.TextureLoader().load(url), [url])
  // const texture = useMemo(() => new THREE.MeshBasicMaterial({ color: new THREE.Color('green'), transparent: true }));  
  console.log(url);
  
  // let video = document.getElementById('video3');
  // video.play();
  // const texture = useMemo(() => new THREE.VideoTexture(video))
  // const x = new BoxBufferGeometry(1, 1, 1)

  const [hovered, setHover] = useState(false)
  const hover = useCallback(() => setHover(true), [])
  const unhover = useCallback(() => setHover(false), [])
  const { factor } = useSpring({ factor: hovered ? 1.1 : 1 })
  return (
    <a.mesh {...props} onHover={hover} onUnhover={unhover} scale={factor.interpolate(f => [scale * f, scale * f, 1])}>
      {/* <planeBufferGeometry attach="geometry" args={[5, 5]} /> */}
      <planeGeometry attach="geometry" args={[1, 1, 1]} />
      {/* <a.meshBasicMaterial attach="material" args={texture} /> */}
      <a.meshLambertMaterial attach="material" transparent opacity={opacity}>
        <primitive attach="map" object={texture} />
      </a.meshLambertMaterial>
    </a.mesh>
  )
}
