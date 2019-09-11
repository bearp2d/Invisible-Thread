import * as THREE from 'three/src/Three'
import React, { useRef, useMemo } from 'react'
import { useRender } from 'react-three-fiber'
import { a } from 'react-spring/three'

// /** This component rotates a bunch of stars */
export default function Stars({ position, scrollSpring }) {


  const vertexShader = `
  precision highp float;
  attribute vec3 position;
  attribute vec3 normal;
  attribute vec2 uv;
  uniform mat4 modelViewMatrix;
  uniform mat4 modelMatrix;
  uniform mat3 normalMatrix;
  uniform mat4 projectionMatrix;
  uniform vec3 cameraPosition;
  uniform float time;
  uniform float offset;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying float vDepth;
  varying float vRim;
  varying vec2 vN;
  #define PI 3.1415926535897932384626433832795
  #define TAU (2.*PI)  
  float parabola( float x, float k ){
    return pow( 4.0*x*(1.0-x), k );
  }
  void main() {
    vUv = uv;
    vec4 p = vec4(position ,1.);
    vec4 mvPosition = modelViewMatrix * p;
    gl_Position = projectionMatrix * mvPosition;
    vec3 e = normalize( mvPosition.xyz);
    vec3 n = normalize( normalMatrix * normal );
    vRim = pow(abs(dot(e,n)),2.);
    vDepth = 1.5-20.*abs(gl_Position.z);
    vec3 r = reflect( e, n );
    float m = 2.82842712474619 * sqrt( r.z+1.0 );
    vN = r.xy / m + .5;
  }
  `
      const fragmentShader = `
  precision highp float;
  uniform float time;
  uniform float offset;
  uniform vec3 color;
  uniform float speed;
  uniform sampler2D matCap;
  varying vec2 vUv;
  varying float vDepth;
  varying float vRim;
  varying vec2 vN;
  #define PI 3.1415926535897932384626433832795
  #define TAU (2.*PI)
  float parabola( float x, float k ){
    return pow( 4.0*x*(1.0-x), k );
  }
  vec4 screen(vec4 base, vec4 blend, float opacity) {
    vec4 color = 1. - (1.-base) * (1.-blend);
    color = color * opacity + base * ( 1. - opacity );
    return color;
  }
  vec3 color1 = vec3(1.,0,0);
  vec3 color2 = vec3(0,1.,0);
  vec3 color3 = vec3(0,0,1.);
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  void main(){
    float t = 3.*time/5.;
    vec2 s = vec2(100.,10.);
    vec2 uv = vUv+vec2(0.,.0);
    vec2 uv1 = floor(uv * s)/s;
    float r = parabola(mod(uv.x + t,1.), 10.);
    vec3 color = vec3(r, uv.y, 0.);
    vec2 uv2 = mod(uv*s, vec2(1.));
    float lx = length(uv2.x-.5);
    float ly = length(uv2.y-.5);
    float l = max(lx,ly);
    if(step(r,l)>.5) discard;
    color = color2 / 9.;
    color += step(r-.1,l)/2.;
    color += (1.-parabola(mod(uv.x + t,1.), 1.)) /10.;
    gl_FragColor = vec4((.75+.25*vRim)*color,1.);
    float b = texture2D(matCap,vN).r/5.;    
    gl_FragColor = screen(gl_FragColor, vec4(b), .5);
    gl_FragColor = vec4(1.,0,0,1.);
  }
  `

  // vec3 color1 = vec3(69.,91.,105.)/255.;
  // vec3 color2 = vec3(236.,40.,31.)/255.;
  // vec3 color3 = vec3(195.,58.,78.)/255.;
  
    let group = useRef()
    let theta = 0
    useRender(() => {
      const r = 0.5 * Math.sin(THREE.Math.degToRad((theta += 0.01)))
      const s = Math.cos(THREE.Math.degToRad(theta * 2))
      // group.current.rotation.set(r, r, r)
      // group.current.scale.set(s, s, s)
      mat.uniforms.time.value = scrollSpring.getValue();
    })
    const [geo, mat, coords] = useMemo(() => {
      // const geo = new THREE.SphereBufferGeometry(1, 10, 10)
      // const geo = new THREE.BoxBufferGeometry(10, 10, 10);
      const geo = new THREE.IcosahedronBufferGeometry(10, 1);
      //  new THREE.BoxBufferGeometry(10, 10, 10);
  

      // const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color('black'), transparent: true, wireframe: true, opacity: 1 })

      
      const mat = new THREE.RawShaderMaterial({
        uniforms: {
          time: { value: 0},
          speed: { value: 1 },
          offset: { value: 0 },
          color: { value: new THREE.Color(0x455b69) }
          //matCap: { value: loader.load("./assets/matcap3.jpg") }
        },
        vertexShader,
        fragmentShader,
        wireframe: true,
        side: THREE.DoubleSide
      })

      // const coords = new Array(100).fill().map(i => [Math.random() * 800 - 400, Math.random() * 800 - 400, Math.random() * 800 - 400])
      const coords = new Array(1).fill().map(i => [0, 0, 0])

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