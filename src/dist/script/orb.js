/* =============================================================================
   Bulle de verre du hero (#about).
   Scène three.js posée derrière le bloc terminal : une membrane de verre qui
   réfracte son propre fond, autour d'un noyau marbré animé par du bruit simplex.
   Les couleurs suivent le thème du site (classe .dark sur <html>).
   three.js est chargé depuis le CDN via l'importmap déclarée dans index.html.
   ============================================================================= */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const NOISE = `
vec3 orbMod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 orbMod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 orbPermute(vec4 x) { return orbMod289(((x * 34.0) + 10.0) * x); }
vec4 orbTaylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float orbNoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = orbMod289(i);
  vec4 p = orbPermute(orbPermute(orbPermute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = orbTaylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

const SHELL_DISPLACE = `
uniform float uTime;
uniform float uAmp;
vec3 orbDisplace(vec3 n) {
  float d = orbNoise(n * 0.9 + vec3(uTime * 0.16, uTime * 0.12, -uTime * 0.1)) * 0.7
          + orbNoise(n * 2.1 + vec3(-uTime * 0.2, uTime * 0.17, uTime * 0.14)) * 0.3;
  return n * (1.0 + d * uAmp);
}
`;

/* La normale est recalculée par différences finies : sans ça la membrane déformée
   garderait l'éclairage d'une sphère lisse. */
const SHELL_NORMAL = `
vec3 orbN = normalize(position);
vec3 orbT = normalize(cross(orbN, abs(orbN.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
vec3 orbB = normalize(cross(orbN, orbT));
vec3 orbP = orbDisplace(orbN);
vec3 orbPT = orbDisplace(normalize(orbN + orbT * 0.02));
vec3 orbPB = orbDisplace(normalize(orbN + orbB * 0.02));
vec3 objectNormal = normalize(cross(orbPT - orbP, orbPB - orbP));
#ifdef USE_TANGENT
  vec3 objectTangent = vec3(tangent.xyz);
#endif
`;

const CORE_VERTEX = `
uniform float uTime;
uniform float uAmp;
varying vec3 vObj;
varying vec3 vNormalView;
varying vec3 vViewDir;
${NOISE}
void main() {
  vec3 n = normalize(position);
  float d = orbNoise(n * 1.4 + vec3(uTime * 0.18, -uTime * 0.14, uTime * 0.11));
  vec3 displaced = position * (1.0 + d * uAmp);
  vObj = n;
  vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
  vNormalView = normalize(normalMatrix * n);
  vViewDir = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

/* uWake : 0 = noyau endormi (marbrures grises), 1 = pleinement éveillé (marbrures bleues).
   uSpark : intensité des braises au centre, surtout visibles quand uWake est bas. */
const CORE_FRAGMENT = `
uniform float uTime;
uniform float uWake;
uniform vec3 uDeep;
uniform vec3 uMid;
uniform vec3 uLight;
uniform vec3 uGreyDeep;
uniform vec3 uGreyMid;
uniform vec3 uGreyLight;
uniform float uSpark;
uniform vec3 uSparkColor;
varying vec3 vObj;
varying vec3 vNormalView;
varying vec3 vViewDir;
${NOISE}
float orbFbm(vec3 p) {
  float s = 0.5 * orbNoise(p);
  s += 0.25 * orbNoise(p * 2.02 + vec3(1.7, 9.2, 3.4));
  s += 0.125 * orbNoise(p * 4.04 + vec3(8.3, 2.8, 5.1));
  return s;
}
void main() {
  vec3 q = vObj * 1.5;
  float wx = orbFbm(q + vec3(0.0, uTime * 0.07, 0.0));
  float wy = orbFbm(q + vec3(5.2, 1.3, uTime * 0.06));
  float m = orbFbm(q + vec3(wx, wy, wx - wy) * 1.8);
  float veins = pow(1.0 - abs(wy), 9.0);
  float facing = clamp(dot(normalize(vNormalView), normalize(vViewDir)), 0.0, 1.0);
  vec3 blue = mix(uMid, uLight, smoothstep(-0.25, 0.45, m));
  blue = mix(blue, uDeep, smoothstep(0.0, -0.45, m) * 0.55);
  blue += uLight * veins * 0.25;
  vec3 grey = mix(uGreyMid, uGreyLight, smoothstep(-0.25, 0.45, m));
  grey = mix(grey, uGreyDeep, smoothstep(0.0, -0.45, m) * 0.6);
  grey += uGreyLight * veins * 0.18;
  vec3 col = mix(grey, blue, uWake);
  col *= mix(0.5, 1.08, pow(facing, 0.6));
  float ember = pow(facing, 40.0) * uSpark;
  float shade = 1.0 - smoothstep(-0.35, 0.35, m);
  col += uSparkColor * ember * (0.08 + shade * 0.5);
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`;

const BACKDROP_VERTEX = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const BACKDROP_FRAGMENT = `
uniform vec2 uCenter;
uniform float uRadius;
uniform float uGlow;
uniform float uTint;
uniform float uAspect;
uniform vec3 uGround;
uniform vec3 uGroundTint;
uniform vec3 uGlowInner;
uniform vec3 uGlowOuter;
varying vec2 vUv;
float orbHash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main() {
  vec2 d = (vUv - uCenter) * vec2(uAspect, 1.0);
  float r = length(d) / max(uRadius, 0.001);
  float halo = exp(-r * r * 0.55);
  float inner = exp(-r * r * 2.2);
  vec2 v = (vUv - 0.5) * vec2(uAspect, 1.0);
  float vignette = smoothstep(1.35, 0.2, length(v));
  vec3 ground = mix(uGround, uGroundTint, uTint * (0.35 + 0.65 * vignette));
  vec3 glow = mix(uGlowOuter, uGlowInner, inner);
  vec3 col = ground + glow * halo * uGlow * 0.6;
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
  // Tramage léger : sans lui, les dégradés sombres se découpent en bandes visibles.
  gl_FragColor.rgb += (orbHash(gl_FragCoord.xy) - 0.5) / 255.0;
}
`;

/* Palettes : exactement les couleurs du site, fond compris, pour que la scène se
   fonde dans la page. Le passage d'un thème à l'autre est interpolé. */
const THEMES = {
  light: {
    ground: '#f8f8f8',
    groundTint: '#e6f4ec',
    glowInner: '#34d399',
    glowOuter: '#a7f3d0',
    deep: '#047857',
    mid: '#22c55e',
    light: '#d1fae5',
    greyDeep: '#9aa3a0',
    greyMid: '#c6cdc9',
    greyLight: '#eef2f0',
    rim: '#6ee7b7',
    spark: '#10b981',
    glow: 0.42,
    tint: 0.3,
    exposure: 1.0,
  },
  dark: {
    ground: '#0a0a0a',
    groundTint: '#05201a',
    glowInner: '#22c55e',
    glowOuter: '#064e3b',
    deep: '#064e3b',
    mid: '#16a34a',
    light: '#86efac',
    greyDeep: '#1d1f24',
    greyMid: '#5f646c',
    greyLight: '#b4b9c0',
    rim: '#6ee7b7',
    spark: '#6ee7b7',
    glow: 0.68,
    tint: 0.3,
    exposure: 1.06,
  },
};

/* Une pose par section de la page, dans l'ordre du document. La bulle passe d'un
   bord à l'autre, jamais en travers du texte : pendant le changement de côté elle
   s'éloigne et rapetisse (voir `dip` plus bas), puis revient de l'autre bord. Une
   moitié déborde du cadre, ce qui la rend ambiante plutôt que posée là.
   x est en unités de scène, positif vers la droite. */
const POSES = [
  { x: 0, y: 0, scale: 1.5, glow: 1, wake: 1 },
  { x: 2.35, y: 0.3, scale: 1, glow: 0.55, wake: 0.9 },
  { x: -2.3, y: 0.32, scale: 0.88, glow: 0.45, wake: 0.8 },
  { x: 2.45, y: 0.25, scale: 0.86, glow: 0.45, wake: 0.75 },
  { x: -2.25, y: 0.28, scale: 0.85, glow: 0.4, wake: 0.7 },
  { x: 2.2, y: 0.15, scale: 1.05, glow: 0.55, wake: 0.9 },
  { x: -2.4, y: 0.3, scale: 0.74, glow: 0.45, wake: 0.65 },
];

const POSE_KEYS = ['x', 'y', 'scale', 'glow', 'wake'];

const COLOR_KEYS = ['ground', 'groundTint', 'glowInner', 'glowOuter', 'deep', 'mid', 'light', 'greyDeep', 'greyMid', 'greyLight', 'rim', 'spark'];
const FOV = 35;
const CAMERA_Z = 6;
const BACKDROP_Z = -3;
const MAX_PIXEL_RATIO = 1.25;
const MIN_PIXEL_RATIO = 0.6;

const visibleHeight = (distance) => 2 * distance * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
const isDark = () => document.documentElement.classList.contains('dark');

/* En dessous de cette largeur, la scène ne tourne pas : sur téléphone les cartes
   occupent toute la largeur, la bulle serait cachée derrière presque tout le temps
   et coûterait quand même GPU et batterie. Mettre 0 pour l'activer partout. */
const MIN_WIDTH = 768;

const host = document.getElementById('orbHero');
const sections = Array.prototype.slice.call(document.querySelectorAll('header#about, main > section'));

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* Position fractionnaire dans POSES : la section dont le milieu de l'écran
   traverse la hauteur donne la pose, et la progression dedans fait le fondu. */
function readStage() {
  const probe = window.innerHeight * 0.5;
  let stage = 0;
  for (let i = 0; i < sections.length; i++) {
    const rect = sections[i].getBoundingClientRect();
    if (probe >= rect.top && probe < rect.bottom) {
      stage = i + (probe - rect.top) / rect.height - 0.5;
      break;
    }
    if (probe >= rect.bottom) stage = i + 0.5;
  }
  return Math.min(Math.max(stage, 0), Math.min(sections.length, POSES.length) - 1);
}

/* Interpole entre les deux poses encadrant `stage`, sans rien allouer. */
function samplePose(stage, out) {
  const i = Math.floor(stage);
  const next = Math.min(i + 1, POSES.length - 1);
  const f = easeInOut(stage - i);
  for (const k of POSE_KEYS) out[k] = POSES[i][k] + (POSES[next][k] - POSES[i][k]) * f;
  return out;
}

let renderer = null;
if (host && window.innerWidth >= MIN_WIDTH) {
  try {
    // 'default' laisse la machine choisir : inutile de réveiller la carte dédiée
    // d'un portable pour un décor de fond.
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'default' });
  } catch (err) {
    renderer = null;
  }
}

if (host && renderer) {
  // Le bloc terminal ne passe en verre dépoli que si la scène tourne vraiment.
  document.documentElement.classList.add('orb-on');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let pixelRatio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO);
  renderer.setPixelRatio(pixelRatio);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  // La passe de transmission est floue par nature : la moitié de la résolution
  // suffit et divise son coût par quatre.
  renderer.transmissionResolutionScale = 0.5;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 50);
  camera.position.z = CAMERA_Z;

  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const envMap = pmrem.fromScene(room, 0.04).texture;
  scene.environment = envMap;
  room.dispose();
  pmrem.dispose();

  const key = new THREE.DirectionalLight(0xffffff, 1.35);
  key.position.set(-3, 4, 5);
  const rim = new THREE.DirectionalLight(0xffffff, 0.9);
  rim.position.set(4, -2, 2);
  scene.add(key, rim);

  // Le fond est rendu dans la scène, pas en CSS : sans lui, la membrane de verre
  // n'aurait rien à réfracter.
  const backdropUniforms = {
    uCenter: { value: new THREE.Vector2(0.5, 0.5) },
    uRadius: { value: 0.3 },
    uGlow: { value: 0 },
    uTint: { value: 0 },
    uAspect: { value: 1 },
    uGround: { value: new THREE.Color() },
    uGroundTint: { value: new THREE.Color() },
    uGlowInner: { value: new THREE.Color() },
    uGlowOuter: { value: new THREE.Color() },
  };
  const backdropGeo = new THREE.PlaneGeometry(1, 1);
  const backdropMat = new THREE.ShaderMaterial({
    uniforms: backdropUniforms,
    vertexShader: BACKDROP_VERTEX,
    fragmentShader: BACKDROP_FRAGMENT,
    depthWrite: false,
    toneMapped: false,
  });
  const backdrop = new THREE.Mesh(backdropGeo, backdropMat);
  backdrop.position.z = BACKDROP_Z;
  backdrop.renderOrder = -1;
  scene.add(backdrop);

  const orb = new THREE.Group();
  scene.add(orb);

  const shellUniforms = { uTime: { value: 0 }, uAmp: { value: 0.085 } };
  const shellGeo = new THREE.SphereGeometry(1, 112, 84);
  const shellMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.22,
    transmission: 1,
    thickness: 0.45,
    ior: 1.15,
    envMapIntensity: 0.75,
    attenuationColor: new THREE.Color('#e8f7ee'),
    attenuationDistance: 4,
  });
  shellMat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = shellUniforms.uTime;
    shader.uniforms.uAmp = shellUniforms.uAmp;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\n' + NOISE + '\n' + SHELL_DISPLACE)
      .replace('#include <beginnormal_vertex>', SHELL_NORMAL)
      .replace('#include <begin_vertex>', 'vec3 transformed = orbP;');
  };
  orb.add(new THREE.Mesh(shellGeo, shellMat));

  const coreUniforms = {
    uTime: { value: 0 },
    uAmp: { value: 0.06 },
    uWake: { value: 1 },
    uDeep: { value: new THREE.Color() },
    uMid: { value: new THREE.Color() },
    uLight: { value: new THREE.Color() },
    uGreyDeep: { value: new THREE.Color() },
    uGreyMid: { value: new THREE.Color() },
    uGreyLight: { value: new THREE.Color() },
    uSpark: { value: 0 },
    uSparkColor: { value: new THREE.Color() },
  };
  const coreGeo = new THREE.SphereGeometry(0.8, 72, 54);
  const coreMat = new THREE.ShaderMaterial({
    uniforms: coreUniforms,
    vertexShader: CORE_VERTEX,
    fragmentShader: CORE_FRAGMENT,
  });
  orb.add(new THREE.Mesh(coreGeo, coreMat));

  // Braises : deux ou trois éclats très proches du centre, qui s'allument à tour
  // de rôle. Hors du groupe de la bulle pour rester face à l'écran quand elle tourne.
  const sparkCanvas = document.createElement('canvas');
  sparkCanvas.width = sparkCanvas.height = 128;
  const ctx = sparkCanvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.12, 'rgba(209,250,229,1)');
    gradient.addColorStop(0.3, 'rgba(52,211,153,0.45)');
    gradient.addColorStop(1, 'rgba(16,185,129,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }
  const sparkTex = new THREE.CanvasTexture(sparkCanvas);
  sparkTex.colorSpace = THREE.SRGBColorSpace;
  const SPARKS = [
    { x: -0.04, y: 0.02, size: 0.09, rate: 1.7, phase: 0 },
    { x: 0.035, y: -0.02, size: 0.07, rate: 2.3, phase: 2.1 },
    { x: 0.005, y: -0.065, size: 0.06, rate: 1.3, phase: 4.2 },
  ];
  const sparkGroup = new THREE.Group();
  scene.add(sparkGroup);
  const sparks = SPARKS.map((config) => {
    const material = new THREE.SpriteMaterial({
      map: sparkTex,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
      opacity: 0,
    });
    const sprite = new THREE.Sprite(material);
    sprite.renderOrder = 10;
    sparkGroup.add(sprite);
    return Object.assign({}, config, { sprite: sprite, material: material });
  });

  /* --- Thème : les couleurs sont interpolées entre les deux palettes -------- */
  const COLORS = { light: {}, dark: {} };
  for (const key of COLOR_KEYS) {
    COLORS.light[key] = new THREE.Color(THEMES.light[key]);
    COLORS.dark[key] = new THREE.Color(THEMES.dark[key]);
  }
  const TARGETS = {
    ground: backdropUniforms.uGround.value,
    groundTint: backdropUniforms.uGroundTint.value,
    glowInner: backdropUniforms.uGlowInner.value,
    glowOuter: backdropUniforms.uGlowOuter.value,
    deep: coreUniforms.uDeep.value,
    mid: coreUniforms.uMid.value,
    light: coreUniforms.uLight.value,
    greyDeep: coreUniforms.uGreyDeep.value,
    greyMid: coreUniforms.uGreyMid.value,
    greyLight: coreUniforms.uGreyLight.value,
    rim: rim.color,
    spark: coreUniforms.uSparkColor.value,
  };

  let themeMix = isDark() ? 1 : 0;
  let themeTarget = themeMix;

  function applyTheme() {
    for (const key of COLOR_KEYS) TARGETS[key].copy(COLORS.light[key]).lerp(COLORS.dark[key], themeMix);
    renderer.toneMappingExposure = THREE.MathUtils.lerp(THEMES.light.exposure, THEMES.dark.exposure, themeMix);
    renderer.setClearColor(TARGETS.ground);
    sparks.forEach((spark) => spark.material.color.copy(TARGETS.spark));
  }
  applyTheme();

  // style.js ajoute ou retire .dark sur <html> : on suit ce changement.
  new MutationObserver(() => { themeTarget = isDark() ? 1 : 0; })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  /* --- Dimensions ---------------------------------------------------------- */
  let aspect = 1;
  let viewWidth = 1;
  let viewHeight = 1;
  const resize = () => {
    viewWidth = host.clientWidth || window.innerWidth;
    viewHeight = host.clientHeight || 1;
    aspect = viewWidth / viewHeight;
    renderer.setSize(viewWidth, viewHeight, false);
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    const backdropHeight = visibleHeight(CAMERA_Z - BACKDROP_Z);
    backdrop.scale.set(backdropHeight * aspect, backdropHeight, 1);
    backdropUniforms.uAspect.value = aspect;
  };
  resize();
  new ResizeObserver(resize).observe(host);

  const pointer = { x: 0, y: 0 };
  window.addEventListener('pointermove', (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  /* --- Boucle -------------------------------------------------------------- */
  const current = Object.assign({}, POSES[0]);
  const target = Object.assign({}, POSES[0]);
  // Retrait : la bulle s'éloigne tant qu'elle traverse, et revient en se posant.
  let lastX = current.x;
  let dip = 1;
  const projected = new THREE.Vector3();
  const heightAtOrb = visibleHeight(CAMERA_Z);
  let raf = 0;
  let running = false;
  let onScreen = true;
  let last = performance.now();
  let time = Math.random() * 20;
  let emberTime = time;
  let pointerShift = 0;
  let intro = reduceMotion ? 1 : 0;
  let slowFrames = 0;
  let ready = false;

  const tick = (now) => {
    // Pas de temps réel plafonné : sur une machine lente, l'animation garde son rythme.
    const dt = Math.min((now - last) / 1000, 0.25);
    last = now;
    intro = Math.min(1, intro + dt / 2.2);
    const introEase = 1 - Math.pow(1 - intro, 4);

    if (ready && dt > 1 / 40) slowFrames++;
    else slowFrames = Math.max(0, slowFrames - 1);
    if (slowFrames > 20 && pixelRatio > MIN_PIXEL_RATIO) {
      pixelRatio = Math.max(MIN_PIXEL_RATIO, pixelRatio * 0.75);
      renderer.setPixelRatio(pixelRatio);
      resize();
      slowFrames = 0;
    }

    if (themeMix !== themeTarget) {
      const step = dt * 3;
      themeMix += Math.min(Math.abs(themeTarget - themeMix), step) * Math.sign(themeTarget - themeMix);
      if (Math.abs(themeTarget - themeMix) < 0.001) themeMix = themeTarget;
      applyTheme();
    }

    const motionScale = reduceMotion ? 0.25 : 1;
    time += dt * motionScale;
    emberTime += dt * motionScale;

    // La section traversée par le milieu de l'écran donne la pose visée.
    samplePose(readStage(), target);
    if (!ready) Object.assign(current, target);
    const follow = 1 - Math.exp(-dt * (reduceMotion ? 12 : 1.7));
    for (const k of POSE_KEYS) current[k] += (target[k] - current[k]) * follow;

    const travel = Math.abs(current.x - lastX) / Math.max(dt, 0.001);
    lastX = current.x;
    const dipTarget = reduceMotion ? 1 : Math.max(0.62, 1 / (1 + travel * 0.32));
    dip += (dipTarget - dip) * (1 - Math.exp(-dt * 4.5));

    // Sur un écran étroit, la bulle se resserre et reste plus près du centre.
    const narrow = aspect < 1.1;
    const fit = Math.min(1, aspect / 1.45);
    const scale = current.scale * dip * (narrow ? 0.7 : 1) * (0.35 + 0.65 * introEase);
    const drift = 1 - Math.exp(-dt * 2);
    pointerShift += (pointer.x * 0.12 - pointerShift) * drift;
    orb.scale.setScalar(scale);
    orb.position.x = current.x * fit + pointerShift;
    orb.position.y = current.y * (narrow ? 1.25 : 1) - (1 - introEase) * 0.35;
    orb.rotation.y += dt * 0.09 * (reduceMotion ? 0.3 : 1);
    orb.rotation.x += (pointer.y * 0.2 - orb.rotation.x) * drift;
    orb.rotation.z += (-pointer.x * 0.14 - orb.rotation.z) * drift;

    shellUniforms.uTime.value = time;
    shellUniforms.uAmp.value = 0.085 + (1 - introEase) * 0.15;
    coreUniforms.uTime.value = time;
    coreUniforms.uWake.value = current.wake;
    sparkGroup.position.set(orb.position.x, orb.position.y, 0);
    sparkGroup.scale.setScalar(scale);

    let emberGlow = 0;
    for (const spark of sparks) {
      const flicker =
        Math.pow(Math.max(0, Math.sin(emberTime * spark.rate + spark.phase)), 4) *
        (0.6 + 0.4 * Math.sin(emberTime * 7.3 + spark.phase * 3));
      spark.sprite.position.set(
        spark.x + Math.sin(emberTime * 0.9 + spark.phase) * 0.012,
        spark.y + Math.cos(emberTime * 1.1 + spark.phase) * 0.012,
        0,
      );
      spark.sprite.scale.setScalar(spark.size * (0.7 + flicker * 0.5));
      spark.material.opacity = flicker * 0.45 * introEase * Math.max(0.25, 1 - current.wake);
      emberGlow = Math.max(emberGlow, flicker);
    }
    coreUniforms.uSpark.value = (0.1 + emberGlow * 0.9) * 0.5 * introEase;

    orb.updateMatrixWorld();
    projected.setFromMatrixPosition(orb.matrixWorld).project(camera);
    backdropUniforms.uCenter.value.set(projected.x * 0.5 + 0.5, projected.y * 0.5 + 0.5);
    backdropUniforms.uRadius.value = (scale / heightAtOrb) * 1.9;
    backdropUniforms.uGlow.value = THREE.MathUtils.lerp(THEMES.light.glow, THEMES.dark.glow, themeMix) * current.glow * (0.35 + 0.65 * dip) * introEase;
    backdropUniforms.uTint.value = THREE.MathUtils.lerp(THEMES.light.tint, THEMES.dark.tint, themeMix);

    renderer.render(scene, camera);
    if (!ready) {
      ready = true;
      renderer.domElement.classList.add('is-ready');
    }
    raf = requestAnimationFrame(tick);
  };

  function start() {
    if (running) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }

  function stop() {
    if (!running) return;
    running = false;
    cancelAnimationFrame(raf);
  }

  // Rien n'est calculé quand le hero est hors de l'écran ou l'onglet en arrière-plan.
  new IntersectionObserver((entries) => {
    onScreen = entries[0].isIntersecting;
    if (onScreen) start();
    else stop();
  }, { rootMargin: '200px' }).observe(host);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (onScreen) start();
  });

  start();
}
