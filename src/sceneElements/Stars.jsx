import * as THREE from 'three/src/Three'
import React, { useRef, useMemo } from 'react'
import { useRender } from 'react-three-fiber'
import { a } from 'react-spring/three'

// /** This component rotates a bunch of stars */
export default function Stars({ position }) {
    let group = useRef()
    let theta = 0
    useRender(() => {
      const r = 0.5 * Math.sin(THREE.Math.degToRad((theta += 0.01)))
      const s = Math.cos(THREE.Math.degToRad(theta * 2))
      group.current.rotation.set(r, r, r)
      group.current.scale.set(s, s, s)
    })
    const [geo, mat, coords] = useMemo(() => {
      // const geo = new THREE.SphereBufferGeometry(1, 10, 10)
      // const geo = new THREE.BoxBufferGeometry(10, 10, 10);
      const geo = new THREE.IcosahedronBufferGeometry(100, 1);
      //  new THREE.BoxBufferGeometry(10, 10, 10);
  
      const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color('black'), transparent: true, wireframe: true, opacity: 1 })
      const coords = new Array(100).fill().map(i => [Math.random() * 800 - 400, Math.random() * 800 - 400, Math.random() * 800 - 400])
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