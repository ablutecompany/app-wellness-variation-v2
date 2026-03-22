import React, { useEffect, useRef } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';

interface NucleusProps {
  score: number;
  onPress: () => void;
  onLongPress: () => void;
  status: 'forte' | 'fraco';
}

const SIZE = 340;

// ─────────────────────────────────────────────────────────────────────────────
// PURE WEBGL SHADER: ZERO DEPENDENCIES, 100% NATIVE BROWSER GPU.
// Bypasses all Metro / Skia build errors on Windows.
// Generates a breathtaking, infinite, bioluminescent neural fractal.
// ─────────────────────────────────────────────────────────────────────────────
const vertexShaderSource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

const fragmentShaderSource = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_vitality;

  // Hash function for noise
  float hash(vec2 p) {
      p = fract(p * vec2(233.14, 113.51));
      p += dot(p, p + 23.45);
      return fract(p.x * p.y);
  }
  
  // Value noise
  float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                 mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
  }
  
  // Fractal Brownian Motion
  float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      mat2 rot = mat2(0.866, -0.5, 0.5, 0.866);
      for (int i = 0; i < 4; i++) {
          v += a * noise(p);
          p = rot * p * 2.0;
          a *= 0.5;
      }
      return v;
  }

  void main() {
      // Normalize UV keeping aspect ratio
      vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
      
      // Time controlled by vitality score
      float t = u_time * (0.3 + u_vitality * 0.4);
      
      // Polar coordinates
      float r = length(uv);
      float a = atan(uv.y, uv.x);
      
      // Organic membrane deformation (FBM mapped to a circle)
      float deform = fbm(vec2(cos(a), sin(a)) * 1.5 + t * 0.4);
      float radius = 0.22 + deform * 0.08;
      
      float dist = r - radius;
      
      // Inner fluid/plasma turbulence
      vec2 pUV = uv * 3.5;
      float q = fbm(pUV - t * 0.6);
      float w = fbm(pUV + vec2(q, q) * 2.0 + t * 0.3);
      float plasma = fbm(pUV + vec2(w, w) * 3.0);
      
      // Premium ablute_ colors
      // Base: Deep Indigo/Navy
      // Mid: Emerald Green (wellnessGreen)
      // High: Bright Cyan (biologicalBlue)
      vec3 colDeep = vec3(0.02, 0.05, 0.15);
      vec3 colMid  = vec3(0.0,  0.66, 0.42); // #00A86B approx
      vec3 colHigh = vec3(0.0,  0.80, 1.0);  // Cyan
      
      vec3 color = colDeep;
      
      if (dist < 0.0) {
          // Inside the cell: glowing core and moving plasma
          float coreMix = smoothstep(0.0, -radius, dist);
          color = mix(colDeep, colMid, plasma * 1.2);
          color = mix(color, colHigh, pow(coreMix, 1.5) * (0.4 + 0.6 * plasma));
          
          // Tiny bioluminescent sparks floating inside
          float sparks = noise(uv * 25.0 - t * 2.5);
          sparks = pow(max(sparks, 0.0), 12.0);
          color += colHigh * sparks * 3.0;
      }
      
      // The membrane wall (sharp glowing edge)
      float membrane = exp(-abs(dist) * 45.0);
      color += colHigh * membrane * 1.2;
      
      // Outer ambient corona (soft glow leaking into the water)
      float corona = exp(-max(dist, 0.0) * 8.0);
      color += mix(colMid, colHigh, 0.3) * corona * 0.4;
      
      // Breathing pulse tied to vitality
      float breath = 0.85 + 0.15 * sin(t * 3.0);
      color *= breath;
      
      // Dynamic alpha: solid inside, smooth fade outside
      float alpha = min(1.0, (membrane + corona + (dist < 0.0 ? 1.0 : 0.0)) * 1.5);
      
      gl_FragColor = vec4(color * alpha, alpha);
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Inject CSS keyframe into <head> once — this is the ONLY way to animate
// a DOM element's transform on the web platform without RNAnimated.
// ─────────────────────────────────────────────────────────────────────────────
function injectBreathCSS() {
  if (typeof document === 'undefined') return;
  // Always replace by ID so hot reloads apply the latest CSS immediately
  const existing = document.getElementById('nucleus-breath-style');
  if (existing) existing.remove();
  const style = document.createElement('style');
  style.id = 'nucleus-breath-style';
  style.textContent = `
    @keyframes nucleusBreathe {
      0%   { transform: scale(1.00); }
      50%  { transform: scale(1.40); }
      100% { transform: scale(1.00); }
    }
    .nucleus-breath-wrapper {
      animation: nucleusBreathe 9000ms ease-in-out infinite;
      transform-origin: center center;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `;
  document.head.appendChild(style);
}

export const Nucleus: React.FC<NucleusProps> = ({ score, onPress, onLongPress, status }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const wrapperRef = useRef<any>(null);

  // Apply CSS animation to the wrapper DOM node
  useEffect(() => {
    injectBreathCSS();
    // Access the underlying DOM div that React Native Web creates for <View>
    const node = wrapperRef.current;
    if (node) {
      // RN Web renders View as a div — we can set className directly
      if (node.classList) {
        node.classList.add('nucleus-breath-wrapper');
      } else if (node._nativeTag) {
        // fallback: find by native tag
        const el = document.querySelector(`[data-tag="${node._nativeTag}"]`);
        if (el) el.classList.add('nucleus-breath-wrapper');
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // React Native Web maps 'canvas' to HTMLCanvasElement seamlessly.
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return;

    // 1. Compile Shaders
    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return;

    // 2. Create Program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    // 3. Setup Geometry (a full canvas quad)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
      ]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // 4. Uniforms
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const vitalityLocation = gl.getUniformLocation(program, 'u_vitality');

    // Enable Alpha Blending so it overlays correctly on the app background
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // 5. Render Loop
    let startTime = performance.now();
    const vitalityValue = status === 'forte' ? 1.0 : 0.4;

    const render = (time: number) => {
      // Handle canvas resize automatically for pixel-perfect scaling
      const displayWidth = canvas.clientWidth * window.devicePixelRatio;
      const displayHeight = canvas.clientHeight * window.devicePixelRatio;
      
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }
      
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      // Clear transparent
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Update uniforms
      gl.uniform1f(timeLocation, (time - startTime) * 0.001);
      gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
      gl.uniform1f(vitalityLocation, vitalityValue);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationRef.current);
      gl.deleteProgram(program);
    };
  }, [status]);

  return (
    <View style={styles.container}>
      {/* breath wrapper — CSS animation applied via ref after mount */}
      <View ref={wrapperRef} style={styles.breathWrapper}>
        <Pressable onPress={onPress} onLongPress={onLongPress} delayLongPress={500}>
          <canvas ref={canvasRef} style={styles.canvas as any} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvas: {
    width: SIZE,
    height: SIZE,
    outline: 'none',
    pointerEvents: 'none',
  } as any,
});
