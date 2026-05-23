import { CGFobject } from "../../lib/CGF.js";

/**
 * MyRock
 *
 * Esfera subdividida com vertex perturbation procedural —
 * cada vértice é deslocado ao longo da sua normal por um valor
 * de noise, produzindo uma forma orgânica irregular.
 *
 * @param scene   – cena CGF
 * @param slices  – subdivisões horizontais (default 12)
 * @param stacks  – subdivisões verticais   (default 8)
 * @param seed    – semente para o noise (torna cada pedra única)
 * @param rough   – amplitude da perturbação [0..1] (default 0.35)
 */
export class MyRock extends CGFobject {

    constructor(scene, slices = 12, stacks = 8, seed = 0, rough = 0.35) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.seed   = seed;
        this.rough  = rough;
        this.initBuffers();
    }

    // ── Noise pseudo-aleatório 3D simples ────────────────────────
    _rand3(x, y, z) {
        const s = this.seed;
        const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.3 + s * 43.2) * 43758.5453;
        return (Math.abs(n) % 1.0);
    }

    // Value noise 3D — interpola 8 cantos do cubo
    _noise3(x, y, z) {
        const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
        const fx = x - ix,        fy = y - iy,        fz = z - iz;
        const ux = fx*fx*(3-2*fx), uy = fy*fy*(3-2*fy), uz = fz*fz*(3-2*fz);

        const v000 = this._rand3(ix,   iy,   iz  );
        const v100 = this._rand3(ix+1, iy,   iz  );
        const v010 = this._rand3(ix,   iy+1, iz  );
        const v110 = this._rand3(ix+1, iy+1, iz  );
        const v001 = this._rand3(ix,   iy,   iz+1);
        const v101 = this._rand3(ix+1, iy,   iz+1);
        const v011 = this._rand3(ix,   iy+1, iz+1);
        const v111 = this._rand3(ix+1, iy+1, iz+1);

        return v000*(1-ux)*(1-uy)*(1-uz) + v100*ux*(1-uy)*(1-uz)
             + v010*(1-ux)*uy*(1-uz)     + v110*ux*uy*(1-uz)
             + v001*(1-ux)*(1-uy)*uz     + v101*ux*(1-uy)*uz
             + v011*(1-ux)*uy*uz         + v111*ux*uy*uz;
    }

    // fBm 3D com 3 oitavas
    _fbm3(x, y, z) {
        let v = 0, a = 0.5, f = 1.0;
        for (let i = 0; i < 3; i++) {
            v += a * this._noise3(x*f, y*f, z*f);
            a *= 0.5; f *= 2.0;
        }
        return v;
    }

    initBuffers() {
        this.vertices  = [];
        this.normals   = [];
        this.texCoords = [];
        this.indices   = [];

        const stackAngleStep = Math.PI / this.stacks;
        const sliceAngleStep = (2 * Math.PI) / this.slices;

        // ── Gerar vértices perturbados ────────────────────────────
        for (let i = 0; i <= this.stacks; i++) {
            const phi = Math.PI / 2 - i * stackAngleStep;
            const cosP = Math.cos(phi), sinP = Math.sin(phi);

            for (let j = 0; j <= this.slices; j++) {
                const theta = j * sliceAngleStep;
                const cosT  = Math.cos(theta), sinT = Math.sin(theta);

                // Posição na esfera unitária
                const nx0 = cosP * cosT;
                const ny0 = sinP;
                const nz0 = cosP * sinT;

                // Perturbação: deslocar ao longo da normal por fBm
                const noiseScale = 2.5;
                const disp = this._fbm3(
                    nx0 * noiseScale + this.seed,
                    ny0 * noiseScale,
                    nz0 * noiseScale
                );
                // disp ∈ [0,1] → centrar em 0 e escalar pela rugosidade
                const offset = (disp - 0.5) * 2.0 * this.rough;
                const r = 1.0 + offset;

                this.vertices.push(nx0 * r, ny0 * r, nz0 * r);

                // Normal aproximada = direcção da esfera base (boa para rochas)
                const len = Math.sqrt(nx0*nx0 + ny0*ny0 + nz0*nz0);
                this.normals.push(nx0/len, ny0/len, nz0/len);

                this.texCoords.push(j / this.slices, i / this.stacks);
            }
        }

        // ── Índices ───────────────────────────────────────────────
        for (let i = 0; i < this.stacks; i++) {
            for (let j = 0; j < this.slices; j++) {
                const a = i * (this.slices + 1) + j;
                const b = a + 1;
                const c = a + this.slices + 1;
                const d = c + 1;
                this.indices.push(a, c, b);
                this.indices.push(b, c, d);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}