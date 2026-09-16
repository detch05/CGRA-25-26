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
    vec4 viewPos = uMVMatrix * vec4(aVertexPosition, 1.0);
    float wave = sin(uTime + viewPos.x * 4.0 + viewPos.z * 4.0);
    vec3 displacedView = viewPos.xyz + vec3(0.0, wave * uWindStrength, 0.0);
    vPosition = displacedView;
    vNormal = normalize((uNMatrix * vec4(aVertexNormal, 0.0)).xyz);
    vTextureCoord = aTextureCoord;

    gl_Position = uPMatrix * vec4(displacedView, 1.0);
}
