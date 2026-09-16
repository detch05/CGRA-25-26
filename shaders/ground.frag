#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uTexGrass;   // unit 0 — erva
uniform sampler2D uTexDirt;    // unit 1 — terra seca

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

    vec3 L = normalize(vec3(0.4, 1.0, 0.3));
    vec3 N = normalize(vNormal);

    float diff = max(dot(N, L), 0.0);

    vec3 lit = colGrass.rgb * (0.38 + 0.68 * diff);

    gl_FragColor = vec4(lit, 1.0);
}