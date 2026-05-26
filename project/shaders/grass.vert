attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTexCoord;
varying vec3 vNormal;
varying vec3 vWorldPos;

void main() {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vTexCoord   = aTextureCoord;
    vNormal     = normalize((uNMatrix * vec4(aVertexNormal, 0.0)).xyz);
    vWorldPos   = aVertexPosition;
}
