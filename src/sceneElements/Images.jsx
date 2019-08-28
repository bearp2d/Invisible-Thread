import * as THREE from 'three/src/Three'
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { apply as applySpring, useSpring, a, interpolate } from 'react-spring/three'
import data from '../data'
import { Mesh, Vector3, Material, BufferGeometry, BoxBufferGeometry } from 'three/src/Three';
import { GetRandom } from './HelperFuncitons'
import { useRender } from 'react-three-fiber';

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
      startPosition={new Vector3(x, y, z)}
    />
  ))
}

/** This component loads an image and projects it onto a plane */
export function Image({ url, opacity, scale, startPosition, ...props }) {
  const texture = useMemo(() => new THREE.TextureLoader().load(url), [url])

  // const texture = useMemo(() => new THREE.MeshBasicMaterial({ color: new THREE.Color('green'), transparent: true }));  

  // let video = document.getElementById('video3');
  // video.play();
  // const texture = useMemo(() => new THREE.VideoTexture(video))
  // const x = new BoxBufferGeometry(1, 1, 1)


  // useRender(() => {
  //   if (hovered) {
  //     setPosition(position.lerp(new Vector3(), 0.1))      
  //   } else {
  //     setPosition(position.lerp(startPosition, 0.1))      
  //   }
  // });


  const [hovered, setHover] = useState(false)
  const hover = useCallback(() => {
    setHover(true)
    console.log('hover');
  }
    , [])
  const unhover = useCallback(() => setHover(false), [])
  const { factor } = useSpring({ factor: hovered ? 1.1 : 1 })

  const { position } = useSpring({ position: hovered ? [0, startPosition.y, 0] : [0, startPosition.y, 0] })  

  return (
    <a.mesh {...props}

      // position={position.interpolate(e => [e[0], e[1], e[2]])} 
      position={position}

      onPointerOver={hover} onPointerOut={unhover} scale={factor.interpolate(f => [scale * f, scale * f, 1])}>
      {/* <planeBufferGeometry attach="geometry" args={[5, 5]} /> */}
      <planeGeometry attach="geometry" args={[1, 1, 1]} />
      {/* <a.meshBasicMaterial attach="material" args={texture} /> */}
      <a.meshLambertMaterial attach="material" transparent opacity={opacity}>
        <primitive attach="map" object={texture} />
      </a.meshLambertMaterial>
    </a.mesh>
  )
}
