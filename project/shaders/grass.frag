#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uTexGrass;   // unit 0 — erva
uniform sampler2D uTexDirt;    // unit 1 — terra seca
uniform sampler2D uTexPath;    // unit 2 — caminho

uniform float uAmplitude;
uniform float uPathWidth;
uniform float uPathBlend;

varying vec2 vTexCoord;
varying vec3 vNormal;
varying vec3 vWorldPos;

// Value noise 2D para manchas de dirt irregulares
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i+vec2(1,0)), u.x),
               mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
}

void main() {
    vec4 colGrass = texture2D(uTexGrass, vTexCoord);
    vec4 colDirt  = texture2D(uTexDirt,  vTexCoord);
    vec4 colPath  = texture2D(uTexPath,  vTexCoord * 0.6);

    // ── Patches de dirt na erva por noise ────────────────────────
    float n  = vnoise(vWorldPos.xz * 0.04)
             + vnoise(vWorldPos.xz * 0.09) * 0.5;
    n = clamp(n / 1.5, 0.0, 1.0);
    float dirtMask = smoothstep(0.52, 0.78, n);
    vec4 terrain = mix(colGrass, colDirt, dirtMask);

    // ── Blending por altura ───────────────────────────────────────
    // Zonas altas ficam mais secas/rochosas
    float normH   = clamp(vWorldPos.y / uAmplitude, 0.0, 1.0);
    float hillMask = smoothstep(0.3, 0.7, normH);
    terrain = mix(terrain, colDirt * 1.1, hillMask * 0.5);

    // ── Caminho central de terra (path) ───────────────────────────
    float absx  = abs(vWorldPos.x);
    float pathT = 1.0 - smoothstep(uPathWidth - 0.5, uPathWidth + uPathBlend, absx);
    vec4 finalCol = mix(terrain, colPath, pathT);

    // ── Iluminação Phong direccional ──────────────────────────────
    vec3 L    = normalize(vec3(0.4, 1.0, 0.3));
    vec3 N    = normalize(vNormal);
    float diff = max(dot(N, L), 0.0);
    vec3 lit  = finalCol.rgb * (0.38 + 0.68 * diff);

    gl_FragColor = vec4(lit, 1.0);
}
