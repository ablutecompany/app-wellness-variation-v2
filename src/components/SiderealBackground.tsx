import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

let WebView: any = null;
if (Platform.OS !== 'web') {
  try {
    WebView = require('react-native-webview').WebView;
  } catch (e) {
    // webview not installed or failed to load
  }
}

const htmlContent = `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Campo Sideral Aleatório</title>
  <style>
    :root {
      --bg-a: #03050a;
      --bg-b: #0a1019;
      --bg-c: #140d18;
      --text: rgba(245, 241, 233, 0.9);
    }

    * { box-sizing: border-box; }

    html, body {
      margin: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background:
        radial-gradient(circle at 20% 20%, rgba(119, 174, 255, 0.06), transparent 22%),
        radial-gradient(circle at 78% 68%, rgba(255, 213, 132, 0.05), transparent 20%),
        radial-gradient(circle at 50% 52%, rgba(165, 112, 255, 0.04), transparent 28%),
        linear-gradient(180deg, var(--bg-a), var(--bg-b) 52%, var(--bg-c));
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .scene {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      isolation: isolate;
      background:
        radial-gradient(circle at 14% 38%, rgba(255, 206, 116, 0.035), transparent 18%),
        radial-gradient(circle at 44% 24%, rgba(147, 224, 255, 0.03), transparent 16%),
        radial-gradient(circle at 82% 42%, rgba(109, 132, 255, 0.04), transparent 18%),
        radial-gradient(circle at 58% 74%, rgba(160, 108, 255, 0.025), transparent 14%);
    }

    canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
    }

    .veil,
    .veil::before,
    .veil::after {
      position: absolute;
      inset: 0;
      content: "";
      pointer-events: none;
    }

    .veil {
      background:
        radial-gradient(circle at 18% 52%, rgba(255, 216, 142, 0.04), transparent 18%),
        radial-gradient(circle at 34% 26%, rgba(150, 233, 255, 0.035), transparent 18%),
        radial-gradient(circle at 69% 38%, rgba(95, 129, 255, 0.04), transparent 18%),
        radial-gradient(circle at 76% 78%, rgba(177, 122, 255, 0.03), transparent 16%);
      filter: blur(18px);
      animation: breathe 14s ease-in-out infinite alternate;
      z-index: 2;
      mix-blend-mode: screen;
      opacity: 0.8;
    }

    .veil::before {
      background:
        radial-gradient(circle at 22% 18%, rgba(255,255,255,0.65) 0 1px, transparent 1.8px),
        radial-gradient(circle at 30% 62%, rgba(255,240,210,0.55) 0 1px, transparent 1.8px),
        radial-gradient(circle at 46% 32%, rgba(171,231,255,0.5) 0 1px, transparent 1.8px),
        radial-gradient(circle at 60% 16%, rgba(255,255,255,0.5) 0 1px, transparent 1.8px),
        radial-gradient(circle at 78% 58%, rgba(151,228,255,0.46) 0 1px, transparent 1.8px),
        radial-gradient(circle at 88% 26%, rgba(255,230,182,0.42) 0 1px, transparent 1.8px),
        radial-gradient(circle at 72% 84%, rgba(255,255,255,0.48) 0 1px, transparent 1.8px),
        radial-gradient(circle at 12% 78%, rgba(169,229,255,0.42) 0 1px, transparent 1.8px);
      opacity: 0.7;
      animation: twinkle 7s ease-in-out infinite;
    }

    .veil::after {
      background:
        radial-gradient(circle at 50% 50%, rgba(255, 228, 172, 0.02), transparent 42%),
        radial-gradient(circle at 50% 50%, rgba(110, 194, 255, 0.02), transparent 58%);
      filter: blur(10px);
      opacity: 0.7;
    }
      
    @keyframes breathe {
      0% { transform: scale(1) translate3d(0, 0, 0); opacity: 0.66; }
      100% { transform: scale(1.03) translate3d(-1.2%, 1%, 0); opacity: 0.92; }
    }

    @keyframes twinkle {
      0%, 100% { opacity: 0.45; }
      50% { opacity: 0.86; }
    }
  </style>
</head>
<body>
  <main class="scene">
    <canvas id="space" aria-label="Campo sideral dinâmico e aleatório"></canvas>
    <div class="veil"></div>
  </main>

  <script>
    const canvas = document.getElementById('space');
    const ctx = canvas.getContext('2d');

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let t = 0;

    const stars = [];
    const floaters = [];
    const embers = [];
    const clouds = [];

    const palette = [
      [255, 245, 227],
      [255, 224, 160],
      [157, 232, 255],
      [109, 132, 255],
      [173, 117, 255]
    ];

    function rand(min, max) { return Math.random() * (max - min) + min; }
    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildScene();
    }

    function buildScene() {
      stars.length = 0; floaters.length = 0; embers.length = 0; clouds.length = 0;
      const starCount = Math.floor((w * h) / 2200);
      const floaterCount = Math.floor((w * h) / 18000);
      const emberCount = Math.floor((w * h) / 32000);
      const cloudCount = 9;

      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: rand(0, w), y: rand(0, h), r: rand(0.45, 1.8), alpha: rand(0.18, 0.95),
          pulse: rand(0.4, 1.6), offset: rand(0, Math.PI * 2), driftX: rand(-0.04, 0.04),
          driftY: rand(-0.03, 0.03), color: pick(palette)
        });
      }

      for (let i = 0; i < floaterCount; i++) {
        floaters.push({
          x: rand(0, w), y: rand(0, h), baseX: rand(0, w), baseY: rand(0, h),
          size: rand(3, 12), halo: rand(18, 54), alpha: rand(0.06, 0.22),
          speed: rand(0.0005, 0.0022), phase: rand(0, Math.PI * 2),
          wobbleX: rand(14, 90), wobbleY: rand(10, 72), color: pick(palette)
        });
      }

      for (let i = 0; i < emberCount; i++) {
        embers.push({
          x: rand(0, w), y: rand(0, h), size: rand(1.8, 4.8), alpha: rand(0.3, 0.8),
          vx: rand(-0.12, 0.12), vy: rand(-0.12, 0.12), phase: rand(0, Math.PI * 2),
          jitter: rand(6, 20), speed: rand(0.003, 0.009), color: pick(palette)
        });
      }

      for (let i = 0; i < cloudCount; i++) {
        clouds.push({
          x: rand(0.08 * w, 0.92 * w), y: rand(0.08 * h, 0.92 * h),
          rx: rand(w * 0.08, w * 0.18), ry: rand(h * 0.07, h * 0.16),
          alpha: rand(0.028, 0.065), phase: rand(0, Math.PI * 2),
          speed: rand(0.0008, 0.002), drift: rand(8, 28), color: pick(palette)
        });
      }
    }

    function drawBackground() {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#04060a');
      g.addColorStop(0.52, '#0a1019');
      g.addColorStop(1, '#140d18');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    function drawClouds(time) {
      clouds.forEach(cloud => {
        const x = cloud.x + Math.sin(time * cloud.speed + cloud.phase) * cloud.drift;
        const y = cloud.y + Math.cos(time * cloud.speed * 0.8 + cloud.phase) * cloud.drift * 0.7;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, Math.max(cloud.rx, cloud.ry));
        grad.addColorStop(0, \`rgba(\${cloud.color[0]}, \${cloud.color[1]}, \${cloud.color[2]}, \${cloud.alpha})\`);
        grad.addColorStop(0.45, \`rgba(\${cloud.color[0]}, \${cloud.color[1]}, \${cloud.color[2]}, \${cloud.alpha * 0.45})\`);
        grad.addColorStop(1, \`rgba(\${cloud.color[0]}, \${cloud.color[1]}, \${cloud.color[2]}, 0)\`);
        ctx.save(); ctx.translate(x, y); ctx.scale(cloud.rx / Math.max(cloud.rx, cloud.ry), cloud.ry / Math.max(cloud.rx, cloud.ry));
        ctx.beginPath(); ctx.arc(0, 0, Math.max(cloud.rx, cloud.ry), 0, Math.PI * 2);
        ctx.fillStyle = grad; ctx.fill(); ctx.restore();
      });
    }

    function drawStars(time) {
      stars.forEach(s => {
        const pulse = 0.62 + 0.38 * Math.sin(time * 0.0012 * s.pulse + s.offset);
        const x = s.x + Math.sin(time * 0.00018 + s.offset) * 2.2 + time * s.driftX;
        const y = s.y + Math.cos(time * 0.00016 + s.offset) * 1.8 + time * s.driftY;
        const alpha = s.alpha * pulse;
        ctx.beginPath(); ctx.fillStyle = \`rgba(\${s.color[0]}, \${s.color[1]}, \${s.color[2]}, \${alpha})\`;
        ctx.arc((x + w) % w, (y + h) % h, s.r, 0, Math.PI * 2); ctx.fill();
        if (s.r > 1.2) {
          ctx.beginPath(); ctx.fillStyle = \`rgba(\${s.color[0]}, \${s.color[1]}, \${s.color[2]}, \${alpha * 0.12})\`;
          ctx.arc((x + w) % w, (y + h) % h, s.r * 4.5, 0, Math.PI * 2); ctx.fill();
        }
      });
    }

    function drawFloaters(time) {
      floaters.forEach(f => {
        const x = f.baseX + Math.sin(time * f.speed + f.phase) * f.wobbleX + Math.cos(time * f.speed * 0.37 + f.phase) * (f.wobbleX * 0.2);
        const y = f.baseY + Math.cos(time * f.speed * 0.82 + f.phase) * f.wobbleY + Math.sin(time * f.speed * 0.29 + f.phase) * (f.wobbleY * 0.25);
        const glow = 0.7 + 0.3 * Math.sin(time * f.speed * 3 + f.phase);
        const grad = ctx.createRadialGradient(x, y, 0, x, y, f.halo);
        grad.addColorStop(0, \`rgba(\${f.color[0]}, \${f.color[1]}, \${f.color[2]}, \${f.alpha * glow})\`);
        grad.addColorStop(0.3, \`rgba(\${f.color[0]}, \${f.color[1]}, \${f.color[2]}, \${f.alpha * 0.42 * glow})\`);
        grad.addColorStop(1, \`rgba(\${f.color[0]}, \${f.color[1]}, \${f.color[2]}, 0)\`);
        ctx.beginPath(); ctx.fillStyle = grad; ctx.arc(x, y, f.halo, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.fillStyle = \`rgba(\${f.color[0]}, \${f.color[1]}, \${f.color[2]}, \${Math.min(0.92, f.alpha * 2.6)})\`;
        ctx.arc(x, y, f.size, 0, Math.PI * 2); ctx.fill();
      });
    }

    function drawEmbers(time) {
      embers.forEach(e => {
        e.x += e.vx + Math.sin(time * e.speed + e.phase) * 0.08;
        e.y += e.vy + Math.cos(time * e.speed * 1.2 + e.phase) * 0.08;
        if (e.x < -30) e.x = w + 30; if (e.x > w + 30) e.x = -30;
        if (e.y < -30) e.y = h + 30; if (e.y > h + 30) e.y = -30;
        const x = e.x + Math.sin(time * e.speed * 4 + e.phase) * e.jitter;
        const y = e.y + Math.cos(time * e.speed * 3.2 + e.phase) * e.jitter * 0.75;
        const pulse = 0.65 + 0.35 * Math.sin(time * e.speed * 9 + e.phase);
        ctx.beginPath(); ctx.fillStyle = \`rgba(\${e.color[0]}, \${e.color[1]}, \${e.color[2]}, \${e.alpha * pulse * 0.2})\`;
        ctx.arc(x, y, e.size * 4.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.fillStyle = \`rgba(\${e.color[0]}, \${e.color[1]}, \${e.color[2]}, \${Math.min(1, e.alpha * pulse)})\`;
        ctx.arc(x, y, e.size, 0, Math.PI * 2); ctx.fill();
      });
    }

    function frame(time) {
      // VELOCIDADE NORMAL: Simulação flui no tempo real
      t = time;
      drawBackground(); drawClouds(t); drawStars(t); drawFloaters(t); drawEmbers(t);
      requestAnimationFrame(frame);
    }

    window.addEventListener('resize', resize);
    resize(); requestAnimationFrame(frame);
  </script>
</body>
</html>
`;

export const SiderealBackground = () => {
  if (Platform.OS === 'web') {
    return (
      <iframe
        srcDoc={htmlContent}
        style={{ position: 'absolute', width: '100%', height: '100%', border: 'none', zIndex: 0 }}
      />
    );
  }

  if (WebView) {
    return (
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
         <WebView
          source={{ html: htmlContent }}
          style={{ width: '100%', height: '100%', opacity: 1, backgroundColor: 'transparent' }}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          bounces={false}
         />
      </View>
    );
  }

  return <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#05070a' }]} pointerEvents="none" />;
};
