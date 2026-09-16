#ifdef GL_ES
precision highp float;
#endif

struct lightProperties {
    vec4 position;
    vec4 ambient;
    vec4 diffuse;
    vec4 specular;
    vec4 half_vector;
    vec3 spot_direction;
    float spot_exponent;
    float spot_cutoff;
    float constant_attenuation;
    float linear_attenuation;
    float quadratic_attenuation;
    bool enabled;
};

#define NUMBER_OF_LIGHTS 8
uniform lightProperties uLight[NUMBER_OF_LIGHTS];

uniform sampler2D uSampler;
uniform float uAmbientFactor;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vec4 texColor = texture2D(uSampler, vTextureCoord);
    vec3 normal = normalize(vNormal);

    vec3 lightDir;
    if (uLight[0].position.w == 0.0) {
        lightDir = normalize(uLight[0].position.xyz);
    } else {
        lightDir = normalize(uLight[0].position.xyz - vPosition);
    }

    float diff = max(dot(normal, lightDir), 0.0);
    vec3 ambientBase = max(uLight[0].ambient.rgb, vec3(uAmbientFactor));
    vec3 color = texColor.rgb * (ambientBase + uLight[0].diffuse.rgb * diff);

    gl_FragColor = vec4(color, texColor.a);
}
