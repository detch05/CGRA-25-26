#ifdef GL_ES
precision highp float;
#endif

varying float vHeight;

uniform vec3 uTopColor;
uniform vec3 uBottomColor;
uniform vec3 uSunsetColor;
uniform float uSunsetStrength;

void main() {
    float t = clamp((vHeight + 1.0) * 0.5, 0.0, 1.0);
    vec3 baseColor = mix(uBottomColor, uTopColor, t);

    float horizon = smoothstep(0.0, 0.25, t) * (1.0 - smoothstep(0.25, 0.5, t));
    vec3 color = mix(baseColor, uSunsetColor, horizon * uSunsetStrength);

    gl_FragColor = vec4(color, 1.0);
}
