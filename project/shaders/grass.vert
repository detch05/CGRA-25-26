attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float uTime;        // tempo em segundos
uniform float uWindStrength; // força do vento [0,1]
uniform float uWindDir;     // direcção do vento em radianos

void main() {
    vec3 pos = aVertexPosition;

    // O vento só afecta a parte superior da lâmina (y > 0.3)
    // heightFactor = 0 na base, 1 no topo — raiz fixa no chão
    float heightFactor = max(0.0, (pos.y - 0.2) / 0.8);
    heightFactor = heightFactor * heightFactor;  // curva quadrática

    // Movimento sinusoidal — duas frequências para parecer natural
    float wave = sin(uTime * 2.5 + pos.x * 0.8 + pos.z * 0.6) * 0.5
               + sin(uTime * 1.3 + pos.x * 1.2) * 0.3;

    // Aplicar deslocamento na direcção do vento
    float dx = cos(uWindDir) * wave * uWindStrength * heightFactor;
    float dz = sin(uWindDir) * wave * uWindStrength * heightFactor;

    pos.x += dx;
    pos.z += dz;

    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
}
