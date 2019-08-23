import * as THREE from 'three/src/Three'
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { apply as applyThree, Canvas, useRender, useThree } from 'react-three-fiber'
import { apply as applySpring, useSpring, a, interpolate } from 'react-spring/three'

export default function Thread({ top, mouse, scrollMax }) {
    let group = useRef();
    let theta = 0
    useRender(() => {
      // const r = 5 * Math.sin(THREE.Math.degToRad((theta += 0.01)))
      // const s = Math.cos(THREE.Math.degToRad(theta * 2))
      // theta += 0.0001;
      // theta += 0.001;
      group.current.rotation.set(0, theta, 0)
      // group.current.scale.set(s, s, s)
    })
  
    const [coords, mat, pos] = useMemo(() => {
      // const geo = new THREE.SphereBufferGeometry(1, 10, 10)
      // const geo = new THREE.BoxBufferGeometry(1, 1, 1);
      const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color('darkgrey'), transparent: true })
      // const mat = new THREE.VideoTexture({baseURI: `https://vimeo.com/65475425`})
      // const mat = new THREE.LineDashedMaterial({ color: new THREE.Color('white') })
  
      // const coords = new Array(1000).fill().map(i => [Math.random() * 800 - 400, Math.random() * 800 - 400, Math.random() * 800 - 400])
      // const pos = position;
      const pos = 0;
      
      const threads = threadGen(
        10,
        new THREE.Vector3(-7, 10, -7),
        new THREE.Vector3(7, -150, 2),
        new THREE.Vector3(20, 10, 5)
      );
  
      const coords = threads.map(thread => {
        const points = thread.getPoints(50);
        return new THREE.BufferGeometry().setFromPoints(points);
      })
      console.log(coords);
      
      return [coords, mat, pos]
    }, [])
  
    const factor = 5.0;
    const x = 0;
    const y = 0;
    const z = 0;
  
    return (<a.group ref={group}
  
      position={interpolate([top, mouse], (top, mouse) => [
        (-mouse[0] * factor) / 50000 + x,
        (mouse[1] * factor) / 50000 + y * 1.15 + ((top * factor) / scrollMax) * 2,
        z + top / 2000
      ])}>
      {coords.map((geo, i) =>
        <ne geometry={geo} material={mat} key={"thread" + i}>
          {/* <lineBasicMaterial attach="material" color="blue" /> */}
        </ne>
      )}
    </a.group>)
  }
  
  
  //Generate Threads(int count, Vector3 min, Vector3 max, Vector3 segments)
  //Y starts at min and goes to segment count to max
  //Return Threads[ (thread[[x, y, z], [x, y, z], [x, y, z], [x, y, z]])
  //                (thread[[x, y, z], [x, y, z], [x, y, z], [x, y, z]])]
  
  
  function threadGen(count, min, max, segments) {
    let threads = []
  
    for (let i = 0; i < count; i++) {
      let points = [];
      let x = 0;
      let z = 0;
  
      let segmentStep = new THREE.Vector3(
        (max.x - min.x) / segments.x,
        (max.y - min.y) / segments.y,
        (max.z - min.z) / segments.z,
      )
      // let segIndexX = GetRandom(0, segments.x);
      // let segIndexZ = GetRandom(0, segments.z);
      for (let segY = min.y; segY >= max.y; segY += segmentStep.y) {
  
        // x = min.x + segIndexX * segmentStep.x;
        // z = min.z + segIndexZ * segmentStep.z;
  
        x = GetRandom(min.x, max.x);
        z = GetRandom(min.z, max.z);
  
        points.push(new THREE.Vector3(x, segY, z));
      }    
      threads.push(new THREE.CatmullRomCurve3(points));
    }
    return threads;
  }
  
  function GetRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  function GetRandomBool() {
    return Math.floor(Math.random() + 0.5) > 0;
  }