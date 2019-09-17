import * as THREE from 'three/src/Three'
import React, { useState, useCallback, useMemo } from 'react'
import { useSpring, a } from 'react-spring/three'
import data from '../data'
import { Vector3 } from 'three/src/Three';
import { GetRandom } from './HelperFuncitons'

//Image object
export function Images({ top, mouse, scrollMax, snap, imageLoader }) {
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


  let left = false
  let right = true;
  let degree = 0;
  const imageList = useMemo(() => imageLoader.materials.map(([i, material]) => {

    let spread = 20;
    //console.log(left, right);
    //1
    if (left && right) {
      degree = (GetRandom(0, spread) + 45 - spread / 2) * -1;
      right = !right;
    } else if(!left && right){
      //4
      degree = GetRandom(0, spread) + 45 - spread / 2;
      left = !left;
    } else if(left && !right){
      //3
      degree = GetRandom(0, spread) + 135 - spread / 2;
      left = !left;

    } else if(!left && !right){
      //2
      degree = GetRandom(0, spread) + 215 - spread / 2;
      right = !right;

    }

    let rad = THREE.Math.degToRad(degree)
    let radius = 5.5;
    let x = radius * Math.cos(rad);
    console.log(x)
    let y = -5 - (i * 5);
    let z = 4.5 + radius * Math.sin(rad);

    // let x = radius * Math.cos(rad);
    // let z = -4 - (i * 4);
    // let y = 5 + radius * Math.sin(rad);

    let startPosition = [x, y, z]
    return [startPosition, material];
  }), [data])

  return imageList.map(([[x, y, z], material], index) => (
      <>
    <Image
      snap={snap}
      rotation={new THREE.Euler(THREE.Math.degToRad(-90)).toArray()}
      key={index}
      index={index}
      material={material}
      selected={selected}
      selectImage={selectImage}
      // opacity={top.interpolate([0, 500], [0, 1])}
      opacity={1}
      startPosition={new Vector3(x, y, z)}
    />
        </>
  ))

}

/** This component loads an image and projects it onto a plane */
export function Image({ url, opacity, startPosition, material, selected, selectImage, index, ...props }) {

  const [sx, sy] = [4, 4]

  // useMemo(() => {
  //   return [1, 1];
  //   // if (texture.image) {
  //   //   const { naturalWidth, naturalHeight } = texture.image;
  //   //   return getScale([naturalWidth, naturalHeight]);
  //   // } else {
  //   //   return [1, 1];
  //   // }
  // }, [texture.image])

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
  // const mat = new THREE.MeshBasicMaterial({color: 'blue'});

  return (
    <a.mesh {...props}
      position={position.interpolate((x, y, z) => [x, y, z], 0.1)}
      onPointerUp={toggle}
      // onPointerOver={hover} onPointerOut={unhover}
      scale={[sx, sy, 1]}
      material={material}
      frustumCulled={false}
      onAfterRender={() => {
        this.frustumCulled = true;
        this.onAfterRender = function(){};
      }}
      >
      {/* <planeBufferGeometry attach="geometry" args={[5, 5]} /> */}
      <planeGeometry attach="geometry" args={[1, 1, 1]} />
      {/* <a.meshBasicMaterial attach="material" args={texture} /> */}
      {/* <a.meshLambertMaterial attach="material" transparent opacity={opacity}>
        <primitive attach="map" object={texture} />
      </a.meshLambertMaterial> */}
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