// Phosphor dot-matrix field behind the hero. Uniforms are fed per frame from
// HeroPhosphor.tsx; uv arrives with (0,0) at the top-left corner.

struct Params {
  pointer: vec2f,
  aspect: f32,
  time: f32,
  glow: f32,
  fade: f32,
};
@group(0) @binding(0) var<uniform> params: Params;

fn hash21(p: vec2f) -> f32 {
  var q = fract(p * vec2f(123.34, 345.45));
  q += dot(q, q + 34.345);
  return fract(q.x * q.y);
}

fn vnoise(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  let a = hash21(i);
  let b = hash21(i + vec2f(1.0, 0.0));
  let c = hash21(i + vec2f(0.0, 1.0));
  let d = hash21(i + vec2f(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

fn fbm(p: vec2f) -> f32 {
  var value = 0.0;
  var amplitude = 0.5;
  var q = p;
  for (var i = 0; i < 4; i++) {
    value += amplitude * vnoise(q);
    q = q * 2.03 + vec2f(1.7, 9.2);
    amplitude *= 0.5;
  }
  return value;
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let p = vec2f(uv.x * params.aspect, uv.y);

  let cells = 64.0;
  let cell = floor(p * cells);
  let cellUv = fract(p * cells) - 0.5;
  let cellCenter = (cell + vec2f(0.5)) / cells;

  var brightness = fbm(cell * 0.11 + vec2f(params.time * 0.045, params.time * -0.03));
  brightness = smoothstep(0.42, 0.95, brightness);

  // A slow scanline sweep, terminal-style.
  let sweepPos = fract(params.time * 0.055) * 1.3 - 0.15;
  brightness += smoothstep(0.05, 0.0, abs(uv.y - sweepPos)) * 0.22;

  // Pointer glow: cells wake up near the cursor.
  let pointerP = vec2f(params.pointer.x * params.aspect, params.pointer.y);
  let dist = distance(cellCenter, pointerP);
  brightness += params.glow * exp(-dist * dist * 14.0) * 0.85;

  // Keep the headline side quiet, fade the top and bottom edges.
  let mask = (0.12 + 0.88 * smoothstep(0.18, 0.85, uv.x))
    * smoothstep(0.0, 0.1, uv.y)
    * smoothstep(1.0, 0.9, uv.y);

  let radius = clamp(brightness, 0.0, 1.0) * 0.34;
  let disc = 1.0 - smoothstep(radius - 0.16, radius, length(cellUv));

  let phosphor = vec3f(0.243, 0.878, 0.498); // --accent #3ee07f
  let alpha = min(disc * brightness * mask * params.fade * 0.42, 1.0);
  return vec4f(phosphor * alpha, alpha);
}
