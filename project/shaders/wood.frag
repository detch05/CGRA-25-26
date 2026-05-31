#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uSampler;
uniform float uWarmth;
uniform float uTime;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vec4 texColor = texture2D(uSampler, vTextureCoord);
    vec3 N = normalize(vNormal);
    vec3 L = normalize(vec3(-0.35, 1.0, 0.28));
    float diff = max(dot(N, L), 0.0);

    float grain = 0.96 + 0.04 * sin(vTextureCoord.x * 42.0 + vTextureCoord.y * 18.0 + uTime * 0.15);
    vec3 warmTint = mix(vec3(1.0, 1.0, 1.0), vec3(1.08, 0.96, 0.86), clamp(uWarmth, 0.0, 1.0));
    vec3 lit = texColor.rgb * warmTint * grain * (0.32 + 0.78 * diff);

    gl_FragColor = vec4(lit, texColor.a);
}