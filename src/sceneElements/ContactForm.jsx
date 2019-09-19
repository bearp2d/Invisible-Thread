import * as THREE from 'three/src/Three'
import { useRender, useThree } from 'react-three-fiber'
import React, { useEffect } from 'react'
import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";

export default function ContactForm() {
  let renderer;
  let { scene, gl, camera } = useThree();

  // var material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, wireframeLinewidth: 1, side: THREE.DoubleSide });
  let material = new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0, wireframe: false, side: THREE.DoubleSide, blending: THREE.NoBlending });
  // var material = new THREE.MeshBasicMaterial({ wireframe: true });
  let geometry = new THREE.PlaneGeometry(window.innerWidth * 0.01, window.innerHeight * 0.01);
  let planeMesh = new THREE.Mesh(geometry, material);
  planeMesh.position.x = 0;
  planeMesh.position.y = -60;
  planeMesh.position.z = 5;
  planeMesh.rotation.x = -3.14159265358978 / 2;

  useEffect(() => {
    let element = document.getElementById('contact-form');
    element.style.width = '100vw';
    element.style.height = '100vh';
    element.style.background = '#ffffff';
    element.style.display = 'block';
    element.style.textAlign = 'center';
    element.style.opacity = '1';

    let cssObject = new CSS3DObject(element);
    // object.position = planeMesh.position;
    cssObject.position.x = planeMesh.position.x;
    cssObject.position.y = planeMesh.position.y;
    cssObject.position.z = planeMesh.position.z;
    
    cssObject.rotation.x = planeMesh.rotation.x;
    cssObject.scale.x = 0.01;
    cssObject.scale.y = 0.01;
    scene.add(cssObject);

    renderer = new CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.width = '100vw';
    renderer.domElement.style.height = '100vh';
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.zIndex = '0';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.pointerEvents = 'none'
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }, [])

  useRender(() => {
    renderer.render(scene, camera);
  })

  return <>
    <mesh {...planeMesh} />
  </>
}
