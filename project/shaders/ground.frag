#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uSampler;   // textura de erva (unit 0 — padrão do CGF)

uniform float uAmplitude;
uniform float uPathWidth;
uniform float uPathBlend;

varying vec2 vTexCoord;
varying vec3 vNormal;
varying vec3 vWorldPos;

void main() {
    vec4 grassCol = texture2D(uSampler, vTexCoord);

    // ── Dirt: zonas mais altas ficam mais secas/castanhas ─────────
    // Cor de terra seca
    vec4 dirtCol  = vec4(0.62, 0.46, 0.28, 1.0);
    float normH   = clamp(vWorldPos.y / uAmplitude, 0.0, 1.0);
    float dirtT   = smoothstep(0.15, 0.65, normH);
    vec4 terrainCol = mix(grassCol, dirtCol * grassCol * 1.4, dirtT);

    // ── Caminho: faixa central em X ───────────────────────────────
    vec4 pathCol  = vec4(0.70, 0.55, 0.35, 1.0);   // cor de caminho de terra
    float absx    = abs(vWorldPos.x);
    float pathT   = 1.0 - smoothstep(uPathWidth - 0.5, uPathWidth + uPathBlend, absx);
    vec4 finalCol = mix(terrainCol, pathCol * grassCol * 1.6, pathT);

    // ── Iluminação Phong direccional simples ──────────────────────
    vec3 L     = normalize(vec3(0.4, 1.0, 0.3));
    vec3 N     = normalize(vNormal);
    float diff = max(dot(N, L), 0.0);
    vec3 lit   = finalCol.rgb * (0.35 + 0.70 * diff);

    gl_FragColor = vec4(lit, 1.0);
}
