attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform float uTime;
uniform float uWindStrength;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    float wave = sin(uTime + aVertexPosition.x * 4.0 + aVertexPosition.z * 4.0);
    vec3 displaced = aVertexPosition + aVertexNormal * (wave * uWindStrength);

    vec4 viewPos = uMVMatrix * vec4(displaced, 1.0);
    vPosition = viewPos.xyz;
    vNormal = normalize((uNMatrix * vec4(aVertexNormal, 0.0)).xyz);
    vTextureCoord = aTextureCoord;

    gl_Position = uPMatrix * viewPos;
}
