#ifdef GL_ES
precision mediump float;
#endif

uniform float uDry;   // 0 = erva verde, 1 = erva seca

void main() {
    // Erva verde: verde vivo
    vec3 greenColor = vec3(0.18, 0.55, 0.12);
    // Erva seca: amarelo-acastanhado
    vec3 dryColor   = vec3(0.68, 0.55, 0.22);

    vec3 color = mix(greenColor, dryColor, uDry);

    gl_FragColor = vec4(color, 1.0);
}
