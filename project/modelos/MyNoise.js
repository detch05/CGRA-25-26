<<<<<<< HEAD
/**
 * MyNoise.js
 * Value Noise 2D simples, baseado em "The Book of Shaders" (cap. Noise).
 * Suficiente para distorcer UVs, animar nuvens, etc.
 *
 * Uso:
 *   import { MyNoise } from "./MyNoise.js";
 *   const noise = new MyNoise();
 *   noise.get(x, y);        // [0, 1]
 *   noise.fbm(x, y, octs);  // [0, 1] com mais detalhe fractal
 */
export class MyNoise {

    /** Hash 2D → float [0,1]  (equivalente ao rand() do Book of Shaders) */
    _rand(x, y) {
        const dot = x * 12.9898 + y * 78.233;
        return (Math.abs(Math.sin(dot) * 43758.5453123)) % 1;
    }

    /**
     * Value Noise 2D — interpola os 4 cantos de cada célula com curva cúbica.
     * Retorna valor em [0, 1].
     */
    get(x, y) {
        const ix = Math.floor(x), iy = Math.floor(y);
        const fx = x - ix,        fy = y - iy;

        // 4 cantos
        const a = this._rand(ix,     iy    );
        const b = this._rand(ix + 1, iy    );
        const c = this._rand(ix,     iy + 1);
        const d = this._rand(ix + 1, iy + 1);

        // Curva cúbica de Hermite (= smoothstep) — evita artefactos lineares
        const ux = fx * fx * (3 - 2 * fx);
        const uy = fy * fy * (3 - 2 * fy);

        return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
    }

    /**
     * Fractal Brownian Motion — soma 'octaves' camadas de noise.
     * Mais oitavas = mais detalhe. 4 é suficiente para nuvens.
     * Retorna valor em [0, 1] (aprox.).
     */
    fbm(x, y, octaves = 4) {
        let value = 0, amplitude = 0.5, frequency = 1;
        for (let i = 0; i < octaves; i++) {
            value     += amplitude * this.get(x * frequency, y * frequency);
            amplitude *= 0.5;
            frequency *= 2.0;
        }
        return value;
    }
=======
/**
 * MyNoise.js
 * Value Noise 2D simples, baseado em "The Book of Shaders" (cap. Noise).
 * Suficiente para distorcer UVs, animar nuvens, etc.
 *
 * Uso:
 *   import { MyNoise } from "./MyNoise.js";
 *   const noise = new MyNoise();
 *   noise.get(x, y);        // [0, 1]
 *   noise.fbm(x, y, octs);  // [0, 1] com mais detalhe fractal
 */
export class MyNoise {

    /** Hash 2D → float [0,1]  (equivalente ao rand() do Book of Shaders) */
    _rand(x, y) {
        const dot = x * 12.9898 + y * 78.233;
        return (Math.abs(Math.sin(dot) * 43758.5453123)) % 1;
    }

    /**
     * Value Noise 2D — interpola os 4 cantos de cada célula com curva cúbica.
     * Retorna valor em [0, 1].
     */
    get(x, y) {
        const ix = Math.floor(x), iy = Math.floor(y);
        const fx = x - ix,        fy = y - iy;

        // 4 cantos
        const a = this._rand(ix,     iy    );
        const b = this._rand(ix + 1, iy    );
        const c = this._rand(ix,     iy + 1);
        const d = this._rand(ix + 1, iy + 1);

        // Curva cúbica de Hermite (= smoothstep) — evita artefactos lineares
        const ux = fx * fx * (3 - 2 * fx);
        const uy = fy * fy * (3 - 2 * fy);

        return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
    }

    /**
     * Fractal Brownian Motion — soma 'octaves' camadas de noise.
     * Mais oitavas = mais detalhe. 4 é suficiente para nuvens.
     * Retorna valor em [0, 1] (aprox.).
     */
    fbm(x, y, octaves = 4) {
        let value = 0, amplitude = 0.5, frequency = 1;
        for (let i = 0; i < octaves; i++) {
            value     += amplitude * this.get(x * frequency, y * frequency);
            amplitude *= 0.5;
            frequency *= 2.0;
        }
        return value;
    }
>>>>>>> master
}