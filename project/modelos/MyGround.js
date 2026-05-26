import { CGFobject, CGFappearance, CGFshader, CGFtexture } from "../../lib/CGF.js";
import { MyNoise } from "./MyNoise.js";

export class MyGround extends CGFobject {

    constructor(scene, {
        size       = 600,
        segments   = 128,
        amplitude  = 8,
        noiseScale = 0.015,
    } = {}) {
        super(scene);

        this.size       = size;
        this.segments   = segments;
        this.amplitude  = amplitude;
        this.noiseScale = noiseScale;

        this.noise = new MyNoise();

        this._buildHeightmap();
        this.initBuffers();
        this._initMaterials();
    }

    _rawHeight(wx, wz) {
        const h = this.noise.fbm(
            wx * this.noiseScale + 10.3,
            wz * this.noiseScale + 7.1,
            5
        );
        const base = (h - 0.3) * this.amplitude;

        const pathHalfWidth = 6.0;
        const blendZone     = 4.0;
        const absx = Math.abs(wx);

        if (absx < pathHalfWidth) {
            return 0;
        } else if (absx < pathHalfWidth + blendZone) {
            const t = (absx - pathHalfWidth) / blendZone;
            const smooth = t * t * (3 - 2 * t);
            return base * smooth;
        }
        return base;
    }

    _buildHeightmap() {
        const N    = this.segments;
        const half = this.size / 2;
        const step = this.size / N;

        this._hmap = new Float32Array((N + 1) * (N + 1));

        for (let i = 0; i <= N; i++) {
            for (let j = 0; j <= N; j++) {
                const wx = -half + j * step;
                const wz = -half + i * step;
                this._hmap[i * (N + 1) + j] = this._rawHeight(wx, wz);
            }
        }
    }

    getHeightAt(wx, wz) {
        const N    = this.segments;
        const half = this.size / 2;

        const gx = (wx + half) / this.size * N;
        const gz = (wz + half) / this.size * N;

        const ix = Math.max(0, Math.min(N - 1, Math.floor(gx)));
        const iz = Math.max(0, Math.min(N - 1, Math.floor(gz)));
        const fx = gx - ix;
        const fz = gz - iz;

        const h00 = this._hmap[ iz      * (N + 1) + ix    ];
        const h10 = this._hmap[ iz      * (N + 1) + (ix+1)];
        const h01 = this._hmap[(iz + 1) * (N + 1) + ix    ];
        const h11 = this._hmap[(iz + 1) * (N + 1) + (ix+1)];

        return h00 * (1 - fx) * (1 - fz)
             + h10 *      fx  * (1 - fz)
             + h01 * (1 - fx) *      fz
             + h11 *      fx  *      fz;
    }

    initBuffers() {
        const N    = this.segments;
        const half = this.size / 2;
        const step = this.size / N;

        this.vertices  = [];
        this.normals   = [];
        this.texCoords = [];
        this.indices   = [];

        for (let i = 0; i <= N; i++) {
            for (let j = 0; j <= N; j++) {
                const wx = -half + j * step;
                const wz = -half + i * step;
                const wy = this._hmap[i * (N + 1) + j];

                this.vertices.push(wx, wy, wz);

                const hL = (j > 0) ? this._hmap[i * (N + 1) + (j - 1)] : wy;
                const hR = (j < N) ? this._hmap[i * (N + 1) + (j + 1)] : wy;
                const hD = (i > 0) ? this._hmap[(i - 1) * (N + 1) + j] : wy;
                const hU = (i < N) ? this._hmap[(i + 1) * (N + 1) + j] : wy;

                const nx = (hL - hR) / (2 * step);
                const nz = (hD - hU) / (2 * step);
                const ny = 1.0;
                const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
                this.normals.push(nx / len, ny / len, nz / len);

                const uvScale = 10;
                this.texCoords.push(j / N * uvScale, i / N * uvScale);
            }
        }

        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                const a = i * (N + 1) + j;
                const b = a + 1;
                const c = a + (N + 1);
                const d = c + 1;
                this.indices.push(a, c, b);
                this.indices.push(b, c, d);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    _initMaterials() {
        const scene = this.scene;

        // Carregar as 3 texturas via CGFtexture
        this.cgfGrass = new CGFtexture(scene, "images/ground.jpg");
        this.cgfDirt  = new CGFtexture(scene, "images/dirt.jpg");
        this.cgfPath  = new CGFtexture(scene, "images/path.jpg");

        // Material neutro — cores vêm 100% das texturas no shader
        this.material = new CGFappearance(scene);
        this.material.setAmbient(1, 1, 1, 1);
        this.material.setDiffuse(1, 1, 1, 1);
        this.material.setSpecular(0, 0, 0, 1);
        this.material.setShininess(1);

        this.shader = new CGFshader(scene.gl, "shaders/ground.vert", "shaders/ground.frag");
    }

    display() {
        const gl = this.scene.gl;
        this.scene.pushMatrix();

        this.scene.setActiveShaderSimple(this.shader);

        // apply() primeiro
        this.material.apply();

        // bind() das texturas DEPOIS do apply()
        this.cgfGrass.bind(0);
        this.cgfDirt.bind(1);
        this.cgfPath.bind(2);

        this.shader.setUniformsValues({
            uTexGrass:  0,
            uTexDirt:   1,
            uTexPath:   2,
            uAmplitude: this.amplitude,
            uPathWidth: 4.0,
            uPathBlend: 0.8,
        });

        super.display();

        // Limpar units 1 e 2
        gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, null);
        gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, null);
        gl.activeTexture(gl.TEXTURE0);

        this.scene.setActiveShaderSimple(this.scene.defaultShader);
        this.scene.popMatrix();
    }
}