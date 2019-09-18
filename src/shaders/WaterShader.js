/**
 * Simple underwater shader
 * 
 
 parameters:
 tDiffuse: texture
 time: this should increase with time passing
 distort_speed: how fast you want the distortion effect of water to proceed
 distortion: to what degree will the shader distort the screen 
 centerX: the distortion center X coord
 centerY: the distortion center Y coord

 explaination:
 the shader is quite simple
 it chooses a center and start from there make pixels around it to "swell" then "shrink" then "swell"...
 this is of course nothing really similar to underwater scene
 but you can combine several this shaders together to create the effect you need...
 And yes, this shader could be used for something other than underwater effect, for example, magnifier effect :)

 * @author vergil Wang
 */

var WaterShader = {
    uniforms: {
      byp: { value: 0 }, //apply the glitch ?
      texture: { type: 't', value: null },
      time: { type: 'f', value: 0.0 },
      factor: { type: 'f', value: 0.0 },
      resolution: { type: 'v2', value: null },
    },
  
    vertexShader: [
      `varying vec2 vUv;
      void main(){  
        vUv = uv; 
        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewPosition;
      }`,
    ].join('\n'),
  
    fragmentShader: [
      `uniform int byp; //should we apply the glitch ?
      uniform float time;
      uniform float factor;
      uniform vec2 resolution;
      uniform sampler2D texture;
      
      varying vec2 vUv;

      vec4 blur5(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
        vec4 color = vec4(0.0);
        vec2 off1 = vec2(1.3333333333333333) * direction;
        color += texture2D(image, uv) * 0.29411764705882354;
        color += texture2D(image, uv + (off1 / resolution)) * 0.35294117647058826;
        color += texture2D(image, uv - (off1 / resolution)) * 0.35294117647058826;
        return color; 
      }
      
      void main() {  
        // if (byp<1) {
          // vec2 uv1 = vUv;
          // vec2 uv = gl_FragCoord.xy/resolution.xy;
          // float frequency = 6.0 * factor;
          // float amplitude = 0.015 * factor;
          // float x = uv1.y * frequency + time * .7; 
          // float y = uv1.x * frequency + time * .3;
          // uv1.x += cos(x+y) * amplitude * cos(y);
          // uv1.y += sin(x-y) * amplitude * cos(y);
          // vec4 rgba = texture2D(texture, uv1);
          // gl_FragColor = rgba;
          gl_FragColor = blur5(texture, vUv, vec2(1000., 1000.), vec2(1., 1.));
        // } else {
        //   gl_FragColor = texture2D(texture, vUv);
        // }
      }`,
    ].join('\n'),
  }
  
  export { WaterShader }
  