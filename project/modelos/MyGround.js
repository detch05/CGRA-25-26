import { CGFobject, CGFappearance, CGFshader, CGFtexture } from "../../lib/CGF.js";
import { MyNoise } from "./MyNoise.js";

/**
 * MyGround
 *
 * Terreno procedural gerado com Fractal Brownian Motion (fBm) via MyNoise.
 *
 * Características:
 *  - Malha subdividida (segments × segments) com alturas calculadas por fBm
 *  - Normais calculadas analiticamente por diferenças finitas
 *  - Dois materiais/texturas blended via shader: erva e terra seca
 *  - Caminho de terra para a carroça (zona aplanada a correr de -Z para +Z)
 *  - Método público getHeightAt(x, z) para posicionar objectos sobre o terreno
 *
 * Parâmetros configuráveis no construtor:
 *  - size      : dimensão total do terreno (ex: 200 → vai de -100 a +100)
 *  - segments  : número de quadrículas por lado (ex: 128)
 *  - amplitude : altura máxima das colinas em unidades de mundo (ex: 8)
 *  - noiseScale: escala espacial do noise — valores maiores = colinas mais largas (ex: 0.015)
 */
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

        // Pré-computar a grelha de alturas para reutilizar em getHeightAt
        this._buildHeightmap();
        this.initBuffers();
        this._initMaterials();
    }

    //  Heightmap procedural
    
    /**
     * Calcula a altura em coordenadas de mundo (wx, wz).
     * Aplana a zona do caminho (faixa central em X) para a carroça andar.
     */
    _rawHeight(wx, wz) {
        // fBm com 5 oitavas → colinas suaves com detalhe médio
        const h = this.noise.fbm(
            wx * this.noiseScale + 10.3,
            wz * this.noiseScale + 7.1,
            5
        );
        // Mapear [0,1] → [-0.2 , 1] para evitar que seja sempre positivo
        const base = (h - 0.3) * this.amplitude;

        // ── Caminho central ──────────────────────────────────────
        // Faixa em X entre -6 e +6 vai para 0 (terreno plano)
        // smooth transition nas bordas com smoothstep
        const pathHalfWidth = 6.0;
        const blendZone     = 4.0;
        const absx = Math.abs(wx);

        if (absx < pathHalfWidth) {
            return 0;
        } else if (absx < pathHalfWidth + blendZone) {
            const t = (absx - pathHalfWidth) / blendZone;
            const smooth = t * t * (3 - 2 * t);   // smoothstep
            return base * smooth;
        }

        return base;
    }

    _buildHeightmap() {
        const N    = this.segments;
        const half = this.size / 2;
        const step = this.size / N;

        // Array achatado: _hmap[i * (N+1) + j] = altura no vértice (i, j)
        this._hmap = new Float32Array((N + 1) * (N + 1));

        for (let i = 0; i <= N; i++) {
            for (let j = 0; j <= N; j++) {
                const wx = -half + j * step;
                const wz = -half + i * step;
                this._hmap[i * (N + 1) + j] = this._rawHeight(wx, wz);
            }
        }
    }

    /**
     * API pública — devolve a altura do terreno em coordenadas de mundo.
     * Útil para posicionar objectos (pedras, fardos, carroça…) sobre o solo.
     */
    getHeightAt(wx, wz) {
        const N    = this.segments;
        const half = this.size / 2;

        // Coordenadas na grelha (floats)
        const gx = (wx + half) / this.size * N;
        const gz = (wz + half) / this.size * N;

        // Limitar ao interior
        const ix = Math.max(0, Math.min(N - 1, Math.floor(gx)));
        const iz = Math.max(0, Math.min(N - 1, Math.floor(gz)));
        const fx = gx - ix;
        const fz = gz - iz;

        // Interpolação bilinear
        const h00 = this._hmap[ iz      * (N + 1) + ix    ];
        const h10 = this._hmap[ iz      * (N + 1) + (ix+1)];
        const h01 = this._hmap[(iz + 1) * (N + 1) + ix    ];
        const h11 = this._hmap[(iz + 1) * (N + 1) + (ix+1)];

        return h00 * (1 - fx) * (1 - fz)
             + h10 *      fx  * (1 - fz)
             + h01 * (1 - fx) *      fz
             + h11 *      fx  *      fz;
    }

    //  Geometria (vértices, normais, UVs, índices)

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

                // Normal por diferenças finitas centradas
                const hL = (j > 0) ? this._hmap[i * (N + 1) + (j - 1)] : wy;
                const hR = (j < N) ? this._hmap[i * (N + 1) + (j + 1)] : wy;
                const hD = (i > 0) ? this._hmap[(i - 1) * (N + 1) + j] : wy;
                const hU = (i < N) ? this._hmap[(i + 1) * (N + 1) + j] : wy;

                const nx = (hL - hR) / (2 * step);
                const nz = (hD - hU) / (2 * step);
                const ny = 1.0;
                const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
                this.normals.push(nx / len, ny / len, nz / len);

                // UVs repetidas pelo terreno (escala de tiling)
                const uvScale = 10;
                this.texCoords.push(j / N * uvScale, i / N * uvScale);
            }
        }

        // Índices: dois triângulos por quad
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

    //  Materiais e shader
    
    _initMaterials() {
        const scene = this.scene;

        // Material com textura de erva — o shader trata do blending dirt/path por cor
        this.material = new CGFappearance(scene);
        this.material.setAmbient(1, 1, 1, 1);
        this.material.setDiffuse(1, 1, 1, 1);
        this.material.setSpecular(0.05, 0.05, 0.05, 1);
        this.material.setShininess(5);
        this.material.loadTexture("images/ground.jpg");
        this.material.setTextureWrap('REPEAT', 'REPEAT');

        // Shader: usa uSampler (unit 0, padrão CGF) + blending por cor para dirt e caminho
        /*this.shader = new CGFshader(
            scene.gl,
            "shaders/ground.vert",
            "shaders/ground.frag"
        );*/
        /*this.shader.setUniformsValues({
            uSampler:   0,
            uAmplitude: this.amplitude,
            uPathWidth: 6.0,
            uPathBlend: 4.0,
        });*/
    }

    //  Display
   
    display() {
        this.scene.pushMatrix();

        /*this.scene.setActiveShaderSimple(this.shader);

        this.shader.setUniformsValues({
        uSampler: 0,
        uAmplitude: this.amplitude,
        uPathWidth: 6.0,
        uPathBlend: 4.0,
        });*/

        this.material.apply();
        super.display();

        //this.scene.setActiveShaderSimple(this.scene.defaultShader);

        this.scene.popMatrix();
    }
}