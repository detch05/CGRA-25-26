attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vec4 viewPos = uMVMatrix * vec4(aVertexPosition, 1.0);
    gl_Position = uPMatrix * viewPos;
    vTextureCoord = aTextureCoord;
    vNormal = normalize((uNMatrix * vec4(aVertexNormal, 0.0)).xyz);
    vPosition = viewPos.xyz;
}