import * as THREE from 'three/src/Three'
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { apply as applySpring, useSpring, a, interpolate, config } from 'react-spring/three'
import data from '../data'
import { Mesh, Vector3, Material, BufferGeometry, BoxBufferGeometry } from 'three/src/Three';
import { GetRandom } from './HelperFuncitons'
import { useRender } from 'react-three-fiber';

//Image object
export function Images({ top, mouse, scrollMax, snap }) {
  //Load images from data.js  

  const [selected, setSelected] = useState(-1);

  const selectImage = (key, y) => {    

    setSelected(key);
    if (key > -1) {
      snap(true, y)
    } else {
      snap(false)
    }

  }



  const imageList = useMemo(() => data.map(([url, animation], i) => {

    const texture = new THREE.TextureLoader().load(url);
    // texture.minFilter = THREE.LinearFilter;
    // const {naturalWidth, naturalHeight} = texture.image;    
    // let x = i % 2 == 0 ? 1 : -1;

    let degree = GetRandom(0, 360);
    let radius = 2;
    let x = radius * Math.sin(degree);
    let y = -12 - (i * 4);
    let z = radius * Math.cos(degree);

    // let x = 0;
    // let z = 0;
    // let y = -1.5;

    let startPosition = [x, y, z]
    return [animation, startPosition, texture];
  }), [data])

  return imageList.map(([animation, [x, y, z], texture], index) => (
    <Image
      snap={snap}
      rotation={new THREE.Euler(THREE.Math.degToRad(-90))}
      key={index}
      index={index}
      texture={texture}
      selected={selected}
      selectImage={selectImage}
      // opacity={top.interpolate([0, 500], [0, 1])}
      opacity={1}
      startPosition={new Vector3(x, y, z)}
    />
  ))
}

/** This component loads an image and projects it onto a plane */
export function Image({ url, opacity, startPosition, texture, selected, selectImage, index, ...props }) {

  const [sx, sy] = useMemo(() => {
    if (texture.image) {
      const { naturalWidth, naturalHeight } = texture.image;
      return getScale([naturalWidth, naturalHeight]);
    } else {
      return [1, 1];
    }
  }, [texture.image])

  // console.log(texture);
  // const {naturalWidth, naturalHeight} = texture.image;
  // const [sx, sy] = getScale([naturalWidth, naturalHeight]);
  // const [sx, sy] = [1, 1];


  // const texture = useMemo(() => new THREE.MeshBasicMaterial({ color: new THREE.Color('green'), transparent: true }));  

  // let video = document.getElementById('video1');
  // video.play();
  // const texture = useMemo(() => new THREE.VideoTexture(video))

  const [hovered, setHover] = useState(false)

  const hover = useCallback(e => {
    e.stopPropagation();
    setHover(true)
  }, [])
  const unhover = useCallback(e => {
    setHover(false)
  }, [])

  const toggle = e => {
    e.stopPropagation();
    if (selected === index) {
      selectImage(-1, 0)
    } else {
      selectImage(index, startPosition.y)
    }
    setHover(!hovered)
  }

  const { position } = useSpring({
    position: selected === index ? [0, startPosition.y, 0] : [startPosition.x, startPosition.y, startPosition.z],
    config: {
      tension: 100,
      friction: 40,
      mass: 1,
      // velocity: 5
    }
  })

  return (
    <a.mesh {...props}
      position={position.interpolate((x, y, z) => [x, y, z], 0.1)}
      onPointerUp={toggle}
      // onPointerOver={hover} onPointerOut={unhover}
      scale={[sx, sy, 1]}>
      {/* <planeBufferGeometry attach="geometry" args={[5, 5]} /> */}
      <planeGeometry attach="geometry" args={[1, 1, 1]} />
      {/* <a.meshBasicMaterial attach="material" args={texture} /> */}
      <a.meshLambertMaterial attach="material" transparent opacity={opacity}>
        <primitive attach="map" object={texture} />
      </a.meshLambertMaterial>
    </a.mesh>
  )
}

const getScale = ([x, y]) => {
  if (x > y) {
    return [1, y / x]
  } else {
    return [x / y, 1]
  }
}